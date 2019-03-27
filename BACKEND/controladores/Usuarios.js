const conexionMysql = require('../modulos/moduloUsuario');
const ctrl = {};

ctrl.buscarUsuarios = (req,res) => {
    conexionMysql.getUsuarios((err,datos) => {
        if(!err){
            res.json(datos);
        }else{
            res.json(err);
        }
    });
};
 ctrl.buscarUsuario = (req,res)=>{
     conexionMysql.buscarUsuario(req.params.usuario,(err,datos)=>{
        if(!err){
            res.json({
                success: true,
                msg: 'Empleado encontrado',
                datos: datos
            });
         } else {
             res.json({
                 success: false,
                 msg: 'Error: con la conexion',
                 error: err
             });
         }
     });
 };
 ctrl.buscarUsuarioCedula = (req,res)=>{
    conexionMysql.buscarUsuarioCedula(req.params.cedula,(err,datos)=>{
       if(!err){
           res.json(datos);
        } else {
            res.json({
                success: false,
                msg: 'Error: con la conexion',
                error: err
            });
        }
    });
};
ctrl.guardarUsuario = (req, res) => {
    let datosUser = {
        Usuario: req.body.Usuario,
        Empleado_cedula: req.body.Empleado_cedula,
        contraseña: req.body.contraseña,
        estado: req.body.estado
    };
    conexionMysql.insertarUsuario(datosUser, (err, datos) => {
        if (datos) {
            res.json({
                success: true,
                msg: 'Usuario Guardado',
                datos: datos
            });
        } else {
            res.status(500).json({
                success: false,
                msg: 'ERROR: con la conexion',
                error: err
            });
        }
    });
};
 ctrl.editarUsuario = (req,res)=>{
    let datosUser = {
        Usuario: req.params.usuario,
        Empleado_cedula: req.body.Empleado_cedula,
        contraseña: req.body.contraseña,
        estado: req.body.estado
    };
    conexionMysql.editarUsuario(datosUser,(err,datos)=>{
         if(!err){
             res.json({
                 success: true,
                 msg: 'Usuario Editado',
                 dato: datos
            });
         }else{
            res.json({
                success: false,
                msg: 'ERROR: con la conecexion',
                error: err
            });
         }
     });
 };
ctrl.eliminarUsuario = (req,res)=>{
    conexionMysql.borrarUsuario(req.params.usuario, (err,datos)=>{
        if(!err){
            console.log(datos);
            if(datos && datos.msg === 'Empleado eliminado' || datos.msg === 'No existe el empleado'){
                res.json({
                    success: true,
                    msg: datos.msg
                });
            }else{
                res.status(500).json({
                    success: false,
                    msg: 'Error',
                    error: err
                });
            }
        }else{
            res.json({
                success: false,
                msg: 'ERROR: con la conexion',
                error: err
            });
        }
    });
};

module.exports = ctrl;