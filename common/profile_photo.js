const { connectDB } = require("../configurations/connectpg");

const customError = require("../functions/customerror");
const { noTryCatch } = require("../functions/notrycatch");


const add_profile_photo=noTryCatch(async(req,res,next)=>{
    const {role,username}=req.user
    const {photo}=req.body
    if(!photo)
    return next(new customError('upload photo',400))

    const client=await connectDB();
 
    await client.query(`UPDATE ${role}_profile
    SET photo= ARRAY_APPEND(photo, $1)
    WHERE username=$2`,[photo,username])

    res.json({"msg":'Photo added successfully'});
    })
    
const update_profile_photo=noTryCatch(async(req,res,next)=>{
    if(!req.body.set||!req.body.find)
    return next(new customError('provide what to update and find'))

    const oldphoto=req.body.find.photo;
    const newphoto=req.body.set.photo;
    const {role,username}=req.user

        const client=await connectDB()
        await client.query(`update ${role}_profile set photo= ARRAY(
            SELECT CASE WHEN element = $1 THEN $2 ELSE element END
            FROM unnest(photo) AS element
        )
         where username=$3`,[oldphoto,newphoto,username])
        res.json({"msg":"update successfull"})
    })

module.exports={add_profile_photo,update_profile_photo}