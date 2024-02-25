const { firebase } = require("googleapis/build/src/apis/firebase");
const { photo_firebase_url } = require("../functions/firebasecrud");
const { noTryCatch } = require("../functions/notrycatch");
const customError=require('../functions/customerror')
const fs=require('fs')
const path=require('path')


const image_url=noTryCatch(async(req,res,next)=>{
  const {role,username}=req.user
  console.log(req.files)
  if(!req.files)
  return next(new customError("provide file",400))
  const n = req.files.length;
  const promises_url = [];
//   const {profile_menu}=req.body;
const profile_menu="profile"
  if(!['menu','profile'].includes(profile_menu))
  return next(new customError('menu or profile at which photo u want to add',400))

  let url=''
  console.log(role)
  if(role=='customer'||role=='admin'){
    url=role
  }
  else if(role=='vendor'){
     url=profile_menu.includes('profile')?role+'/'+username+'/profile':role+'/'+username+'/menu';
  }
  
  for (let i = 0; i < n; i++) {
    let file=req.files[i]
    let urls=url+`/`+file.filename//path withinn storage
    let filepath='../uploads/'+file.filename//within the computer
    console.log(urls)
    promises_url.push(
      photo_firebase_url(
        urls,
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