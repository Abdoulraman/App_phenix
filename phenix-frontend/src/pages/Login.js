// Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Charger l'email sauvegardé
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error) setError("");
  };

  // Obtenir le chemin du dashboard selon le rôle
  const getDashboardPath = (roleId) => {
    const dashboards = {
      1: '/admin/dashboard',      // Admin
      2: '/secretary/dashboard',  // Secrétaire
      3: '/teacher/dashboard',    // Enseignant
      4: '/parent/dashboard',     // Parent
      5: '/student/dashboard'     // Élève
    };
    return dashboards[roleId] || '/dashboard';
  };

  // Obtenir le libellé du rôle
  const getRoleLabel = (roleId) => {
    const labels = {
      1: 'Administrateur',
      2: 'Secrétaire',
      3: 'Enseignant',
      4: 'Parent',
      5: 'Élève'
    };
    return labels[roleId] || 'Utilisateur';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation rapide
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      console.log("📡 Tentative de connexion à:", `${API_URL}/api/login`);
      
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📦 Réponse API:", data);

      if (!res.ok) {
        // Gestion des erreurs
        switch (res.status) {
          case 400:
            setError(data.message || "Données invalides");
            break;
          case 401:
            setError("Email ou mot de passe incorrect");
            break;
          case 403:
            setError("Compte désactivé. Contactez l'administrateur");
            break;
          default:
            setError(data.message || "Erreur de connexion");
        }
        setLoading(false);
        return;
      }

      // Vérification des données essentielles
      if (!data.user) {
        setError("Erreur: données utilisateur manquantes");
        setLoading(false);
        return;
      }

      if (data.user.role_id === undefined) {
        setError("Erreur: rôle non défini");
        setLoading(false);
        return;
      }

      const roleId = data.user.role_id;
      const roleLabel = getRoleLabel(roleId);
      
      console.log(`✅ Connexion réussie - Rôle ID: ${roleId} (${roleLabel})`);

      // Déterminer le chemin de redirection
      const dashboardPath = getDashboardPath(roleId);
      
      console.log(`🎯 Dashboard path: ${dashboardPath}`);

      // Stockage du token
      localStorage.setItem("token", data.token);
      
      // Construction des informations utilisateur
      const userInfo = {
        id: data.user.id,
        role_id: roleId,
        role_name: data.user.role_name || roleLabel,
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || "",
        full_name: data.user.full_name || 
          `${data.user.first_name || ""} ${data.user.last_name || ""}`.trim() || "Utilisateur",
        email: data.user.email,
        phone: data.user.phone || "",
        is_active: data.user.is_active !== undefined ? data.user.is_active : true,
        dashboard: dashboardPath,
        user_type: roleLabel.toLowerCase()
      };
      
      localStorage.setItem("user", JSON.stringify(userInfo));
      console.log("💾 Utilisateur sauvegardé:", userInfo);
      
      // Stocker les permissions si elles existent
      if (data.permissions) {
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
      }
      
      // Stocker le rôle pour un accès rapide
      localStorage.setItem("userRole", roleId);

      // Gestion de "Se souvenir de moi"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      console.log(`🔄 Redirection vers: ${dashboardPath} (${roleLabel})`);
      
      // Redirection
      navigate(dashboardPath);

    } catch (err) {
      console.error("❌ Erreur détaillée:", err);
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  // Message de bienvenue personnalisé
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");

    // Vérifier si un utilisateur est déjà connecté
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserName(user.first_name ? ` ${user.first_name}` : '');
      } catch (e) {
        console.error("Erreur parsing user:", e);
      }
    }
  }, []);

  return (
    <div className="login-container">
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-card">
        <div className="logo-section">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <span className="phoenix-icon">🦅</span>
            </div>
          </div>
          <h1 className="logo-text">
            <span className="line1">CENTRE DE SOUTIEN</span>
            <span className="line2">SCOLAIRE</span>
            <span className="line3">"LE PHÉNIX"</span>
          </h1>
          <p className="welcome-message">
            {greeting}{userName} ! ✨
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
            <label>
              <span className="label-icon">📧</span>
              Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                disabled={loading}
                autoComplete="email"
              />
              {formData.email && !error && formData.email.includes('@') && (
                <span className="input-valid">✓</span>
              )}
            </div>
          </div>

          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
            <label>
              <span className="label-icon">🔒</span>
              Mot de passe
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span className="checkbox-text">Se souvenir de moi</span>
            </label>
            <button
              type="button"
              className="forgot-password"
              onClick={() => navigate("/forgot-password")}
              disabled={loading}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            className={`btn-login-submit ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Connexion...
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <span className="btn-icon">→</span>
              </>
            )}
          </button>

          <div className="signup-link">
            <span>Première visite ?</span>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/register")}
              disabled={loading}
            >
              Créer un compte
            </button>
          </div>
        </form>

        <div className="footer-note">
          <span className="dot"></span>
          <span className="footer-text">Espace Éducateur</span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default Login;