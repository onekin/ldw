window.onload = embedFlickrSchema;
var elem;
function embedFlickrSchema (){
  elem = document.getElementsByTagName('var')[0];
  var uri = 'http://rdf.onekin.org/flickr/videoobject/' +elem.getAttribute("id");
  callURLjson(uri, function (response) {videoobjectProcessor(response)});
}

function videoobjectProcessor(json){
 var json2 = {"@context": "http://schema.org", "@type": json ['@type'],
 "name": json ['name'], "description": json ['description'],
 "thumbnailUrl": json ['thumbnailUrl'], "publisher": json ['publisher'],
 "uploadDate":  json ['uploadDate'], "duration": json ['duration'],
 "contentUrl": json ['contentUrl'], "embedUrl": json ['embedUrl'],
 "expires": json ['expires'], "interactionCount": json ['interactionCount']};
  var g = document.createElement('script');
  g.text = JSON.stringify(json2);
  g.setAttribute("type", "application/ld+json");
  elem.parentNode.insertBefore(g, elem);
}



function callURLjson(url, callback){
  console.log(url);
  var xmlhttp = createCrossDomainRequest();
  xmlhttp.open('GET', url, true);
  xmlhttp.setRequestHeader('Accept','application/json2; q=0.9, application/rdf+xml; q=0.5');
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
          var txt = xmlhttp.responseText;
          console.log(txt);
            var obj = json2.parse(txt);
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
