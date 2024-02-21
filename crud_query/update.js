const update_query=async(table_name,set_conditions,where_conditions,set_value,where_constraints)=>{

    let values = [];
    let index=0;

    let set_query = Object.keys(set_value)
    .filter((f) => 
      set_conditions.includes(f)
    )
    .map((m) => {
        index++;
        values.push(set_value[m])
        return `${m}=$${index}`
    })
    .join(",");
    set_query=set_query==''?'':' set '+set_query;

  
    let where_query = Object.keys(where_constraints)
      .filter((f) => 
        where_conditions.includes(f)
      )
      .map((m) => {
          index++;
          values.push(where_constraints[m])
          return `${m}=$${index}`
      })
      .join(" AND ");

     if(where_query==''){
     where_query=''
     }
    else
    where_query=' where '+where_query;
    
    const query = `UPDATE  ${table_name} ${set_query} ${where_query}  `;
    return {query,values}
    }
    
    module.exports={update_query}