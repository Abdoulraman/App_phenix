import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

// ══════════════════════════════════════════════════════════════════
//  Constantes établissement
// ══════════════════════════════════════════════════════════════════
const SCHOOL_INFO = {
  name: 'CENTRE DE SOUTIEN SCOLAIRE',
  subtitle: '"LE PHÉNIX"',
  address: 'Nkolmesseng, Safari, École Madio',
  phone: '679 999 552',
  website: 'www.lephenix.cm'
};

const C = {
  navy:      [15,  46,  109],  // Bleu foncé
  gold:      [251, 191, 36],   // Doré
  goldLight: [253, 217, 100],  // Doré clair
  green:     [0,   154, 68],    // Vert
  red:       [206, 17,  38],    // Rouge
  yellow:    [252, 209, 22],    // Jaune
  white:     [255, 255, 255],
  lightGray: [245, 247, 250],
  midGray:   [180, 190, 210],
  darkGray:  [80,  90,  110],
};

// ══════════════════════════════════════════════════════════════════
//  Utilitaire : charger une image en base64 depuis une URL
// ══════════════════════════════════════════════════════════════════
const loadImageAsBase64 = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

// ══════════════════════════════════════════════════════════════════
//  Composant principal
// ══════════════════════════════════════════════════════════════════
const BadgesTab = ({ students = [], classes = [] }) => {
  const [selectedClass, setSelectedClass]     = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll]             = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [previewStudent, setPreviewStudent]   = useState(null);
  const [loading, setLoading]                 = useState(false);
  const [loadingMsg, setLoadingMsg]           = useState('');
  const [validityDate, setValidityDate]       = useState({
    start: new Date().toISOString().split('T')[0],
    end:   new Date(new Date().setFullYear(new Date().getFullYear() + 1))
             .toISOString().split('T')[0],
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // ── Helpers ────────────────────────────────────────────────────
  const getStudentFirstName = (s) => {
    if (!s) return '';
    return s.student_user?.first_name || s.first_name || '';
  };

  const getStudentLastName = (s) => {
    if (!s) return '';
    return s.student_user?.last_name || s.last_name || '';
  };

  const getStudentFullName = (s) => {
    return `${getStudentLastName(s)} ${getStudentFirstName(s)}`.trim();
  };

  const getStudentClass = (s) => {
    if (!s) return '';
    return s.class?.name || classes.find((c) => c.id === s.class_id)?.name || '';
  };

  const getStudentInitials = (s) => {
    const last = getStudentLastName(s);
    const first = getStudentFirstName(s);
    return (last[0] || '') + (first[0] || '').toUpperCase();
  };

  const getStudentPhotoUrl = (s) =>
    `${API_URL}/src/images/students/student-${s.id}.jpg`;

  const getLogoPath = () =>
    `${API_URL}/src/images/logo/logo_phenix.jpeg`;

  // ── Filtres ────────────────────────────────────────────────────
  const filteredStudents = students.filter((s) => {
    const matchClass  = !selectedClass || s.class_id === parseInt(selectedClass);
    const matchSearch = !searchTerm ||
      getStudentFullName(s).toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  // ── Sélection ──────────────────────────────────────────────────
  const handleSelectStudent = (id) =>
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSelectAll = () => {
    setSelectedStudents(selectAll ? [] : filteredStudents.map((s) => s.id));
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectedStudents([]);
    setSelectAll(false);
  }, [selectedClass]);

  // ══════════════════════════════════════════════════════════════
  //  DESSIN D'UN BADGE PDF - VERSION CORRIGÉE
  // ══════════════════════════════════════════════════════════════
 

  const drawBadge = (pdf, student, x, y, W, H, logoB64, photoB64) => {
    const lastName = getStudentLastName(student);
    const firstName = getStudentFirstName(student);
    const cls = getStudentClass(student);
    const id = student.id;
    const initials = getStudentInitials(student);
  
    const matricule =
      `${lastName.substring(0,2).toUpperCase()}${firstName.substring(0,2).toUpperCase()}${String(id).padStart(3,'0')}`;
  
    // ===== CARTE PRINCIPALE =====
    pdf.setFillColor(...C.white);
    pdf.roundedRect(x, y, W, H, 4, 4, 'F');
    pdf.setDrawColor(...C.gold);
    pdf.setLineWidth(1.2);
    pdf.roundedRect(x, y, W, H, 4, 4, 'S');
  
    // ===== HEADER =====
    const headerH = 24;
    pdf.setFillColor(...C.navy);
    pdf.rect(x, y, W, headerH, 'F');
  
    // Logo
    const logoSize = 12;
    const logoX = x + 6;
    const logoY = y + 6;
    if (logoB64) pdf.addImage(logoB64, 'JPEG', logoX, logoY, logoSize, logoSize);
  
    // Titres centrés
    pdf.setTextColor(...C.white);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(SCHOOL_INFO.name, x + W/2, y + 9, { align: 'center' });
  
    pdf.setTextColor(...C.gold);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.text(SCHOOL_INFO.subtitle, x + W/2, y + 16, { align: 'center' });
  
    // ===== PHOTO =====
    const photoSize = 35;
    const photoX = x + 10;
    const photoY = y + headerH + 8;
  
    pdf.setDrawColor(...C.gold);
    pdf.setLineWidth(1.5);
    pdf.rect(photoX, photoY, photoSize, photoSize, 'S');
  
    if (photoB64) {
      pdf.addImage(photoB64, 'JPEG', photoX, photoY, photoSize, photoSize);
    } else {
      pdf.setFillColor(...C.navy);
      pdf.rect(photoX, photoY, photoSize, photoSize, 'F');
      pdf.setTextColor(...C.gold);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(initials, photoX + photoSize/2, photoY + photoSize/2 + 4, { align: 'center' });
    }
  
    // ===== INFOS ÉLÈVE =====
    const infoX = x + 50;
    let infoY = y + headerH + 12;

    // ── Helper : label souligné + valeur ──────────────────────────
    const drawLabelValue = (label, value, curY) => {
      // Label en gris petit
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.setTextColor(...C.darkGray);
      pdf.text(label, infoX, curY);

      // Soulignement PRÉCIS : on mesure la largeur réelle avec jsPDF
      const labelW = pdf.getTextWidth(label);
      pdf.setDrawColor(...C.darkGray);
      pdf.setLineWidth(0.3);
      pdf.line(infoX, curY + 0.8, infoX + labelW, curY + 0.8);

      // Valeur en bleu gras
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(...C.navy);
      pdf.text(value, infoX + 20, curY);
    };

    drawLabelValue('Nom:', lastName.toUpperCase(), infoY);
    infoY += 5;
    drawLabelValue('Prénom:', firstName, infoY);
    infoY += 5;
    drawLabelValue('Classe:', cls, infoY);
    infoY += 7;

    // ===== MATRICULE =====
    pdf.setFillColor(...C.lightGray);
    pdf.roundedRect(infoX, infoY - 2, 35, 8, 1, 1, 'F');
    pdf.setDrawColor(...C.gold);
    pdf.roundedRect(infoX, infoY - 2, 35, 8, 1, 1, 'S');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5);
    pdf.setTextColor(...C.darkGray);
    pdf.text('Matricule', infoX + 2, infoY + 1);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...C.navy);
    pdf.text(matricule, infoX + 15, infoY + 1);

    // ===== BANDEAU OVAL DORÉ =====
    // Positionné sous la photo ET sous les infos élève
    const photoBottom = y + headerH + 8 + photoSize;       // bas de la photo
    const infoBottom  = infoY + 8;                          // bas du matricule
    const ovalY       = Math.max(photoBottom, infoBottom) + 6; // 6mm sous le plus bas

    const ovalW = W - 20;   // largeur ovale (marge de 10 de chaque côté)
    const ovalH = 9;        // hauteur ovale
    const ovalX = x + 10;  // centré horizontalement

    pdf.setFillColor(...C.gold);
    pdf.setDrawColor(...C.gold);
    pdf.roundedRect(ovalX, ovalY, ovalW, ovalH, ovalH / 2, ovalH / 2, 'FD'); // rx=ovalH/2 = vrai ovale

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);
    pdf.setTextColor(...C.navy);
    pdf.text(
      "Seuls les élèves avec un badge ont accès au centre",
      x + W / 2,
      ovalY + ovalH / 2 + 1.5,
      { align: 'center' }
    );

    // ===== INFORMATIONS ÉTABLISSEMENT =====
    const bottomY = y + H - 22;
  
    pdf.setDrawColor(...C.gold);
    pdf.setLineWidth(0.3);
    pdf.line(x + 15, bottomY - 3, x + W - 15, bottomY - 3);
  
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);
    pdf.setTextColor(...C.navy);
    pdf.text(`${SCHOOL_INFO.name} ${SCHOOL_INFO.subtitle}`, x + W/2, bottomY, { align: 'center' });
  
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5);
    pdf.setTextColor(...C.darkGray);
    pdf.text(SCHOOL_INFO.address, x + W/2, bottomY + 4, { align: 'center' });
    pdf.text(`Tel: ${SCHOOL_INFO.phone} • Web: ${SCHOOL_INFO.website}`, x + W/2, bottomY + 8, { align: 'center' });
  
    // ===== FOOTER =====
    const footH = 8;
    pdf.setFillColor(...C.navy);
    pdf.rect(x, y + H - footH, W, footH, 'F');
  
    pdf.setFontSize(5);
    pdf.setTextColor(...C.gold);
    pdf.text(
      `${new Date(validityDate.start).toLocaleDateString('fr-FR')} — ${new Date(validityDate.end).toLocaleDateString('fr-FR')}`,
      x + W/2,
      y + H - 2.5,
      { align: 'center' }
    );
  };





  // ══════════════════════════════════════════════════════════════
  //  EXPORT PDF
  // ══════════════════════════════════════════════════════════════
  const handleExportPDF = async (overrideList = null) => {
    let list = overrideList;
    if (!list) {
      if (selectedStudents.length > 0)
        list = students.filter((s) => selectedStudents.includes(s.id));
      else if (selectedClass)
        list = students.filter((s) => s.class_id === parseInt(selectedClass));
      else
        list = [...students];
    }
    if (list.length === 0) { alert('Veuillez sélectionner au moins un élève'); return; }
  
    setLoading(true);
    setLoadingMsg('Chargement du logo…');
    try {
      const logoB64 = await loadImageAsBase64(getLogoPath());
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
      // Dimensions page A4 : 210 x 297 mm
      const pageW = 210;
      const pageH = 297;
  
      const cols = 2;
      const rows = 2;
      const perPage = cols * rows; // 4 badges par page
  
      const marginX = 10;
      const marginY = 15;
      const gapX = 8;
      const gapY = 10;
  
      // Calcul automatique de la taille des badges
      const W = (pageW - marginX * 2 - gapX * (cols - 1)) / cols;
      const H = (pageH - marginY * 2 - gapY * (rows - 1)) / rows;
  
      for (let i = 0; i < list.length; i++) {
        const student = list[i];
        setLoadingMsg(`Badge ${i + 1}/${list.length} — ${getStudentFullName(student)}`);
  
        const photoB64 = await loadImageAsBase64(getStudentPhotoUrl(student));
  
        const posInPage = i % perPage;
        const col = posInPage % cols;
        const row = Math.floor(posInPage / cols);
  
        const x = marginX + col * (W + gapX);
        const y = marginY + row * (H + gapY);
  
        if (i > 0 && i % perPage === 0) pdf.addPage();
  
        drawBadge(pdf, student, x, y, W, H, logoB64, photoB64);
      }
  
      pdf.save(`badges_phenix_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Erreur export PDF:', err);
      alert("Erreur lors de l'export PDF : " + err.message);
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  STYLES (inchangés)
  // ══════════════════════════════════════════════════════════════
  const S = {
    page:      { fontFamily: "'Segoe UI', Arial, sans-serif", padding: '24px', maxWidth: '860px', margin: '0 auto', color: '#1e293b' },
    pageTitle: { fontSize: '20px', fontWeight: '700', color: '#0f2e6d', margin: '0 0 4px' },
    pageSub:   { fontSize: '13px', color: '#64748b', margin: '0 0 22px' },
    card:      { background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' },
    cardHeader:{ padding: '11px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    cardTitle: { fontSize: '13px', fontWeight: '700', color: '#0f2e6d' },
    grid2:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '16px 18px' },
    label:     { display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '5px' },
    input:     { width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
    select:    { width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: '#fff', cursor: 'pointer', outline: 'none', boxSizing: 'border-box' },
    dateRow:   { display: 'flex', gap: '8px', alignItems: 'center' },
    listWrap:  { maxHeight: '300px', overflowY: 'auto' },
    row: (sel) => ({ display: 'flex', alignItems: 'center', padding: '10px 18px', cursor: 'pointer', background: sel ? '#eff6ff' : '#fff', borderBottom: '1px solid #f1f5f9', transition: 'background .15s' }),
    avatar: (sel) => ({ width: '38px', height: '38px', borderRadius: '50%', background: sel ? '#0f2e6d' : '#e8edf5', color: sel ? '#fcd116' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0, marginRight: '12px' }),
    sName:     { fontWeight: '600', fontSize: '13px', color: '#1e293b' },
    sMeta:     { fontSize: '11px', color: '#64748b', marginTop: '1px' },
    check: (sel) => ({ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, border: sel ? 'none' : '2px solid #cbd5e1', background: sel ? '#009a44' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    apBtn:     { background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#64748b', cursor: 'pointer', marginRight: '10px', flexShrink: 0 },
    exportBtn: (dis) => ({ flex: 1, padding: '13px 20px', background: dis ? '#94a3b8' : '#0f2e6d', color: '#fcd116', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: dis ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }),
    selBtn:    { background: 'transparent', border: 'none', fontSize: '12px', color: '#0f2e6d', fontWeight: '600', cursor: 'pointer' },
    overlay:   { position: 'fixed', inset: 0, background: 'rgba(10,20,50,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modal:     { background: '#fff', borderRadius: '18px', padding: '22px', width: '310px', boxShadow: '0 24px 64px rgba(0,0,0,.25)', maxHeight: '90vh', overflowY: 'auto' },
    bCard:     { border: '2px solid #fbbf24', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
    bHeader:   { background: '#0f2e6d', padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '12px' },
    bLogoCircle:{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #fbbf24', overflow: 'hidden', flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    bBody:     { padding: '15px' },
    bPhotoWrap:{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #fbbf24', margin: '0 auto 12px', overflow: 'hidden', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', color: '#0f2e6d' },
    bFooter:   { background: '#0f2e6d', padding: '8px', textAlign: 'center', borderTop: '2px solid #fbbf24' },
  };

  // ══════════════════════════════════════════════════════════════
  //  RENDU JSX (inchangé)
  // ══════════════════════════════════════════════════════════════
  return (
    <div style={S.page}>
      <h2 style={S.pageTitle}>Génération des Badges Scolaires</h2>
      <p style={S.pageSub}>{SCHOOL_INFO.name} {SCHOOL_INFO.subtitle} — {SCHOOL_INFO.address}</p>

      {/* Filtres */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={S.cardTitle}>Filtres &amp; Période de validité</span>
        </div>
        <div style={S.grid2}>
          <div>
            <label style={S.label}>Rechercher un élève</label>
            <input type="text" placeholder="Nom ou prénom…" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} style={S.input} />
          </div>
          <div>
            <label style={S.label}>Filtrer par classe</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={S.select}>
              <option value="">Toutes les classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={S.label}>Période de validité</label>
            <div style={S.dateRow}>
              <input type="date" value={validityDate.start}
                onChange={(e) => setValidityDate({ ...validityDate, start: e.target.value })}
                style={{ ...S.input, flex: 1 }} />
              <span style={{ color: '#94a3b8', fontSize: '16px' }}>→</span>
              <input type="date" value={validityDate.end}
                onChange={(e) => setValidityDate({ ...validityDate, end: e.target.value })}
                style={{ ...S.input, flex: 1 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Liste élèves */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          <span style={S.cardTitle}>
            {filteredStudents.length} élève{filteredStudents.length > 1 ? 's' : ''}
            {selectedStudents.length > 0 && (
              <span style={{ marginLeft: '8px', color: '#009a44' }}>
                · {selectedStudents.length} sélectionné{selectedStudents.length > 1 ? 's' : ''}
              </span>
            )}
          </span>
          <button style={S.selBtn} onClick={handleSelectAll}>
            {selectAll ? 'Désélectionner tout' : 'Sélectionner tout'}
          </button>
        </div>
        <div style={S.listWrap}>
          {filteredStudents.length === 0 && (
            <p style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              Aucun élève trouvé
            </p>
          )}
          {filteredStudents.map((student) => {
            const isSel = selectedStudents.includes(student.id);
            return (
              <div key={student.id} style={S.row(isSel)} onClick={() => handleSelectStudent(student.id)}>
                <div style={S.avatar(isSel)}>{getStudentInitials(student)}</div>
                <div style={{ flex: 1 }}>
                  <div style={S.sName}>{getStudentFullName(student)}</div>
                  <div style={S.sMeta}>{getStudentClass(student)} · ID #{student.id}</div>
                </div>
                <button style={S.apBtn}
                  onClick={(e) => { e.stopPropagation(); setPreviewStudent(student); }}>
                  Aperçu
                </button>
                <div style={S.check(isSel)}>
                  {isSel && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bouton export */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          style={S.exportBtn(loading || filteredStudents.length === 0)}
          onClick={() => handleExportPDF()}
          disabled={loading || filteredStudents.length === 0}
        >
          {loading ? (
            <span>{loadingMsg || 'Génération en cours…'}</span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {selectedStudents.length > 0
                ? `Exporter ${selectedStudents.length} badge${selectedStudents.length > 1 ? 's' : ''} PDF`
                : 'Exporter tous les badges en PDF'}
            </>
          )}
        </button>
      </div>

      {/* Modal aperçu badge */}
      {previewStudent && (
        <div style={S.overlay} onClick={() => setPreviewStudent(null)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f2e6d' }}>Aperçu du badge</span>
              <button onClick={() => setPreviewStudent(null)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}>×</button>
            </div>

            {/* Badge preview */}
            <div style={S.bCard}>
              <div style={S.bHeader}>
                <div style={S.bLogoCircle}>
                  <img src={getLogoPath()} alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = 'LP'; }} />
                </div>
                <div>
                  <div style={{ fontSize: '9px', fontWeight: '700', color: '#fff' }}>
                    CENTRE DE SOUTIEN SCOLAIRE
                  </div>
                  <div style={{ fontSize: '8px', fontStyle: 'italic', color: '#fcd116' }}>
                    "LE PHÉNIX"
                  </div>
                </div>
              </div>

              <div style={S.bBody}>
                <div style={S.bPhotoWrap}>
                  <img src={getStudentPhotoUrl(previewStudent)} alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.textContent = getStudentInitials(previewStudent);
                    }} />
                </div>

                <div style={{ textAlign: 'left', marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#0f2e6d' }}>Nom:</span> {getStudentLastName(previewStudent)}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#0f2e6d' }}>Prénom:</span> {getStudentFirstName(previewStudent)}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#0f2e6d' }}>Classe:</span> {getStudentClass(previewStudent)}
                  </div>
                </div>

                <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'left' }}>
                  <div style={{ marginBottom: '3px' }}>📍 {SCHOOL_INFO.address}</div>
                  <div style={{ marginBottom: '3px' }}>📞 {SCHOOL_INFO.phone}</div>
                  <div>🌐 {SCHOOL_INFO.website}</div>
                </div>
              </div>

              <div style={S.bFooter}>
                <div style={{ fontSize: '9px', color: '#93c5fd' }}>
                  {new Date(validityDate.start).toLocaleDateString('fr-FR')} —{' '}
                  {new Date(validityDate.end).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            <button
              style={{ ...S.exportBtn(false), marginTop: '14px', fontSize: '13px', padding: '10px' }}
              onClick={() => { setPreviewStudent(null); handleExportPDF([previewStudent]); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Exporter ce badge en Pdf
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesTab;