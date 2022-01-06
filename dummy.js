
// file upload -> API_1
// app.post('/upload', (req, res) => {
//     if(!req.files)
//     {
//         res.status(400).send("Please attach a file");
//         return;
//     }
//     const nameObj = Object.keys(req.files)[0]
//     const fileName = req.files[nameObj].name 
//     let fileFormat = fileName.split('.')
//     fileFormat = fileFormat[fileFormat.length - 1]

//     // check file format
//     if(fileFormat !== 'json'){
//         res.status(400).send("Please attach a .json file")
//     }
//     if(!(isJSON(req.files[nameObj].data.toString()))){
//         res.status(400).send('Upload a JSON format file')
//     }   

//     // check file name length
//     if(fileName.length > 24){
//         res.status(400).send("Your file name is too long")
//     }

//     // check file size
//     if((req.files[nameObj].size / 1000000.0) > 2.0){
//         res.status(400).send("File size should be less than 2 MB")
//     }

//     // check wether file exists or not
//     if (!fileExists(req.files[nameObj].name)) {

//         // creating a file   
//         const content = JSON.stringify(extractLabelAndValue(JSON.parse(req.files[nameObj].data.toString())))
//         fs.writeFile(`database/${req.files[nameObj].name}`, content, function (err) {
//             if (err) throw err;
//             res.send('File uploaded')
//           });
//     }
//     else res.status(400).send("File already exists")
// })


// get file with filename -> API_2
// app.get('/getData', (req, res) => {
//     if(fileExists(req.query.fileName))
//     {
//         fs.readFile(`database/${req.query.fileName}`, "utf8", function(err, data){
//             if(err) throw err;
//             res.send(JSON.parse(data))
//         });
//     }
//     else res.status(400).send('File not found')
// })


// // file upload -> API_1
// app.post('/upload', (req, res) => {

//     if(!req.files)
//     {
//         res.status(400).send("Please attach a file");
//         return;
//     }
//     const nameObj = Object.keys(req.files)[0]
//     const fileName = req.files[nameObj].name 
//     let fileFormat = fileName.split('.')
//     fileFormat = fileFormat[fileFormat.length - 1]

//     // check file format
//     if(fileFormat !== 'json'){
//         res.status(400).send("Please attach a .json file")
//         return
//     }
//     if(!(isJSON(req.files[nameObj].data.toString()))){
//         res.status(400).send('Upload a JSON format file')
//         return
//     }   

//     // check file name length
//     if(fileName.length > 24){
//         res.status(400).send("Your file name is too long")
//         return
//     }

//     // check file size
//     if((req.files[nameObj].size / 1000000.0) > 2.0){
//         res.status(400).send("File size should be less than 2 MB")
//         return
//     }

//     // check wether file exists or not
//     File.exists({filename : req.files[nameObj].name})
//     .then(fileExists => { 
//         if(fileExists === false){
//             const fileData = File({
//                 filename : req.files[nameObj].name,
//                 filedata : extractLabelAndValue(JSON.parse(req.files[nameObj].data.toString()))
//             })
//             fileData
//             .save()
//             .then(result => res.send("File uploaded successfully"))
//             .catch(err => console.log(err))
//         }   
//         else res.status(400).send("File Name already exists")
//     })
//     .catch(err => {
//         res.send("Some error occured try again later")
//         console.log(err)
//     })
// })


// // get file with filename -> API_2
// app.get('/getData', (req, res) => {
//     File.exists({filename : req.query.fileName})
//     .then(fileExists => {
//         if(fileExists)
//         {
//             File
//     .       find({filename : req.query.fileName})
//             .then(files => res.send((files[0].filedata)))
//             .catch(err => console.log(err))
//         }
//         else res.status(400).send('File not found')
//     })
// })