const order_table=async()=>{
    return `
     CREATE TABLE if not exists order_data (
          food_name TEXT NOT NULL,
             order_time TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
             served_status CHAR(1) NOT NULL DEFAULT 'N',
              table_id TEXT NOT NULL,
             quantity INT DEFAULT 1,
             CHECK (served_status = 'S' OR served_status = 'N'),
             CHECK (EXTRACT(EPOCH FROM order_time::TIME) != 0),
             CHECK (quantity > 0)
         );`
} 

module.exports={order_table}