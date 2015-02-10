// ==UserScript==
// @name           ODTfromGithub 
// @author         Iker Azpeitia
// @version        0.3
// @namespace      odt++
// @description	   ODT++: transform xml outputs on Linked Data.
// @include        http://developer.yahoo.com/yql/console/*
// @include        https://developer.yahoo.com/yql/console/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// ==/UserScript== 


window.addEventListener("load",mod,true);

function mod(){
 if(document.body.parentNode.className){
   if(window==window.top){
 	   start();
	 }
  }     
}

function start(){
 var but=document.getElementById("submitMeButton");
 but.addEventListener("click",onClickButton,true);
 var textarea=document.getElementById("qid");
 textarea.addEventListener("keydown",function(ev){if(ev.keyCode==13){onClickButton(ev);}},true);
}

function onClickButton(ev){
var textarea2=document.getElementById("qid").value;
var textarea=textarea2.toLowerCase();
    alert (textarea2);
textarea=textarea.replace(/(\ )*\n+(\ )*/g," ");
textarea=textarea.replace(/\s+/g, ' ');
    if(textarea.indexOf('http')==0){
    ev.stopImmediatePropagation();
    ev.preventDefault();
    ev.stopPropagation();  
    call(textarea);
 }
}

function call(uri){
  GM_xmlhttpRequest({
  method: "GET",
  url: uri,
  onload: function(response) {
      var parser=new DOMParser();
      var txt= response.responseText; 
      txt=txt.replace(/</g, "\n<span class=\'re1\'><<span>");
      //txt= urlify(txt);
     document.getElementById("viewContent").innerHTML=txt;
  }
 });
 return 0;
}


function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
     return text.replace(urlRegex, '<a href="$1">$1</a>')
}

