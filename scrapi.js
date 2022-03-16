// Send width of iframe to parent, so it can calculate the appropriate height
var corsAPIurl="https://animatedshowsb1.herokuapp.com/";
var eventMethod = window.addEventListener?"addEventListener":"attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent"?"onmessage":"message";
eventer(messageEvent, function (e) {
    if (e.data === "requestwidth" || e.message === "requestwidth") {
        parent.postMessage({"width":self.innerWidth,"status":localStorage["playerstatus"],"vidposition":params.get("ssid")+params.get("lang")+params.get("e")+"time : "+localStorage[params.get("ssid")+params.get("lang")+params.get("e")+"time"],"reload":false}, "*");
    }
});
// Iteration function to move to the next backup source if there are any errors encountered
var casualiteration=function(){
    c++;
    setupScrape(c);
},
// Code to set up MediaElements Player
mediaEl=function(vurl,poster,fm){
    if(fm=="hls"){
        document.querySelector("#container").innerHTML="<video style='width:100%;height:"+window.innerHeight+"px' controls></video>";
        var video = document.querySelector('video');
        video.poster=poster;
        if (Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(vurl);
          hls.attachMedia(video);
        }
                
    }else{
        document.querySelector("#container").innerHTML="<video style='width:100%;height:"+window.innerHeight+"px' controls src=\""+vurl+"\" poster=\""+poster+"\"></video>"
    }
    var mediaElements = document.querySelectorAll("video"),
    total = mediaElements.length;
    let player = new MediaElementPlayer(mediaElements[0], {
        enableAutosize: true,
        pluginPath: "https://cdn.jsdelivr.net/npm/mediaelement@4.2.16/build/",
        shimScriptAccess: "always",
        success: function(a, t, c) {
            for (var e = document.body.querySelectorAll(".player"),
            l = e.length, y = 0; y < l; y++)e[y].style.visibility = "visible"
        }
    })
    
    window.onresize=function(){
        document.querySelector("video").style.height=window.innerHeight+"px";
        document.querySelector(".mejs__container").style.height=window.innerHeight+"px";
        for(var i=0;i<document.querySelectorAll(".mejs__overlay").length;i++){
            document.querySelectorAll(".mejs__overlay")[i].style.height=window.innerHeight+"px";
        }
        document.querySelector(".mejs__poster").style.height=window.innerHeight+"px";
    }
},
plyr=function(vurl,poster,fm){
    // alert(fm)
      if(fm=="hls"){
          document.querySelector("#container").innerHTML="<video id='player' style='width:100%;height:100vh' controls></video>";
          var video = document.querySelector('#player');
          video.poster=poster;
          if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(vurl);
            hls.attachMedia(video);
          }
      }else{
          document.querySelector("#container").innerHTML="<video preload='none' id='player' style='width:100%;height:100vh' controls src=\""+vurl+"\" poster=\""+poster+"\"></video>";
      }
      var player = new Plyr('#player',
      {
        title: 'AnimatedShows',
        controls:[
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'fullscreen'
            ],
      });
      window.player = player;
},
// Disables CTRL key pressing (except CTRL+R) and disables the use of the Developer tools.
disabler = function(keys,debug){
    if(keys){
        function disableKeyPressing(e) {
          var conditions = [
            (e.which || e.keyCode) == 116,
            e.ctrlKey && (e.which === 82)
          ]
          if ($.each(conditions, function(key, val) {
              val + ' || '
            })) {
            window.location.reload();
          }
        }
        window.addEventListener("keydown", (e) => {
          if ((e.which || e.keyCode) == 116) {
            disableKeyPressing(e);
          } else if (e.ctrlKey && (e.which === 82)) {
            disableKeyPressing(e);
          } else {
            e.preventDefault();
          }
        });
    }
    if(debug){
        let div = document.createElement('div');
        let loop = setInterval(() => {
            console.log(div);
            console.clear();
        });
        Object.defineProperty(div, "id", {get: () => { 
            clearInterval(loop);
            localStorage["playerstatus"]="Unwanted use of Developer Tools";
            parent.postMessage({"width":self.innerWidth,"status":localStorage["playerstatus"],"vidposition":params.get("ssid")+params.get("lang")+params.get("e")+"time : "+localStorage[params.get("ssid")+params.get("lang")+params.get("e")+"time"],"reload":false}, "*");
            window.location="https://www.youtube.com/embed";
        }});
    }
},
// Get URL parameters
params = new URLSearchParams(window.location.search),
gp=function(p){return params.get(p);},
// A formula to format a number with a zero in front if less than 10
nformat = function(M) {
    return M > 9 ? "" + M : "0" + M;
}
// Returns the substring between two substrings.
function getBetween(string, from, to){
    try{
        return string.split(from)[1].split(to)[0];
    }catch(e){ //error
        return false;
    }
}
// Unblock CORS
function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, corsAPIurl + options.url);
  x.onload = function() {
    printResult(
      options.method + ' ' + options.url + '\n' +
      x.status + ' ' + x.statusText + '\n\n' +
      (x.responseText || '')
    );
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  x.send(options.data);
}
localStorage["playerstatus"]="Pending";
function animSCRAPI(dat){
    this.init=function(){
        if(!dat.url){
          $.getJSON(dat.json,function(d){
              var j = d[params.get("s")+params.get("lang")], finalkey="";
              if(!j) return dat.onerror();
              var prevSeasonEpsCount=0;
              if((Number(params.get("e").split('|')[0])-1)!=0){
                  for (var i = 0; i <= Number(params.get("e").split('|')[0])-2; i++){
                      prevSeasonEpsCount+=j["ec"][i];
                  }
              }
              var keyIndex=prevSeasonEpsCount+(Number(params.get("e").split('|')[1])-1);
              if(j["keys"][keyIndex] && j["keys"][keyIndex]!==""){
                 finalkey = j["keys"][keyIndex];
              }
              if(finalkey==="") return dat.onerror();
            doCORSRequest({
              method: 'GET',
              url: dat.urlparts[0]+finalkey+dat.urlparts[1]
            }, function printResult(result) {
              var poster="";
              if(params.has("th")&&params.get("th")!=""&&params.get("th") != 'undefined'){
                  poster=params.get("th");
              }else{
                  var gb=getBetween(result, dat.posdivider[0],dat.posdivider[1]);
                      if(gb) poster=corsAPIurl+getBetween(result, dat.posdivider[0],dat.posdivider[1]);
                  else return dat.onerror();
              }
              var vurl = getBetween(result, dat.epdivider[0],dat.epdivider[1]);
              if(vurl===""||typeof vurl === 'undefined'||vurl===false) return dat.onerror();
              else vurl=corsAPIurl+vurl;
              if(dat.runplayer&&dat.runplayer()!="Netflix"){
                  dat.runplayer(vurl, poster, dat.format);
                  localStorage["playerstatus"]="Working";
                  if(dat.dlfallback) vurl=dat.dlfallback;
                  parent.postMessage({"width":self.innerWidth,"status":localStorage["playerstatus"],"reload":false,"vidposition":params.get("ssid")+params.get("lang")+params.get("e")+"time : "+localStorage[params.get("ssid")+params.get("lang")+params.get("e")+"time"],"dl":btoa(vurl)}, "*");
              }else{
                  var b=jwplayer("container");
                  b.setup({
                    controls: true,
                    displaytitle: true,
                    fullscreen: false,
                    primary: 'html5',
                    stretching:"uniform",
                    autostart: false,
                    skin: { name: 'Netflix' },
                    file: vurl,
                    image: poster
                  });
                   b.on('error', function(evt){
                      if (evt.message === "Error loading media: File could not be played" || evt.message === "Error loading media: Unknown network error") {
                        return dat.onerror();
                      }
                   });
              }
              if(!localStorage["playerstatus"].includes("Backup")){
                localStorage["playerstatus"]="Working";
              }
              if(dat.dlfallback) vurl=dat.dlfallback;
              parent.postMessage({"width":self.innerWidth,"status":localStorage["playerstatus"],"reload":false,"vidposition":params.get("ssid")+params.get("lang")+params.get("e")+"time : "+localStorage[params.get("ssid")+params.get("lang")+params.get("e")+"time"],"dl":btoa(vurl)}, "*");
            });
        });
        }else{
            var poster="";
            if(params.has("th")&&params.get("th")!==""&&params.get("th") !== 'undefined'){
                poster=params.get("th");
            }else{
               if(dat.poster){
                   poster=dat.poster;
               }
            }
            if(dat.format=="hls"){
                $.getJSON("https://streamzzzzio.ga/"+params.get("s")+".json",function(json){
                    try{
                        var vurl=dat.url.replace("[INSERTPART]",json[params.get("index")]);
                        var b=jwplayer("container");
                        b.setup({
                          controls: true,
                          displaytitle: true,
                          fullscreen: false,
                          primary: 'html5',
                          stretching:"uniform",
                          autostart: false,
                          skin: { name: 'Netflix' },
                          file: vurl,
                          image: poster
                        });
                         b.on('error', function(evt){
                          return dat.onerror();
                         });
                        if(!localStorage["playerstatus"].includes("Backup")){
                            localStorage["playerstatus"]="Working";
                        }
                        var vurl="";
                        if(dat.dlfallback) vurl=dat.dlfallback;
                        parent.postMessage({"width":self.innerWidth,"status":localStorage["playerstatus"],"reload":false,"vidposition":params.get("ssid")+params.get("lang")+params.get("e")+"time : "+localStorage[params.get("ssid")+params.get("lang")+params.get("e")+"time"],"dl":btoa(vurl)}, "*");
                    }catch(e){
                        return dat.onerror();
                    }
                }).fail(function() { return dat.onerror(); });
            }else{
                var b=jwplayer("container");
                b.setup({
                  controls: true,
                  displaytitle: true,
                  fullscreen: false,
                  primary: 'html5',
                  stretching:"uniform",
                  autostart: false,
                  skin: { name: 'Netflix' },
                  file: dat.url,
                  image: poster
                });
                 b.on('error', function(evt){
                    if (evt.message === "Error loading media: File could not be played") {
                      return dat.onerror();
                    }
                 });
                if(!localStorage["playerstatus"].includes("Backup")){
                    localStorage["playerstatus"]="Working";
                  }
                parent.postMessage({"width":self.innerWidth,"status":localStorage["playerstatus"],"reload":false,"vidposition":params.get("ssid")+params.get("lang")+params.get("e")+"time : "+localStorage[params.get("ssid")+params.get("lang")+params.get("e")+"time"],"dl":btoa(dat.url)}, "*");
            }
        }
    }
}
