self.port.on('datosLogin', function(message) {
   if (document.URL.indexOf('loginPageFire') > -1)
   {
        var param = 'nick=' + encodeURIComponent(message.nick);
        param += '&password=' + md5(message.password);
        param += '&rememberme=true';

        $.ajax({
            type: "POST",
            url: 'conectarUsuario2.php',
            data: param,
            timeout: 20000,
            cache: false,
            success: function(answer){
                    if ($.trim(answer) != 'OK') $('#capaContenedora').text('ERROR! ' + answer);
                    else document.location.href="firefoxBoard";
                },
            error: function(objeto, quepaso, otroobj){
                console.log(quepaso);
                },
        });
    }
});

self.port.on('loginFb', function(message) {
   if (document.URL.indexOf('loginPageFire') > -1)
   {
        var interval = setInterval (function(){
            if (document.getElementById('fb-login'))
            {
                //clearInterval(interval);
                $('#fb-login').click();
            }
        }, 1000);
    }
});


