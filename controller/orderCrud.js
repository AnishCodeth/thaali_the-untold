const { photo_firebase_url } = require("../functions/firebasecrud");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");
const { form_to_json } = require("../functions/form_json");
const customError = require("../functions/customerror");
const { add_query } = require("./add");

const add_order = noTryCatch(async (req, res) => {
  const client = await connectDB();
  //there will be some function regarding saving from adding order by another people
  const b_id = "book01";
  // const b_id=req.cookies.b_id
  await client.query(`drop table  if exists food_order`);
  await client.query(
    `create table  if not exists food_order(id serial primary key,
        b_id int not null references book(id) on delete cascade ,
        food_name varchar(100) not null,
        quantity int not null default 1 check (quantity>0) ,
        served char(1) default 'N' check (served in ('Y','N')),
        o_time timestamptz  not null default current_timestamp ,
        description text)`
  );

  req.body.b_id = b_id;
  const { query, values } = await add_query(req.body, "food_order");
  await client.query(query, values);
  res.json("order added successfully");
});

const display_order = noTryCatch(async (req, res) => {
  const client = await connectDB();
  const pgres = await client.query(`
    select *
     from food_order
    order by served,o_time 
    `);
    console.log(pgres)
  res.json(pgres.rows);
});

const update_order = noTryCatch(async (req, res) => {
  const to_update = req.body.update;
  const order_id = req.body.id;
  let values = [];
  let set_query = "";
  let index = 1;
  Object.keys(to_update).forEach((key) => {
    set_query += `${key}=$${index},`;
    values.push(to_update[key]);
    index++;
  });
  set_query = set_query.slice(0, -1);
  values.push(order_id);
  const client = await connectDB();

  const pgres = await client.query(
    `select food_name from order_data where order_id=$1`,
    values.slice(-1)
  );
  if (pgres.rows.length == 0) return res.send("not found");
  await client.query(
    `update order_data 
    set ${set_query}
    where order_id=$${index}`,
    values
  );
  res.send("successfully updated");
});

const delete_order = async (req, res) => {
  let query = "";
  let where_query = `where order_id=$1`;
  let values = [req.body.order_id];
  const client = await connectDB();
  const row = await client.query(
    `
  select food_name from order_data ${where_query} `,
    values
  );

  if (row.rows.length == 0)
    return res.json({ msg: "no such data found to delete" });

  query = `delete from  order_data
  ${where_query};`;

  const pgres = await client.query(query, values);
  res.json({ msg: "deleted successfully" });
};

module.exports = { add_order, display_order, update_order, delete_order };
