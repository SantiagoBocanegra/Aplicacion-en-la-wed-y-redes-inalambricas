var url = "http://localhost:3000";
//CAMPOS DEL DOCUMENTO  index.html
var $usuario = $("#usuario");
var $contraseña = $("#contraseña");

$(document).ready(() => {

    $("#btn_login").on('click', () => {
        let usuario = $usuario.val();
        let contraseña = $contraseña.val();
        if (usuario !== "") {
            $.ajax({
                type: "GET",
                contentType: "application/json; charset =utf-8",
                url: url + `/Usuario/${usuario}`,
                datoType: "json",
                success: (resp) => {
                    datos = resp.datos[0];
                    if (datos !== undefined) {
                        if (datos.Usuario === usuario && datos.contraseña === contraseña) {
                            $("#menu_login").hide();
                            $("#menu_principal").show();
                            $("#barra_superior").show();
                            $("#navDrop").text(usuario);
                            $("#fotoU").attr('src');
                            let empleado  = datos.Empleado_cedula[0];
                            if(empleado.foto !== '//'){
                                $("#fotoU").attr('src',empleado.foto);
                            }
                        } else {
                            toastr.error('Usuario o contraseña incorrectas', '¡ERROR!');
                        }
                    }
                },
                error: (estado, err) => {
                    console.log("( event:click()  btn -> contraseña) NO SE PUDO BUSCAR EL EMPLEADO " + err);
                    console.log(estado);
                    toastr.error('No se busco la foto del empleado', '¡ERROR!');
                }
            });
        } else {
            toastr.error('El campo usuario no puede estar vacio', '¡ERROR!');
        }
    });

    $usuario.on('change', () => {
        $("#foto_empleado_index").attr('src', 'https://via.placeholder.com/300');
    });

    $("#contraseña").on('click', () => {
        let usuario = $usuario.val();
        if (usuario !== "") {
            $.ajax({
                type: "GET",
                contentType: "application/json; charset =utf-8",
                url: url + `/Usuario/${usuario}`,
                datoType: "json",
                success: (resp) => {
                    datos = resp.datos[0];
                    if (datos === undefined) {

                    } else {
                        let empleado = datos.Empleado_cedula[0];
                        if (empleado.foto !== '//') {
                            $("#foto_empleado_index").attr('src', empleado.foto);
                        };
                    }
                },
                error: (estado, err) => {
                    console.log("( event:click()  btn -> contraseña) NO SE PUDO BUSCAR EL EMPLEADO " + err);
                    console.log(estado);
                    toastr.error('No se busco la foto del empleado', '¡ERROR!');
                }
            });
        } else {
            toastr.error('El campo usuario no puede estar vacio', '¡ERROR!');
        }
    });








});
