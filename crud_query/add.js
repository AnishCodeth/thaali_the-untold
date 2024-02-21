

const add_query=async(payload,table_name)=>{
let values=Object.values(payload);
const columns=Object.keys(payload).join(',');
const values_params=values.map((_,index)=>`$${index+1}`).join(',');

const query=`insert into ${table_name}(${columns}) values (${values_params});`
return {query,values}
}

module.exports={add_query}