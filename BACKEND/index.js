const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const paht = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
//const fs = require('fs-extra');


//creando un servidor
const app = express();
const servidor = http.createServer(app);
//conexion en tiempo real con el servidor
const io = socketio.listen(servidor);

//configuraciones
app.set('port', process.env.PORT || 3000);

//peticiones servidor
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    /*res.header ("Access-Control-Allow-Origin", "*");
    res.header ("Access-Control-Allow-Headers", "Origin, X-Requested With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); */
    next();
});

app.use(morgan('dev'));
//MANEJO DE ARCHIVOS CON MORGAN
app.use(multer({
    dest: paht.join(__dirname,'/img/temp')
}).single('fotoEmpleado'));
//entender peticiones ataves de JSON
app.use(bodyParser.json());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//rutas de usuario
require('./rutas/user_rutas.js')(app);


//Requirir la funcionalidad de los socket
require('./sockets')(io);

let direccion = paht.join(__dirname,'FRONEND');

//enviar los archivos estaticos
app.use(express.static('BACKEND'));
app.use(express.static('FRONEND'));

servidor.listen(app.get('port'), () =>{
    console.log('servidor puerto '+app.get('port'));
});