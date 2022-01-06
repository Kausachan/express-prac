const express = require('express')
const router = express.Router()
const {File_Name, File_Details} = require('../mongoDB');
const status = require('http-status')

router.get('*', (req, res) => {
    File_Name.exists({File_Name : req.query.fileName})
    .then(fileExists => {
        if(fileExists){
            File_Details.find({File_Name : req.query.fileName})
            .then(docList => {
            const new_arr = []
            let obj
            for(let i of docList){
                obj = {...i.toObject()}
                delete obj['__v']
                delete obj['File_Name']
                new_arr.push(obj)
            }    
            res.send(new_arr)
            })
        }
        else res.status(status.NOT_FOUND).send('Given file name was not found')
    })
})

module.exports = router