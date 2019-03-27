const mysql = require('mysql');
const conection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'www-bsc' 
});
 
conection.connect((err) => {
    if(err) {
        console.log('Error conectar bd: '+ err);
        return;
    }else{
        console.log('conectado a bd');
    }
});
module.exports = conection;