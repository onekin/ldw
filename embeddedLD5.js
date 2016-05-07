var typeURIMap = {'municipio': 'http://rdf.onekin.org/ode.municipio/[w .-]*', 'weather': 'http://rdf.onekin.org/weather.forecast.ldw/[w .-]*'}
var URIJSONMap = {};
var embeddedElem = [];
var embeddedElemURI = [];
var tagType = 'div';

function processIndividual(uri) {
  callURLJSON(uri, function (resp) {embedding(resp)});
}

function linkifyHTML(json){
  var text = JSON.stringify(json);
    if (text) {
    	var exp = /,/g;
    	text = text.replace(exp,",<br/>");
        text = text.replace(/http[^"]*/g,
            function(url){var find = '\\\\';
                          var re = new RegExp(find, 'g');
                          url = url.replace(re, '');
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            }
        );
    }
    return text;
}

function linkifyTXT(json){
  return JSON.stringify(json);
}

function hashIt (s) {
var hash = 0, strlen = s.length, i, c;
if (strlen === 0 ) {
return hash;
}
for (i = 0; i < strlen; i++ ) {
c = s.charCodeAt( i );
hash += c;
}
return hash;
}

function callURLJSON(url, callback){
  //console.log ('URLjson calling: '+url);
  var xmlhttp = createCrossDomainRequest();
  xmlhttp.open('GET', url, true);
  xmlhttp.setRequestHeader('Accept','application/json; q=0.9, application/rdf+xml; q=0.5');
	xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
            var obj = JSON.parse(xmlhttp.responseText);
            callback (obj);
         }else{
    		alert("Problem retrieving data. Status: "+xmlhttp.status + ' | '+xmlhttp.statusText +' \n Response: ' + xmlhttp.responseText);
  		}
    }
};
xmlhttp.send(null);
}

function createCrossDomainRequest(){
var request;
if (window.XDomainRequest){request = new window.XDomainRequest();}
else if (window.XMLHttpRequest){request=new XMLHttpRequest();}
else if (window.ActiveXObject){request=new ActiveXObject("Microsoft.XMLHTTP");}
if (request!=null){return request;}
else{alert("Your browser does not support XMLHTTP.");}
}

function linkifyProcessor(json, elem){
  elem.innerHTML=linkifyHTML(json);
}

function textualProcessor(json, elem){
  elem.innerHTML=linkifyTXT(json);
}

function embeddedProcessor(json, elem){
  var g = document.createElement('script');
var s = document.getElementsByTagName('script')[0];
g.text = JSON.stringify(json);
g.setAttribute("type", "application/ld+json");                           // Set the value of the class attribute
elem.parentNode.insertBefore(g, elem);
}


function embedLD (){
	var elems = document.getElementsByTagName(tagType);
	console.log(elems);
	console.log(elems.length);
	for (var i =0; i<elems.length; i++) {
		var elem= elems[i];
    var ldid1 = elem.getAttribute("ldid1");
    var ldid2 = elem.getAttribute("ldid2");
    var ldtype = elem.getAttribute("ldtype");
    var ldflavor = elem.getAttribute("ldflavor");
    if (!ldtype or !ldflavor)  continue;
    var uri = typeURIMap[ldtype].replace('[w .-]*', ldid1);
    uri = uri.replace('[w .-]*', ldid2);
		console.log(uri);
    URIJSONMap[uri]={};
    embeddedElem[i]=elem;
    embeddedElemURI[i]=uri;
    embeddedProcessor[i]=embeddedProcessor; // by default ldflavor == "embedded"
    if (ldflavor == "embedded") embeddedProcessor[i]=embeddedProcessor;
    if (ldflavor == "textual") embeddedProcessor[i]=textualProcessor;
    if (ldflavor == "linkified") embeddedProcessor[i]=linkifyProcessor;
    if (ldflavor == "test") embeddedProcessor[i]=testProcessor;
  }
console.log(JSON.stringify(URIJSONMap));
  for(var uri in URIJSONMap) {
       if(URIJSONMap.hasOwnProperty(uri)){
           processIndividual(uri);
       }
   }
}

function embedding (json){
  var uri = json['@id'];
  console.log(uri);
  URIJSONMap[uri]= json;
  for (var j=0; j< embeddedElem.length; j++){
    if (uri == embeddedElemURI[j]){
      console.log(embeddedElemURI[j]);
      var processor = embeddedProcessor[j];
      console.log(embeddedProcessor[j]);
      console.log(processor);
      processor (json, embeddedElem[j]);
  }
}
}
