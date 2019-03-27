const conection = require('./confiMysql');
let user_model = {};

user_model.getEmpleados = (callback) => {
    if(conection){
        let sql  = 'SELECT * FROM empleados';
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("(conexionMysql) ERROR AL BUSCAR TODOS LOS EMPLEADOS: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            }
        });
    }
};

user_model.insertarEmpleado = (datosEmp, callback) =>{
    if(conection){
        let sql = 'INSERT INTO empleados SET ?';
        conection.query(sql,datosEmp,(err,row)=>{
            if(err){
                console.log("(conexionMysql) ERROR AL INGRESAR EL EMPLEADO: " + err);
                callback(err,null);
            }else{
                callback(null,row);
            }
        });
    }
};

user_model.buscarCedulaEmpleado = (cedula,callback) => {
    if(conection){
        let sql = `SELECT * FROM empleados WHERE cedula = ${conection.escape(cedula)}`;
        conection.query(sql,(err,row)=>{
            if (err){
                console.log("(conexionMysql) ERROR AL BUSCAR EL EMPLEADO: " + err);
                callback(err,null);
            } else{
                callback(null, row);
            }
        });
    }
};

user_model.editarEmpleado = (datos_usuario,callback)=>{
    if(conection){
        let sql = `UPDATE empleados SET 
        rol_empleado = ${conection.escape(datos_usuario.rol_empleado)},
        primer_nombre = ${conection.escape(datos_usuario.primer_nombre)},
        segundo_nombre = ${conection.escape(datos_usuario.segundo_nombre)},
        apellido_paterno = ${conection.escape(datos_usuario.apellido_paterno)},
        apellido_materno = ${conection.escape(datos_usuario.apellido_materno)},
        telefono = ${conection.escape(datos_usuario.telefono)},
        cargo_empleado = ${conection.escape(datos_usuario.cargo_empleado)},
        foto = ${conection.escape(datos_usuario.foto)} 
        WHERE cedula = ${conection.escape(datos_usuario.cedula)}
        `;
        conection.query(sql,(err,result)=>{
            if(err){
                console.log('(moduloEmpleado-editarEmpleado)ERROR No se edito el empleado '+err);
                callback(err,null);
            }else{ 
                callback(null,result);
            }
        });
    }
};

user_model.borrarEmpleado = (cedula,callback)=>{
    if(conection){
        let sql = `DELETE FROM usuario WHERE Empleado_cedula = ${conection.escape(cedula)}`;
        conection.query(sql,(err,row)=>{
            if(!err && row){
                let sql = `DELETE FROM empleados WHERE cedula = ${cedula}`;
                conection.query(sql,(err,result)=>{
                    if(err){
                        console.log('(moduloEmpleado-borrarEmpleado)ERROR No se borro el empleado '+err);
                        callback(err,null);
                    }else{
                        callback(null,{
                            msg: 'empleado eliminado'
                        });
                    }
                });
            }else{
                callback(null,{
                    msg: 'no se elimino el empleado'
                })
            }
        });
    }
}; 

module.exports = user_model;