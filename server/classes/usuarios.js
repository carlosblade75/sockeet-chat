class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {

        let persona = {
            id, // es lo mismo id = id
            nombre,
            sala
        };

        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {

        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {

        let personas = this.personas.filter(persona => persona.sala === sala);

        return personas;
    }

    borrarPersona(id) {

        let pesonaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => persona.id != id); // devolvemos todas las personas que no correspondan a la expresión

        return pesonaBorrada;
    }
}

module.exports = {
    Usuarios
}