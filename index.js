// penyedia sistem routing server
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = 2020
const App = express()
const bearerToken = require('express-bearer-token')
const db = require('./database')

db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('Connect to database status : ' + db.state + ' as id ' + db.threadId);
});

App.use(cors())
App.use(bodyParser.json())
App.use(bearerToken())

// Middleware yang menjalankan function untuk memberikan akses pada direktori server
App.use(express.static('public'))

const { userRouter, productRouter, uploadRouter } = require('./routers')

App.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align:center">Welcome to Management Market API</h1>')
})

App.use('/users', userRouter)
App.use('/products', productRouter)
App.use('/files', uploadRouter)

App.listen(PORT, () => console.log('Connected to Market API :', PORT))