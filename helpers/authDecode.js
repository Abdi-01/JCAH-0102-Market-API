const jwt = require('jsonwebtoken')

module.exports = {
    auth: (req, res, next) => {
        jwt.verify(req.token, 'm4rk3t', (err, decode) => {
            if (err) {
                return res.status(401).send('User Not Auth')
            }
            req.user = decode

            next()
        })
    }
}