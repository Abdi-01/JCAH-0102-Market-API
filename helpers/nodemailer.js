// nybrupzjnrnlcgvt

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alghifarfn@gmail.com',
        pass: 'nybrupzjnrnlcgvt'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter