const conection = require('./confiMysql');
let user_model = {};
//TODOS LOS OBJETIVOS
user_model.getObjetivos = (callback) => {
    if(conection){
        let sql  = 'SELECT * FROM objetivo';
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("(moduloObjetivo.getObjetivo) ERROR AL BUSCAR TODOS LOS OBJETIVOS: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            }
        });
    }
};
//OBTENER COMPLEMENTO CON ID
user_model.getComplementoId = (tabla,id, callback) => {
    if(conection){
        let sql = `SELECT * FROM ${tabla} WHERE id = ${conection.escape(id)}`;
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("(moduloObjetivo.getComplementoId)ERROR AL BUSCAR COMPLEMENTO: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            }
        });
    }
};
//OBTENER SOLO COMPLEMENTO CON Objetivo_fechaCreacion
user_model.getComplementoObjetivo_fechaCreacion = (tabla,Objetivo_fechaCreacion, callback) => {
    if(conection){
        // let sql = `SELECT * FROM ${tabla} WHERE Objetivo_fechaCreacion = ${conection.escape(Objetivo_fechaCreacion)}`;
        let sql = `SELECT ${tabla}.*, empleados.rol_empleado FROM ${tabla} JOIN objetivo ON ${tabla}.Objetivo_fechaCreacion = objetivo.fechaCreacion JOIN usuario ON objetivo.Usuario = usuario.Usuario JOIN empleados ON usuario.Empleado_cedula = empleados.cedula WHERE Objetivo_fechaCreacion = ${conection.escape(Objetivo_fechaCreacion)}`;
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("(moduloObjetivo.getComplementoId)ERROR AL BUSCAR COMPLEMENTOS: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            }
        });
    }
};
//OBTENER OBJETIVO CON LA FECHA DE CREACION
user_model.getObjetivoFechaCreacion = (fechaCreacion,tabla,callback)=>{
    if(conection){
        let sql = `SELECT * FROM ${tabla} JOIN objetivo ON ${tabla}.Objetivo_fechaCreacion = objetivo.fechaCreacion WHERE Objetivo_fechaCreacion = ${conection.escape(fechaCreacion)}`
        conection.query(sql,(err,rows)=>{
            if(err){
                console.log("(moduloObjetivo.getObjetivoFechaCreacion) ERROR AL OBTENER EL OBJETIVOS: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            };
        });
    };
};
//OBTENER OBJETIVO POR ROL DEL EMPLEADO
user_model.getObjetivoRolEmpleado = (rol_empleado,callback) => {
    if(conection){
        let sql = `SELECT objetivo.fechaCreacion, objetivo.Usuario, objetivo.tipoObjetivo FROM objetivo JOIN usuario ON objetivo.Usuario = usuario.Usuario JOIN empleados ON usuario.Empleado_cedula = empleados.cedula WHERE empleados.rol_empleado = ${conection.escape(rol_empleado)}`;
        conection.query(sql,(err,rows)=>{
            if(!err){
                callback(null,rows);
            }else{
                console.log("(moduloObjetivo.getObjetivoRolEmpleado) ERROR AL OBTENER LOS OBJETIVOS: " + err);
                callback(err,null);
            };
        });
    }
};
//OBTENER OBJETIVOS POR EL USUARIO
user_model.getObjetivosUsuario = (usuario,callback) => {
    if(conection){
        let sql  = `SELECT * FROM objetivo WHERE Usuario = ${conection.escape(usuario)}` ;
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("(moduloObjetivo.getObjetivoUsuario) ERROR AL BUSCAR LOS OBJETIVOS: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            }
        });
    }
};
//OBTENER ULTIMOS OBJETIVOS INSERTADOS
user_model.getUltimosObjetivos = (callback) => {
    if(conection){
        let sql = `SELECT * FROM objetivo ORDER BY fechaCreacion DESC LIMIT 3`;
        conection.query(sql,(err,rows) => {
            if(err){
                console.log("(moduloObjetivo.getUltimoObjetivos)ERROR AL BUSCAR LOS OBJETIVOS: " + err);
                callback(err,null);
            }else{
                callback(null,rows);
            }
        });
    }
};
//INSERTAR OBJETIVO 
user_model.insertarObjetivo = (datosObj, callback) =>{
    if(conection){
        let obj = {
            fechaCreacion: datosObj.fechaCreacion,
            Usuario: datosObj.Usuario,
            tipoObjetivo: datosObj.tipoObjetivo
        }
        let sql = 'INSERT INTO objetivo SET ?';
        conection.query(sql,obj,(err,row)=>{
            if(err){
                console.log("(moduloObjetivo.insertarObjetivo) ERROR AL INGRESAR EL OBJETIVO: " + err);
                callback(err,null);
            }else{
                callback(null,row);
            }
        });
    }
};
//EDITAR OBJETIVO
user_model.editarObjetivo = (datosObj,callback)=>{
    if(conection){
        let sql = `UPDATE objetivo SET 
        tipoObjetivo = ${conection.escape(datosObj.tipoObjetivo)},
        WHERE fechaCreacion = ${conection.escape(datosObj.fechaCreacion)}`;
        conection.query(sql,(err,result)=>{
            if(err){
                console.log(`(moduloObj.editarObjetivo)ERROR NO SE EDITO EL OBJETIVO: ${err}` );
                callback(err,null);
            }else{ 
                callback(null,result);
            }
        });
    }
};
//INSERTAR COMPLEMENTO DEL OBJETIVO
user_model.insertarComplemento = (datosObj, callback) => {
    if(conection){
        let complemento = {
            fechaCreacion: datosObj.fechaCreacion,
            indicador: datosObj.indicador,
            iniciativa: datosObj.iniciativa,
            meta: datosObj.meta,
            Objetivo_fechaCreacion: datosObj.Objetivo_fechaCreacion
        }
        let tabla = datosObj.tabla;
        let sql = `INSERT INTO ${tabla} SET ?`;
            conection.query(sql,complemento,(err,row)=>{
                if(err){
                    console.log("(moduloObjetivo.insertarComplemento) ERROR AL INGRESAR EL COMPLEMENTO: " + err);    
                    callback(err,null);
                }else{
                callback(null,row);
            }
        });
    }
};
//EDITAR COMPLEMENTO DEL OBJETIVO
user_model.editarComplementoId = (tabla, datosObj, callback)=>{
    if(conection){
        let sql = `UPDATE ${tabla} SET 
        indicador = ${conection.escape(datosObj.indicador)},
        meta = ${conection.escape(datosObj.meta)},
        iniciativa = ${conection.escape(datosObj.iniciativa)}
        WHERE id = ${conection.escape(datosObj.id)}`;
        console.log(sql);
        conection.query(sql,(err,result)=>{
            if(err){
                console.log(`(moduloObjetvo.editarComplemento)ERROR NO SE EDITO EL COMPLEMENTO: ${err}` );
                callback(err,null);
            }else{ 
                callback(null,result);
            }
        });
    }
};
//BORRAR COMPLEMENTO POR ID
user_model.borrarComplementoId = (tabla,id,callback)=>{
    if(conection){
        let sql = `DELETE FROM ${tabla} WHERE id = ${conection.escape(id)}`;
        conection.query(sql,(err,row)=>{
            if(!err){
                callback(null,{
                    msg:'Complemento Eliminado'
                });
            }else{
                callback(err,null);
            }
        });
    }
};
//BORRAR UN OBJETIVO
user_model.borrarObjetvo = (obj,callback)=>{
    if(conection){
        let sql = `DELETE FROM ${obj.tabla} WHERE Objetivo_fechaCreacion = ${conection.escape(obj.fechaCreacion)}`;
        conection.query(sql,(err,row)=>{
            if(!err){
                let sql = `DELETE FROM objetivo WHERE fechaCreacion = ${conection.escape(obj.fechaCreacion)}`;
                conection.query(sql,(err,result)=>{
                    if(!err){
                        callback(null,{
                            msg: 'Objetivo Eliminado'
                        });
                    }else{
                        console.log(`(moduloObjetivo.borrarObjetivo)ERROR NO SE BORRO EL OBJETIVO: ${err}`);
                        callback(err,null);
                    }
                });
            }else{
                console.log(`(moduloObjetivo.borrarObjetivo)ERROR NO SE BORRO EL OBJETIVO: ${err}`);
                callback(err,{
                    msg: 'No se borro el objetivo'
                })
            }
        });
    }
};  


module.exports = user_model;