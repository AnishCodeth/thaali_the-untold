const { connectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");

const menu_db=noTryCatch(async(req,res,next)=>{
const r_username=req.book.r_username;
const client=await connectDB()
const pgres=await client.query(`select distinct on (category) * from menu where r_username=$1`,[r_username])
res.status(200).json(pgres.rows)
})


const dailytrans=(async(req,res,next)=>{
    const r_username=req.user.r_username;
    const client=await connectDB();
    const nowdate=new Date()
    let pgres=(await client.query(`select id,food_quantity,calculated_amount from payment where payment_time=$1 and r_username=$2`,[nowdate,r_username])).rows
    let food_category_quantity={}
    let total=0

    pgres.map((row)=>{
        total=total+row.calculated_amount;
        row.food_quantity.split(',').map((food_quan)=>{
            let [category,food,quantity]=food_quan.split('_')
            let food_cat=category+'_'+food;
            if(food_cat in food_category_quantity)
            food_category_quantity[food_cat]=food_category_quantity[food_cat]+quantity
        else
            food_category_quantity[food_cat]=quantity
        })
    })
    res.status(200).json({food_category_quantity,total})
})

module.exports={menu_db,dailytrans}