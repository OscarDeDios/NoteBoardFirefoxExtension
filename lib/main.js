var Request = require("sdk/request").Request;
var widgets = require("sdk/widget");
var data = require("sdk/self").data;
var menu = require("sdk/context-menu");
var ss = require("sdk/simple-storage");
var toolbarbutton = require("toolbarbutton");
var button;
var tabs = require("sdk/tabs");
var windows = require("sdk/windows").browserWindows;
var worker;
var panel;
var listenFacebook = false;

exports.main = function(options) {


// @return object
function createButton(options) {
    return toolbarbutton.ToolbarButton({
        id: "NoteBoard",
        label: "Note Board",
        tooltiptext: "Note Board",
        image: data.url("noteboardMini.png"),
        onCommand: function() {
            abrePopup();
        }
    });
}

button = createButton(options);
// On install moves button into the toolbar

if (options.loadReason == "install")
{
    button.moveTo({
        toolbarID: "nav-bar",
        insertbefore: "home-button",
        forceMove: true
    });
}

widget = new widgets.Widget({
    id: "btn-noteBoard",
    label: "NoteBoard",
    //contentURL: "http://www.mozilla.org/favicon.ico",
    contentURL: data.url("NoteBoard.png"),
    onClick: function() {
        abrePopup();
    }
});



/*------------------------------------------------------------------------*/
/* ----------------------- INICIO ----------------------------------------*/
/*------------------------------------------------------------------------*/
function abrePopup()
{
    if (!ss.storage.password)
    {
        abreLogin();
    }
    else
    {
        var tabOpen = false;
        for each (var tab in tabs)
        {
            if (tab.url == "http://www.noteboardapp.com/board.php")
            {
                tabOpen = true;
                tab.activate();
            }
        }
        if (!tabOpen) tabs.open("http://www.noteboardapp.com/board.php");
    }
}

function abreLogin()
{
      panel = require("sdk/panel").Panel({
      width: 900,
      height: 700,
      contentURL: data.url("options2.html"),
      contentScriptFile: data.url("injectLogin.js"),
    });

    listenFacebook = true;
    panel.show();
    panel.port.on("idioma", function(idioma){
        ss.storage.idioma = idioma;
        crearMenus();
    });
    panel.port.on("loged", function(datos){
        if (!ss.storage.password) var primera = true;
        else var primera = false;
        ss.storage.id_usuario = datos.id_usuario;
        ss.storage.password = datos.password;
        ss.storage.nick = datos.nick;
        ss.storage.token = datos.token;

        panel.hide();
        if (primera) tabs.open("http://www.noteboardapp.com/loginPageFire.php");
        listenFacebook = false;
    });
    panel.port.on("registered", function(datos){
        if (!ss.storage.password) var primera = true;
        else var primera = false;
        ss.storage.id_usuario = datos.id_usuario;
        ss.storage.password = datos.password;
        ss.storage.nick = datos.nick;
        ss.storage.token = datos.token;

        panel.hide();
         if (primera) tabs.open("http://www.noteboardapp.com/loginPageFireReg.php");
        listenFacebook = false;
    });
    panel.port.on("goDemo", function(datos){
        if (!ss.storage.password) var primera = true;
        else var primera = false;
        panel.hide();
        if (primera) tabs.open("http://www.noteboardapp.com/board.php?user=demo");
        listenFacebook = false;
    });
    panel.port.on("loginFacebook", function(datos){
        listenFacebook = true;
        windows.open("https://www.facebook.com/dialog/oauth?client_id=339270982866129&response_type=token&redirect_uri=http://www.facebook.com/connect/login_success.html&scope=email");
    });
}

    tabs.on("ready", function onOpen(tab) {
    if (tab.url == 'http://www.noteboardapp.com/board.php')
    {
         worker = tab.attach({
            contentScriptFile:  [data.url("jquery/jquery.js"),
                                data.url("listeningFirefox.js")                     ]
        });
        worker.port.on('logout', function(param){
            delete ss.storage.id_usuario;
            delete ss.storage.nick;
            delete ss.storage.token;
            delete ss.storage.password;
            delete ss.storage.listaTablones;
            delete ss.storage.id_fb;
            crearMenus();
        });
        worker.port.on('cambioTablones', function(param){
            ss.storage.listaTablones = param.split(',');
            crearMenus();
        });

    }
    if (tab.url == 'http://www.noteboardapp.com/loginPageFire.php')
    {
            worker = tab.attach({
                contentScriptFile:  [data.url("jquery/jquery.js"),
                                     data.url("varios.js"),
                                     data.url("listeningLogin.js")
                                    ]
            });
            var log = {
                id_usuario : ss.storage.id_usuario,
                nick : ss.storage.nick,
                password: ss.storage.password,
                token : ss.storage.token
            }
            if (ss.storage.id_fb)
                worker.port.emit('loginFb',log);
            else
                worker.port.emit('datosLogin',log);
    }
    if (tab.url == 'http://www.noteboardapp.com/loginPageFireReg.php')
    {
            worker = tab.attach({
                contentScriptFile:  [data.url("jquery/jquery.js"),
                                     data.url("varios.js"),
                                     data.url("listeningLoginReg.js")
                                    ]
            });
            var log = {
                id_usuario : ss.storage.id_usuario,
                nick : ss.storage.nick,
                password: ss.storage.password,
                token : ss.storage.token
            }
            if (ss.storage.id_fb)
                worker.port.emit('loginFb',log);
            else
                worker.port.emit('datosLogin',log);
    }
    if (tab.url.indexOf('noteboardapp.com') > -1 && tab.url.indexOf('board.php') == -1)
    {
            worker = tab.attach({
                contentScriptFile:  [data.url("injectLogout.js")
                                    ]
            });
            worker.port.on('injectLogout', function(param){
                delete ss.storage.id_usuario;
                delete ss.storage.nick;
                delete ss.storage.token;
                delete ss.storage.password;
                delete ss.storage.listaTablones;
                delete ss.storage.id_fb;
                crearMenus();
            });
    }
    if (tab.url == 'http://www.noteboardapp.com/loginPage.php')
    {
    // si llego a esta página es que se ha hecho logout o ha caducado la sesión.
        delete ss.storage.id_usuario;
        delete ss.storage.nick;
        delete ss.storage.token;
        delete ss.storage.password;
        delete ss.storage.listaTablones;
        delete ss.storage.id_fb;
        crearMenus();
    }
    /* ------------------------ FACEBOOK LOGIN -----------------------------------*/
    if (listenFacebook && tab.url.indexOf('www.facebook.com/connect/login_success.html') > -1)
    {
        var token;
        var expires;

        if (tab.url.indexOf('#access_token') > -1)
            {
                token = tab.url.substring(tab.url.indexOf('#access_token=') + 14, tab.url.indexOf('&expires'));
                if (tab.url.indexOf('&base_domain') > -1)
                    expires = tab.url.substring(tab.url.indexOf('&expires_in=') + 12, tab.url.indexOf('&base_domain'));
                else
                    expires = tab.url.substring(tab.url.indexOf('&expires_in=') + 12);

                var graphUrl = "https://graph.facebook.com/me?access_token=" + token;


                Request({
                    url: graphUrl,
                    onComplete: function (answer) {
                        var facebookData = answer.json;
                        loginFb(facebookData,token);
                        //ss.storage.dataLoged = new dataLoged(facebookData.id,token,expires);
                    }
                }).get();
                tab.close();
                                 //chrome.tabs.remove(tabid);
            }

            listenFacebook = false;

        }
    });


function loginFb(facebookData,token)
{
  var url = 'http://www.noteboardapp.com/api/loginFb.php';
  var param = 'nick=' + encodeURIComponent(facebookData.name);
  param += '&fbId=' + encodeURIComponent(facebookData.id);
  param += '&fbToken=' + encodeURIComponent(token);
  param += '&firefox=true';

  Request({
    url: url,
    content: param,
    onComplete: function(answer){
        var resp = answer.json;
        if (resp.isSuccess)
        {
            ss.storage.id_usuario = resp.id_usuario;
            ss.storage.id_fb = facebookData.id;
            ss.storage.password = 'fbLogin';
            ss.storage.nick = resp.nick;
            ss.storage.token = resp.token;

            panel.hide();
            if (resp.nuevoReg) tabs.open("http://www.noteboardapp.com/loginPageFireReg.php");
            else tabs.open("http://www.noteboardapp.com/loginPageFire.php");
            // if (resp.nuevoReg) tabs.open("http://www.noteboardapp.com/paypalPage3.php");
            // else tabs.open("http://www.noteboardapp.com/board.php");
        }
    }
  }).post();
}

   crearMenus();


/*************************************************************************************************/
/************************************ MENUS         **********************************************/
/*************************************************************************************************/
var tabList = new Array();
var menuImg;

function crearMenus()
{
    if (typeof menuImg == 'object') menuImg.destroy();
    if (typeof menuPage == 'object') menuPage.destroy();
    if (typeof menuSelection == 'object') menuSelection.destroy();
    if (typeof menuLink == 'object') menuLink.destroy();
    if (typeof menuImg2 == 'object') menuImg2.destroy();
    if (typeof menuPage2 == 'object') menuPage2.destroy();
    if (typeof menuSelection2 == 'object') menuSelection2.destroy();
    if (typeof menuLink2 == 'object') menuLink2.destroy();


    if (ss.storage.listaTablones)
    {
        if (ss.storage.idioma && (ss.storage.idioma == 'es' || ss.storage.idioma == 'es-ES'))
        {
            var mensMenu1 = 'Guarda Imagen';
            var mensMenu2 = 'Guarda Página';
            var mensMenu3 = 'Guarda Selección';
            var mensMenu4 = 'Guarda Link';
            var mensMenuCon = ' en ';
        }
        else
        {
            var mensMenu1 = 'Save Image';
            var mensMenu2 = 'Save Page';
            var mensMenu3 = 'Save Selection';
            var mensMenu4 = 'Save Link';
            var mensMenuCon = ' in ';
        }

        menuImg = menu.Menu({
            label: mensMenu1,
            image: data.url("NoteBoard.png"),
            context: [menu.URLContext("*"), menu.SelectorContext("img")]
        });

        menuPage = menu.Menu({
            label: mensMenu2,
            image: data.url("NoteBoard.png"),
            context: [menu.URLContext("*"), menu.PageContext()]
        });

        menuSelection = menu.Menu({
            label: mensMenu3,
            image: data.url("NoteBoard.png"),
            context: [menu.URLContext("*"), menu.SelectionContext()],
        });

        menuLink = menu.Menu({
            label: mensMenu4,
            image: data.url("NoteBoard.png"),
            context: [menu.URLContext("*"), menu.SelectorContext("[href]")],
        });
       for (var i=0;i< ss.storage.listaTablones.length;i++)
        {
            var numtab = i + 1;
            numtab += '';
            menuImg2 =  menu.Item({
                        label: mensMenu1 + mensMenuCon + ss.storage.listaTablones[i],
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.SelectorContext("img")],
                        contentScript: getImage(),
                        onMessage: saveImage,
                        data: numtab
                      });
            menuImg.addItem(menuImg2);

            menuPage2 =  menu.Item({
                        label: mensMenu2 + mensMenuCon + ss.storage.listaTablones[i],
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.PageContext()],
                        contentScript: getPage(),
                        onMessage: savePage,
                        data: numtab
                      });
            menuPage.addItem(menuPage2);

            menuSelection2 =  menu.Item({
                        label: mensMenu3 + mensMenuCon + ss.storage.listaTablones[i],
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.SelectionContext()],
                        contentScript: getSelection(),
                        onMessage: saveSelection,
                        data: numtab
                      });
            menuSelection.addItem(menuSelection2);

            menuLink2 =  menu.Item({
                        label: mensMenu4 + mensMenuCon + ss.storage.listaTablones[i],
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.SelectorContext("[href]")],
                        contentScript: getLink(),
                        onMessage: saveLink,
                        data: numtab
                      });
            menuLink.addItem(menuLink2);
        }
    }
    else
    {
            if (ss.storage.idioma && (ss.storage.idioma == 'es' || ss.storage.idioma == 'es-ES'))
            {
                var mensMenu1 = 'Haz login para guardar Imagen';
                var mensMenu2 = 'Haz login para guardar Página';
                var mensMenu3 = 'Haz login para guardar Selección';
                var mensMenu4 = 'Haz login para guardar Link';
            }
            else
            {
                var mensMenu1 = 'Login to save Image';
                var mensMenu2 = 'Login to save Page';
                var mensMenu3 = 'Login to save Selection';
                var mensMenu4 = 'Login to save Link';
            }

            menuImg2 =  menu.Item({
                        label: mensMenu1,
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.SelectorContext("img")],
                        contentScript: getImage(),
                        onMessage: abreLogin
                      });

            menuPage2 =  menu.Item({
                        label: mensMenu2,
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.PageContext()],
                        contentScript: getPage(),
                        onMessage: abreLogin
                      });

            menuSelection2 =  menu.Item({
                        label: mensMenu3,
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.SelectionContext()],
                        contentScript: getSelection(),
                        onMessage: abreLogin
                      });

            menuLink2 =  menu.Item({
                        label: mensMenu4,
                        image: data.url("NoteBoard.png"),
                        context: [menu.URLContext("*"), menu.SelectorContext("[href]")],
                        contentScript: getLink(),
                        onMessage: abreLogin
                      });

    }
}
      function getImage()
      {
          return 'self.on("click", function(node, data){self.postMessage({imagen:node.src,menu:data})});';
      }

      function saveImage(args)
      {
        var nota = guardaPostit("image",tabs.activeTab.url,args.imagen,args.menu);
      }

      function getPage()
      {
          return 'self.on("click", function(node, data){ self.postMessage({title: window.document.title,url:window.document.URL,menu:data})});';
      }

      function savePage(args)
      {
        var nota = guardaPostit("page",args.url,tabs.activeTab.getThumbnail(),args.menu);
      }

      function getSelection()
      {
          return 'self.on("click", function(node, data){ self.postMessage({selection: window.getSelection().toString(),menu:data})});';
      }

      function saveSelection(args)
      {
        var nota = guardaPostit("selection","",args.selection,args.menu);
      }

      function getLink()
      {
          return 'self.on("click", function(node, data){ self.postMessage({link: node.href,menu:data})});';
      }

      function saveLink(args)
      {
        var nota = guardaPostit("link","",args.link,args.menu);
      }


function guardaPostit(type,url,data,numTablon){
    var f = new Date();
    if (ss.storage.idioma == 'es' || ss.storage.idioma == 'es-ES')
        var fecha = f.getDate() + '/' + (f.getMonth() +1) +  '/' + f.getFullYear();
    else
        var fecha = (f.getMonth() +1) + '/' + f.getDate() + '/' + f.getFullYear();

    var nota = {
        tipoA: 1+Math.floor(Math.random()*7),
        X: 20+Math.floor(Math.random()*100),
        Y: 50+Math.floor(Math.random()*100),
        postit: "",
        width: 250,
        height: 0,
        fecha: fecha,
        tablon: numTablon
    }
    var param = 'id_usuario=' +  ss.storage.id_usuario;
    param += '&token=' +  ss.storage.token;
    param += '&nota=' + encodeURIComponent(JSON.stringify(nota));
    param += '&type=' +  type;
    param += '&url=' +  encodeURIComponent(url);
    param += '&data=' +  encodeURIComponent(data);

    Request({
      url: 'http://www.noteboardapp.com/api/createNoteFirefox.php',
      content: param,
      onComplete: function(answer){
             var resp = answer.json;
             if (resp.isSuccess)
             {
                nota.treeId = resp.idNota;
                nota.postit = resp.postit;
                sendMessageToInjectCode({clip: nota});
             }
             else console.log('OK ' + resp.error);
          }
    }).post();
    return nota;
  }


function sendMessageToInjectCode(message)
{
    for (var property in message)
    {
        worker.port.emit(property,message);
    }
}

function listenMessage(messageType,callback)
{
  worker.port.on(messageType,callback);
}

};

