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




// var interval = setInterval (function(){
//     listaTablones = [];
//     $('.tabLabel').each(function(){listaTablones.push($(this).text())});
//     auxStr = listaTablones.toString();
//     if (listaStr != auxStr)
//     {
//        self.port.emit('cambioTablones',auxStr);
//     }
//     listaStr = auxStr;
// }, 5000);
// var listaTablones = new Array();
// var listaStr = '';



