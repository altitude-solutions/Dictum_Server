const jwt = require('jsonwebtoken');

// ===============================================
// Verify token
// ===============================================
let verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                err: {
                    err,
                    message: 'Token inválido'
                }
            });
        } else {
            req.user = decoded.user;
            next();
        }
    });
};



module.exports = {
    verifyToken
}