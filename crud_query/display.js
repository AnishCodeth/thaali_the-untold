const display_query=async(where_conditions,order_conditions,queries)=>{

    let values = [];
    let index=0;

    let page = queries.page || 1;
    const limit = queries.limit || 10;
    const offset = Math.max(0,(page - 1) * limit);
  
    let where_query = Object.keys(queries)
      .filter((f) => 
        where_conditions.includes(f)
      )
      .map((m) => {
          index++;
          values.push(queries[m])
          return `${m}=$${index}`
      })
      .join(" AND ");
      where_query=where_query==''?'':' where '+where_query;
    
    let order_query =queries.sort?queries.sort.split(",").filter((f) => 
      order_conditions.includes(f.split(' ')[0])
    )
    .map((m) => {
        return m
    })
    .join(","):''
    order_query=order_query==''?'':'order by '+order_query;
    values.push(offset);
    values.push(limit);
    const query = `select * from FOOD_TABLE  ${where_query}  ${order_query} offset $${++index} limit $${++index}`;
    return {query,values}
    }
    
    module.exports={display_query}