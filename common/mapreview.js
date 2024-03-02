const { noTryCatch } = require("../functions/notrycatch");
const { connectDB, disconnectDB } = require("../configurations/connectpg");
const { display_query } = require("../crud_query/display");

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

const allvendordata=noTryCatch(async(req,res,next)=>{
    const where_conditions = ['username','id'];
    const order_conditions=['username','id','longitude','latitude']
    const role='vendor';
    const {query,values}=await display_query(role+'_profile',where_conditions,order_conditions,req.query)
    const client = await connectDB();
    const pgres = await client.query(
  query,values
    );
    res.json(pgres.rows);
})


const nearby=noTryCatch(async(req,res,next)=>{
const client=await connectDB()
let {longitude,latitude,radius}=req.body;
radius=180/6371*radius;
console.log(longitude-radius,latitude)
let pgres=(await client.query(`select * from vendor_profile where longitude<$1 and latitude<$2 and longitude>$3 and latitude>$4`,[longitude+radius,latitude+radius,longitude-radius,latitude-radius])).rows
pgres=pgres.sort((row1,row2)=>getDistanceFromLatLonInKm(row1.latitude,row1.longitude,latitude,longitude)-getDistanceFromLatLonInKm(row2.latitude,row2.longitude,latitude,longitude))
res.status(200).json(pgres)
})

module.exports={allvendordata,nearby}