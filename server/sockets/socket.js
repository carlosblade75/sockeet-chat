const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');
const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {


        if (!data.nombre || !data.sala) {
            return callback({
                ok: false,
                err: {
                    message: 'El nombre/sala es necesario'
                }
            });
        }

        // si no hacemos join, nos unimos a una sala de nombre el client.ID. Con lo cual habrá una por cada usuario
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        let personas = usuarios.getPersonasPorSala(data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', personas);
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} entro al chat`));

        // esto va al cliente que se agregó
        callback(personas);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió del chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('crearMensaje', (data, callback) => {

        console.log(data);

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        // esto va a todos los clientes de la sala pero no parael que envió el mensaje
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        // esto va al cliente que que envió el mensaje
        callback(mensaje);

    });

    client.on('mensajePrivado', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        // con broadcast.to() enviamos a un cliente en concreto
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);

        callback(mensaje);

    });

});