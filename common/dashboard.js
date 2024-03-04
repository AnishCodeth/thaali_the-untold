const { connectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");

const menu_db=noTryCatch(async(req,res,next)=>{
const r_username=req.book.r_username;
const client=await connectDB()
const pgres=await client.query(`select distinct on (category) * from menu where r_username=$1`,[r_username])
res.status(200).json(pgres.rows)
})


const dailytrans=(async(req,res,next)=>{
    const r_username=req.user.username;
    const client=await connectDB();
    const nowdate=new Date(req.body.nowdate);
    let pgres=(await client.query(`select * from payment where  r_username=$1 and DATE(payment_time)=DATE($2) `,[r_username,nowdate])).rows

    console.log(pgres,nowdate.toISOString())
    let food_category_quantity={}
    let total=0

    pgres.map((row)=>{
        total=total+Number(row.amount);
        let lengths=(row.food_quantity.split(',')).length-1
        row.food_quantity.split(',').map((food_quan,index)=>{
            if(index==lengths)
            return 
            let [food_cat,quantity]=food_quan.split('_')
            if(food_cat in food_category_quantity)
            food_category_quantity[food_cat]=food_category_quantity[food_cat]+Number(quantity)
        else
            food_category_quantity[food_cat]=Number(quantity)
        })
    })
    res.status(200).json({food_category_quantity,total})
})

module.exports={menu_db,dailytrans}