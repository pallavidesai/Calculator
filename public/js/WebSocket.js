    $(window).on("load", function () {
      $('#output').hide();
    });

$(function () {
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    var myColor = false;
    var myName = false;

    //mozilla has built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if WebSocket not supported
    if (!window.WebSocket) {
        content.html($('<p>',
            { text: 'Browser does not support WebSockets.' }
        ));
        input.hide();
        $('span').hide();
        return;
    }

    // open connection
    var host = location.origin.replace(/^http/, 'ws');
    var connection = new WebSocket(host);
    connection.onopen = function () {
        // first message is name
        input.removeAttr('disabled');
        status.text('');
    };

    connection.onerror = function (error) {
        content.html($('<p>', {
            text: 'Something went wrong!!.'
        }));
    };

    connection.onmessage = function (message) {
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }

        if (json.type === 'color') {
            myColor = json.data;
            input.removeAttr('disabled').focus();
        }
        else if (json.type === 'history') {
            content.empty();
            for (var i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                    json.data[i].color, new Date(json.data[i].time));
            }
        }
        else if (json.type === 'message') {
            input.removeAttr('disabled');
            addMessage(json.data.author, json.data.text,
                json.data.color, new Date(json.data.time));
        }
        else {
            console.log('Invalid Jason', json);
        }

    };

    // When "=" button pressed 
    input.change(function () {
        var msg = document.getElementById("input").value;
        connection.send(msg);
        $(this).val('');
        input.attr('disabled', 'disabled');
        if (myName === false) {
            myName = msg;
        }
    });

    // When username submitted
    $('#formsubmit').click(function () {
        $('#nameContainer').hide();
        $('#output').show();
        var msg = document.getElementById("name").value;
        $('h2').append(msg);
        connection.send(msg);
        $(this).val('');
        input.attr('disabled', 'disabled');
        if (myName === false) {
            myName = msg;
        }
    });

    // Show error message if server not reachable 
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val(
                'Unable to communicate with the WebSocket server.');
        }
    }, 3000);

    function addMessage(author, message, color, dt) {
        content.prepend('<p><span style="color:' + color + '">'
            + author + '</span> @ ' + (dt.getHours() < 10 ? '0'
                + dt.getHours() : dt.getHours()) + ':'
            + (dt.getMinutes() < 10
                ? '0' + dt.getMinutes() : dt.getMinutes())
            + ': ' + message + '</p>');
    }
});