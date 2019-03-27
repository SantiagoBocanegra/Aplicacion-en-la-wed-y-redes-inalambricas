const path = require('path');
const fs = require('fs-extra');
const conexionMysql = require('../modulos/moduloEmpleado');
const ctrl = {};
//OBTENER LA FECHA ACTUAL 
function fecha() {
    let fecha = new Date();
    let fechaActual = `Dia${fecha.getDate()}Mes${fecha.getMonth() + 1}Año${fecha.getFullYear()} Hor${fecha.getHours()}Min${fecha.getMinutes()}Seg${fecha.getSeconds()}Mil${fecha.getMilliseconds()}`;
    return fechaActual;
};
//BUSCAR TODOS LOS EMPLEADOS
ctrl.buscarEmpleados = (req,res) => {
    conexionMysql.getEmpleados((err,datos) => {
        res.json(datos);
    });
};
//BUSCAR EMPLEADO POR EL ID 
ctrl.buscarEmpleadoId = (req,res)=>{
    conexionMysql.buscarCedulaEmpleado(req.params.cedula,(err,datos)=>{
        res.json(datos);
    });
};
//GUARDAR INFORMACION DE UN EMPLEADO
ctrl.guardarEmpleado = (req, res) => {
    /*
    if (req.file) {
        //DIRECCION DE DONDE SE ENCUENTRA LA IMAGEN
        const dirImag = req.file.path;
        //EXTENCION DE  EL ARCHIVO
        const ext = path.extname(req.file.originalname).toLocaleLowerCase();
        //DIRECCION DONDE VAMOS A GUARDAR LA IMAGEN
        let nombreImagen = fecha()+` Ced${datosUser.cedula}`+ext;
        const dirDestinoImg = path.resolve(`./BACKEND/img/${nombreImagen}`);
        if (ext === '.png' || ext === '.jpg') {
            await fs.rename(dirImag, dirDestinoImg);
            datosUser.foto = nombreImagen;
        } else {
            await fs.unlink(dirImag);
            res.json({
                success: false,
                msg: 'Formato del archivo incorrecto'
            });
        }
    }
    */
    let datosUser = {
        cedula: req.body.cedula,
        rol_empleado: req.body.rol_empleado,
        primer_nombre: req.body.primer_nombre,
        segundo_nombre: req.body.segundo_nombre,
        apellido_paterno: req.body.apellido_paterno,
        apellido_materno: req.body.apellido_materno,
        telefono: req.body.telefono,
        cargo_empleado: req.body.cargo_empleado,
        foto: '//'
    };
   obtenerInfo(req,datosUser,(err,datosUser)=>{
       if(!err){
        conexionMysql.insertarEmpleado(datosUser, (err, datos) => {
            if (!err) {
                res.json({
                    success: true,
                    msg: 'Empleado Guardado',
                    datos: datos
                });
            } else {
                res.status(500).json({
                    success: false,
                    msg: 'ERROR: '+err
                });
            }
        });
        }else{
            res.json({
                success: false,
                msg: err.msg
            });
        }
   });
};
//EDITAR INFORMACION DE UN EMPLEADO
ctrl.editarEmpleado = (req,res)=>{
    let datosUser = {
        cedula: req.params.cedula,
        rol_empleado: req.body.rol_empleado,
        primer_nombre:req.body.primer_nombre,
        segundo_nombre:req.body.segundo_nombre,
        apellido_paterno:req.body.apellido_paterno,
        apellido_materno:req.body.apellido_materno,
        telefono:req.body.telefono,
        cargo_empleado: req.body.cargo_empleado,
        foto:req.body.foto
    };
    obtenerInfo(req,datosUser,(err,datosUser)=>{
        if(!err){
            conexionMysql.editarEmpleado(datosUser,(err,datos)=>{
                if(!err){
                    res.json({
                        success: true,
                        msg: 'Empleado Editado',
                        dato: datos
                    });
                }else{
                    res.json({
                        success: false,
                        msg: 'error '+err
                    });
                }
            });
        }else{
            res.json({
                success: false,
                msg: err.msg
            });
        }
    });
};
let obtenerInfo = async (req,datosUser, callback) => {
    if (req.file !== undefined) {
        //DIRECCION DE DONDE SE ENCUENTRA LA IMAGEN
        const dirImag = req.file.path;
        //EXTENCION DE  EL ARCHIVO
        const ext = path.extname(req.file.originalname).toLocaleLowerCase();
        //DIRECCION DONDE VAMOS A GUARDAR LA IMAGEN
        let nombreImagen = fecha()+` Ced${datosUser.cedula}`+ext;
        const dirDestinoImg = path.resolve(`./BACKEND/img/${nombreImagen}`);
        if (ext === '.png' || ext === '.jpg') {
            await fs.rename(dirImag, dirDestinoImg);
            datosUser.foto = nombreImagen;
        } else {
            await fs.unlink(dirImag);
            callback({
                success: false,
                msg: 'Formato del archivo incorrecto'
            }, null);
        }
    }
    callback(null,datosUser);
};
//ELIMINAR UN EMPLEADO
ctrl.eliminarEmpleado = (req,res)=>{
    conexionMysql.borrarEmpleado(req.params.cedula,(err,datos)=>{
        if(datos && datos.msg === 'empleado eliminado' || datos.msg === 'no existe empleado'){
            res.json({
                success: true,
                msg: datos.msg
            });
        }else{
            res.status(500).json({
                msg: 'Error'
            });
        }
    });
};

module.exports = ctrl;