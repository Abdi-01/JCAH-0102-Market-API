const db = require('../database')
const Crypto = require('crypto')
const { createToken } = require('../helpers/createToken')
const transporter = require('../helpers/nodemailer')
const { asyncQuery } = require('../helpers/query')
const hbs = require('nodemailer-express-handlebars')

module.exports = ({
    getUsers: async (req, res) => {
        try {
            let sqlGet = `Select * from tbusers;`
            let get = await asyncQuery(sqlGet)
            res.status(200).send(get)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getUserbyId: async (req, res) => {
        try {
            let sqlGet = `Select * from tbusers where iduser = ${req.query.iduser};`
            let get = await asyncQuery(sqlGet)
            res.status(200).send(get)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    register: (req, res) => {
        let sqlInsert = `Insert into tbusers set ? `
        req.body.password = Crypto.createHmac("sha1", "m@rk3t").update(req.body.password + "marketku").digest("hex")

        let karakter = `0123456789abcdefghijklmnopqrstuvwxyz`
        let OTP = ''
        for (let i = 0; i < 6; i++) {
            OTP += karakter.charAt(Math.floor(Math.random() * karakter.length))
        }

        req.body.status = OTP
        console.log(req.body)

        db.query(sqlInsert, req.body, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }

            let sqlGet = `Select * from tbusers where iduser = ${results.insertId};`

            db.query(sqlGet, (errGet, resGet) => {
                if (errGet) {
                    console.log(errGet)
                    res.status(500).send(errGet)
                }

                let { iduser, fullname, username, email, role, status } = resGet[0]

                let token = createToken({ iduser, fullname, username, email, role, status })
                // Untuk konfigurasi direktori dan tipe data
                const handlebarsOption = {
                    viewEngine: {
                        extName: '.html',
                        partialsDir: './emailTemplate',
                        layoutsDir: './emailTemplate',
                        defaultLayout: 'verify.html'
                    },
                    viewPath: './emailTemplate',
                    extName: '.html'
                }

                transporter.use('compile', hbs(handlebarsOption))

                let mail = {
                    from: 'Admin <alghifarfn@gmail.com>',
                    to: 'abdialghi@gmail.com',
                    subject: 'Confirm Regis',
                    template: 'verify',
                    context: {
                        nama: fullname,
                        link: `http://localhost:3000/verification/${token}`,
                        image:'http://localhost:2020/images/FILE1605103182025.png'
                    }
                    // html: `Your OTP : <h3>${OTP}</h3>
                    // <a href='http://localhost:3000/verification/${token}'>Click Here !</a>`
                }
                // res.status(200).send(results)
                transporter.sendMail(mail, (errMail, resMail) => {
                    if (errMail) {
                        console.log(errMail)
                        return res.status(500).send(errMail)
                    }
                    res.status(200).send(true)
                })

            })

        })
    },
    deleteUser: (req, res) => {
        let sqlDelete = `Delete from tbusers where iduser = ${req.params.iduser} ;`

        db.query(sqlDelete, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },
    verification: async (req, res) => {
        try {
            let sqlVerified = `Update tbusers set status = 'Verified' where iduser = ${req.user.iduser} and status = ${db.escape(req.body.otp)};`
            let verified = await asyncQuery(sqlVerified)
            res.status(200).send(true)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    Login: async (req, res) => {
        try {
            req.body.password = Crypto.createHmac("sha1", "m@rk3t").update(req.body.password + "marketku").digest("hex")
            let sqlGet = `Select * from tbusers where username = ${db.escape(req.body.username)} and password = ${db.escape(req.body.password)};`
            let get = await asyncQuery(sqlGet)
            if (get[0]) {
                let { iduser, fullname, username, email, role, status } = get[0]
                let token = createToken({ iduser, fullname, username, email, role, status })
                if (status != 'Verified') {
                    res.status(200).send({ message: 'You Not Verified Account' })
                } else {
                    res.status(200).send({ dataLogin: get[0], token, message: 'Login Success' })
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    reqPass: async (req, res) => {
        try {
            let sqlGet = `Select * from tbusers where email = ${db.escape(req.body.email)};`
            let get = await asyncQuery(sqlGet)
            if (get[0]) {
                let mail = {
                    from: 'Admin <alghifarfn@gmail.com>',
                    to: 'abdialghi@gmail.com',
                    subject: 'Confirm Regis',
                    html: `Reset your password link :
                    <a href='http://localhost:3000/rst/${get[0].iduser}'>Click Here !</a>`
                }

                transporter.sendMail(mail, (errMail, resMail) => {
                    if (errMail) {
                        console.log(errMail)
                        return res.status(500).send(errMail)
                    }
                    res.status(200).send(true)
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    resetPass: async (req, res) => {
        try {
            req.body.password = Crypto.createHmac("sha1", "m@rk3t").update(req.body.password + "marketku").digest("hex")
            let sqlReset = `Update tbusers set password = ${db.escape(req.body.password)} where iduser = ${req.body.iduser}`
            let reset = await asyncQuery(sqlReset)

            if (reset) {
                res.status(200).send(true)
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
})