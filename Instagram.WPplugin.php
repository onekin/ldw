<?php
/**
 * Plugin Name: InstagramVideoObject
 * Plugin URI: http://www.onekin.org/
 * Description: Embedding LD schema.org description for Instagram Videos.
 * Version:     0.1
 * Author:      Iker Azpeitia
 * Author URI: http://www.onekin.org
 * License: GPL v3
 * Text Domain: InstagramVideoObject
 */

 add_action( 'init', 'InstagramVideoObjectShortcode' );

  function InstagramVideoObjectShortcode() {
    add_shortcode('InstagramVideoObject', 'EmbedVideoObject' );
  }

  function EmbedVideoObject( $atts ){
     return "<InstagramVideoObject id='".$atts['id']."'> </InstagramVideoObject>";
  }
?>

<script type="text/javascript">
window.onload = embedInstagramSchema;
var embeddingPoint;
function embedInstagramSchema (){
 embeddingPoint = document.getElementsByTagName('InstagramVideoObject')[0];
 var uri = 'http://rdf.onekin.org/instagram/videoobject/' + embeddingPoint.getAttribute("id");
 callURLjson(uri, function (response) {embedRichSnippet(response)});
}

//rewrite as Google requires in https://search.google.com/structured-data/testing-tool
function embedRichSnippet(json){
 var json2 = {"@context": "http://schema.org", "@type": json ['@type'],
 "name": json ['schema:name'], "description": json ['schema:description'],
 "thumbnailUrl": json ['schema:thumbnailUrl'], "uploadDate":  json ['schema:uploadDate'], "contentUrl": json ['schema:contentUrl'], "interactionCount": json ['schema:interactionCount']};
  var g = document.createElement('script');
  g.text = JSON.stringify(json2);
  g.setAttribute("type", "application/ld+json");
  embeddingPoint.parentNode.insertBefore(g, elem);
}

function createCrossDomainRequest(){
var request;
if (window.XDomainRequest){request = new window.XDomainRequest();}
else if (window.XMLHttpRequest){request=new XMLHttpRequest();}
else if (window.ActiveXObject){request=new ActiveXObject("Microsoft.XMLHTTP");}
if (request!=null){return request;}
else{alert("Your browser does not support XMLHTTP.");}
}

function callURLjson(url, callback){
  console.log(url);
  var xmlhttp = createCrossDomainRequest();
  xmlhttp.open('GET', url, true);
  xmlhttp.setRequestHeader('Accept','application/json; q=0.9, application/rdf+xml; q=0.5');
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
          var txt = xmlhttp.responseText;
          console.log(txt);
            var obj = JSON.parse(txt);
            callback (obj);
         }else{
        alert("Problem retrieving data. Status: "+xmlhttp.status + ' | '+xmlhttp.statusText +' \n Response: ' + xmlhttp.responseText);
      }
    }
};
xmlhttp.send(null);
}
</script>
