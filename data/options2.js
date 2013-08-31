     $(document).ready(function() {
     	$('#nick').focus();
		$("#titulo").text(getMessage("extName"));
		if (navigator.language != 'es' && navigator.language != 'es-ES')
		{
			$("#labUser").text('Nick or Mail');
			$("#signupLabel").text('Nick');
			$("#confirmPass").text('Repeat Password');
			document.getElementById("buttonReg").value ='   Sign up';
			$("#lostPwd").text('forgot the password?');
			$("#fb-button span").text('Log in with Facebook');
			//$('#mensLogin').html(getMessage("confSincro3"));
		}
		document.getElementById("nick").value = "";
		document.getElementById("pwd").value = "";
		$('#formUser').on("submit",function(){
			loginUsuario(callback);
			return false;
		});
		$('#formUserReg').on("submit",function(){
			registraUsuario();
			return false;
		});
		$('#buttonReg').on('click',function(){
			$('#capaContenedora').text('');
			$('#formUser').slideUp(400,function(){$('#formUserReg').slideDown()});
		});
		$('#logBot').on('click',function(){
			$('#capaContenedora').text('');
			$('#formUserReg').slideUp(400,function(){$('#formUser').slideDown()});
		});
		$('#lostPwd').on('click',enviaPassword);

	    $('#fb-login').on("click",function(){
	        $('#black_overlay').show();
	        loginFacebook();
	    });
	});



function callback()
{
	if (navigator.language == 'es' || navigator.language == 'ca' || navigator.language == 'es-ES')	$('#capaContenedora').text("Login Correcto");
	else $('#capaContenedora').text("Login OK");
}

