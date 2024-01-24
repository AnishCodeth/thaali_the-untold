const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");

const customError = require("../functions/customerror");
const { add_query } = require("../crud_query/add");
const {display_query}=require("../crud_query/display")
const { decodeJWT } = require("../functions/createJWT");
const { encrypt } = require("../functions/decryptencryptpassword");

const add_table = noTryCatch(async (req, res) => {
  const client = await connectDB();
  const { t_name, capacity, type } = req.body;
  const r_username = req.body.username;
  await client.query(
    ` create table if not exists FOOD_TABLE (
        id serial primary key,
        t_name varchar(100) not null ,
        type varchar(100) default 'steel chair',
        qr_code text not null unique,
        capacity int not null,
        r_username varchar(100) references USER_CREDENTIAL on delete cascade,
        unique(r_username,t_name))`
  );

  const qr_code = await encrypt(r_username + t_name);
  const { query, values } = await add_query(
    { r_username, t_name, capacity, qr_code, type },
    "FOOD_TABLE"
  );

  await client.query(query, values);
  res.json("Table added successfully");
});

const display_table = noTryCatch(async (req, res) => {
  const where_conditions = ["type","capacity","t_name","id","qr_code","r_username",];
  const order_conditions = ["capacity", "id",'type','t_name','r_username'];
  req.query.r_username=req.body.username
  const {query,values}=display_query(where_conditions,order_conditions,req.query)
//   let values = [];
//   let index=0;

//   req.query.r_username = req.body.username;
//   let page = req.query.page || 1;
//   const limit = req.query.limit || 10;
//   const offset = Math.max(0,(page - 1) * limit);

//   let where_query = Object.keys(req.query)
//     .filter((f) => 
//       where_conditions.includes(f)
//     )
//     .map((m) => {
//         index++;
//         values.push(req.query[m])
//         return `${m}=$${index}`
//     })
//     .join(" AND ");
//     where_query=where_query==''?'':' where '+where_query;
  
//   let order_query =req.query.sort?req.query.sort.split(",").filter((f) => 
//     order_conditions.includes(f.split(' ')[0])
//   )
//   .map((m) => {
//       return m
//   })
//   .join(","):''
//   order_query=order_query==''?'':'order by '+order_query;
//   values.push(offset);
//   values.push(limit);
//   const query = `select * from FOOD_TABLE  ${where_query}  ${order_query} offset $${++index} limit $${++index}`;
//   console.log(query,values);
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  res.json(pgres.rows);
});

const update_table = noTryCatch(async (req, res) => {});

const delete_table = noTryCatch(async (req, res) => {});

module.exports = { add_table, display_table, update_table, delete_table };
