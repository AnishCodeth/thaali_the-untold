const { firebase } = require("googleapis/build/src/apis/firebase");
const { photo_firebase_url } = require("../functions/firebasecrud");
const { noTryCatch } = require("../functions/notrycatch");
const fs=require('fs')
const path=require('path')


const image_url=noTryCatch(async(req,res)=>{
  const n = req.files.length;
  console.log(req.files)
  const promises_url = [];
  for (let i = 0; i < n; i++) {
    let file=req.files[i]
    let url=`${file.fieldname}/`+file.filename
    let filepath='../uploads/'+file.filename
    promises_url.push(
      photo_firebase_url(
        url,
        filepath
        )
        );
        fs.unlinkSync(path.join(__dirname,filepath))
      }
      const firebasepath= await Promise.all(promises_url);
      
      res.json(firebasepath)
      // return res.json(req.files)
})

module.exports={image_url}