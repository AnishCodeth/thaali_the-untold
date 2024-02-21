const delete_query=async(table_name,where_conditions,where_constraints)=>{

    let values = [];
    let index=0;

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

      where_query=where_query==''?'':'where '+where_query
    
    const query = `DELETE FROM ${table_name} ${where_query}  `;
    return {query,values}
    }
    
    module.exports={delete_query}