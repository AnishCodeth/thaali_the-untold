const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { noTryCatch } = require("../functions/notrycatch");
const customError = require("../functions/customerror");
const { add_query } = require("../crud_query/add");
const { display_query } = require("../crud_query/display");
const { update_query } = require("../crud_query/update");
const { delete_query } = require("../crud_query/delete");



const display_review = noTryCatch(async (req, res,next) => {
  const where_conditions = ["r_username","id","rating"];
  const order_conditions = ['rating'];
  const {query,values}=await display_query('review',where_conditions,order_conditions,req.query)
  const client = await connectDB();
  const pgres = await client.query(
query,values
  );
  res.json(pgres.rows);
});


module.exports = {display_review};
