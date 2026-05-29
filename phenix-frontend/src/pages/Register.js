// Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Tu peux réutiliser le même CSS

const Register = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    user_type: "parent" // 'parent' ou 'student' par défaut
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          user_type: formData.user_type
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur d'inscription");
        setLoading(false);
        return;
      }

      // Succès - Connexion automatique
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirection selon le type d'utilisateur
      if (data.user.user_type === 'parent') {
        navigate("/parent/dashboard");
      } else {
        navigate("/student/dashboard");
      }

    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-card" style={{ width: '500px' }}>
        <div className="logo-section">
          <div className="logo-wrapper">
            <div className="logo-icon">
              <span className="phoenix-icon">🔥</span>
            </div>
          </div>
          <h1 className="logo-text">
            <span className="line1">CENTRE DE SOUTIENT</span>
            <span className="line2">SCOLAIRE</span>
            <span className="line3">"LE PHÉNIX"</span>
          </h1>
          <p className="welcome-message">
            Créez votre compte en quelques secondes ✨
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Type d'utilisateur - Choix visible mais pas de numéro de rôle */}
          <div className="form-group">
            <label>👤 Je suis</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="user_type"
                  value="parent"
                  checked={formData.user_type === 'parent'}
                  onChange={handleChange}
                />
                <span>Parent</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="user_type"
                  value="student"
                  checked={formData.user_type === 'student'}
                  onChange={handleChange}
                />
                <span>Élève</span>
              </label>
            </div>
          </div>

          {/* Prénom */}
          <div className={`form-group ${focusedField === 'first_name' ? 'focused' : ''}`}>
            <label>📝 Prénom</label>
            <input
              type="text"
              name="first_name"
              placeholder="Votre prénom"
              value={formData.first_name}
              onChange={handleChange}
              onFocus={() => setFocusedField('first_name')}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Nom */}
          <div className={`form-group ${focusedField === 'last_name' ? 'focused' : ''}`}>
            <label>📝 Nom</label>
            <input
              type="text"
              name="last_name"
              placeholder="Votre nom"
              value={formData.last_name}
              onChange={handleChange}
              onFocus={() => setFocusedField('last_name')}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Email */}
          <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
            />
          </div>

          {/* Téléphone (optionnel) */}
          <div className={`form-group ${focusedField === 'phone' ? 'focused' : ''}`}>
            <label>📞 Téléphone (optionnel)</label>
            <input
              type="tel"
              name="phone"
              placeholder="06 12 34 56 78"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Mot de passe */}
          <div className={`form-group ${focusedField === 'password' ? 'focused' : ''}`}>
            <label>🔒 Mot de passe</label>
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
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''}`}>
            <label>🔒 Confirmer le mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn-login-submit ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Inscription...
              </>
            ) : (
              <>
                <span>S'inscrire</span>
                <span className="btn-icon">→</span>
              </>
            )}
          </button>

          <div className="signup-link">
            <span>Déjà un compte ?</span>
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;