const empleados = require('../controladores/Empleados');
const usuario = require('../controladores/Usuarios');
 
module.exports = (app) => {
    app.get('/Empleado', empleados.buscarEmpleados);
    app.post('/Empleado', empleados.guardarEmpleado);
    app.put('/Empleado/:cedula', empleados.editarEmpleado);
    app.get('/Empleado/:cedula', empleados.buscarEmpleadoId);
    app.delete('/Empleado/:cedula',empleados.eliminarEmpleado); 

    app.get('/Usuario', usuario.buscarUsuarios);
    app.get('/Usuario/:usuario', usuario.buscarUsuario);
    app.get('/Usuario/Emp/:cedula', usuario.buscarUsuarioCedula);
    app.post('/Usuario', usuario.guardarUsuario);
    app.put('/Usuario/:usuario', usuario.editarUsuario);
    app.delete('/Usuario/:usuario', usuario.eliminarUsuario); 
};