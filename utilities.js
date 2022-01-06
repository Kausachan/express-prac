const res = require('express/lib/response');
const fs = require('fs');


// check wether data is json or not
function isJSON(data){
  let new_data = null
  try{
    new_data = JSON.parse(data)
  }
  catch(err){
    return false
  }
    if(typeof new_data === 'object' && !(Array.isArray(new_data))  && new_data !== null) return true
    else return false
}


// check wether file exists or not
function fileExists(filename){
    return fs.existsSync(`database/${filename}`) 
}


// formatting data 
function extractLabelAndValue(data, result = []) {
    if (typeof data === 'object') {
      for (item in data) {
        if ('LabelDetection' in data && 'ValueDetection' in data) {
          const key = data['LabelDetection']['Text']
          const value = data['ValueDetection']['Text']
          if(key === 'Description'){
              const obj = {}
              obj[key] = value
              result.push(obj)
          }
          else{
              const l = result.length
              result[l - 1][key] = value
          }
          return 
        }
        else extractLabelAndValue(data[item], result)
      }
    }
    else if (Array.isArray(data)) {
        for (const arrayItem of data) {
          extractLabelAndValue(arrayItem, result)
        }
      }
    return result
}

function checkValidFields(req){
  const preDefinedKeys = ['description', 'qty', 'uom', 'unit_price_curr', 'discount', 'discount_curr', 'gross_amt_curr']
    const userkeys = Object.keys(req.query)
    for(let i of userkeys){
        if(!(preDefinedKeys.includes(i))){
            return {
              result : false,
              response : `You've entered a wrong key. Please enter keys in this list \n\n ${preDefinedKeys.join('\n')}`
            }
        }
    }
    return {
      result : true,
      response : null 
    }
}

module.exports = {
    extractLabelAndValue,
    fileExists,
    isJSON,
    checkValidFields
}