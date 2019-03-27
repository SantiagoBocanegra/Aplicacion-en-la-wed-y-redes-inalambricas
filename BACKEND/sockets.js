const conexionMysql = require('./modulos/moduloUsuario');
const moduloObjetivo = require('./modulos/moduloObjetivo');
var objetivosNuevos = [];

module.exports = function (io) {
    io.on('connection', socket => {
        console.log('nuevo usuario conectado');
        //VALIDAR EL LOGIN
        socket.on('validarUsuario', (usuario, callback) => {
            conexionMysql.buscarUsuario(usuario, (err, datos) => {
                callback(err, datos);
            });
        });
        //GUARDAR INFORMACION DEL USUARIO
        socket.on('ConectarUsuario', (usuario, callback) => {
            socket.usuario = usuario;
            callback({
                Usuario: usuario.Usuario
            });
            moduloObjetivo.getUltimosObjetivos((err,row)=>{
                if(!err){
                    buscarUsuarios(row,(err,datos)=>{
                        objetivosNuevos = [];
                        let rows = datos.datos;
                        for(let i = 0; i < rows.length; i++){ 
                            let nombreCompleto = rows[i].Usuario.Empleado_cedula.primer_nombre+" "+rows[i].Usuario.Empleado_cedula.apellido_paterno;
                            let rol_empleado = rows[i].Usuario.Empleado_cedula.rol_empleado;
                            let foto = rows[i].Usuario.Empleado_cedula.foto;
                            let infoObjUser = {};
                            infoObjUser.tipoObjetivo = rows[i].tipoObjetivo,
                            infoObjUser.fechaCreacion = fecha(rows[i].fechaCreacion),
                            infoObjUser.nombre_completo = nombreCompleto,
                            infoObjUser.rol_empleado = rol_empleado;
                            infoObjUser.foto = foto;

                            objetivosNuevos.push(infoObjUser);
                        }
                        io.sockets.emit('ActualizarCarrucel', objetivosNuevos);
                    });
                };
            });
        });
        //INSERTAR NUEVO OBJETIVO
        socket.on('GuardarObjetivo', (objetivo, callback) => {
            let usuarioAct = socket.usuario;
            let fechaCreacio = new Date();
            let tabla = obtenerTabla(socket.usuario.Empleado_cedula[0].rol_empleado);
            let obj = {
                fechaCreacion: fechaCreacio,
                tipoObjetivo: objetivo.tipoObjetivo
            };
            obj.Usuario = socket.usuario.Usuario;
            let comp = {
                Objetivo_fechaCreacion: fechaCreacio,
                indicador: objetivo.indicador,
                meta: objetivo.meta,
                iniciativa: objetivo.iniciativa,
                fechaCreacion: fechaComplemento(fechaCreacio),
                tabla: tabla
            };
            let usu = usuarioAct.Usuario;
            moduloObjetivo.getObjetivosUsuario(usu, (err, row) => {
                if (!err) {
                    if (row.length <= 10) {
                        moduloObjetivo.insertarObjetivo(obj, (err, row) => {
                            if (!err) {
                                moduloObjetivo.insertarComplemento(comp, (err, row) => {
                                    if (!err) {
                                        let nombreCompleto = usuarioAct.Empleado_cedula[0].primer_nombre + " " + usuarioAct.Empleado_cedula[0].apellido_paterno;
                                        let rol_empleado = usuarioAct.Empleado_cedula[0].rol_empleado;
                                        let foto = usuarioAct.Empleado_cedula[0].foto;
                                        let infoObjUser = {
                                            tipoObjetivo: objetivo.tipoObjetivo,
                                            fechaCreacion: fechaCreacio,
                                            nombre_completo: nombreCompleto,
                                            rol_empleado: rol_empleado,
                                            foto: foto
                                        };
                                        //ACTUALIZAR LOS NUEVOS ELEMENTOS
                                        if (objetivosNuevos.length > 2) {
                                            objetivosNuevos.unshift(infoObjUser);
                                            objetivosNuevos.pop();
                                        } else {
                                            objetivosNuevos.unshift(infoObjUser);
                                        };
                                        io.sockets.emit('NuevoObjetivo', objetivosNuevos);
                                        callback(null, {
                                            msg: 'Objetivo insertado'
                                        });
                                    } else {
                                        console.log('(sockets-GuardarObjetivo)No se guardo los complemetos ERROR');
                                        let tabla = obtenerTabla(socket.usuario.Empleado_cedula[0].rol_empleado);
                                        obj.tabla = tabla;
                                        moduloObjetivo.borrarObjetvo(obj, (err, resul) => {
                                            if (!err) {
                                                callback(err, {
                                                    msg: 'Objetivo no alamacenado'
                                                });
                                            };
                                        });   
                                    }
                                });
                            } else {
                                callback(err, {
                                    msg: 'Objetivo no alamacenado'
                                });
                                console.log('NO SE INGRESO EL OBJETIVO');
                            };
                        });
                    } else {
                        callback(null, {
                            estado: false,
                            msg: `El usuario ${usu} no puede agragar mas objetivos`
                        })
                    }
                } else {
                    callback(err, null);
                }
            });
        });
        //OBTENER TODOS LOS OBJETIVOS
        socket.on('VerTodosLosObjetivos', (callback) => {
            moduloObjetivo.getObjetivos((err, row) => {
                if (!err) {
                    buscarUsuarios(row, callback);
                } else {
                    callback(err, null);
                }
            });
        });
        //OBTENER OBJETIVO POR FECHA DE CRACION
        /*socket.on('ObtenerObjetivoFechaCreacion', (fechaCreacion, callback) => {
             let tabla = obtenerTabla(socket.usuario.Empleado_cedula[0].rol_empleado);
             moduloObjetivo.getObjetivoFechaCreacion(fechaCreacion, tabla, (err, rows) => {
                 if (!err) {
                     callback(null, rows);
                 } else {
                     callback(err, null);
                 }
             });
         });
         */
        //OBTENER COMPLEMENTO DE OBJETIVO POR ID
        socket.on('BuscarComplementoObjId', (infoObj, callback) => {
            let tabla = obtenerTabla(infoObj.rol);
            moduloObjetivo.getComplementoId(tabla, infoObj.id, (err, row) => {
                if (!err) {
                    callback(null, row);
                } else {
                    callback(err, null);
                }
            });
        });
        //OBTENER OBJETIVOS POR ROL DE EMPLEADOS
        socket.on('BuscarObjetivoRolEmpleado', (rol_empleado, callback) => {
            moduloObjetivo.getObjetivoRolEmpleado(rol_empleado, (err, row) => {
                if (!err) {
                    buscarUsuarios(row, callback);
                } else {
                    callback(err, null);
                }
            });
        });
        //INCORPORAR LOS USUARIOS A UNA LISTA DE OBJETIVOS
        function buscarUsuarios(row, callback) {
            conexionMysql.getUsuarios((err, rows) => {
                if (!err) {
                    for (let i = 0; i < row.length; i++) {
                        for (let j = 0; j < rows.length; j++) {
                            if (row[i].Usuario === rows[j].Usuario) {
                                row[i].Usuario = rows[j];
                            }
                        }
                    }
                    let res = {
                        usuarioActivo: socket.usuario,
                        datos: row
                    }
                    callback(null, res);
                }
            });
        };
        //BUSCAR SOLO COMPLEMENTO DE UN OBJETIVO POR Objetivo_fechaCreacion
        socket.on('BuscarComplementoObjetivo_FechaCreacion', (infoObj, callback) => {
            let tabla = obtenerTabla(infoObj.rol);
            moduloObjetivo.getComplementoObjetivo_fechaCreacion(tabla, infoObj.Objetivo_fechaCreacion, (err, row) => {
                if (!err) {
                    let usuarioAct = socket.usuario;
                    callback(null, row, usuarioAct);
                } else {
                    callback(err, null, null);
                }
            });
        });
        //EDITAR COMPLEMENTO DE UN OBJETIVO POR ID COMPLEMENTO
        socket.on('EditarComplementoId', (datosObj, callback) => {
            let tabla = obtenerTabla(datosObj.rol);
            moduloObjetivo.editarComplementoId(tabla, datosObj, (err, row) => {
                if (!err) {
                    let info = {};
                    let fechaCreacion = fecha(datosObj.Objetivo_fechaCreacion);
                    moduloObjetivo.getObjetivoFechaCreacion(fechaCreacion, tabla, (err, row) => {
                        if (!err && row.length > 0) {
                            let usuario = row[0].Usuario;
                            conexionMysql.buscarUsuario(usuario, (err, rowUsuario) => {
                                if (!err && rowUsuario.length > 0) {
                                    info.fechaCreacion = fechaCreacion;
                                    info.nombreAuto = socket.usuario.Empleado_cedula[0].primer_nombre + ' ' + socket.usuario.Empleado_cedula[0].apellido_paterno;
                                    info.objetivo = row[0].tipoObjetivo;
                                    info.nombreCreador = rowUsuario[0].Empleado_cedula[0].primer_nombre + ' ' + rowUsuario[0].Empleado_cedula[0].apellido_paterno;
                                    info.rol = datosObj.rol;
                                    io.sockets.emit('EditarComplementoObj', info);
                                }
                            });
                        }
                    });
                    let userAct = socket.usuario;
                    callback(null, row, userAct);
                } else {
                    callback(err, null);
                }
            });
        });
        //CREAR COMPLEMENTO DE UN OBJETIVO
        socket.on('CrearComplementoObj', (datosObj, callback) => {
            let tabla = obtenerTabla(datosObj.rol);
            datosObj.tabla = tabla;
            moduloObjetivo.insertarComplemento(datosObj, (err, row) => {
                if (!err) {
                    callback(null, {
                        msg: 'Componete agregado'
                    });
                } else {
                    callback(err, null);
                };
            });
        });
        //EDITAR OBJETIVO
        socket.on('EditarObjetivoFechaCreacion', (objetivo, callback) => {

        });
        //BORRAR COMPLEMENTO DE UN OBJETIVO POR ID COMPLEMENTO
        socket.on('BorrarComplementoId', (infoComp, callback) => {
            let info = {};
            info.estado = false;
            let tabla = obtenerTabla(infoComp.rol);
            moduloObjetivo.getComplementoObjetivo_fechaCreacion(tabla,fecha(infoComp.Objetivo_fechaCreacion),(err,row)=>{
                if(!err && row.length > 1){
                    moduloObjetivo.borrarComplementoId(tabla, infoComp.id, (err, resul) => {
                        if (!err) {
                            info.estado = true;
                            info.usuarioActivo = socket.usuario;
                            info.msg = resul.msg;
                            callback(null, info);
                        } else {
                            callback(err, null);
                        }
                    });
                }else{
                    info.estado = false;
                    info.usuarioActivo = socket.usuario;
                    info.msg = 'No se puede eliminar el componente';
                    callback(null,info);
                };
            });
        });
        //BORRAR OBJETIVO
        socket.on('BorrarObjetivo', (obj, callback) => {
            comprobarElemento(obj.fechaCreacion, ()=>{
                io.sockets.emit('ActualizarCarrucel', objetivosNuevos);
            });
            let info = {};
            let tabla = obtenerTabla(obj.rol);
            obj.tabla = tabla;
            moduloObjetivo.borrarObjetvo(obj, (err, resul) => {
                if (!err) {
                    let nombreCompleto = socket.usuario.Empleado_cedula[0].primer_nombre + ' ' + socket.usuario.Empleado_cedula[0].apellido_paterno;
                    info.nombre_completo = nombreCompleto;
                    info.msg = resul.msg;
                    info.tipoObjetivo = obj.tipoObjetivo;
                    io.sockets.emit('BorrarObjetivoObj', info);
                    callback(null, info);
                } else {
                    callback(err, null);
                }
            });
        });
        //OBTENER INFORMACION DE UN USUARIO
        socket.on('ObtenerUsuarioU', (usuario, callback) => {
            conexionMysql.buscarUsuario(usuario, (err, row) => {
                if (!err) {
                    callback(null, row);
                } else {
                    callback(err, null);
                }
            });
        });
    });
}
//BUSCAR SI EXISTE UN OBJETIVO EN EL ARRAR
function comprobarElemento(fechaCreacion,callback){
    for(let i = 0; i < objetivosNuevos.length; i++){
        if (fechaCreacion === objetivosNuevos[i].fechaCreacion){
            objetivosNuevos.splice(i,1);
            callback();
        }
    }
};

function obtenerTabla(parametro) {
    let tabla = "";
    if (parametro === "Gestion Humana") {
        tabla = 'gestionhumana';
    };
    if (parametro === "Servicio al Cliente") {
        tabla = 'servicioncliente';
    };
    if (parametro === "Financiero") {
        tabla = 'financiero'
    };
    if (parametro === "Investigacion y Desarrollo") {
        tabla = 'investigaciondesarrollo'
    };
    return tabla;
};
//OBTENER FECHA 9999-12-31 23:59:59 DEL TIPO DATE
function fecha(string) {
    let fecha = new Date(string);
    let fechaActual = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
    return fechaActual;
};
//OBTENER FECHA SIN HORA 9999-12-31 DEL TIPO DATE
function fechaComplemento(string) {
    let fecha = new Date(string);
    let fechaActual = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
    return fechaActual;
};
Array.prototype.unique = function (a) {
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});



// console.log(`Objetivo Guardado:  ${datos.objetivo}`);
// //Retrasmitir a todos los usuario conectados
// //io.sockets.emit('Nuevo Objetivo', datos);
