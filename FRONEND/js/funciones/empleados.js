var url = "http://localhost:3000";
//FORMULARIO EMPLEADO index.html
var formEmpleado = document.getElementById('form_empleado');

//FORMULARIOS DE nuevo_usuario.hmtl
var $formEmpleado_nu = document.getElementById('form_empleado_nu');
var $formUsuario = document.getElementById('form_usuario_nu');
//CAMPOS DEL FORMULARIO USUARIOS nuevo_usuario.hmtl
var $usuario = $('#usuario_nu');
var $contraseña = $('#contraseña');
var $confirmar_contraseña = $('#confirmar_contraseña');

//CAMPOS DE ENTRADA DEL FORMULARIO EMPLEADOS index.html
var $cedula = $('#cedula');
var $rol_empleado = $('#rol_empleado');
var $primer_nombre = $('#primer_nombre');
var $segundo_nombre = $('#segundo_nombre');
var $apellido_paterno = $('#apellido_paterno');
var $apellido_materno = $('#apellido_materno');
var $telefono = $('#telefono');
var $cargo_empleado = $('#cargo_empleado');
var $foto = "//";

//CAMPOS DE ENTRADA DEL FORMULARIO EMPLEADOS EN DOCUMENTO nuevo_usuario.html
var $cedula_nu = $('#cedula_nu');
var $rol_empleado_nu = $('#rol_empleado_nu');
var $primer_nombre_nu = $('#primer_nombre_nu');
var $segundo_nombre_nu = $('#segundo_nombre_nu');
var $apellido_paterno_nu = $('#apellido_paterno_nu');
var $apellido_materno_nu = $('#apellido_materno_nu');
var $cargo_empleado_nu = $('#cargo_empleado_nu');
var $telefono_nu = $('#telefono_nu');

//CUERPO DE LA TABLA DE EMPLEADOS DE EL DOCUMENTO nuevo_usuario.html
var $body = $("#cuerpo_tabla_empleado");
// CUERPO DE LA TABLA DE USUARIOS DE EL DOCUMENTO nuevo_usuario.html
var $bodyUsuario = $("#bodyUsuario");
//INFORMACION DE USUARIO ACTIVO
let cargo = 'Jefe Area';
let rol_empleado_Activo = "Financiero";
var asignarUsuario = {};
//  AUX
let elemAux;
let fotoAux;
toastr.options.closeButton = true;

$(document).ready(() => {
    //METODO POST GUARDAR EMPLEADO
    $("#btn_empleado").on('click', () => {
        /*
        // Display the values
        convertir a json
        //let env = JSON.stringify(datos);
        for (var value of formData.values()) {
            console.log(value); 
        }
        */
        // CREA EL OBJETO FORMDATE CON INFORMACION DEL FORMULARIO
        var formData = new FormData(formEmpleado);
        formData.append('foto', '//');
        let cedula = $cedula.val();
        if (cedula !== "") {
            if(confirm('Esta seguro de insertar el empleado')){
                postEmpleado(formData,()=>{
                    limpiarIndex();
                    $("#wrapper").toggleClass("toggled");
                    $("aside").show();
                });
            }
        } else {
            toastr.warning("El campo cedula es obligatorio", "ADVERTENCIA");
        }
    });

    //METODO PUT EDITAR EMPLEADO
    $("#btn_editar_emp").on('click', () => {
        let cedula = $cedula_nu.val();
        let item = {
            rol_empleado: $rol_empleado_nu.val(),
            primer_nombre: $primer_nombre_nu.val(),
            apellido_paterno: $apellido_paterno_nu.val(),
            cedula: cedula 
        }
        var formData = new FormData($formEmpleado_nu);
        formData.append('foto', fotoAux);
        if(confirm(`Esta seguro de editar el empleado`)){
            putEmpleado(cedula,formData,(success)=>{
                if(success){
                    limpiar();
                    $("#btn_editar_emp").hide();
                    $("#btn_eliminar_emp").hide();
                    $(elemAux).closest('tr').remove();
                    renderEmpleado(item, cargo, rol_empleado_Activo);
                }
            });
        }
        
    });

    //METODO DELETE ELIMINAR EMPLEADO
    $("#btn_eliminar_emp").on('click', ()=>{
        if(confirm(`Si elimina el empleado los usuarios que pertenescan a el tambien seran eliminados 
        ¿Desea continuar?`)){
            borrarElemento();
        }
    });

    //METODO GET BUSCACR EMPLEADO POR CEDULA
    $("#btn_buscar_nu").on('click', () => {
        let cedula = $cedula_nu.val();
        if (cedula !== "") {
            buscarEmpleado(cedula);
        } else {
            toastr.warning("Ingrese la cedula del empleado", "ADVERTENCIA");
        }
    });

    //METODO GET VER TODOS LOS EMPLEADOS
    $("#btn_verEmpleados").on('click', ()=>{
        verEmpleados(cargo,rol_empleado_Activo);
    });

    //METODO GET VER TODOS LOS USUARIOS
    $("#inf_usuarios").on('click',()=>{
        $("#btn_editar_user_form").hide();
        getUsuario((resp)=>{
            renderTablaUsuario(resp,cargo,rol_empleado_Activo);
        });
    });

    //METODO POST CREAR USUARIO
    $("#btn_usuario_form").on('click',()=>{
        let usuario = $usuario.val();
        let contraseña = $contraseña.val();
        let confirmar_contraseña = $confirmar_contraseña.val();
        if(usuario !== ""){
            if(contraseña === confirmar_contraseña){
                var formData = new FormData($formUsuario);
                formData.append('Empleado_cedula',asignarUsuario.cedula);
                formData.append('estado','1');
                if(confirm(`Asignar Usuario: ${usuario} al empleado: ${asignarUsuario.primer_nombre} ${asignarUsuario.apellido_paterno} 
                 con cedula: ${asignarUsuario.cedula}`)){
                    postUsuario(formData,()=>{
                        renderUsuario(usuario,asignarUsuario, cargo, rol_empleado_Activo);
                        limpiarUsuario();
                        $("#btn_usuario_form").hide();
                    });
                };
                limpiarUsuario();
            }else{
                toastr.error("Confirmacion de contraseña invalidad", "ADVERTENCIA");
            };
        }else{
            toastr.warning("El campo usuario es obligatorio", "ADVERTENCIA");
        };
    });

    //METODO PUT EDITAR USUARIO
    $("#btn_editar_user_form").on('click',()=>{
        let usuario = $usuario.val();
        let contraseña = $contraseña.val();
        let contraseña_anterior = auxUsuario[0].contraseña;
        let confirmar_contraseña = $confirmar_contraseña.val();
        if(usuario !== ""){
            if(contraseña === confirmar_contraseña){
                var formData = new FormData();
                formData.append('Usuario',usuario);
                formData.append('contraseña',contraseña);
                formData.append('Empleado_cedula',auxUsuario[0].Empleado_cedula[0].cedula);
                formData.append('estado','1');
                if(prompt('Contraseña Anterior') === contraseña_anterior ){
                    putUsuario(usuario,formData,()=>{
                        $(auxUsuario.item).closest('tr').remove();
                        renderUsuario(usuario,asignarUsuario, cargo, rol_empleado_Activo);
                        limpiarUsuario();
                        $usuario.prop('disabled',false);
                        $("#btn_editar_user_form").hide();
                    });
                }else{
                    toastr.error("Confirmacion de contraseña invalidad", "ADVERTENCIA");
                };
            }else{
                toastr.error("Confirmacion de contraseña invalidad", "ADVERTENCIA");
            };
        }else{
            toastr.warning("El campo usuario es obligatorio", "ADVERTENCIA");
        };
    });

});
function iniciar(){
    let cadVariables = location.search.substring(1);
    let usuario = cadVariables.split("=");
    getUsuarioU(usuario[1],(resp)=>{
        let user = resp.datos;
        cargo = user[0].Empleado_cedula[0].cargo_empleado;
        rol_empleado_Activo = user[0].Empleado_cedula[0].rol_empleado;
        $('#navDrop_nu').text(user[0].Usuario);
        let empleado = user[0].Empleado_cedula[0];
        if (empleado.foto !== '//' && empleado.foto !== null && empleado.foto !== undefined) {
            $("#fotoU_nu").attr('src',`/img/${empleado.foto}`);
        }
        console.log(user[0].Empleado_cedula[0]);
    });
};
//LIMPIAR CAMPOS DEL FORMULARIO EMPLEADOS nuevo_usuario.html
function limpiar() {
    $cedula_nu.val('');
    $rol_empleado_nu.val('Financiero');
    $primer_nombre_nu.val('');
    $segundo_nombre_nu.val('');
    $apellido_paterno_nu.val('');
    $apellido_materno_nu.val('');
    $telefono_nu.val('');
    $cargo_empleado_nu.val('Empleado');
    $('#foto_empleado').attr('src', 'https://via.placeholder.com/200x150');
}
//LIMPIAR  CAMPOS DEL FORMULARIO EMPLEADOS DE index.html
function limpiarIndex() {
    $cedula.val('');
    $rol_empleado.val('Financiero');
    $primer_nombre.val('');
    $segundo_nombre.val('');
    $apellido_paterno.val('');
    $apellido_materno.val('');
    $telefono.val('');
    $cargo_empleado.val('Empleado');
    $('#imgFotoE').attr('src', 'https://via.placeholder.com/200x150');
}
//LIMPIAR FORMULARIO USUARIO nuevo_usuario.html
function limpiarUsuario(){
    $usuario.val("");
    $contraseña.val("");
    $confirmar_contraseña.val("");
}
//VER LA INFORMACION DE LOS EMPLEADOS
function verEmpleados(cargo, rol) {
    getEmpleado((resp)=>{
        let html = " ";
            $.each(resp, (i, item) => {
                html = html
                    + '<tr>'
                    + `<th scope="row">${item.cedula}</th>`
                    + `<td>${item.rol_empleado}</td>`
                    + `<td>${item.primer_nombre}</td>`
                    + `<td>${item.apellido_paterno}</td>`;
                    if(cargo === 'Super Usuario' || (cargo === 'Jefe Area' && item.rol_empleado === rol)){
                        html += '<td>'
                        + `<button type="button" class="btn btn-primary button_tabla editarEvt" title="Editar empleado" data-cedula="${item.cedula}" onclick="editarElemento(this)">`
                        + '<span class="icon-pencil"></span>'
                        + '</button>'
                        + '</td>'
                        + '<td>'
                        + `<button lang="Nuevo usuario" type="button" class="btn btn-danger button_tabla nuevoUser" title="Nuevo usuario" data-empleado="${item.cedula}" onclick="nuevoUser(this)">`
                        + '<span class="icon-users"></span>'
                        + '</button>'
                        + '</td>'
                    } else {
                        html += `<td colspan="2"></td>`
                    }
                    html += '</tr>';
            });
            $body.html(html);
    });
}
//RENDERIZAR EMPLEADO
function renderEmpleado(item, cargo, rol){
    let html = '<tr>'
                + `<th scope="row">${item.cedula}</th>`
                + `<td>${item.rol_empleado}</td>`
                + `<td>${item.primer_nombre}</td>`
                + `<td>${item.apellido_paterno}</td>`
                if(cargo === 'Super Usuario' || (cargo === 'Jefe Area' && item.rol_empleado === rol)){
                    html += '<td>'
                    + `<button type="button" class="btn btn-primary button_tabla editarEvt" title="Editar empleado" data-cedula="${item.cedula}" onclick="editarElemento(this)">`
                    + '<span class="icon-pencil"></span>'
                    + '</button>'
                    + '</td>'
                    + '<td>'
                    + `<button lang="Nuevo usuario" type="button" class="btn btn-danger button_tabla nuevoUser" title="Nuevo usuario" data-empleado="${item.cedula}" onclick="nuevoUser(this)">`
                    + '<span class="icon-users"></span>'
                    + '</button>'
                    + '</td>'
                } else {
                    html += `<td colspan="2"></td>`
                }
                html += '</tr>';
                $body.append(html);
};
//BORRAR INFORMACION DE UN EMPLEADO
function borrarElemento() {
    let cedula = $cedula_nu.val();
        let direccion =`/Empleado/${cedula}`
        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset =utf-8",
            url: direccion,
            datoType: "json",
            success: (datos) => {
                toastr.success(datos.msg, 'INFORMACION');
                $("#btn_editar_emp").hide();
                $("#btn_eliminar_emp").hide();
                $(elemAux).closest('tr').remove();
                limpiar();
            },
            error: (estado, err) => {
                console.log("(funcion borrar elemento)NO SE PUDO BORRAR EL EMPLEADO " + err);
                console.log(estado);
                toastr.error("No se borro el empleado", 'ERROR');
            }
        });
}
//EDITAR LA INFORMACION DE UN EMPLEADO
function editarElemento(elem) {
    let cedula = $(elem).data('cedula');
    elemAux = elem;
    buscarEmpleado(cedula);
}
//BUSCAR INFORMACION DE UN EMPLEADO
function buscarEmpleado(cedula) {
    limpiar();
    getEmpleadoCedula(cedula,(resp)=>{
        if (resp.length < 0) {
            toastr.success("No se encontro empleado", 'INFORMACION');
        } else {
            $.each(resp, (i, item) => {
                $cedula_nu.val(item.cedula);
                $rol_empleado_nu.val(item.rol_empleado);
                $primer_nombre_nu.val(item.primer_nombre);
                $segundo_nombre_nu.val(item.segundo_nombre);
                $apellido_paterno_nu.val(item.apellido_paterno);
                $apellido_materno_nu.val(item.apellido_materno);
                $telefono_nu.val(item.telefono);
                $cargo_empleado_nu.val(item.cargo_empleado);
                fotoAux = item.foto;
                if (item.foto !== '//' && item.foto !== undefined) {
                    $('#foto_empleado').attr('src', `/img/${item.foto}`);
                }
                $("#file-select").attr('href', item.foto);
                $("#btn_editar_emp").show();
                $("#btn_eliminar_emp").show();
            });
        }
    });
}
//EVENTO NUEVO USUARIO DEL BTN DE LA TABLA EMPLEADO
function nuevoUser(elem) {
    $cedula = $(elem).data('empleado');
    getEmpleadoCedula($cedula,(resp)=>{
        if(resp.length>0){
            asignarUsuario = resp[0];
        }else{
            asignarUsuario.cedula = $cedula;
        }
    });
    $("#form_empleado_nu").hide();
    $("#tabla_empleados_nu").hide();
    $("#form_usuario_nu").show();
    $("#tabla_usuarios_nu").show();
    $("#btn_usuario_form").show();
    getUsuarioCedula($cedula,(resp)=>{
        renderTablaUsuario(resp,cargo,rol_empleado_Activo);
    });
}
//EVENTO EDITAR DE LA TABLA USUARIO
function evtEditarUsuario(item){
    let usuario = $(item).data('usuario');
    getUsuarioU(usuario,(resp)=>{
        auxUsuario = resp.datos;
        auxUsuario.item = item;
    });
    $usuario.val(usuario);
    $usuario.prop('disabled',true);
    $('#btn_usuario_form').hide();
    $("#btn_editar_user_form").show();
} 
//EVENTO BORRAR DE LA TABLA USUARIO
function evtBorrarUsuario(item){
    let usuario = $(item).data('usuario');
    if (confirm(`Seguro que desea eliminar usuario: ${usuario}`)) {
        let direccion = url + `/Usuario/${usuario}`
        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset =utf-8",
            url: direccion,
            datoType: "json",
            success: (datos) => {
                toastr.success(datos.msg, 'INFORMACION...');
                $(item).closest('tr').remove();
            },
            error: (estado, err) => {
                console.log("(funcion borrarUsuario)NO SE PUDO BORRAR EL USUARIO " + err);
                console.log(estado);
                toastr.error("No se pudo borrar el usuario", 'ERROR');
            }
        });
    };
}
//COLOCAR INFORMACION DE USUARIO EN LA TABLA
function renderTablaUsuario(usuarios,cargo,rol) {
    let html="";
    $.each(usuarios, (i, item) => {
        html += `<tr>`
            + `<th scope="row">${item.Empleado_cedula.cedula}</th>`
            + `<td>${item.Empleado_cedula.primer_nombre}</td>`
            + `<td>${item.Usuario}</td>`;
        if (cargo === "Super Usuario" || (cargo === 'Jefe Area' && item.Empleado_cedula.rol_empleado === rol)) {
            html += `<td>`
                + `<button type="button" class="btn btn-primary button_tabla editarEvenUser" title="Editar usuario" data-usuario="${item.Usuario}" data-cedula_empleado="${item.Empleado_cedula.cedula}" onclick="evtEditarUsuario(this);">`
                + `<span class="icon-pencil"></span>`
                + `</button>`
                + `</td>`
                + `<td>`
                + `<button type="button" class="btn btn-danger button_tabla borrarEventUser" title="Eliminar usuario" data-usuario="${item.Usuario}" onclick="evtBorrarUsuario(this);">`
                + `<span class="icon-bin"></span>`
                + `</button>`
                + `</td>`;
        } else {
            html += `<td colspan="2"></td>`
        }
        html += `</tr>`;
    });
    $bodyUsuario.html(html);
};
//COLOCAR UN EMPLEADO EN LA TABLA
function renderUsuario(usuario,empleado,cargo,rol){
    let html = `<tr>`
            + `<th scope="row">${empleado.cedula}</th>`
            + `<td>${empleado.primer_nombre}</td>`
            + `<td>${usuario}</td>`;
        if (cargo === "Super Usuario" || (cargo === 'Jefe Area' && empleado.Empleado_cedula.rol_empleado === rol)) {
            html += `<td>`
                + `<button type="button" class="btn btn-primary button_tabla editarEvenUser" title="Editar usuario" data-usuario="${usuario}" data-cedula_empleado="${empleado.cedula}" onclick="evtEditarUsuario(this);">`
                + `<span class="icon-pencil"></span>`
                + `</button>`
                + `</td>`
                + `<td>`
                + `<button type="button" class="btn btn-danger button_tabla borrarEventUser" title="Eliminar usuario" data-usuario="${usuario}" onclick="evtBorrarUsuario(this);">`
                + `<span class="icon-bin"></span>`
                + `</button>`
                + `</td>`;
        } else {
            html += `<td colspan="2"></td>`
        }
        html += `</tr>`;
    $bodyUsuario.append(html);
};
//PETICION AJAX-POST EMPLEADO
function postEmpleado(formData,callback){
    $.ajax({
        type: "POST",
        contentType: false,
        processData: false,
        url:'/Empleado',
        datoType: "json",
        data: formData,
        success: (resp) => {
            toastr.success(resp.msg, "INFORMACION...");
            callback();
        },
        error: (estado, err) => {
            console.log("NO SE PUDO GUARDAR EL EMPLEADO " + err);
            console.log(estado);
            toastr.error("No se pudo guardar el empleado", "ERROR");
        }
    });
};
//PETICION AJAX-GET EMPLEADO
function getEmpleado(callback){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset =utf-8",
        url:'/Empleado',
        datoType: "json",
        success: (resp) => {
            callback(resp);
        },
        error: (estado, err) => {
            console.log("(ver empleados) NO SE PUDO GUARDAR EL EMPLEADO " + err);
            console.log(estado);
            toastr.error("No se encontraron los empleados", 'ERROR');
        }
    });
};
//PETICION AJAX-GET-CEDULA EMPLEADO
function getEmpleadoCedula(cedula,callback){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset =utf-8",
        url:`/Empleado/${cedula}`,
        datoType: "json",
        success: (resp) => {
            callback(resp);
        },
        error: (estado, err) => {
            console.log("( empleados-getEmpleadoCedula )NO SE PUDO BUSCAR EL EMPLEADO " + err);
            console.log(estado);
            toastr.error('No se encontro el empleado', '¡ERROR!');
        }
    });
}; 
//PETICION AJAX-PUT-CEDULA EMPLEADO
function putEmpleado(cedula,formData,callback){
    $.ajax({
        type: "PUT",
        contentType: false,
        processData: false,
        url: `/Empleado/${cedula}`,
        datoType: "json",
        data: formData,
        success: (resp) => {
            if(resp.success){
                toastr.success(resp.msg, "INFORMACION");
            }else{
                toastr.error("No se edito el empleado", '¡ERROR!');
            }
            callback(resp.success);
        },
        error: (estado, err) => {
            console.log("(btn_editar_emp) NO SE PUDO EDITAR EL EMPLEADO " + err);
            console.log(estado);
            toastr.error("No se pudo editar el empleado", '¡ERROR!');
        }
    });
};
//PETICION AJAX-GET USUARIO
function getUsuario(callback){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset =utf-8",
        url: url+'/Usuario',
        datoType: "json",
        success: (resp) => {
            callback(resp);
        },
        error: (estado, err) => {
            console.log("(empleados-getUsuario) NO SE ENCONTRARON USUARIOS" + err);
            console.log(estado);
            toastr.error("No se encontraron usuarios", 'ERROR');
        }
    });
};
//PETICION AJAX-GET/USUARIO USUARIO
function getUsuarioU(usuario, callback){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset =utf-8",
        url: url+`/Usuario/${usuario}`,
        datoType: "json",
        success: (resp) => {
            callback(resp);
        },
        error: (estado, err) => {
            console.log("(empleados-getUsuario) NO SE ENCONTRARON USUARIOS" + err);
            console.log(estado);
            toastr.error("No se encontraron usuarios", 'ERROR');
        }
    });
};
//PETICION AJAX-GET/CEDULA_EMPLEADO USUARIO
function getUsuarioCedula(cedula,callback){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset =utf-8",
        url: url + `/Usuario/Emp/${cedula}`,
        datoType: "json",
        success: (resp) => {
            callback(resp);
        },
        error: (estado, err) => {
            console.log("NO SE PUDO ENCONTRAR USUARIO " + err);
            console.log(estado);
            toastr.error("NO se encontraron usuarios", 'ERROR');
        }
    });
};
//PETICION AJAX-POST USUARIO
function postUsuario(formData, callback){
    $.ajax({
        type: "POST",
        contentType: false,
        processData: false,
        url: url+'/Usuario',
        datoType: "json",
        data: formData,
        success: (resp) => {
            toastr.success(resp.msg, "INFORMACION...");
            callback();
        },
        error: (estado, err) => {
            console.log("(empleados-postUsuario)NO SE GUARDO EL USUARIO: " + err);
            console.log(estado);
            toastr.error("No se guardo el usuario", "ERROR");
        }
    });
};
//PETICION AJAX-PUT USUARIO
function putUsuario(usuario,formData, callback){
    $.ajax({
        type: "PUT",
        contentType: false,
        processData: false,
        url: url+`/Usuario/${usuario}`,
        datoType: "json",
        data: formData,
        success: (resp) => {
            toastr.success(resp.msg, "INFORMACION...");
            callback();
        },
        error: (estado, err) => {
            console.log("(btn_editar_emp) NO SE PUDO EDITAR EL USUARIO" + err);
            console.log(estado);
            toastr.error("No se pudo editar el Usuario", '¡ERROR!');
        }
    });
}