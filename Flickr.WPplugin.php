<?php
/**
 * Plugin Name: FlickrVideoObject
 * Plugin URI: http://www.onekin.org/
 * Description: Embedding LD schema.org description for Flickr Videos.
 * Version:     0.3
 * Author:      Iker Azpeitia
 * Author URI: http://www.onekin.org
 * License: GPL v3
 * Text Domain: FlickrVideoObject
 */

 add_action( 'init', 'FlickrVideoObjectShortcode' );

  function FlickrVideoObjectShortcode() {
    add_shortcode('FlickrVideoObject', 'EmbedVideoObject' );
  }

  function EmbedVideoObject( $atts ){
     return "<FlickrVideoObject id='".$atts['id']."'> </FlickrVideoObject>";
  }
?>

<script type="text/javascript">
var xmlhttp = createCrossDomainRequest();
var RichSnippet = document.createElement('script')
RichSnippet.setAttribute("type", "application/ld+json");
   
window.onload = embedFlickrSchema;
	
function embedFlickrSchema (){
 embeddingPoint = document.getElementsByTagName('FlickrVideoObject')[0];  
 var VideoID = embeddingPoint.getAttribute("id");
 var uri = 'http://rdf.onekin.org/flickr/videoobject/' + VideoID;
 xmlhttp.open('GET', uri, true);
 xmlhttp.setRequestHeader('Accept','application/ld+json; q=1');
 xmlhttp.onreadystatechange = function() {
 if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
   RichSnippet.text = JSON.stringify(xmlhttp.responseText);
   embeddingPoint.parentNode.insertBefore(RichSnippet, embeddingPoint);}};
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

</script>
