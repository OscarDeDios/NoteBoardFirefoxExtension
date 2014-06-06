self.port.on('clip', function(args) {

  nota = args.clip
  var numPost = localStorage["totalPost"];
  localStorage["tipoA"+numPost] = nota.tipoA;
  localStorage["X"+numPost] = nota.X;
  localStorage["Y"+numPost] = nota.Y;
  localStorage["postit"+numPost] = nota.postit;
  localStorage["width"+numPost] = nota.width;
  localStorage["height"+numPost] = nota.height;
  localStorage["fecha"+numPost] = nota.fecha;
  localStorage["tablon"+numPost] = nota.tablon;
  localStorage["treeId" + numPost] = nota.treeId;
  localStorage["totalPost"]++;

  if (((localStorage["tablon"+numPost] == undefined || localStorage["tablon"+numPost] == "undefined") && localStorage["tablonActual"] == 1) ||
    localStorage["tablon"+numPost] == localStorage["tablonActual"]) //4.0
  {
    if (localStorage["tablonActual"] == 1)
    {
      $('#tablon2').click();
      $('#tablon1').click();
    }
    else
    {
      var tabAct = localStorage["tablonActual"];
      $('#tablon1').click();
      $('#tablon'+tabAct).click();
    }
  }
})

$('#logoutFire').show();
$('#logoutFire').on('click',function(){
    self.port.emit('logout','logout');
    window.open('salir.php', '_self')
});

var interval = setInterval (function(){
    listaTablones = [];
    $('.tabLabel').each(function(){
      if ($(this).attr('id') != 'tab5LabelAdd')
        listaTablones.push($(this).text())
    });
    auxStr = listaTablones.toString();
    listaTablones2 = [];
    $('.tabPaneles2').each(function(){listaTablones2.push($(this).text())});
    auxStr2 = listaTablones2.toString();
    if (listaStr != auxStr)
    {
       self.port.emit('cambioTablones',auxStr);
    }
    if (listaStr2 != auxStr2 && auxStr2 != '')
    {
       self.port.emit('cambioTablones',auxStr2);
    }
    listaStr = auxStr;
    listaStr2 = auxStr2;
}, 5000);
var listaTablones = new Array();
var listaStr = '';
var listaTablones2 = new Array();
var listaStr2 = '';


/*------------------------------- AGENDA ---------------------------------------------------*/
var intervalAgenda = setInterval (function(){
  mirarAgenda();
}, 300000);
setTimeout(mirarAgenda,10000);


function mirarAgenda()
{
    for (var i=0;i<localStorage["totalPost"];i++) {
    if (localStorage['calendar'+i] != undefined && localStorage['calendar'+i] != '' && localStorage['calendar'+i] != "undefined")
    {
      var d = new Date(localStorage['calendar'+i].substr(0,10));
      var actual = new Date();
      d.setHours(actual.getHours());
      d.setMinutes(actual.getMinutes());
      d.setSeconds(actual.getSeconds());
      actual.setMilliseconds(0);
      var horaPasada = false;
      if (localStorage['calendar'+i].length > 10)
      {
        var horaSelec =  localStorage['calendar'+i].substr(11,2);
        var minSelec =  localStorage['calendar'+i].substr(14,2);
      }

      if (d.getYear() == actual.getYear() && d.getMonth() == actual.getMonth() && d.getDate() == actual.getDate())
      {
        if (actual.getHours() > horaSelec || (actual.getHours() == horaSelec && actual.getMinutes() >= minSelec))
          horaPasada = true;
      }

      if (d < actual || horaPasada)
      {
          nuevaNotificacion(i)
      }
    }
  }
}

function nuevaNotificacion(numPost)
{
  //https://github.com/GoogleChrome/chrome-app-samples/blob/master/rich-notifications/main.js
  var temp = document.createElement('div');
  $(temp).html(localStorage['postit'+numPost]);

  var message = temp.textContent;
  var tipo = 0;

  var imagenes = temp.getElementsByTagName('img');

  /* -- Imágenes --*/
  for (var i=0;i<imagenes.length;i++)
  {
      var linkImg = imagenes[i].src;
      if (linkImg.indexOf('www.noteboardapp.com') > -1 && imagenes.length == 1 && message == '')
      {
          linkImg = linkImg.replace("http://www.noteboardapp.com","..");
          tipo = 1;
      }
      if (imagenes[i].height > 100) message += linkImg + ' ';
  }

  /* -- Lista de tareas --*/
  if (temp.getElementsByTagName('ul').length > 0)
  {
      message = '';
      var list = temp.getElementsByTagName('li');
      var items = new Array();
      for (var i=0;i<list.length;i++)
      {
          message += list[i].textContent + '||';
      }
      message = message.substr(0,message.length-2);
      tipo = 2;
  }
  message = message.trim();

  /* -- Video embeded --*/
  if (message == '')
  {
      $(temp).find('iframe').each(function(){
          message += $(this).attr('src').replace("?wmode=transparent","") + ' ';
      });
      if ($(temp).find('iframe').length == 1) tipo = 3;
  }
  if (message == '') return;

  var data = {
    message: message,
    numPost: numPost
  }

  self.port.emit('creaNotificacion',data);

}

self.port.on('notificationClicked', function(args) {
  var numPost = args.notificationClicked;
  localStorage.removeItem('calendar' + numPost);
  localStorage["updated" + numPost] = 'true';
});
