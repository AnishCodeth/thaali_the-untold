const { firebase } = require("googleapis/build/src/apis/firebase");
const { photo_firebase_url } = require("../functions/firebasecrud");
const { noTryCatch } = require("../functions/notrycatch");
const customError=require('../functions/customerror')
const fs=require('fs')
const path=require('path')


const image_url=noTryCatch(async(req,res,next)=>{
  
  const {role,username}=req.user
  console.log(role)
  if(!req.files)
  return next(new customError("provide file",400))
  const n = req.files.length;
  const promises_url = [];
  const {profile_menu}=req.body;

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
    let file=req.files[i]//path withinn storage
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = file.originalname.split('.').pop();
      file.filename=uniqueSuffix + '.' + fileExtension
    let filepath=path.join(__dirname,'../uploads/'+file.filename)//within the computer
    let urls=url+`/`+file.filename
    promises_url.push(
      photo_firebase_url(
        urls,
        filepath,i,file
        )
        );
        // fs.unlinkSync(filepath)
      }
      const firebasepath= await Promise.all(promises_url);
      
      res.json(firebasepath)
      // return res.json(req.files)
})


const image_url_vendor_profile=noTryCatch(async(req,res,next)=>{
  
 const role='vendor';
 const profile_menu='profile';
 const username=req.body.username;
  if(!req.files)
  return next(new customError("provide file",400))
  const n = req.files.length;
  const promises_url = [];

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
    
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = file.originalname.split('.').pop();
      file.filename=uniqueSuffix + '.' + fileExtension
    let filepath=path.join(__dirname,'../uploads/'+file.filename)//within the computer
    let urls=url+`/`+file.filename//path withinn storage
    promises_url.push(
      photo_firebase_url(
        urls,
        filepath,i,file
        )
        );
        // fs.unlinkSync(filepath)
      }
      const firebasepath= await Promise.all(promises_url);
      
      res.json(firebasepath)
      // return res.json(req.files)
})

module.exports={image_url,image_url_vendor_profile}