const db = require('../database')
const { uploader } = require('../helpers/uploader')
const fs = require('fs')

module.exports = ({
    uploadFile: (req, res) => {
        try {
            let path = '/images'
            const upload = uploader(path, 'FILE').fields([{ name: 'file' }])

            upload(req, res, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).send(error)
                }

                const { file } = req.files
                const filepath = file ? path + '/' + file[0].filename : null

                let data = JSON.parse(req.body.data)

                let dataNew = { filepath }

                let sqlInsert = `Insert into uploadfile set ?`
                db.query(sqlInsert, data, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + filepath)
                        res.status(500).send(err)
                    }
                    res.status(200).send('Upload Success')
                })
            })

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
})
