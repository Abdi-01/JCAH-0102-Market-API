const db = require('../database')
const { asyncQuery } = require('../helpers/query')
const { uploader } = require('../helpers/uploader')

module.exports = ({
    getLeafCat: async (req, res) => {
        try {
            let sqlGet = `Select tb1.idcategory, tb1.category from tbcategory tb1
            left join tbcategory tb2 on tb2.parentId = tb1.idcategory
            where tb2.idcategory is null;`
            let get = await asyncQuery(sqlGet)

            res.status(200).send(get)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addProduct: (req, res) => {
        try {
            let path = '/images'
            const upload = uploader(path, 'FILE').fields([{ name: 'file' }])

            upload(req, res, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).send(error)
                }
                console.log("cek data ===>",req.body)
                console.log("cek file ===>",req.files)
                const { file } = req.files
                const filepath = file ? path + '/' + file[0].filename : null

                let data = JSON.parse(req.body.data)
                // console.log(data)
                let dataNew = { image: filepath, ...data }
                // console.log(dataNew)

                let sqlInsert = `insert into tbproducts set ?`
                let sqlGetCat = `
                with recursive category_path (idcategory, category, parentId)as
                (
                    Select idcategory, category, parentId
                        from tbcategory
                        where idcategory = ${req.params.leafnode} -- idcategory leaf node 
                    Union ALL
                    Select tbc.idcategory, tbc.category, tbc.parentId 
                        from category_path cp join tbcategory tbc
                        on cp.parentId = tbc.idcategory
                )

                select * from category_path;
                `
                // let sqlInsertPr = `Insert into product_category values `
                // // let insert = await asyncQuery(sqlInsert)
                // db.query(sqlInsert, dataNew, async(err, results) => {
                //     if (err) {
                //         console.log(err)
                //         res.status(500).send(err)
                //     }
                //     console.log(results)
                //     if (results.insertId) {
                //         let getCat = await asyncQuery(sqlGetCat)
                //         if (getCat) {
                //             let data = []
                //             getCat.forEach(element => {
                //                 data.push(`(null,${results.insertId},${element.idcategory})`)
                //             });
                //             let inpc = await asyncQuery(`${sqlInsertPr} ${data.toString()};`)
                //             res.status(200).send('Add Product Success')
                //         }
                //     }
                // })
            })

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getCategoryParent: (req, res) => {
        let sqlGet = 'Select * from tbcategory tc1 where tc1.parentId is null;'
        db.query(sqlGet, (err, results) => {
            if (err) console.log(err)
            res.status(200).send(results)
        })
    },
    getProducts: (req, res) => {
        let sqlGet = `Select * from tbproducts 
        ${req.query.idcategory && `p left join product_category pc on 
        p.idproduct = pc.idproduct where pc.idcategory = ${req.query.idcategory}`} ;`

        db.query(sqlGet, (err, results) => {
            if (err) console.log(err)
            res.status(200).send(results)
        })
    }
})