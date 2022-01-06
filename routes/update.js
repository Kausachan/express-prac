const express = require('express')
const router = express.Router()
const {File_Details, File_Name} = require('../mongoDB');
const { checkValidFields, extractLabelAndValue } = require('../utilities');
const status = require('http-status')

router.all('*', (req, res, next) => {
    let fileName;
    switch(req.method)
    {
        case 'DELETE':
            fileName = req.query.fileName 
            File_Name.deleteOne({File_Name : fileName})
            .then(resObj => {
                if(resObj.deletedCount === 0) res.status(status.NOT_FOUND).send("File name not found")
                else{
                    File_Details.deleteMany({File_Name : fileName})
                    .then(() => res.send("Sucessfully deleted"))
                }
            })
            break 

        case 'PATCH':
            const {description, qty, uom, unit_price_curr, discount, discount_curr, gross_amt_curr} = req.query
            const validFields = checkValidFields(req)
            if(validFields.result === false){
                return res.status(status.NOT_FOUND).send(validFields.response)
            }
            const obj = {}
            if(!!uom === true){
                obj['UOM'] = uom
            }
            if(!!qty === true){
                obj['Qty'] = qty
            }
            if(!!unit_price_curr === true){
                obj['Unit Price\n(Curr)'] = unit_price_curr
            }
            if(!!discount === true){
                obj['Discount\n%'] = discount 
            }
            if(!!discount_curr === true){
                obj['Discount\nAmt (Curr)'] = discount_curr
            }
            if(!!gross_amt_curr === true){
                obj['Gross Amt\n(Curr)'] = gross_amt_curr
            }

            if(description === undefined) return res.status(status.NOT_FOUND).send("'description' field not found")

            File_Details.updateOne({'Description' : description}, obj)
            .then(resObj => {
                if(resObj.matchedCount === 1) res.send("Document successfully modified")
                else if(resObj.matchedCount === 0) res.status(status.NOT_FOUND).send("Given description not found")
            })
            break

        case 'PUT':
            const nameObj = Object.keys(req.files)[0]
            fileName = req.files[nameObj].name 
            const fileData = extractLabelAndValue(JSON.parse(req.files[nameObj].data.toString())) 
            File_Details.deleteMany({File_Name : fileName})
            .then(resObj =>{
                if(resObj.deletedCount === 0){
                    return res.status(status.NOT_FOUND).send("Given file name was not found")
                }
                else{
                    let obj = {}
                    const arr = []
                    for(let i of fileData){
                        obj = {
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
                        }
                        arr.push({...obj})
                    }
                    File_Details.insertMany(arr)
                    .then(resObj => res.send("Successfully updated"))
                    .catch(err => res.status(status.INTERNAL_SERVER_ERROR).send('Error occured try again after sometime'))
        }
    })
}
})

module.exports = router 