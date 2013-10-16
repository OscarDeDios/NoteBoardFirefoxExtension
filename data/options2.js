     $(document).ready(function() {
     	$('#nick').focus();
		$("#titulo").text(getMessage("extName"));
		if (navigator.language != 'es' && navigator.language != 'es-ES')
		{
			$("#labUser").text('Nick or Mail');
			$("#signupLabel").text('Nick');
			$("#confirmPass").text('Repeat Password');

			document.getElementById("buttonSubmitReg").value ='Sign up';
			$("#mensReg").text('Sign up');
			$("#logBot").text('Return to login');
			$("#buttonReg").text('Sign up');
			$("#lostPwd").text('forgot the password?');
			$("#fb-button span").text('Log in with Facebook');
			$('#mens1').text("This extension allows you to capture and save web content such as notes on a virtual board. Sign up for FREE in ");
			$('#mens2').text(" so you can access your notes from any browser (including mobile) and also from the android application in ");
			$('#mens3').text("If you want to test the application before registering click ");

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

	    // $('#fb-login').on("click",function(){
	    //     $('#black_overlay').show();
	    //     //loginFacebook();
	    // });
	});



function callback()
{
	if (navigator.language == 'es' || navigator.language == 'ca' || navigator.language == 'es-ES')	$('#capaContenedora').text("Login Correcto");
	else $('#capaContenedora').text("Login OK");
}

