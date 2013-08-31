if (document.getElementById('logoutHeader'))
	document.getElementById('logoutHeader').addEventListener('click',function(){
    	self.port.emit('injectLogout','injectLogout');
	});