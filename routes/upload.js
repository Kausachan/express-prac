const express = require('express')
const router = express.Router()
const {extractLabelAndValue, isJSON} = require('../utilities')
const {File_Name, File_Details} = require('../mongoDB');
const status = require('http-status')

router.post('*', (req, res) => {
    if(!req.files)
    {
        res.status(400).send("Please attach a file");
        return;
    }
    const nameObj = Object.keys(req.files)[0]
    const fileName = req.files[nameObj].name 
    let fileFormat = fileName.split('.')
    fileFormat = fileFormat[fileFormat.length - 1]

    // check file format
    if(fileFormat !== 'json'){
        res.status(status.BAD_REQUEST).send("Please attach a .json file")
        return
    }
    if(!(isJSON(req.files[nameObj].data.toString()))){
        res.status(status.BAD_REQUEST).send('Upload a JSON format file')
        return
    }   

    // check file name length
    if(fileName.length > 24){
        res.status(status.BAD_REQUEST).send("Your file name is too long")
        return
    }

    // check file size
    if((req.files[nameObj].size / 1000000.0) > 2.0){
        res.status(status.BAD_REQUEST).send("File size should be less than 2 MB")
        return
    }

    const arr = extractLabelAndValue(JSON.parse(req.files[nameObj].data.toString()))

    File_Name.exists({File_Name : fileName})
    .then(fileExists => {
        if(!fileExists){
            File_Name({
                File_Name : fileName
            })
            .save()
            .catch(err => res.status(status.INTERNAL_SERVER_ERROR).send("Error occured try after sometime"))
            for(let i of arr){
                File_Details({
                    'Description': i['Description'],
                    'Qty': i['Qty'],
                    'UOM' : i['UOM'],
                    'Unit Price\n(Curr)': i['Unit Price\n(Curr)'],
                    'Discount\n%': i['Discount\n%'],
                    'Discount\nAmt (Curr)': i['Discount\nAmt (Curr)'],
                    'Net Amt\n(Curr)': i['Net Amt\n(Curr)'],
                    'Net Amt\n(AED)': i['Net Amt\n(AED)'],
                    'VAT Code': i['VAT Code'],
                    'VAT\n%': i['VAT\n%'],
                    'VAT Amt\n(Curr)': i['VAT Amt\n(Curr)'],
                    'VAT Amt\n(AED)': i['VAT Amt\n(AED)'],
                    'Gross Amt\n(Curr)': i['Gross Amt\n(Curr)'],
                    'Gross Amt\n(AED)': i['Gross Amt\n(AED)'],
                    'File_Name' : fileName
                }).save()
            }
            res.send("File uploaded succesfully")
        }
        else res.status(status.BAD_REQUEST).send("File Name already exists")
    })
})

module.exports = router