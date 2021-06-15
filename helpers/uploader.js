const multer = require('multer')
const fs = require('fs')

module.exports = {
    uploader: (directory, fileNamePrefix) => {
        // Lokasi penyimpanan file yang dituju
        let defaultDir = './public'

        // diskstorage : untuk menyimpan file kedalam disk storage BE
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const pathDir = defaultDir + directory
                // Melakukan pengecekan directory apakah sudah ada
                if (fs.existsSync(pathDir)) {
                    // Jika ada maka pathDir akan direturn oleh callback(cb)
                    console.log('Directory Ada ✅')
                    cb(null, pathDir)
                } else {
                    // Jika tidak ada, maka directory baru akan di buat
                    fs.mkdir(pathDir, { recursive: true }, error => cb(error, pathDir))
                    console.log('Directory Tidak Ada 🚫, Baru Di Buat')
                }
            },
            filename: (req, file, cb) => {
                let ext = file.originalname.split('.')
                let filename = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1]
                cb(null, filename)
            }
        })

        const fileFilter = (req, file, cb) => {
            const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|txt|xlsx)/;
            if (!file.originalname.match(ext)) {
                return cb(new Error('Your file type are denied'), false)
            }
            cb(null, true)
        }

        return multer({
            storage,
            fileFilter
        })
    }
}