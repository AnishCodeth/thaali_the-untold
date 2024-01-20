const { photo_firebase_url } = require("../functions/firebasecrud");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const {noTryCatch}=require('../functions/notrycatch');
const { form_to_json } = require("../functions/form_json");
const { add_query } = require("./add");


const menu_add = noTryCatch(async (req, res) => {
  //req.body must be array of the json
  // let url = {};
  // const n = req.body.food_name.length;
  //for the images
  // const n = req.files.length;
  // const promises_url = [];
  // for (let i = 0; i < n; i++) {
  //   promises_url.push(
  //     photo_firebase_url(
  //       category[i],
  //       food_name[i],
  //       req.files[i].filename,
  //       url,
  //       i
  //     )
  //   );
  // }
  // await Promise.all(promises_url);
  // let values = "";
  // for (let i = 0; i < n; i++) {
  //   values += `('${category[i]}','${food_name[i]}',${price[i]},'${description[i]}','${discount_percentage[i]}','${available[i]}','${restaurant_id[i]}'),`;
  // }

 const client=await connectDB()
  await client.query(`drop table  if exists menu`);
  await client.query(
    `create table  if not exists menu(id serial,
        food_name varchar(100) not null,
        category varchar(100) not null,
        discount_percentage numeric(5,2) not null ,
        price numeric not null,
        available char(1) check (available in ('Y','N')),
        restaurant_id int not null,
        photo text)
        `
  );

  const { query, values } = await add_query(req.body, "menu");
  await client.query(query, values);
  res.json("menu added successfully");
});

const menu_display = async (req, res) => {
  console.log('in menu')
  //vendor must be send in url
  const {query}=req
  let query_sql = `select * from (select * from menu where restaurant_id=1) where 1=1`;//restaurant_id=sth
  try {
    const client = await connectDB();
    if ("category" in query) {
      query_sql += ` AND category ~ '^${query.category}'`; 
    }

    if ("food_name" in query) {
      query_sql += ` AND food_name ~ '^${query.food_name}'`;
    }

    if ("price_eq" in query) {
      query_sql += ` AND price=${parseInt(query.price_eq)}`; 
    }

    if ("price_lt" in query) {
      query_sql += ` AND price<${parseInt(query.price_lt)}`; 
    }

    if ("price_gt" in query) {
      query_sql += ` AND price>${parseInt(query.price_gt)}`; 
    }

    if ("discount_percentage_eq" in query) {
      query_sql += ` AND discount_percentage=${parseInt(query.discount_percentage_eq)}`; 
    }

    if ("discount_percentage_lt" in query) {
      query_sql += ` AND discount_percentage<${parseInt(query.discount_percentage_lt)}`; 
    }

    if ("discount_percentage_gt" in query) {
      query_sql += ` AND discount_percentage>${parseInt(query.discount_percentage_gt)}`; 
    }

    if ("available" in query) {
      query_sql += ` AND available=${Boolean(query.available)}`; 
    }

    if ("sort" in query) {
      query_sql += ` ORDER BY ${query.sort}`;//front must use , as price desc,.. 
    }else {
      // query_sql += " ORDER BY order_last_7_days"; 
    }
    const pgres = await client.query(query_sql);
   console.log(pgres.rows[0].price+1)
    res.json(pgres.rows);
  } catch (err) {
    res.json(err.message);
  }
};

const menu_update=noTryCatch(async(req,res)=>{
  //with json
//user wll send   update: {"food_name":"burger","category":"chicken"},id: {"restaurant_id":"vendor001","Tiramisu"} in form_data
//do photo for the later

const to_update=await form_to_json(req.body)

let query=''
let where_query=`where restaurant_id=$1 and food_name=$2`
let values=[to_update.id.restaurant_id, to_update.id.food_name];
let index=3;
//need to make middleware for the form data
Object.keys(to_update.update).filter((filtered)=>{
  query+=`${filtered}=$${index},`
  values.push(to_update.update[filtered])
  index++;
})
console.log(query)
query=query.slice(0,-1)
const client=await connectDB()
const row=await client.query(`
select food_name from menu ${where_query} `,values.slice(0,2))

if(row.rows.length==0)
return res.json('no such data found to update');

query=`update menu
set ${query}
${where_query};`

const pgres=await client.query(query,values)
res.json(pgres.rows)
})

const menu_delete=(async(req,res)=>{
  //with json
//user wll send   update: {"food_name":"burger","category":"chicken"},id: {"restaurant_id":"vendor001","Tiramisu"} in form_data
//do photo for the later

// const to_update=await form_to_json(req.body)

let query=''
let where_query=`where restaurant_id=$1 and food_name=$2`
let values=[req.body.restaurant_id, req.body.food_name];
// let index=3;
//need to make middleware for the form data
// Object.keys(to_update.update).filter((filtered)=>{
//   query+=`${filtered}=$${index},`
//   values.push(to_update.update[filtered])
//   index++;
// })
// console.log(query)
// query=query.slice(0,-1)
const client=await connectDB()
const row=await client.query(`
select food_name from menu ${where_query} `,values)

if(row.rows.length==0)
return res.json('no such data found to delete');

query=`delete from  menu
${where_query};`

const pgres=await client.query(query,values)
res.json({'msg':'deleted successfully'})
})

module.exports = { menu_add, menu_display,menu_update,menu_delete };
