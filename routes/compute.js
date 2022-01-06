const express = require('express')
const router = express.Router()
const {File_Details} = require('../mongoDB');
const status = require('http-status')
const { checkValidFields } = require('../utilities');

router.get('*', (req, res) => {
    const {description, qty, uom, unit_price, discount, discount_amt, gross_amt_curr} = req.query
    const validFields = checkValidFields(req)
    if(validFields.result === false){
        return res.send(validFields.response)
    }
    let obj = {}
    let new_obj = {}
    let no_desc_obj = {}
    File_Details.find({File_Name : 'invoice.json'})
    .then(docList =>{
        let flag = 1
        const file_data = []
        let dummy = {}
        for(let i of docList){
            dummy = {...i.toObject()}
            file_data.push(dummy)
        }
        if(!!description !== false){
            for(let i of file_data){
                if(i["Description"] === description){ 
                    obj = {...i}
                    break
                }
            }
    
            if(qty === 'true'){
                flag = 0
                new_obj['Qty'] = obj['Qty']
            }
    
            if(uom === 'true'){
                flag = 0
                new_obj['UOM'] = obj['UOM']
            }
    
            if(unit_price === 'true'){
                flag = 0
                new_obj['Unit Price\n(Curr)'] = obj['Unit Price\n(Curr)']
            }
    
            if(discount === 'true'){
                flag = 0
                new_obj['Discount\n%'] = obj['Discount\n%']
            }
    
            if(discount_amt === 'true'){
                flag = 0
                new_obj['Discount\nAmt (Curr)'] = obj['Discount\nAmt (Curr)']
            }

            if(gross_amt_curr === 'true'){
                flag = 0
                new_obj['Gross Amt\n(Curr)'] = obj['Gross Amt\n(Curr)']
            }
            if(flag === 0) res.send(new_obj)
            else{
                delete obj['_id']
                delete obj['__v']
                delete obj['File_Name']
                res.send(obj)
            } 
        }
        else{
            for(let i of file_data){

                // qty
                if(qty === 'true'){
                    if('Qty' in no_desc_obj){
                        no_desc_obj['Qty'].push(i['Qty'])
                    }
                    else{
                        no_desc_obj['Qty'] = [i['Qty']]
                    }
                }

                //uom
                if(uom === 'true'){
                    if('UOM' in no_desc_obj){
                        no_desc_obj['UOM'].push(i['UOM'])
                    }
                    else{
                        no_desc_obj['UOM'] = [i['UOM']]
                    }
                }

                // gross_amt_curr
                if(gross_amt_curr === 'true'){
                    let string = i['Gross Amt\n(Curr)']
                    string = string.replace(',', '')
                    const number = Number.parseFloat(string)
                   
                    if('Gross Amt\n(Curr)' in no_desc_obj){
                        if(isNaN(number)) no_desc_obj['Gross Amt\n(Curr)'] += 0
                        else no_desc_obj['Gross Amt\n(Curr)'] += number
                    }
                    else{
                        if(isNaN(number)) no_desc_obj['Gross Amt\n(Curr)'] = 0
                        else no_desc_obj['Gross Amt\n(Curr)'] = number
                    }
                }

                // unit_price
                if(unit_price === 'true'){
                    if('Unit Price\n(Curr)' in no_desc_obj){
                        no_desc_obj['Unit Price\n(Curr)'].push(i['Unit Price\n(Curr)'])
                    }
                    else{
                        no_desc_obj['Unit Price\n(Curr)'] = [i['Unit Price\n(Curr)']]
                    }
                }

            }
            res.send(no_desc_obj)
        }
        })
    .catch(err => res.status(status.INTERNAL_SERVER_ERROR).send("Error occured try after sometime"))
})


module.exports = router 