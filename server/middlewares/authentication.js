/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/


const jwt = require('jsonwebtoken');

// ===============================================
// Verify token
// ===============================================
let verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                err
            });
        } else {
            req.user = decoded.user;
            next();
        }
    });
};


// ===============================================
// Verify token by url
// ===============================================
let verifyTokenByURL = (req, res, next) => {
    let token = String(req.query.token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                err
            });
        } else {
            req.user = decoded.user;
            next();
        }
    });
};


module.exports = {
    verifyToken,
    verifyTokenByURL
}