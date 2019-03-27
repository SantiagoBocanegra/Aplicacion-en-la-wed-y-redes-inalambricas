const socket = io();
var $bodyObj = $('#objetivo_body_obj');
var aside = $("aside");
//DIV INFORMACION OBJETIVO
var $filtroObjetivos = $('#filtroObjetivos');
var $informacionObj = $('#informacionObjetivo');
var $objetivo_ob = $('#objetivo_ob');

//CAMPOS DEL FORMULARIO INFORMACION 
var $btnCrearComponente = $('#btnCrearComponente');
var $objetivo_ob = $('#objetivo_ob');
var $indicadores_ob = $('#indicadores_ob');
var $metas_ob = $('#metas_ob');
var $iniciativas_ob = $('#iniciativas_ob');
var $btnEditarFormObjetivos_ob = $('#btnEditarFormObjetivos_ob');

//CAMPOS FORMULARIO OBJETIVO
var $objetivo = $('#objetivo');
var $indicadores = $('#indicadores');
var $iniciativas = $('#iniciativas');
var $metas = $('#metas');
var $btn_formulario_objetivo = $('#btnFormularioObjetivos');

//COLUMNA OBJETIVO RECIENTE
var $divInformacion = $('#divInformacion');

//CAMPOFORMULARIO LOGIN
var $btn_login = $("#btn_login");
//BTN DEL DOM
var $btn_ver_objetivos = $('#ver_objetivos');
//INFORMACION SOBRE USUARIO ACTIVO
var $infoUseAct = $('#infoUseAct');
//OBJETOS AUX;
var componenteAux = {};
// FECHA DE CREACION DEL OBJETIVO QUE SE ABRIO
var fechaCreacionObj = '';
    
//FUNCIONES QUE SE ENCARGAN DEL MANEJO DE LOS DATOS CON SOCKET
$(document).ready(() => {
    var $usuario = $("#usuario");
    var $contraseña = $("#contraseña");
    //ACTUALIZAR FOTO EN EL LOGIN
    $usuario.on('change',()=>{
        let usuario = $usuario.val();
        if( usuario !== ""){
            socket.emit('ObtenerUsuarioU',usuario,(err,row)=>{
                if(!err){
                    let foto = row[0].Empleado_cedula[0].foto;
                    if (foto !== '//' && foto !== null && foto !== undefined) {
                        $("#foto_empleado_index").attr('src',`/img/${foto}`);
                    }
                }else{
                    console.log(`(objetivos-$contraseña.click)Error ${err.sqlMessage}`);
                };
            });
        };
    });
    //VALIDAR EL USUARIO QUE INGRESAN PARA INGRESAR A LA APLICACION
    $btn_login.on('click', (e) => {
        e.preventDefault();
        let usuarioVal = $usuario.val();
        let contraseñaVal = $contraseña.val();
        if (usuarioVal !== "" && usuarioVal !== undefined) {
            socket.emit('validarUsuario', usuarioVal, (err, datos) => {
                if (!err) {
                    if (datos.length > 0) {
                        usuario = datos[0];
                        if (usuario.Usuario === usuarioVal && usuario.contraseña === contraseñaVal) {
                            $("#menu_login").hide();
                            $("#menu_principal").show();
                            $("#barra_superior").show();
                            $("#navDrop").text(usuario.Usuario);
                            $("#fotoU").attr('src');
                            let empleado = usuario.Empleado_cedula[0];
                            if (empleado.foto !== '//' && empleado.foto !== null && empleado.foto !== undefined) {
                                $("#fotoU").attr('src',`/img/${empleado.foto}`);
                            }
                            socket.emit('ConectarUsuario', usuario, (usuario)=>{
                                $infoUseAct.attr('data-Usuario',usuario.Usuario);
                                $('#ver_informacion').attr('href',`nuevo_usuario.html?usuario=${usuario.Usuario}`);
                            });
                        } else {
                            toastr.error('Contraseña incorrecta', '¡ERROR!');
                        }
                    } else {
                        toastr.error('Usuario incorrecto', '¡ERROR!');
                    }
                } else {
                    console.log('(objetivos-btn_login.click)Error');
                    console.log(err);
                    toastr.error(`Error: ${err.sqlMessage}`, '¡ERROR!');
                }
            });
        } else {
            toastr.error('El campo usuario no puede estar vacio', '¡ERROR!');
        }
    });
    //GUARDAR UN NUEVO OBJETIVO
    $btn_formulario_objetivo.on('click', (e) => {
        e.preventDefault();
        let obj = $objetivo.val();
        let ind = $indicadores.val();
        let ini = $iniciativas.val();
        let met = $metas.val();
        if (obj !== "" && ind !== "" && ini !== "" && met !== "") {
            if(confirm(`Esta seguro de Ingresar el Objetivo: ${obj}`)) {
                let objetivo = {
                    tipoObjetivo: obj,
                    indicador: ind,
                    iniciativa: ini,
                    meta: met
                };
                socket.emit('GuardarObjetivo', objetivo,(err,row)=>{
                    if(!err){
                        $objetivo.val('');
                        $indicadores.val('');
                        $iniciativas.val('');
                        $metas.val('');
                        $("#wrapper").toggleClass("toggled");
                        $("aside").show();
                        toastr.success(row.msg, "INFORMACION");
                    }else{
                        console.log(err.sqlMessage);
                        toastr.error(row.msg, 'ERROR');
                    };
                });
            };
        } else {
            toastr.error('Todos los campos son obligatorios', '¡ERROR!');
        }
    });
    //VER TODOS LOS OBJETIVOS
    $btn_ver_objetivos.on('click', (e) => {
        e.preventDefault();
        socket.emit('VerTodosLosObjetivos', (err, rows) => {
            if (!err) {
                let rol = rows.usuarioActivo.Empleado_cedula[0].rol_empleado;
                let cargo = rows.usuarioActivo.Empleado_cedula[0].cargo_empleado;
                let objetivos = rows.datos;
                renderObjetivos(objetivos, rol,cargo);
            } else {
                console.log(err);
            }
        });
    });
    //EDITAR COMPLEMENTO 
    $btnEditarFormObjetivos_ob.on('click', ()=>{
        componenteAux.indicador = $indicadores_ob.val();
        componenteAux.meta = $metas_ob.val();
        componenteAux.iniciativa = $iniciativas_ob.val();
        let elem = componenteAux.elem;
        componenteAux.elem = "";
        if(confirm(`Esta seguro de editar el componente`)){
            socket.emit('EditarComplementoId',componenteAux,(err,row, userAct)=>{
                if(!err){
                    limpiarForInf();
                    $btnEditarFormObjetivos_ob.hide();
                    $btnCrearComponente.show();
                    $(elem).closest('tr').remove();
                    let cargo = userAct.Empleado_cedula[0].cargo_empleado;
                    let rol = userAct.Empleado_cedula[0].rol_empleado;
                    renderfilaTablaObj(componenteAux, cargo, rol);
                    toastr.success('Complemento Editado', "INFORMACION");
                }else{
                    console.log(`(objetivos-btnEditarFormObjetivos_ob)Error no se edito el complemento ${err.sqlMessage} `);
                    toastr.error('No se edito el complemento','ERROR');
                };
            });
        }
    });
    //AGREGAR COMPONENTE A UN OBJETIVO
    $btnCrearComponente.on('click',()=>{
        let rol = $btnCrearComponente.data('rol');
        let indicador = $indicadores_ob.val();
        let meta = $metas_ob.val();
        let iniciativa = $iniciativas_ob.val();
        if(indicador !== "" || meta !== "" || iniciativa !== ""){
            let fechaA = new Date();
            let componente = {
                Objetivo_fechaCreacion: fechaCreacionObj,
                indicador: indicador,
                meta: meta,
                iniciativa: iniciativa,
                fechaCreacion: fechaComplemento(fechaA),
                rol: rol
            };
            if(confirm('Agregar Informacio al objetivo')){
                socket.emit('CrearComplementoObj',componente,(err,msg)=>{
                    if(!err){
                        let infoObj = {
                            rol: rol,
                            Objetivo_fechaCreacion: fechaCreacionObj
                        };
                        limpiarForInf();
                        socket.emit('BuscarComplementoObjetivo_FechaCreacion',infoObj,(err,rows,usuarioAct)=>{
                            if(!err){
                                let cargo = usuarioAct.Empleado_cedula[0].cargo_empleado;
                                let rol = usuarioAct.Empleado_cedula[0].rol_empleado;
                                renderTablaObj(rows, rol, cargo);
                            }else{
                                console.log(`(objetivos-btnCrearComponente/buscarComplementoObjetivo_fechaCreacion)Error 
                                ${err.sqlMessage}`)
                            };
                        });
                        toastr.success(msg.msg, "INFORMACION");
                    }else{
                        console.log(`(objetivos-btnCrearComponente)Error no se creo el componente: ${err.sqlMessage}`);
                        toastr.error('No se agrego el complemento','ERROR');
                    };
                });
            }
        }else{
            toastr.warning('Ingrese informacion','Advertencia');
        };
    });
    //OBJETIVOS RECIENTES
    $('#btnrecientes').on('click',()=>{
        
    });
    //FILTRO PARA VER LOS OBJETIVOS
    $filtroObjetivos.on('change',()=>{
        let rol = $filtroObjetivos.val();
        if(rol !== "" && rol !== undefined){
            socket.emit('BuscarObjetivoRolEmpleado',rol,(err,rows)=>{
                if (!err) {
                    let rol = rows.usuarioActivo.Empleado_cedula[0].rol_empleado;
                    let cargo = rows.usuarioActivo.Empleado_cedula[0].cargo_empleado;
                    let objetivos = rows.datos;
                    renderObjetivos(objetivos, rol, cargo);
                } else {
                    console.log(err);
                }
            });
        };
    });
    //COLOCAR IMAGEN EN EL FORMULARIO DE NUEVO OBJETIVO
    $('#objetivo-toggle').on('click',()=>{
        let src = $('#fotoU').attr('src');
        $('#fotoObjUser').attr('src',src);
    });
  
    //Eventos del servidor
    //EVENTO CUANDO SE GUARDAR UN NUEVO OBJETIVO
    socket.on('NuevoObjetivo', objetivosNuevos => {
        let objetivo = objetivosNuevos[0];
        let tipoObj = objetivo.tipoObjetivo;
        let autor = objetivo.nombre_completo;
        let rol = objetivo.rol_empleado;
        let html = `<a href="#" class="list-group-item" data-rol="${rol}" data-objtivo="${tipoObj}" data-fechaCreacion="${objetivo.fechaCreacion}" onclick="evtVerInfoObj(this)">
        <h4 class="list-group-header">${tipoObj}</h4>
        <p class="list-group-text">
            <span class="post-info">${autor}</span><br>
            <span class="post-info" >Nuevo Objetivo</span><br>
            <!--<span class="post-info" id="creador"></span>-->
        </p>                    
        </a>`;
        $divInformacion.html(html);
        renderCarrusel(objetivosNuevos);
    });
    //ACTUALIZA EL CARRUCEL
    socket.on('ActualizarCarrucel',obj => {
        renderCarrusel(obj);
    });
    //EVENTO CUANDO SE EDITA EL COMPLEMENTO DE UN OBJETIVO
    socket.on('EditarComplementoObj', (info) =>{
        let html = `<a href="#" class="list-group-item" data-rol="${info.rol}" data-objtivo="${info.objetivo}" data-fechaCreacion="${info.fechaCreacion}" onclick="evtVerInfoObj(this)">
        <h4 class="list-group-header">${info.objetivo}</h4>
        <p class="list-group-text">
            <span class="post-info">${info.nombreAuto}</span><br>
            <span class="post-info">Edito el Objetivo</span><br>
            <span class="post-info">de: ${info.nombreCreador}</span>
        </p>            
        </a>`;
        $divInformacion.html(html);
    });
    //EVENTO CUANDO SE BORRE UN OBJETIVO
    socket.on('BorrarObjetivoObj', info =>{
        let objetivo = info.tipoObjetivo;
        let autor = info.nombre_completo;
        let html = `<a href="#" class="list-group-item">
        <h4 class="list-group-header">${objetivo}</h4>
        <p class="list-group-text">
            <span class="post-info">${autor}</span><br>
            <span class="post-info" >Elimino el Objetivo</span><br>
            <!--<span class="post-info" id="creador"></span>-->
        </p>
        </a>`;
        $divInformacion.html(html);
    });
});
//CLICK EN EL CUADRO DE INFORMACION VER INFORMACION DE MODIFICACIONES RECIENTES
function evtVerInfoObj(elem){
    let rolObj = $(elem).data('rol');
    let fecha = $(elem).data('fechacreacion');
    let infoObj = {
        rol: rolObj,
        Objetivo_fechaCreacion: fecha
    };
    let tipoObj = $(elem).data('objtivo');
    aside.hide();
    $('#cuerpoObj').hide();
    $informacionObj.show();
    socket.emit('BuscarComplementoObjetivo_FechaCreacion',infoObj,(err,row, usuarioAct)=>{
        if(!err){
            if(row.length > 0){
                let cargo = usuarioAct.Empleado_cedula[0].cargo_empleado;
                let rol = usuarioAct.Empleado_cedula[0].rol_empleado;
                $objetivo_ob.val(tipoObj);
                renderTablaObj(row, rol, cargo);
            }else{
                toastr.success('hay que limpiar la tabla','Recordatorio');
            }
        }else{
        console.log(err.sqlMessage);
        };
    });
};
//LIMPIAR EL FORMULARIO DE INFORMACION DE UN OBJETIVO
function limpiarForInf(){
    $indicadores_ob.val('');
    $metas_ob.val('');
    $iniciativas_ob.val('');
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
//EVENTO DE VER TODOS LOS OBJETIVOS-CARD PASAR INFORMACION AL FORMULARIO PARA EDITAR OBJETIVO
function evtVerComplementosObj(item) {
    var $contenedor_objetivos = $('#contenedor_objetivos');
    $contenedor_objetivos.hide();
    $filtroObjetivos.hide();
    aside.hide();
    $informacionObj.show();
    let foto = $(item).data('foto');
    let rolObj = $(item).data('rol');
    let fechaCreacion = $(item).data('obj');
    fechaCreacionObj = fechaCreacion;
    let infoObj = {
        rol: rolObj,
        Objetivo_fechaCreacion: fechaCreacion
    };
    socket.emit('BuscarComplementoObjetivo_FechaCreacion',infoObj,(err,row, usuarioAct)=>{
        if(!err){
            if(row.length > 0){
                let tipoObjeivo = $(item).data('objtivo');
                $objetivo_ob.val(tipoObjeivo);
                $('#formObjUser').attr('src',foto);
                let cargoUserA = usuarioAct.Empleado_cedula[0].cargo_empleado;
                let rolUserA = usuarioAct.Empleado_cedula[0].rol_empleado;
                if (cargoUserA === "Super Usuario" || rolUserA === rolObj) {
                    $btnCrearComponente.data("rol",rolObj);
                    $btnCrearComponente.show(); 
                }else{
                    $btnCrearComponente.hide();
                }
                renderTablaObj(row, rolUserA, cargoUserA);
            }else{
                $bodyObj.html('');
                toastr.success('No se encontro informacion','INFORMACION');
            }
        }else{
            console.log(err.sqlMessage);
        };
    });
};
//EVENTO DE VER TODOS LOS OBJETIVOS-CARD BTN-BORRAR
function evtBorrarObj(item) {
    let tipoObjetivo = $(item).data('objtivo');
    let fechaCreacion = $(item).data('obj');
    let rol = $(item).data('rol');
    let obj = {
        tipoObjetivo: tipoObjetivo,
        fechaCreacion: fechaCreacion, 
        rol: rol
    };
    if(confirm('Segunro que desea eliminar el objetivo: '+tipoObjetivo)){
        socket.emit('BorrarObjetivo',obj,(err,info)=>{
            if(!err){
                toastr.success(info.msg, "INFORMACION");
                socket.emit('VerTodosLosObjetivos', (err, rows) => {
                    if (!err) {
                        let rol = rows.usuarioActivo.Empleado_cedula[0].rol_empleado;
                        let cargo = rows.usuarioActivo.Empleado_cedula[0].cargo_empleado;
                        let objetivos = rows.datos;
                        renderObjetivos(objetivos, rol, cargo);
                    } else {
                        console.log(err);
                    }
                });
            }else{
                console.log(`(objetivos-evtBorrarObj)Error no se borro el complemento ${err.sqlMessage} `);
                toastr.error('No se Elimino el complemento','ERROR');
            };
        });
    };
};
//MANDAR INFORMACION A LOS CAMPOS DEL FORMULARIO PARA EDITAR 
function editarCom(elem){
    let id = $(elem).data('id');
    let rol = $(elem).data('rol');
    let infoObj = {
        rol: rol,
        id: id
    };
    socket.emit('BuscarComplementoObjId',infoObj,(err,row)=>{
        if(!err){
            componenteAux = row [0];
            componenteAux.elem = elem;
            componenteAux.rol = rol;
            let indicador = row[0].indicador;
            let meta = row[0].meta;
            let iniciativa = row[0].iniciativa;
            $indicadores_ob.val(indicador);
            $metas_ob.val(meta);
            $iniciativas_ob.val(iniciativa);
            $btnEditarFormObjetivos_ob.show();
            $btnCrearComponente.hide();
        }else{
            console.log(err);
        }
    });
};
//ELIMINAR COMPLEMENTO DE UN OBJETIVO
function borrarCom(elem){
    let id = $(elem).data('id');
    let rol = $(elem).data('rol');
    let ObjFechaCreacion = $(elem).data('fechaobj');
    let infCom = {
        rol: rol,
        id: id, 
        Objetivo_fechaCreacion: ObjFechaCreacion
    };
    if(confirm(`Seguro que desea eliminar el complemento del objetivo`)){
        socket.emit('BorrarComplementoId',infCom,(err,info)=>{
            if(!err){
                toastr.success(info.msg, "INFORMACION");
                if (info.estado){
                    $(elem).closest('tr').remove();
                };
            }else{
                console.log(`(objetivos-borrarCom)Error no se borro el complemento ${err.sqlMessage} `);
                toastr.error('No se Elimino el complemento','ERROR');
            };
        });
    }
}   
//RENDER OBJETIVOS EN EL CARRUSEL
function renderCarrusel(objetivos){
    let objetivo = objetivos[0];
    let foto;
    if (objetivo.foto !== '//' && objetivo.foto !== null && objetivo.foto !== undefined) {
        foto  = `/img/${objetivo.foto}`;
    }else{
        foto = "https://via.placeholder.com/800x400";
    }
    let htmlIndicator = `<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>`;
    let htmlinner = `<div class="carousel-item active">
                        <img class="d-block w-100 img-responsive" style="height: 400px; width: 800px;" src="${foto}" alt="Third slide">
                        <div class="carousel-caption">
                            <span href="#" class="con_obj_header">${objetivo.tipoObjetivo}</span>
                            <br/>
                            <!--FECHA DE CREACION DE OBJETIVO-->
                            <span class="post-info">${fecha(objetivo.fechaCreacion)}</span>
                            <br />
                            <!--AUTOR DEL OBJETIVO-->
                            <span class="post-info">${objetivo.nombre_completo}</span>
                            <br />
                            <!--ROL DEL OBJETIVO-->
                            <span class="post-info">${objetivo.rol_empleado}</span>
                        </div>
                    </div>`;
    objetivos.shift();
    $.each(objetivos,(index,item)=>{
        if (item.foto !== '//' && item.foto !== null && item.foto !== undefined) {
            foto  = `/img/${item.foto}`;
        }else{
            foto = "https://via.placeholder.com/800x400";
        }
        htmlIndicator += `<li data-target="#carouselExampleIndicators" data-slide-to="${index+1}"></li>`;
        htmlinner += `<div class="carousel-item">
                        <img class="d-block w-100 img-responsive" style="height: 400px; width: 800px;" src="${foto}" alt="Third slide">
                        <div class="carousel-caption">
                            <span href="#" class="con_obj_header">${item.tipoObjetivo}</span>
                            <br/>
                            <!--FECHA DE CREACION DE OBJETIVO-->
                            <span class="post-info">${fecha(item.fechaCreacion)}</span>
                            <br />
                            <!--AUTOR DEL OBJETIVO-->
                            <span class="post-info">${item.nombre_completo}</span>
                            <br />
                            <!--ROL DEL OBJETIVO-->
                            <span class="post-info">${item.rol_empleado}</span>
                        </div>
                    </div>`;
    });
    let html = `<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                    <ol class="carousel-indicators">
                        ${htmlIndicator}
                    </ol>
                    <div class="carousel-inner">
                        ${htmlinner}
                    </div>
                    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>`;
    $('#cuerpoObj').html(html); 
};
//RENDERIZAR TODOS LOS OBJETIVOS EN EL DIV
function renderObjetivos(objetivos, rol, cargo) {
    let aux = 1;
    let htmlA = '';
    let html = '';
    for (let i = 0; i < objetivos.length; i++) {
        let foto;
        if (objetivos[i].Usuario.Empleado_cedula.foto !== '//' && objetivos[i].Usuario.Empleado_cedula.foto !== null && objetivos[i].Usuario.Empleado_cedula.foto !== undefined) {
            foto  = `/img/${objetivos[i].Usuario.Empleado_cedula.foto}`;
        }else{
            foto = "https://via.placeholder.com/100x180";
        }
        html +=`<div class="col-sm-4">
            <div class="card text-center">
                <img style="height: 120px; width: 100;" class="card-img-top" src="${foto}" alt="Foto del creador del objetivo">
                <div class="card-body" style="padding: 2px 4px;">
                    <h5 class="card-title con_obj_header">
                        <a href="#">${objetivos[i].tipoObjetivo}</a>
                    </h5>
                    <p class="card-text">
                        <!--FECHA DE CREACION DE OBJETIVO-->
                        <span class="post-info">${fecha(objetivos[i].fechaCreacion)}</span>
                        <br />
                        <!--AUTOR DEL OBJETIVO-->
                        <span class="post-info">${objetivos[i].Usuario.Empleado_cedula.primer_nombre}</span>
                        <br />
                        <!--ROL DEL OBJETIVO-->
                        <span class="post-info">${objetivos[i].Usuario.Empleado_cedula.rol_empleado}</span>
                    </p>
                    <a href="#" class="btn btn-primary btn_cards" type="button" data-foto="${foto}" data-rol="${objetivos[i].Usuario.Empleado_cedula.rol_empleado}" data-objtivo="${objetivos[i].tipoObjetivo}" data-obj="${fecha(objetivos[i].fechaCreacion)}" onclick="evtVerComplementosObj(this)">Ver</a>`;
        if (cargo === "Super Usuario" || rol === objetivos[i].Usuario.Empleado_cedula.rol_empleado) {
            html += ` <a href="#" class="btn btn-danger btn_cards" type="button" data-rol="${objetivos[i].Usuario.Empleado_cedula.rol_empleado}" data-objtivo="${objetivos[i].tipoObjetivo}" data-obj="${fecha(objetivos[i].fechaCreacion)}" onclick="evtBorrarObj(this)" >Borrar </a>`;
        }
        html += `</div>
            </div>
        </div>`;
        if (aux > 2) {
            htmlA += `<div id="cuerpoObj" class="container-fluid row cuerpoObj">
                        ${html}
                    </div>`;
            html = "";
            aux = 0;
        }
        aux++;
    }
    if (html !== "") {
        htmlA += `<div id="cuerpoObj" class="container-fluid row cuerpoObj">
                ${html}
            </div>`;
    };
    $('#contenedor_objetivos').html(htmlA);
}
//RENDER OBJETIVOS EN LA TABLA OBJETVOS
function renderTablaObj(objetivo,rol,cargo) {
    let html="";
    $.each(objetivo, (i, item) => {
        console.log(item);
        html += `<tr>`
            + `<th scope="row">${fechaComplemento(item.fechaCreacion)}</th>`
            + `<td>${item.indicador}</td>`
            + `<td>${item.meta}</td>`
            + `<td>${item.iniciativa}</td>`;
            if (cargo === "Super Usuario" || rol === item.rol_empleado) {
                html += `<td>`
                + `<button type="button" class="btn btn-primary" title="Editar objetivo" data-rol="${item.rol_empleado}" data-id="${item.id}" onclick="editarCom(this);">`
                + `<span class="icon-pencil"></span>`
                + `</button>`
                + `</td>`
                + `<td>`
                + `<button type="button" class="btn btn-danger" title="Eliminar objetvo" data-fechaobj="${item.Objetivo_fechaCreacion}" data-rol="${item.rol_empleado}" data-id="${item.id}" onclick="borrarCom(this);">`
                + `<span class="icon-bin"></span>`
                + `</button>`
                + `</td>`;
            } else {
                html += `<td colspan="2"></td>`;
            }
            html += `</tr>`;
    });
    $bodyObj.html(html);
};
//COLOCAR INFORMACION EN LA TABLA OBJETIVOS
function renderfilaTablaObj(item,cargo,rol){
    let html = `<tr>`
    + `<th scope="row">${fechaComplemento(item.fechaCreacion)}</th>`
    + `<td>${item.indicador}</td>`
    + `<td>${item.meta}</td>`
    + `<td>${item.iniciativa}</td>`;
    if (cargo === "Super Usuario" || rol === item.rol) {
        html += `<td>`
        + `<button type="button" class="btn btn-primary" title="Editar objetivo" data-rol="${item.rol}" data-id="${item.id}" onclick="editarCom(this);">`
        + `<span class="icon-pencil"></span>`
        + `</button>`
        + `</td>`
        + `<td>`
        + `<button type="button" class="btn btn-danger" title="Eliminar objetvo" data-fechaobj="${item.Objetivo_fechaCreacion} data-rol="${item.rol}" data-id="${item.id}" onclick="borrarCom(this);">`
        + `<span class="icon-bin"></span>`
        + `</button>`
        + `</td>`;
    } else {
        html += `<td colspan="2"></td>`;
    }
    html += `</tr>`;
    $bodyObj.append(html);
}