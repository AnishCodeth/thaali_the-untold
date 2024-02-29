
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");
const customError = require("../functions/customerror");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");

const track_order=async(r_username,food_name)=>{
  const client = await connectDB();
  await client.query(
    `create table  if not exists food_order_count(id serial primary key,
        food_name varchar(100) not null,
        r_username varchar(100) not null ,
        order_count int not null default 0,
      foreign key (food_name,r_username,t_id) references menu(food_name,r_username,t_id))`
  );
  await client.query('update table food_order_count set order_count=order_count+1 where r_username=$1 and food_name=$2',[r_username,food_name])
}

const add_order = noTryCatch(async (req, res) => {
  const client = await connectDB();
  let {m_id,quantity,served,description}=req.body
  if(!quantity)
  quantity=1

  const {id:b_id,r_username}=req.book;
  await client.query(`
  CREATE TABLE IF NOT EXISTS food_order (
      id SERIAL PRIMARY KEY,
      b_id INT NOT NULL REFERENCES book_status(id) ON DELETE CASCADE,
      m_id INT NOT NULL REFERENCES menu(id) ,
      quantity INT not null DEFAULT 1 CHECK (quantity >= 0),
      served CHAR(1) DEFAULT 'N' CHECK (served IN ('Y', 'N')),
      o_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      r_username text not null references vendor_profile(username),
      description TEXT
  )
`);

const promises=[]
for (let i=0;i<req.body.length;i++){
  let {m_id,quantity,served,description}=req.body[i]
  let { query, values } = await add_query({m_id,quantity,served,description,b_id,r_username}, "food_order");
  promises.push(client.query(query, values));
  promises.push(client.query(`update menu set count=count+$2 where id=$1`,[m_id,quantity]))
}
await Promise.all(promises)
  return res.json("order added successfully");
});

const display_order = noTryCatch(async (req, res) => {
  const where_conditions = ["b_id"];
  const order_conditions = ['o_time'];
  req.query.b_id=req.book.id
  const {query,values}=await display_query('food_order',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  return res.json(pgres.rows);

});





module.exports = { add_order,display_order};
