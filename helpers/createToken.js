const jwt = require('jsonwebtoken')

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, 'm4rk3t', {
            expiresIn: '12h'
        })
    }
}