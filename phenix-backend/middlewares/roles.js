// middleware/roles.js
const jwt = require('jsonwebtoken');

// Middleware d'authentification
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token d'authentification manquant"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key');
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token invalide ou expiré"
        });
    }
};

// Middleware pour vérifier les rôles autorisés
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié"
            });
        }

        const userRole = req.user.role_name;
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Accès non autorisé pour votre rôle",
                required_roles: allowedRoles,
                your_role: userRole
            });
        }

        next();
    };
};

// Middleware pour vérifier une permission spécifique
const hasPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Non authentifié"
            });
        }

        const permissions = req.user.permissions || [];
        
        if (permissions.includes('all_access') || permissions.includes(requiredPermission)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Permission insuffisante",
                required_permission: requiredPermission
            });
        }
    };
};

module.exports = {
    authenticate,
    authorize,
    hasPermission
};