import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    users: 0
  });

  const [examStats, setExamStats] = useState({
    bac: 0,
    probatoire: 0,
    bepc: 0
  });

  const [isVisible, setIsVisible] = useState({
    hero: false,
    stats: false,
    success: false,
    services: false,
    contact: false
  });

  const sectionRefs = {
    hero: useRef(null),
    stats: useRef(null),
    success: useRef(null),
    services: useRef(null),
    contact: useRef(null)
  };

  // Animation au défilement
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.dataset.section]: true
            }));
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        ref.current.dataset.section = key;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Animation des compteurs pour les stats de réussite
  useEffect(() => {
    if (isVisible.success) {
      const targets = {
        bac: 95,
        probatoire: 90,
        bepc: 92
      };

      const duration = 2000; // 2 secondes
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setExamStats({
          bac: Math.min(Math.floor(progress * targets.bac), targets.bac),
          probatoire: Math.min(Math.floor(progress * targets.probatoire), targets.probatoire),
          bepc: Math.min(Math.floor(progress * targets.bepc), targets.bepc)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible.success]);

  // Charger statistiques depuis backend
  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Erreur stats:", err));
  }, []);

  return (
    <div className="home-container">
      {/* Particules décoratives */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* HERO SECTION */}
      <section 
        ref={sectionRefs.hero} 
        className={`hero ${isVisible.hero ? 'visible' : ''}`}
      >
        <div className="hero-content">
          <div className="hero-logo">
            <span className="phoenix-icon">🔥</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">CENTRE DE SOUTIEN</span>
            <span className="title-line">SCOLAIRE</span>
            <span className="title-line highlight">"LE PHÉNIX"</span>
          </h1>
          <p className="hero-subtitle">
            Accompagner chaque élève vers la réussite scolaire grâce à un encadrement de qualité
          </p>
          
          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-number">{stats.students}+</span>
              <span className="hero-stat-label">Élèves</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number">{stats.teachers}+</span>
              <span className="hero-stat-label">Enseignants</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-number">15+</span>
              <span className="hero-stat-label">Années d'expérience</span>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to="/login" className="btn btn-login">
              <span>Se connecter</span>
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/preinscription" className="btn btn-preinscription">
              <span>Se préinscrire</span>
              <span className="btn-icon">✨</span>
            </Link>
          </div>
        </div>

        <div className="hero-shape"></div>
      </section>

      {/* STATISTIQUES DE RÉUSSITE */}
      <section 
        ref={sectionRefs.success} 
        className={`success-stats ${isVisible.success ? 'visible' : ''}`}
      >
        <h2 className="section-title">Nos Résultats aux Examens 2026</h2>
        <p className="section-subtitle">Des taux de réussite exceptionnels qui parlent d'eux-mêmes</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-number">
              <span className="counter">{examStats.bac}</span>
              <span className="percent">%</span>
            </div>
            <div className="stat-label">BACCALAURÉAT</div>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${examStats.bac}%` }}
              ></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-number">
              <span className="counter">{examStats.probatoire}</span>
              <span className="percent">%</span>
            </div>
            <div className="stat-label">PROBATOIRE</div>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${examStats.probatoire}%` }}
              ></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✏️</div>
            <div className="stat-number">
              <span className="counter">{examStats.bepc}</span>
              <span className="percent">%</span>
            </div>
            <div className="stat-label">BEPC</div>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${examStats.bepc}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="success-badge">
          <span className="badge-icon">🏆</span>
          <span className="badge-text">Meilleur centre de soutien 2026</span>
        </div>
      </section>

      {/* STATISTIQUES GÉNÉRALES */}
      <section 
        ref={sectionRefs.stats} 
        className={`general-stats ${isVisible.stats ? 'visible' : ''}`}
      >
        <div className="stats-wrapper">
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-big-number">{stats.users}</span>
            </div>
            <p>Utilisateurs actifs</p>
          </div>
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-big-number">{stats.teachers}</span>
            </div>
            <p>Enseignants qualifiés</p>
          </div>
          <div className="stat-item">
            <div className="stat-circle">
              <span className="stat-big-number">{stats.students}</span>
            </div>
            <p>Élèves accompagnés</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section 
        ref={sectionRefs.services} 
        className={`services ${isVisible.services ? 'visible' : ''}`}
      >
        <h2 className="section-title">Nos Services</h2>
        <p className="section-subtitle">Un accompagnement complet pour la réussite de vos enfants</p>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📚</div>
            <h3>Cours particuliers</h3>
            <p>Soutien scolaire personnalisé pour tous les niveaux, du primaire au lycée.</p>
            <div className="service-hover"></div>
          </div>

          <div className="service-card">
            <div className="service-icon">🎯</div>
            <h3>Préparation aux examens</h3>
            <p>BEPC, Probatoire, Baccalauréat et concours avec des méthodes éprouvées.</p>
            <div className="service-hover"></div>
          </div>

          <div className="service-card">
            <div className="service-icon">📊</div>
            <h3>Suivi pédagogique</h3>
            <p>Évaluation continue et accompagnement individualisé pour chaque élève.</p>
            <div className="service-hover"></div>
          </div>

          <div className="service-card">
            <div className="service-icon">💻</div>
            <h3>Informatique & TIC</h3>
            <p>Initiation et perfectionnement en informatique, coding et technologies.</p>
            <div className="service-hover"></div>
          </div>

          <div className="service-card">
            <div className="service-icon">🗣️</div>
            <h3>Langues étrangères</h3>
            <p>Anglais, Allemand, Espagnol avec des professeurs natifs.</p>
            <div className="service-hover"></div>
          </div>

          <div className="service-card">
            <div className="service-icon">🧮</div>
            <h3>Méthodologie de travail</h3>
            <p>Apprendre à apprendre : techniques de mémorisation et organisation.</p>
            <div className="service-hover"></div>
          </div>
        </div>
      </section>

      {/* CONTACT & LOCALISATION */}
      <section 
        ref={sectionRefs.contact} 
        className={`contact-section ${isVisible.contact ? 'visible' : ''}`}
      >
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Contactez-nous</h2>
            <p className="contact-description">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:contact@centrephenix.cm">contact@centrephenix.cm</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <h4>Téléphone / WhatsApp</h4>
                  <a href="https://wa.me/237699123456" target="_blank" rel="noopener noreferrer">
                    +237 699 123 456
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Adresse</h4>
                  <p>Boulevard de la République, Yaoundé</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">⏰</span>
                <div>
                  <h4>Horaires</h4>
                  <p>Lun - Sam : 8h00 - 19h00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="map-wrapper">
            <iframe
              title="Localisation Centre Phénix"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.1234567890!2d11.123456!3d3.123456"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="phoenix-icon">🔥</span>
            <span>Le Phénix</span>
          </div>
          
          <div className="footer-links">
            <Link to="/about">À propos</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/mentions">Mentions légales</Link>
          </div>

          <div className="footer-social">
            <a href="#" target="_blank" rel="noopener noreferrer">📘</a>
            <a href="#" target="_blank" rel="noopener noreferrer">📷</a>
            <a href="#" target="_blank" rel="noopener noreferrer">🐦</a>
            <a href="#" target="_blank" rel="noopener noreferrer">📱</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          © {new Date().getFullYear()} Centre de Soutien Scolaire Le Phénix - Tous droits réservés
        </div>
      </footer>
    </div>
  );
};

export default Home;