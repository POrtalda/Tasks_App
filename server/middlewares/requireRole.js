function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role === role) {
            return next()
            };
            return res.status(403).json({
                success: false,
                message: `Accesso negato.`
            });
        }
        
    };


module.exports = requireRole;