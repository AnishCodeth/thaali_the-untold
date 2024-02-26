const display_query=async(table_name,where_conditions,order_conditions,queries)=>{

    let values = [];
    let index=0;

    let page = queries.page || 1;
    const limit = queries.limit || 10;
    const offset = Math.max(0,(page - 1) * limit);
  
    let where_query = Object.keys(queries)
      .filter((f) => 
        where_conditions.includes(f.split('^')[0])
      )
      .map((m) => {
        let sym='=';
        const val=m.split('^')
        let new_m=m
        if(val.length==2){
        new_m=val[0]
        if(val[1]=='g')
        sym='>='
        else if(val[1]=='l')
        sym='<='
        }

          index++;
          values.push(queries[m])
          return `${new_m}${sym}$${index}`
      })
      .join(" AND ");
      where_query=where_query==''?'':' where '+where_query;
    
      console.log(queries.sort)
    let order_query =queries.sort?queries.sort.split(",").filter((f) =>{ 
      const val=f.split(' ')
     
      if(order_conditions.includes(val[0])){
      if(val.length==2 && val[1]==='desc')
      return f
    else if(val.length==1)
    return val[0]
    }
    else
    return false
  }
    )
    .map((m) => {
        return m
    })
    .join(","):''
    order_query=order_query==''?'':'order by '+order_query;
    values.push(offset);
    values.push(limit);
    const query = `select * from ${table_name}  ${where_query}  ${order_query} offset $${++index} limit $${++index}`;
    return {query,values}
    }
    
    module.exports={display_query}