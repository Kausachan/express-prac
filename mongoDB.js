const res = require('express/lib/response')
const mongoose = require('mongoose')
const status = require('http-status')

const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost:27017/express')
.catch(err => res.sendStatus(status.INTERNAL_SERVER_ERROR))


fileName_Schema = new Schema({
    'File_Name': {
        type : String,
        required : true
    }
})

fileDetails_Schema = new Schema({
    'Description': String,
    'Qty': String,
    'UOM' : String,
    'Unit Price\n(Curr)': String,
    'Discount\n%': String,
    'Discount\nAmt (Curr)': String,
    'Net Amt\n(Curr)': String,
    'Net Amt\n(AED)': String,
    'VAT Code': String,
    'VAT\n%': String,
    'VAT Amt\n(Curr)': String,
    'VAT Amt\n(AED)': String,
    'Gross Amt\n(Curr)': String,
    'Gross Amt\n(AED)': String,
    'File_Name' : String
})


const File_Name = mongoose.model('File_Name', fileName_Schema)
const File_Details = mongoose.model('File_Details', fileDetails_Schema)

module.exports = {
    File_Name,
    File_Details
}


