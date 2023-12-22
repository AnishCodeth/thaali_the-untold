
const {User}=require('../functions/connectfirebase')


const test_create=async(req,res)=>{
await User.add(req.body)
res.send({'msg':'data send carefully!'})
}

module.exports={test_create}