var interval = setInterval (function(){
	if (localStorage["nick"] != undefined)
	{
		clearInterval(interval);
		var resp= {
			id_usuario : localStorage["id_usuario"],
			nick: localStorage["nick"],
			token: localStorage["token"],
			password : localStorage["password"],
		}
		if (localStorage["registrado"] != undefined )
			self.port.emit('registered', resp);
		else
			self.port.emit('loged', resp);
	}
}, 1000);
localStorage.removeItem("password");
localStorage.removeItem("id_usuario");
localStorage.removeItem("token");
localStorage.removeItem("nick");
localStorage.removeItem("registrado");

self.port.emit('idioma', navigator.language);

document.getElementById('demoImg').addEventListener('click',function(){
    self.port.emit('goDemo','goDemo');
});

