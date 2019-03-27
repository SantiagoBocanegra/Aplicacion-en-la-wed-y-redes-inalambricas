const conection = require('./confiMysql');
let user_model = {};
//BUSCAR TODOS LOS USUARIOS
user_model.getUsuarios = (callback) => {
    if(conection){
        let sql  = 'SELECT * FROM usuario';
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("(moduloUsuario.getUsuarios) ERROR AL BUSCAR TODOS LOS USUARIOS: " + err);
                callback(err,null);
            }else{
                getEmpleados((err, rowsEmp)=>{
                    if(!err){
                        for(let i=0; i < rows.length; i++){;
                            for(let j=0; j < rowsEmp.length; j++){
                                if(rows[i].Empleado_cedula === rowsEmp[j].cedula){
                                    rows[i].Empleado_cedula = rowsEmp[j];
                                }
                            }
                        }
                        callback(null,rows);
                    }else{
                        callback(err,null); 
                    }
                });
            }
        });
    }
};
//BUSCAR POR EL USUARIO
user_model.buscarUsuario = (usuario,callback) => {
    if(conection){
        let sql = `SELECT * FROM usuario WHERE Usuario = ${conection.escape(usuario)}`;
        conection.query(sql,(err,row)=>{
            if (err){
                console.log("(moduloUsuario.buscarUsuario) ERROR AL BUSCAR EL USUARIO: " + err);
                callback(err,null);
            } else{
                if(row.length > 0){ 
                    buscarEmpleado(row[0], (res)=>{
                        row[0].Empleado_cedula = res;
                        callback(null, row);
                    }); 
                }else{
                    callback(null, row);
                }
            }
        });
    }
};
//BUSCAR USUARIOS POR LA CEDULA DEL EMPLEADO
user_model.buscarUsuarioCedula = (cedula,callback) => {
    if(conection){
        let sql = `SELECT * FROM usuario WHERE Empleado_cedula = ${conection.escape(cedula)}`;
        conection.query(sql,(err,row)=>{
            if (err){
                console.log("(moduloUsuario.buscarUsuarioCedula) ERROR AL BUSCAR EL USUARIO: " + err);
                callback(err,null);
            } else{
                getEmpleados((err, rowsEmp)=>{
                    if(!err){
                        for(let i=0; i < row.length; i++){;
                            for(let j=0; j < rowsEmp.length; j++){
                                if(row[i].Empleado_cedula === rowsEmp[j].cedula){
                                    row[i].Empleado_cedula = rowsEmp[j];
                                }
                            }
                        }
                        callback(null,row);
                    }else{
                        callback(err,null); 
                    }
                });
            }
        });
    }
};
//INSERTAR UN USUARIO NUEVO
user_model.insertarUsuario = (datosUser, callback) =>{
    if(conection){
        let sql = 'INSERT INTO usuario SET ?';
        conection.query(sql,datosUser,(err,row)=>{
            if(err){
                console.log("(moduloUsuario.insertarUsuario) ERROR AL INGRESAR EL USUARIO: " + err);
                callback(err,null);
            }else{
                callback(null,row);
            }
        });
    }
};
//EDITAR UN USUARIO
user_model.editarUsuario = (datosUser,callback)=>{
    if(conection){
        let sql = `UPDATE usuario SET 
        contraseña = ${conection.escape(datosUser.contraseña)},
        estado = ${conection.escape(datosUser.estado)}
        WHERE Usuario = ${conection.escape(datosUser.Usuario)}`;
        conection.query(sql,(err,result)=>{
            if(err){
                console.log(`(moduloUsuario.editarUsuario)ERROR NO SE EDITO EL USUARIO: ${err}` );
                callback(err,null);
            }else{ 
                callback(null,result);
            }
        });
    }
};
//BORRAR UN USUARIO
user_model.borrarUsuario = (usuario,callback)=>{
    if(conection){
        let sql = `SELECT * FROM usuario WHERE Usuario = ${conection.escape(usuario)}`;
        conection.query(sql,(err,row)=>{
            if(row){
                let sql = `DELETE FROM usuario WHERE Usuario = '${usuario}'`;
                conection.query(sql,(err,result)=>{
                    if(err){
                        console.log(`(moduloUsuario.borrarUsuario)ERROR NO SE BORRO EL USUARIO: ${err}`);
                        callback(err,null);
                    }else{
                        callback(null,{
                            msg: 'Empleado eliminado'
                        });
                    }
                });
            }else{
                callback(null,{
                    msg: 'No existe el empleado'
                })
            }
        });
    }
}; 
//BUSCAR EL EMPLEADO QUE LE PERTENES A UN USUARIO 
function buscarEmpleado(usuario, callback){
    if(usuario.Empleado_cedula !== undefined){
        if(conection){
            let cedula = usuario.Empleado_cedula;
            let sql = `SELECT * FROM empleados WHERE cedula = ${cedula}`;
            conection.query(sql,(err,row)=>{
                if (err){
                    console.log("(moduloUsuario.buscarEmpleado) ERROR AL BUSCAR EL EMPLEADO: " + err);
                }else{
                    callback(row);
                }
            });
        }
    }
};
//OBTENER TODOS LOS EMPLEADOS
function getEmpleados(callback){
    if(conection){
        let sql  = 'SELECT * FROM empleados';
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("((moduloUsuario) funcion getEmpleados) ERROR AL BUSCAR TODOS LOS EMPLEADOS: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            }
        });
    }
};
module.exports = user_model;