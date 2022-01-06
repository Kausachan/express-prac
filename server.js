const app = require('express')();
const fileupload = require('express-fileupload')
const status = require('http-status')

const updateRouter = require('./routes/update')
const uploadRouter = require('./routes/upload')
const computeRouter = require('./routes/compute')
const getRouter = require('./routes/getData')

// middlewares
app.use(fileupload());
app.use('/update', updateRouter)
app.use('/upload', uploadRouter)
app.use('/compute', computeRouter)
app.use('/getData', getRouter)
app.use((req, res, next) => {
    return res.sendStatus(status.NOT_FOUND)
})

app.listen(3001, () => console.log("The server is listening to port 3001"))

