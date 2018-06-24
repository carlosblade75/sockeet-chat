var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var nombre = params.get('nombre');
var sala = params.get('sala');
// Referencias de JQuery

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var txtSearch = $('#txtSearch');

// Funciones para renderizar usuarios

function renderizarUsuarios(personas) {

    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        if (personas[i].nombre != nombre) {
            html += '<li><div>';
            html += '    <a data-id="' + personas[i].id + '" href="chat.private.html?id=' + personas[i].id + '&sala=' + personas[i].id + '&nombre=' + personas[i].nombre + '"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
            html += '</li></div>';
        }
    }

    divUsuarios.html(html);
}

function renderizarMensaje(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);

    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '    <h5>Yo</h5>';
        html += '    <div class="box bg-light-info">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';

        if (mensaje.nombre != 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '<div class="chat-content">';
        html += '    <h5>' + mensaje.nombre + '</h5>';
        html += '    <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '<li>';

    }

    divChatbox.append(html);
}

// Listener
divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});

txtSearch.on('input', function(e) {
    //console.log(txtSearch.val());
    $("#divUsuarios div span").each(function() {

        var name = $(this).html();
        name = name.substring(0, name.indexOf('<small')).toLowerCase();
        console.log(name);
        var inputValue = txtSearch.val().toLowerCase();
        // console.log($(this).parent().parent().html());
        if (name.indexOf(inputValue) === -1) {

            $(this).parent().hide();
        } else {
            $(this).parent().show();
        }

    });
});

formEnviar.on('submit', function(e) {

    e.preventDefault(); // evita que siga el evento y haga submit

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {

        txtMensaje.val('').focus();

        renderizarMensaje(mensaje, true);
        scrollBottom();
    });

});

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}