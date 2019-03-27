//FUNCIONES QUE SE ENCARGAN DEL MANEJO DE LOS DATOS CON SOCKET
$(function () {
    const socket = io();

    //Obtener los elementos del formulario
    let $btnFormulario = $('#btnFormularioObjetivos');
    

    //Eventos
    $btnFormulario.submit(e => {
        e.preventDefault();
        let formObjectivo = {
            objetivo: 'HOLA ESTO ES UN SOCKET'
        }
        socket.emit('Guardar Datos', formObjectivo);
    });

    //Eventos del servidor
    socket.on('Nuevo Objetivo', datos => {
        let html = '<article class="post">'
            + '<!--Imagen del creador del articulo-->'
            + '<a href="#" class="thumb">'
            + '<img class="img-thumbnail" src="https://via.placeholder.com/300" alt="foto creardor">'
            + '</a>'
            + '<h2 class="post-title">'
            + '<!--Objetivo del articulo-->'
            + `<a href="#">${datos.objetivo}</a>`
            + '</h2>'
            + '<p>'
            + '<!--Fecha creacion del objetivo-->'
            + '<span class="post-info">Fecha:</span>'
            + '<br/>'
            + '<!--Autor del objetivo-->'
            + '<span class="post-info">Autor:</span>'
            + '<br/>'
            + '<!--Rol del Autor-->'
            + '<span class="post-info">Rol:</span>'
            + '</p>'
            + '<!--Opcional si tiene permiso el usuario-->'
            + '<div class="contenedor-botones">'
            + '<!--Boton Ediatr-->'
            + '<button type="button" class="btn btn-primary" id="btnEditar">Editar</button>'
            + '<!--Boton Eliminar-->'
            + '<button type="button" class="btn btn-danger" id="btnEliminar">Eliminar</button>'
            + '</div>'
            + '</article>'
        $cuerpoArticulos.append(html);
    });
})