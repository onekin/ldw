// ==UserScript==
// @name           ODT to LDW
// @author         	Iker Azpeitia
// @version        2017.04.10
// @namespace      odt2ldw
// @description	   ODT to LDW
// @include        http://developer.yahoo.com/yql/*
// @include        https://developer.yahoo.com/yql/*
// @require https://raw.githubusercontent.com/onekin/ldw/master/base64.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_addStyle
// ==/UserScript==

//////////////////
/// GLOBAL VARIABLES
//////////////////

var version = {number :'2017.04.10'};
console.log ('Loading '+version.number);

///
//URLs
///

//global vars;
var logo ="url(data:image/png;base64,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)";
var oneFingerImg ='&nbsp;<img  width="10" height="10" title="" title="DECoupled LDW" alt="DECoupled LDW" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAA0klEQVRIie3WsQ3CMBAFUI/ACDSJ7rqMwAgZgREY4W8QNiAbQId/mniDsAFsEDYITZDSIOwTSYFy0hW2bD357JPsXETkYKlgr/CHmPXmEDAoOCjYzQ3dRmiYFXojK7RCfw4JrjuBbxWsMjSFgmcFqxkgf5+OJ/MnBTsB8RMoJjM0xSKQwh8XgQQMyYiAdfqJ2C+BpLWBgLAiqVBYBFL4ixUR8BkNjV1vhUI0NJbPdE8C1kmQc7YS5mCZDG3Rbqafk+/pH8mIBRM0ezPkXPzj+LT/BX/7O08t261FAAAAAElFTkSuQmCC" />&nbsp;';
var tiedHandsImg ='&nbsp;<img  width="10" height="10" title="" title="Coupled LDW" alt="Coupled LDW" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABbUlEQVRIie3U0Y2DMAwA0IzQEfIZ7B9+qrO/ygbHBscmZYPrBmWD6wYOXaBs0Nug2YD7oBREIAKE7qtIFhIEv9hyUEopJQS5ZayFIFcbXaM5LWPdxlZQL+fjv6A6/PANzYWE0AlH6VaQcJQKofMhjlJhPFnGumT8Xg/gyTI+hDATjlIPau+vIDgvRgiL4ViPtM4kbUVrsAFSC+NJyCRC6PqLnGW4Sax3ww/mYB5CWEisd5bhJoS2W/iqZDkWQrxf0DN5FcLG/oPDVvsIFv7OBtj1Az49bI9xV4lJPISjtIdUgV4b3c7+WPR3KAyXwLpKYr2bhJRSSvYYT2IE93ZdAHFCRgeRbrfNQRuLECSErt/eeRhhtgLKFiGhZHPerYaavqMVhktXMeTNyTfJaqBLZrSQ0Vc2hyubQ0n4VRIcS4KjJThbQmkC7s9j8bMcCYzv5MT1Kl4MCcOvENpnFE3LIBfCrG3d7HEOgu/WTVx/HAZGEDSg3bQAAAAASUVORK5CYII=" />&nbsp;';
var globalBaseURI ='http://rdf.onekin.org/';
var globalBaseURI1 ='http://localhost:8080/ldw/';

var editorpage = false;
var consolepage = false;
var loadingwrapper = false;

var globalTableCount=0;
var globalLowRefreshProb = 0.15;
var globalHighRefreshProb = 0.5;

var annotations = JSON.parse("[]");
var globalResultsElement = false;
var globalRootElement = false;

var globalOntologyNum;
var globalYQLTableName;
var globalButtonContainner;
var globalButtonContainner2;
var ANNOTATED = 1;
var PUSHEDANNOTATIONBUTTON = 2;
var XMLANNOTATION = 3;
var XMLREANNOTATION=4;
var RENEWANNOTATION=6;
var OBJPROPERTY = 7;
var globalSignaler=[];
globalSignaler[ANNOTATED] = false;
globalSignaler[PUSHEDANNOTATIONBUTTON] = false;
globalSignaler[XMLANNOTATION] = false;
globalSignaler[XMLREANNOTATION] = false;
globalSignaler[RENEWANNOTATION] = true;
globalSignaler[OBJPROPERTY] = false;

var globalLDWurl;
var globalAnnotationurl;
var globalOntologyFunction;
var globalOntologyDescription;

var globalquidHash = 0;

var yqlgithuburl = "https://api.github.com/repos/yql/yql-tables/git/trees/master?recursive=1";
var ldwgithuburl = "https://api.github.com/repos/onekin/ldw/git/trees/master?recursive=1";
var tableurl = "https://api.github.com/repos/onekin/owc/contents/";
var mode = "&mode=";
var format ="RDF/XML-ABBREV"; //default

var urlOWL1B ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fpublic%2Fyql%3Fq%3Dselect%2520*%2520from%2520xml%2520where%2520url%253D'";
var urlOWL2B ="'%26format%3Djson%26diagnostics%3Dtrue%26callback%3D%22%20and%20itemPath%20%3D%20%22query.results.RDF.*.about%22%20%7C%20unique(field%3D%22about%22%2C%20hideRepeatCount%3D%22true%22)&debug=true&format=json&diagnostics=true&callback=";
var urlOWL1c ="lov.okfn.org/dataset/lov/api/v2/vocabulary/info?vocab=";
var urlOWL2c ="";

var lovurl = "http://lov.okfn.org/dataset/lov/";

var urlOWL1 ='https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22http%3A%2F%2Flov.okfn.org%2Fdataset%2Flov%2Fapi%2Fv2%2Fvocabulary%2Finfo%3Fvocab%3D';
var urlOWL2 ='%22&debug=true&format=json&diagnostics=true&callback=';

var n3url1 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20execute%20where%20code%3D%22response.object%20%3D%20y.rest('";
var n3url2 = "').get().response%3B%22&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
var ldwURL=globalBaseURI+"ldw/registerwrapper";
////

var anchor = null;
var ldw = null;

//////////////////
/// INIT  seccion
//////////////////

window.addEventListener("load",mod,true);

var starting = false;
function mod(){
try{
  working();
  if (starting )return;
  starting = true;
  anchor = new Anchor();
  var loggedin = anchor.get ('a+Sign In');
  if (loggedin != null ) alert ('Please, Sign in to use the LDW augmentation tool.');
  modal_init();
  addOnekinLogo ();
  var ver = readData ('version');
  var reseting = version.number != ver;
  if (reseting) {
    resetData();
    writeData ('version', version.number);
  }else{
    consoleTokens();
  }
  readStorageTokens();
  var page = window.location.href;
	if (page.indexOf ('developer.yahoo.com/yql/editor')>-1) {
    globalSignaler[ANNOTATED]=true;

    ldw = new LDW();
		editorpage=true;
		augmentEditor();
    if (page.indexOf ('loadingcoupledwrapper')>-1){
		    showCoupledAnnotation();
		      setTimeout( firing (),2000);
        }
	}
	if (page.indexOf ('developer.yahoo.com/yql/console')>-1) {
		consolepage=true;
      ldw = new LDW();
		augmentConsole();
  }
  writeData('deploying', true);
  console.log ('Loaded');
  lazing();
}catch(err){lazing();infoit (err.lineNumber+' :: '+ err.message);}}

function firing(){
  fireEvent(anchor.get ('tableName'),"click");
  fireEvent(anchor.get ('renameButton'),"click");
  fireEvent(anchor.get ('save-button'),"click");
}

function resetData(){
  try{
    GM_setValue('LDWdata', '{}');
    newstorage();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////////
/////console augmentation
/////////////////

function augmentConsole(){
  try{
  readOntologies ();
  appendStyles();
  addVisualElementsConsole();
  checkSelectPermanence();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////////////
////VISUAL ELEMENTS seccion
//////////////////

function addOnekinLogo (){
  try{

	var elmNewContent = document.createElement('a');
	elmNewContent.href = 'http://www.onekin.org';
	elmNewContent.innerHTML = 'Enhaced by <img src="http://www.onekin.org/sites/default/files/danland_logo.png" alt="logo" height="50" width="100"> ';
  var logoel = anchor.get ('yql-logo');
  logoel.parentNode.insertBefore(elmNewContent, logoel);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function showVisualElementsAnnotationView(){
  try{
    resizeAnnotationview();
	hideVisualElementsSemanticView();
	anchor.show ("annotationViewContent");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function hideVisualElementsAnnotationView(){
  try{
	anchor.hide ("annotationViewContent");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function showVisualElementsSemanticView(){
  try{
	hideVisualElementsAnnotationView();
	anchor.show ("theURIs");
	anchor.show ("semanticViewContent");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function hideVisualElementsSemanticView(){
  try{
anchor.hide ("theURIs");
	anchor.hide ("semanticViewContent");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addVisualElementsAnnotationView(){
//Annotation tab.
try{
var li = document.createElement('li');
  li.id ="annotationLi";
  li.setAttribute ("class","tab results-tab nav-tab");
  var html = '<a id="annotation" data-rapid_p="3" class="rapidnofollow" href="#annotationView" data-toggle="tab" hidden="true"><span id="annotationTab">Annotation View</span></a>';
  li.innerHTML = html;
  anchor.get ('resultsNav').insertBefore(li, anchor.get ('viewMenu'));
  fireEvent(li,"click");
  li.addEventListener("click", creatingAnnotationView, false);
  var div = document.createElement('div');
  div.setAttribute ("class","tab-pane active in");
  div.setAttribute ("id","annotationView");
  div.innerHTML='<pre style="background-color: rgb(255, 255, 255);overflow:auto;resize:none" id="annotationViewContent"></pre>';
anchor.get ('outputTabContent').insertBefore(div, anchor.get ('perfView'));
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addOtherElements(){
  try{

	//Community LDW radio button
	var cln = anchor.get ('showCommunityTables').cloneNode(true);
	cln.id ="CommunityLDW";
	cln.innerHTML= '<input id ="radioshowldw" type="radio" name="showldw" value="">Show Community Wrappers<a href="'+globalBaseURI+'/ldw/page" target="_blank"><i id ="helpldw" class="icon-question-sign"></i></a>';
	cln.setAttribute("class", "democlass");
  anchor.get ('showCommunityTables').parentNode.insertBefore(cln, anchor.get ('dtQuestion'));

  anchor.get ('radioshowldw').onclick = function (e){createLDWFolder ();};
  var generateLDWButton = createButton ("Generate", "editCoupledButton");//document.createElement('button');
	//var annotationButton = createButton ("Annotate", "annotationButton");//document.createElement('button');
  //anchor.get ('submitMeButton').parentNode.insertBefore(annotationButton, anchor.get ('submitMeButton').nextSibling);
  anchor.get ('submitMeButton').parentNode.insertBefore(generateLDWButton, anchor.get ('submitMeButton').nextSibling);

//	anchorAnnotationButton.addEventListener("click", anchor.get ('annotationLi'), false);
    anchor.get ('editCoupledButton').addEventListener("click", openCoupledLDW, false);
	disableLDWGenerationButton();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function startAnnotation (){
  try{
anchor.get ('annotationLi').style.visibility = "";
	anchor.get ('semanticLi').style.visibility = "";
	enableLDWGenerationButton();
	fireEvent(anchor.get ('annotationLi'),"click");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function disableLDWGenerationButton(){
  try{
anchor.get ('editCoupledButton').disabled=true;
	anchor.get ('semanticLi').style.visibility = "";
	anchor.get ('annotationLi').style.visibility = "";
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function enableLDWGenerationButton(){
  try{
  anchor.get ('editCoupledButton').disabled=false;
	anchor.get ('semanticLi').style.visibility = "";
	anchor.get ('annotationLi').style.visibility = "";
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createButton (text, id){
  try{
	var button = document.createElement('button');
	button.setAttribute("style", "margin-left: 1em;");
	button.setAttribute("class", "btn btn-primary");
	button.setAttribute("type", "button");
	button.setAttribute("id", id);
	button.innerHTML=text;
	return button;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addVisualElementsSemanticView(){
  try{
  var li2 = document.createElement('li');
  li2.id ="semanticLi";
  li2.setAttribute ("class","tab results-tab nav-tab");
  var html2 = '<a id="semantic" data-rapid_p="3" class="rapidnofollow" href="#semanticView" data-toggle="tab" hidden="true"><span id="semanticTab">Semantic View</span></a>';
  li2.innerHTML = html2;
  anchor.get ('resultsNav').insertBefore(li2, anchor.get ('viewMenu'));
  //anchor.get ('semanticTab').addEventListener("click", creatingSemanticView, false);
  li2.addEventListener("click", creatingSemanticView, false);
  var div2 = document.createElement('div');
  div2.setAttribute ("class","tab-pane active in");
  div2.setAttribute ("id","semanticView");
  div2.innerHTML='<pre style="background-color: rgb(255, 255, 255);overflow:auto;resize:none" id="semanticViewContent"></pre>';
  anchor.get ('outputTabContent').insertBefore(div2, anchor.get ('perfView'));
  var div1 = document.createElement('div');
  div1.id='theURIs';
  div1.innerHTML = '';
  // div1.innerHTML += '<h4><span>THE URI example and pattern</span><a style="font-weight: normal; margin-left: .7em;" target="_blank" href="http://onekin.org">How do I use this?</a> Generate LDW through:<button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="editButton" data-rapid_p="8">Edit LDW</button><button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="editCoupledButton" data-rapid_p="8">reference</button><button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="editDecoupledButton" data-rapid_p="8">cloning</button></h4>';
  div1.innerHTML += '<h4><span>THE URI example and pattern</span><a style="font-weight: normal; margin-left: .7em;" target="_blank" href="http://onekin.org">How do I use this?</a></h4>';
  div1.innerHTML += '<input type="text" readonly="readonly" name="copytoclip" id="uriexample" class="span12"><input type="text" readonly="readonly" name="copytoclip" id="uripattern" class="span12">';
  anchor.get ('semanticView').appendChild(div1);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addVisualElementsConsole(){
  try{
  //Annotation tab.
  addVisualElementsAnnotationView();
  //Semantic View tab.
  addVisualElementsSemanticView();
  //Community LDW radio button
  addOtherElements();
  hideVisualElementsSemanticView();
  hideVisualElementsAnnotationView();
  fireEvent(anchor.get ('formattedTab'),"click");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function openCoupledLDW (){
  try{
	var url = "https://developer.yahoo.com/yql/editor/?loadingcoupledwrapper";
  window.open(url,'_two');
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function wrapperHashId(wrpp){
  try{
    var begin = wrpp.indexOf('y.xmlToJson(oneXML)');
	var end = wrpp.indexOf('</execute>', begin);
	var newHash = 0;
	if (end ==-1) {
		newHash = hashIt (wrpp.substring(begin));
	}else{
		newHash = hashIt (wrpp.substring(begin, end));
	}
	return newHash;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createMenuObjectProperty(path, name){
  try{
    var color = '#1E90FF';
	var txt ='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"<button >'+name+'</button>"<span><button path="'+path+'" class="ldwembedded" type="button">Annnotate embedded class</button></span></span>';
	return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createMenuDatatypeProperty(path, name, value){
  try{
  var color ='#1E90FF';
  var txt ='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"<button  >'+name+'</button>"<span><button path="'+path+'" value="'+value+'" class="ldwdataprop" type="button">Attribute mapping</button></span><span><button path="'+path+'" value="'+value+'" class="ldwobjprop" type="button">Association mappping</button></span></span>';
  return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function createMenuInput(name, value){
  try{
  var color ='#1E90FF';
  var txt ='<span class="ldwnav" style="background-color:'+color+'" id="input_'+name+'">"<button  >'+name+'</button>"<span><button path="'+name+'" value="'+value+'" class="ldwinput" type="button">Annotate input</button></span></span></span>: "'+value+'"';
  return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function createMenuResults(path, name){
  try{
	var color ='#1E90FF';
    var txt='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"<button class="button" type="button">'+name+'</button>"<span id="individualtype"><button path="'+path+'" class="ldwtype button" type="button">Define the @type</button></span></span>';
	return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////
//LOWERING
///////////

function annotateLowering(){
  try{
  if (globalSignaler[XMLREANNOTATION]){return;}
  logit ('ANNOTATE LOWERING...')
  var urlA='https://query.yahooapis.com/v1/public/yql?q=select%20src%20from%20yql.table.desc%20where%20name%3D%22';
	var urlB='%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
	var select = anchor.get ('qid').value;
    var select2=select;
//  select = select.toLowerCase();
	var table="";
    var reg = "";
  try{
    reg = /from(.*)where/i;
     table= select.match(reg)[1].trim();
  }catch(err){
    reg = /from(.*)/i;
    table= select.match(reg)[1].trim();
  }

	if (table.indexOf(' ')>0){
		table = table.substring(0, table.indexOf(' '));
	}
  if (table.indexOf('(')>0){
		table = table.substring(0, table.indexOf('('));
	}
if (!table){
		alert ('The select is not correct: ' + select);
		return;
	}
	callURLJSON(urlA+table+urlB, srcURL);
  if (table.indexOf(".")>-1){
    var globalAPI = table.substring(0,table.indexOf("."));
  }else{
    var globalAPI = table;
  }
  var str ="";
  try{
    reg=/where((.|\n)*)/i;
	   str = select.match(reg);
	    str =  str[1];
    }catch(err){str=null;}
	res = formatDataPiece (str);
  var find = '\"';
	var re = new RegExp(find, 'g');
	select2 = select2.replace(re, "'");
	var firstly = true;
  var tokens = readStorageTokens();
  executeToken = tokens.executeToken;
	var ldwquery = "use '"+executeToken+"' as t; select * from t";
  var URIExampleParams ="";
  var URIPatternParams ="";
	for (var i=0; i< res.length; i++){
      var resi = res[i].replace(/like/ig, '=');
    	var res2 = resi.split("=");
		var datapiece1 = getDataPiece(res2[1]);
    URIExampleParams += '/'+datapiece1.toString();
    var datapiece2 = getDataPiece(res2[0]);
    URIPatternParams += '/{'+datapiece2+'}';
		select2=  replaceDataPiece(select2, datapiece1, '@'+datapiece2+' ');
		if (firstly){
			firstly=false;
			ldwquery = ldwquery + " where " + datapiece2 + "= '" + datapiece1 + "' ";
		}else{
			ldwquery = ldwquery + " and " + datapiece2 + "= '" + datapiece1 + "' ";
		}
	}

  infoit('lowering: '+ldwquery+"\n"+select +"\n"+select2);
  infoit('URIExampleParams: '+URIExampleParams+"\nURIPatternParams"+URIPatternParams );
  infoit('URIExampleParams: '+URIExampleParams+"\nURIPatternParams"+URIPatternParams );
  setGlobalData (URIExampleParams, URIPatternParams, select, select2, ldwquery, table, ldw.getXML(), ldw.getTypeData(), globalAPI, ldw.get ('uriexampleparamscredentialless'), ldw.get ('uripatternparamscredentialless'), ldw.get ('metas'));
  anchor.get ('uripattern').value = ldw.getURIPatternCredentialLess();//ldw.get ('uripattern');
	anchor.get ('uriexample').value = ldw.getURIExampleCredentialLess();
}catch(err){alert(err.message);infoit (err.lineNumber+' :: '+ err.message);}}

function replaceDataPiece(str, data, newdata){
  try{
    find = '\"'+data+'\"';
	re = new RegExp(find, 'g');
	str = str.replace(re, newdata);
  find = '\''+data+'\'';
re = new RegExp(find, 'g');
str = str.replace(re, newdata);
	return str;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function formatDataPiece (str){
  try{
  var find = '\"';
	var re = new RegExp(find, 'g');
	str = str.replace(re, "'");
	var res = str.split(/and /i);
	return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message); return [];}}

function getDataPiece (d){
  try{
    try{
    data=d;
	var data = data.match("\'(.*)\'");
	if (data != null) {
	  return data[1].trim();
	}
  }catch(err){}

    data=d;
	var data = data.match('\"(.*)\"');
	if (data != null) {
	  return data[1].trim();
	}

	data=d;
	if (data.indexOf (' ')<0) return d.trim();
	var datasplit = data.split(" ");
	k=1;
	while (datasplit.length>k && datasplit[datasplit.length-k].trim() == ""){
		k=k+1;
	}
	if (datasplit.length>k != null) {
		return datasplit[datasplit.length-k].trim();
	}
	return d.trim();
}catch(err){
  infoit (err.lineNumber+' :: '+ err.message);
  return "";
}
}
/////////////////////////
////ANNOTATION seccion
/////////////////////////

function creatingAnnotationView(e){
  try{
  consoleGlobalSignalers();
  showVisualElementsAnnotationView();
  var chkvalue = checkSelectPermanence();
  var url1 = 'https://query.yahooapis.com/v1/public/yql?q=';
  var select = anchor.get ('qid').value;
  var url2 = "&debug=true&format=json&callback=&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var url = url1+select+url2;
  //var url = anchor.get ('qid').value.trim();
  if (globalSignaler[RENEWANNOTATION]){
    URIPattern = ldw.get ('uripattern');
    anchor.get ('annotationViewContent').innerHTML="Loading data...";
         ///LA PRIMERA ANOTACIÓN DESDE XML.
      resetSignalers();
      ldw = new LDW();
      annotateLowering();
      globalSignaler[XMLANNOTATION]=true;
      globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
      callURLJSON(url, setAnnotationViewXML);
      disableLDWGenerationButton();
  }else{
    if (!globalSignaler[PUSHEDANNOTATIONBUTTON]){
      logit('PUSHEDANNOTATIONBUTTON');
      anchor.get ('annotationViewContent').innerHTML="Loading data...";
      if (globalSignaler[XMLANNOTATION]){   ///SEGUIMOS LA ANOTACIÓN EN XML
          ldw = new LDW();
          annotateLowering();
          resetSignalers();
          globalSignaler[XMLANNOTATION]=true;
          globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
          globalSignaler[ANNOTATED]=true;
          callURLJSON(url, setAnnotationViewXML);
     }
     if (globalSignaler[XMLREANNOTATION]){////SEGUIMOS REANOTANDO EN XML
       logit('XMLREANNOTATION');
       globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
      setReAnnotationViewXML();
    }
   }
  }
  consoleGlobalSignalers();
  e.preventDefault ? e.preventDefault() : e.returnValue = false;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function setReAnnotationViewXML(){
  try{
  var url1 = 'https://query.yahooapis.com/v1/public/yql?q=';
  var select = anchor.get ('qid').value;
  var url2 = "&debug=true&format=json&callback=&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var url = url1+select+url2;
  anchor.get ('yqlurl').value = url;
  callURLJSON(url, createReAnnotationView);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function resizeAnnotationview(){
  try{
  var w = anchor.get ('yqlurl').offsetWidth - 10;
	var h =anchor.get ('outputTabContent').offsetHeight-(anchor.get ('yqlurl').offsetHeight * 3);
  anchor.get ('annotationViewContent').style.height =h+"px";
  anchor.get ('annotationViewContent').style.width =w+"px";
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function iterateInputs(params, values){
  try{
 var result = levelblank (2)+'"inputs": {\n';
 var pars= params.split('/');
 var vars= values.split('/');
 var first = true;
 for (var i =1; i<pars.length;i++){
   param = pars[i].replace('{','').replace('}','');
   value = vars[i];
   if (first) {
     result += levelblank (3)+createMenuInput(param, value);
     first=false;
   }else result += ',\n'+levelblank (3)+createMenuInput(param, value);
 }
  return result+'\n'+levelblank (2)+'}';
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createAnnotationView(json){
  try{
  anchor.get ('annotationViewContent').style.display = "block";
  globalRootElement=false;
  globalResultsElement = false;
  ldw.set("globalsource", json);
  logit(JSON.stringify(json.query));
	var processedHTML = '{\n"query":{\n'+iterateInputs (ldw.get('uripatternparamscredentialless'), ldw.get('uriexampleparamscredentialless')) +' \n'+iterateJsonPath(json.query, "['query']", 1) +" }\n}";
 anchor.get ('annotationViewContent').innerHTML=processedHTML;
  IterateAnnotationsEvents();
  ldw.cleanLDW (json);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createReAnnotationView(json){
  try{
  anchor.get ('annotationViewContent').style.display = "block";
  globalRootElement=false;
  globalResultsElement = false;
  consoleGlobalSignalers();
  var wrapperxml=ldw.getXML();
  ldw.set("globalsource", json);
	//var processed = '{\n"query":{\n'+iterateJsonPath(json.query, "['query']", 1) +" }\n}";
  var processed = '{\n"query":{\n'+iterateInputs (ldw.get('uripatternparamscredentialless'), ldw.get('uriexampleparamscredentialless')) +' \n'+iterateJsonPath(json.query, "['query']", 1) +" }\n}";
  anchor.get ('annotationViewContent').innerHTML=processed;
  IterateAnnotationsEvents();
  ldw.cleanLDW (json);
  creatingReannotation (wrapperxml);
  savestorage();
  globalSignaler[ANNOTATED] = true;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function iterateJsonPath (json, jpath, level){
  try{
  globalRootElement=false;
	return keyvaluePath(json, jpath, level);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function keyvaluePath (json, jpath, level){
  try{
    level +=1;
 var result = "";
	if (globalRootElement){
	 result = keyvaluePathProcessed (json, jpath, level);
 }else{
	 result = keyvaluePathNeutral (json, jpath, level);
 }
  return result;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

  function keyvaluePathNeutral (json, jpath, level){
    try{
   var result = "";
   var type = typeof json;
   for (var p in json) {
  if(json.hasOwnProperty(p) ) {
    	var jpath2 = jpath+ '[\''+p+'\']';
      var type = typeof json[p];
  		if (type=="undefined" || type=="number" || type=="string" || json[p]== null){
  			result += levelblank (level)+'"'+p+': "'+json[p]+'",\n';
  		}else{
        if (childrenCount(json[p])>1){
  				globalRootElement = true
          var isArray = json[p][0]!= undefined;
          if (isArray){
          result += levelblank (level)+ createMenuResults('results',p)+': [\n'+keyvaluePathProcessedArray (json[p], jpath2, level)+levelblank (level)+'],\n';
        }else{
          result += levelblank (level)+ createMenuResults('results',p)+': {\n'+keyvaluePath (json[p], jpath2, level)+levelblank (level)+'},\n';
        }
  			}else{
   				result += levelblank (level)+ '"'+p+'": {\n'+keyvaluePath (json[p], jpath2, level)+levelblank (level)+'},\n';
  			}
  		}
    	}
    }
    return result;
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function keyvaluePathProcessed (json, jpath, level){
  try{
 var result = "";
 var type = typeof json;
 for (var p in json) {
  if(json.hasOwnProperty(p) ) {
  	var jpath2 = jpath+ '[\''+p+'\']';
    var type = typeof json[p];
    //logit(type);
    if (type=="undefined" || type=="number" || type=="string" || json[p]== null){
      if (type=="string"){
                result += levelblank (level)+createMenuDatatypeProperty(jpath2,p, json[p])+': "'+json[p].replace('>','&gt;').replace('<','&lt;')+'",\n';
      }else{
              result += levelblank (level)+createMenuDatatypeProperty(jpath2,p, json[p])+': "'+json[p]+'",\n';
    }
	 }else{
	   var isArray = json[p][0]!= undefined;
     if (typeof json[p][0] == "string" ){
     logit(isArray +' :: '+ level );
     logit(JSON.stringify(json[p]['0']));

     var jpath3 = jpath2+ '[LOOP' + (level) + ']';
       result += levelblank (level)+ createMenuDatatypeProperty(jpath3,p, json[p][0]) +": [";
        for (var i=0; i<json[p].length; i++){
            result += json[p][i].replace('>','&gt;').replace('<','&lt;')+'",';
          }
          result +="]\n";
            } else{
    if ( !isArray) {
	   result += levelblank (level)+ createMenuObjectProperty(jpath2,p)+': {\n'+keyvaluePath (json[p], jpath2, level)+levelblank (level)+'},\n';
      }
      if (isArray && level <=1) {
        result += levelblank (level)+ createMenuObjectProperty(jpath2,p) +": [\n";
        for (var i=0; i<json[p].length; i++){
    	   result += levelblank (level)+ '{\n'+keyvaluePath (json[p][i], jpath2, level)+levelblank (level)+'},\n';
	    }
        result += levelblank (level)+"]\n";
	  }
    if (isArray && level > 1){
     result += levelblank (level)+ createMenuObjectProperty(jpath2,p) +": [\n";
      var jpath3 = jpath+ '[\''+p+'\']'+'[LOOP' + level + ']';
      for (var i=0; i<json[p].length; i++){
    	result += levelblank (level)+ '{\n'+keyvaluePath (json[p][i], jpath3, level)+levelblank (level)+'},\n';
	  }
      result += levelblank (level)+"]\n";
	 }
	}}}
  }
  return result;
}catch(err){alert ('ERROR ANNOTATING: '+jpath2); infoit (err.lineNumber+' :: '+ err.message);}}

function keyvaluePathProcessedArray (json, jpath, level){
  try{
    jpath+= '[LOOP'+level+']';
    level++;
 var result = "";
 var type = typeof json;
 for (var p in json) {
  if(json.hasOwnProperty(p) ) {
  	var jpath2 = jpath;
    var type = typeof json[p];
   if (type=="undefined" || type=="number" || type=="string" || json[p]== null){
     if (type=="string"){
  		result += levelblank (level)+createMenuDatatypeProperty(jpath2,p, json[p])+': "'+json[p].replace('>','&gt;').replace('<','&lt;')+'",\n';
    }else{
		result += levelblank (level)+createMenuDatatypeProperty(jpath2,p, json[p])+': "'+json[p]+'",\n';}
	 }else{
	   var isArray = json[p][0]!= undefined;
	  if ( !isArray) {
	   result += levelblank (level)+' {\n'+keyvaluePath (json[p], jpath2, level)+levelblank (level)+'},\n';
      }
      if (isArray && level <=2) {
        result += levelblank (level)+ createMenuObjectProperty(jpath2,p) +": [\n";
        for (var i=0; i<json[p].length; i++){
    	   result += levelblank (level)+ '{\n'+keyvaluePath (json[p][i], jpath2, level)+levelblank (level)+'},\n';
	    }
        result += levelblank (level)+"]\n";
	  }
    if (isArray && level > 2){
     result += levelblank (level)+ createMenuObjectProperty(jpath2,p) +": [\n";
      var jpath3 = jpath+ '[\''+p+'\']'+'[LOOP' + level + ']';
      for (var i=0; i<json[p].length; i++){
    	result += levelblank (level)+ '{\n'+keyvaluePath (json[p][i], jpath3, level)+levelblank (level)+'},\n';
	  }
      result += levelblank (level)+"]\n";
	 }
	}
	}
  }
  return result;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

////

function levelblank (n){
  try{
	var txt = "";
 	for (var i =0; i<n*2; i++){
 		txt += '&nbsp;';
 	}
 	return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function levelblank2 (n){
  try{
	var txt = "";
 	for (var i =0; i<n*2; i++){
 		txt += ' ';
 	}
 	return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////

function IterateAnnotationsEvents(){
  try{
  var spans = document.querySelectorAll("button.ldwobjprop");
	for (var i=0; i < spans.length; i++){
		var span = spans[i];
        span.onclick = function(e) {openObjProp(e);};
	}
  spans = document.querySelectorAll("button.ldwdataprop");
	for (var i=0; i < spans.length; i++){
		var span = spans[i];
        span.onclick = function(e) {openDataProp(e);};
	}
  spans = document.querySelectorAll("button.ldwinput");
	for (var i=0; i < spans.length; i++){
		var span = spans[i];
        span.onclick = function(e) {openInput(e);};
	}
	spans = document.querySelectorAll("button.ldwtype");
	for (var i=0; i < spans.length; i++){
		var span = spans[i];
        span.onclick = function(e) {openTypetion(e);};
	}
	spans = document.querySelectorAll("button.ldwembedded");
	for (var i=0; i < spans.length; i++){
		var span = spans[i];
        span.onclick = function(e) {openEmbedded(e);};
	}
  spans = document.querySelectorAll("button.ldwontology");
	for (var i=0; i < spans.length; i++){
		var span = spans[i];
        span.onclick = function(e) {openOntology(e);};
	}
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function leafCount (js){
  try{
var count = 0;
for ( property in js )
{
  if(js.hasOwnProperty(property))
   {
     var type = typeof js[property];
 		if (type=="undefined" || type=="number" || type=="string"){
     count++;
   }
 }
}
return count;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function childrenCount (js){
  try{
var count = 0;
for ( property in js )
{
  if(js.hasOwnProperty(property))
   {
      count++;
   }
}
return count;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function firstChild (js){
  try{
for ( property in js )
{
   if(js.hasOwnProperty(property))
   {
      return js[property];
   }
}
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function cleanAnnotate (json, jpath, level){
  try{
	level = level+1;
  var result = JSON.parse ("{}");
 var type = typeof json;
 for (var p in json) {
  if(json.hasOwnProperty(p) ) {
  	var jpath2 = jpath+ '[\''+p+'\']';
    var type = typeof json[p];
  if (type=="undefined" || type=="number" || type=="string" || json[p]== null){
		result[jpath2] = createJSONDataType(jpath2,p, json[p]);
	}else{
	    var isArray = json[p][0]!= undefined;
		if ( !isArray) {
			result[jpath2] = createJSONObjectProperty(jpath2,p, cleanAnnotate (json[p], jpath2, level));
		}
		if (isArray && level <=2) {
//			result[jpath2] = createJSONObjectProperty(jpath2,p, cleanAnnotate (json[p], jpath2, level));
			//var jpath2 = jpath+'[\''+p+'\']';
			//var jpath3 = jpath+'[\''+p+'\']';
			var recursiveJS= JSON.parse ("{}");
			for (var i=0; i<json[p].length; i++){
				recursiveJS = jsonAdd (recursiveJS, cleanAnnotate (json[p][i], jpath2, level));
			}
			result[jpath2] = createJSONObjectProperty(jpath2, p, recursiveJS);
		}
		if (isArray && level > 2){
			var jpath2 = jpath+'[\''+p+'\']';
			result[jpath2] = createJSONArrayObjectProperty(jpath2, p, 'LOOP' + level);
			var jpath3 = jpath+'[\''+p+'\'][LOOP' + level + ']';
			for (var i=0; i<json[p].length; i++){
				result[jpath2]['datacornejo'] = jsonAdd (result[jpath2]['datacornejo'], cleanAnnotate (json[p][i], jpath3, level));
			}
		}
	}
	}
  }
  return result;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function annotateJSON (path, js, globalannotation){
  try{
	 //path = path.replace(/'/g, '');
   path = path.replace(/"/g, '');
	path = path.replace(/\[results\]/g, '');
	return annotateJSONDeep(path, js, globalannotation);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function annotateJSONDeep (path, js, jsSource){
  try{
    if (jsSource == null) return null;
    var result = JSON.parse ("{}");
  for (var p in jsSource) {
  	if(jsSource.hasOwnProperty(p) ) {
      var pat = jsSource[p].path;
      var jjss = jsSource[p];
      if (pat === path){
        logit(":: "+ pat);
        logit("== "+ path);
  			jjss['annotation']= js;
  			result[p]=jjss;
  		}else{
	  		var type = jjss.type;
  			if (type=="value"){
				      result[p] = jjss;
			   }else{
           jjss['datacornejo']=annotateJSONDeep (path, js, jjss['datacornejo']);
           result[p]=jjss;
  			}
  		}
  	}
  }
  return result;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function typeEvent() {
  try{
  var globalOntologies = readOntologies ();
	var type = anchor.get ('formClasses').value;
	var type2 = type.substring (type.indexOf(':')+1, type.length);
	var ontNum2 = anchor.get ('formOntologiesClasses').value;
    var ontprefix2 = globalOntologies[ontNum2].prefix;
   var onturi2 = globalOntologies[ontNum2].uri;
    var j = '{"type":"'+type+'","classontologyprefix":"'+ontprefix2+'","classontologyuri":"'+onturi2+'","class":"'+type2+'"}';
    var js = JSON.parse(j);
    ldw.setTypeData(js);
    closeModal();
//    if (globalSignaler[XMLANNOTATION] || globalSignaler[XMLREANNOTATION]){
          savestorage();
  //  }
    globalSignaler[ANNOTATED] = true;
    consoleGlobalSignalers();
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function annotateEvent() {
  try{
 var globalOntologies = readOntologies ();
  	var value = anchor.get ('formValue').innerHTML;
	var re = anchor.get ('formRegex').value.trim();
  if (re.trim()){
  	var m = value.match(re);
  	if (m) {
			value = m[0];
		}else{
			value="";
			}
	}
	var uri="{}";
	if (anchor.get ('formDataSet')){
		uri = anchor.get ('formDataSet').value;
	}
if (!uri) {uri="{}";}
	if (!uri.trim()) {uri="{}";}
var pattern = '{.*}', reuri = new RegExp(pattern);
	uri = uri.replace(reuri, value);
	var ontNum = anchor.get ('formOntologiesProperties').value;
    var ontprefix = globalOntologies[ontNum].prefix;
    var onturi = globalOntologies[ontNum].uri;
    var path = anchor.get ('formPath').innerHTML;
	var dataSetValue = '';
	if (anchor.get ('formDataSet')){
		dataSetValue = anchor.get ('formDataSet').value;
	}
	if (dataSetValue){
		datasetSave(dataSetValue);
	}
  if (re) re = Base64.encode("/"+re+"/");
	var j = '{"type":"normal","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+anchor.get ('formProperties').value+'","dataset":"'+dataSetValue+'","path":"'+path+'", "regex":"'+re+'"}';
  var js = JSON.parse(j);
    js.objproperty=  globalSignaler[OBJPROPERTY];
  ldw.annotate(path, js);
  closeModal();
  consoleGlobalSignalers();
//  if (globalSignaler[XMLANNOTATION] || globalSignaler[XMLREANNOTATION]){
    savestorage();
  //}
  globalSignaler[ANNOTATED] = true;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function annotateInputEvent() {
  try{
 var globalOntologies = readOntologies ();
  	var value = anchor.get ('formValue').innerHTML;
	var uri="{}";
	var ontNum = anchor.get ('formOntologiesProperties').value;
    var ontprefix = globalOntologies[ontNum].prefix;
    var onturi = globalOntologies[ontNum].uri;
    var id = anchor.get ('formPath').innerHTML;
var re=null
	var j = '{"type":"input","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+anchor.get ('formProperties').value+'","dataset":"'+null+'","path":"'+id+'", "regex":"'+null+'"}';
  var js = JSON.parse(j);
    js.objproperty=  globalSignaler[OBJPROPERTY];
  ldw.annotate('input_'+id, js);
  closeModal();
  consoleGlobalSignalers();
  savestorage();
//  globalSignaler[ANNOTATED] = true;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function datasetSave(uri) {
  try{
  var datasets= readDatasets ();
	if (uri==null || !uri.trim()) return;
	for(var i=0;i<datasets.length;i++){
        if (datasets[i]['uri']===uri) return;
    }
	var j = '{"uri":"'+uri+'"}';
    var js = JSON.parse(j);
  datasets.push(js);
    writeDatasets(datasets);
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function setEmbeddedURI (value, regex, embeddedType){
  try{
  embeddedType = embeddedType.substring (embeddedType.indexOf(':')+1, embeddedType.length).toLowerCase();
  var internalURIPattern = ldw.get('uriexample');
  if (internalURIPattern.endsWith ('/')) internalURIPattern = internalURIPattern + '{type}';
  else internalURIPattern = internalURIPattern + '/{type}';
  var clas = ldw.getTypeDataClass();
  clas = clas.toLowerCase();

  var externalURIPattern = internalURIPattern.substring(0, internalURIPattern.indexOf ('/'+clas)+1)+embeddedType+'/{id}';

  embeddedType =embeddedType +"#1";
var uri = "http://...";
  if (regex.trim()){
    if (!value.startsWith("!@")){
      uri = getInterlink(externalURIPattern, getRegexpValue (regex, value));
    }else{
      uri = getInterlink(internalURIPattern, embeddedType);
    }
  }else{
    if (!value.startsWith("!@")){
      uri = getInterlink(externalURIPattern, value);
    }else{
      uri = getInterlink(internalURIPattern, embeddedType);
    }
  }
return uri;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function annotateEmbeddedEvent() {
  try{
  var globalOntologies = readOntologies ();
  	var value = anchor.get ('formValue').innerHTML;
	var re = anchor.get ('formRegex').value.trim();
	if (re.trim()){
		var m = value.match(re);
		if (m) {
			value = m[0];
		}else{
			value="";
		}
	}
	var type = anchor.get ('formClasses').value;
	type = type.substring (type.indexOf(':')+1, type.length);
	var index = anchor.get ('formProperties').value;
	index = index.substring (index.indexOf(':')+1, index.length);
	var uri = anchor.get ('formURIPattern').innerHTML;

  var value = anchor.get ('formAttributes').innerHTML;
  var value = anchor.get ('formAttributes').options[anchor.get ('formAttributes').selectedIndex].text;
  value = value.substring (value.indexOf(':')+1, value.length).toLowerCase();
  value = value.replace(new RegExp('"', 'g'), '').trim();
  var embeddedType = anchor.get ('formClasses').value;
  var regex = anchor.get ('formRegex').value.trim();
  var uri = setEmbeddedURI (value, regex, embeddedType);

  var internalURIPattern = ldw.get('uriexample');
  if (internalURIPattern.endsWith ('/')) internalURIPattern = internalURIPattern + '{type}';
  else internalURIPattern = internalURIPattern + '/{type}';
  var clas = ldw.getTypeDataClass();
  clas = clas.toLowerCase();
  var externalURIPattern = internalURIPattern.substring(0, internalURIPattern.indexOf ('/'+clas)+1)+embeddedType+'/{id}';
var uri = externalURIPattern;
	uri = uri.replace('{type}', type.toLowerCase());
    uri = uri.replace('{attributevalue}', '{'+index+'}');
    var ontNum = anchor.get ('formOntologiesProperties').value;
    var ontprefix = globalOntologies[ontNum].prefix;
    var onturi = globalOntologies[ontNum].uri;
    var ontNum2 = anchor.get ('formOntologiesClasses').value;
    var ontprefix2 = globalOntologies[ontNum2].prefix;
    var onturi2 = globalOntologies[ontNum2].uri;
    var path=anchor.get ('formPath').innerHTML;
    if (re) re = Base64.encode("/"+re+"/");
    var j = '{"type":"embedded","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+anchor.get ('formProperties').value+'","uripattern":"'+uri+'","path":"'+path+'","attribute":"'+anchor.get ('formAttributes').value+'","regex":"'+re+'","classontologyprefix":"'+ontprefix2+'","classontologyuri":"'+onturi2+'","class":"'+anchor.get ('formClasses').value+'"}';
    var js = JSON.parse(j);
    ldw.annotate(path, js);
    closeModal();
  //  if (globalSignaler[XMLANNOTATION] || globalSignaler[XMLREANNOTATION]){
      savestorage();
    //}
    globalSignaler[ANNOTATED] = true;
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function changeButtonColorAnnotated(){
  try{
  var color = 'cyan';
  if (globalButtonContainner)   globalButtonContainner.setAttribute('style', 'background-color:'+color);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

////////

function createJSONDataType(path,name, value){
  try{
	var j = JSON.parse('{}');
  j['path']=path;
  j['name']=name;
  j['datacornejo']=value;
	j['type']='value';
	return j;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createJSONObjectProperty(path,name, js){
  try{
	var j = JSON.parse('{}');
  j['path']=path;
  j['name']=name;
	j['datacornejo']=js;
	j['type']='recursive';
	return j;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createJSONArrayObjectProperty(path,name,variable){
  try{
	var j = JSON.parse('{}');
  j['path']=path;
  j['name']=name;
	j['datacornejo']=JSON.parse('{}');  //asigned afterwards
	j['type']='for';
	j['var']=variable;
	return j;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function jsonAdd (target, source){
  try{
	for (var p in source) {
  		if(source.hasOwnProperty(p) ) {
  			target[p]= source[p];
  		}
  	}
  	return target;
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

////////////////////////////
/////Windows seccion
///////////////////////////

function openObjProp (e){
  try{
var h = '%20%20%3Ctable%20style%3D%22width%3A100%25%22%20align%3D%22center%22%3E%0A%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%20%20colspan%3D%222%22%20%20align%3D%22center%22%3E%0A________________________INTERLINK%20URI________________________%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%20%0A%20%3Ctr%3E%0A%20%20%20%20%3Ctd%20%20style%3D%22width%3A30%25%22%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%20style%3D%22width%3A30%25%22%3E%0A%20URI%20PATTERN%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%20style%3D%22width%3A30%25%22%3E%0A%20VALUE%20PATTERN%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY...%3C%2Foption%3E%0A%3C%2Fselect%3E%20%3C%3D%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formDataSetSelect%22%3E%0A%3Coption%20value%3D%22%22%3ESelect%20INTERLINK%20URI%20PATTERN...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%3Cinput%20id%3D%22formDataSet%22%20type%3D%22text%22%20name%3D%22formDataSet%22%20%20style%3D%22width%3A90%25%22%20value%3D%22%22%20%2F%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%20style%3D%22width%3A50%25%22%20%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%3Cspan%20id%3D%22formPath%22%20hidden%3E%5B%27person%27%5D%5B%27name%27%5D%3C%2Fspan%3E%20%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%7B%22ontology%3Aproperty%22%20%3A%20%22http%3A%2F%2Furipattern%2Fattributevalue%22%7D%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';

  createModalContent('Association mapping', undecode(h));

  anchor.get ('formOntologiesProperties').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesProperties'));
  anchor.get ('formOntologiesProperties').onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchor.get ('formDataSetSelect').innerHTML = datasetSelects();
  sortSelect(anchor.get ('formDataSetSelect'));
	anchor.get ('formDataSetSelect').onchange = function(e) {formDataSetSelectEvent(e);};
  anchor.get ('formPath').innerHTML = e.target.getAttribute("path");
  anchor.get ('formValue').innerHTML = e.target.getAttribute("value");
  anchor.get ('formPreviewButton').onclick = function(e) {previewEvent(e);};
  globalSignaler[OBJPROPERTY]=true;
  anchor.get ('formAnnotateButton').onclick = function(e) {annotateEvent(e);};
  anchor.get ('formAddOntologyButton').onclick = function(e) {addOntology(e);};
  globalButtonContainner2 = globalButtonContainner;
  globalButtonContainner = e.target.parentNode.parentNode;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addOntology (){
  try{
  loadNewOntology();
  anchor.get ('formOntologiesProperties').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesProperties'));
  anchor.get ('formOntologiesProperties').onchange = function(e) {ontologyPropertySelectionEvent(e);};
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addOntologyClass (){
  try{
  loadNewOntology();
  anchor.get ('formOntologiesProperties').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesProperties'));
  anchor.get ('formOntologiesProperties').onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchor.get ('formOntologiesClasses').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesClasses'));
  anchor.get ('formOntologiesClasses').onchange = function(e) {ontologyClassSelectionEvent(e);};
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addOntologyOnlyClass (){
  try{
  loadNewOntology();
  anchor.get ('formOntologiesClasses').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesClasses'));
  anchor.get ('formOntologiesClasses').onchange = function(e) {ontologyClassSelectionEvent(e);};
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function openDataProp (e){
  try{
var h ='%20%20%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%20VALUE%20PATTERN%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY...%3C%2Foption%3E%0A%3C%2Fselect%3E%20%3C%3D%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%3Cspan%20id%3D%22formPath%22%20hidden%3E%5B%27person%27%5D%5B%27name%27%5D%3C%2Fspan%3E%20%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%7B%22ontology%3Aproperty%22%20%3A%20%22http%3A%2F%2Furipattern%2Fattributevalue%22%7D%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
 createModalContent('Property mapping', undecode(h));

  anchor.get ('formOntologiesProperties').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesProperties'));
  anchor.get ('formOntologiesProperties').onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchor.get ('formPath').innerHTML = e.target.getAttribute("path");
  anchor.get ('formValue').innerHTML = e.target.getAttribute("value");
  anchor.get ('formPreviewButton').onclick = function(e) {previewEvent(e);};
  globalSignaler[OBJPROPERTY]=false;
  anchor.get ('formAnnotateButton').onclick = function(e) {annotateEvent(e);};
  anchor.get ('formAddOntologyButton').onclick = function(e) {addOntology(e);};
  globalButtonContainner = e.target.parentNode.parentNode;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function previewCode() {
  try{
  var path = anchor.get ('formPath').innerHTML;
  var value = anchor.get ('formValue').innerHTML;
	var re = anchor.get ('formRegex').value.trim();
  var txtcode = "";
	var uri=null;
	if (anchor.get ('formDataSet')){
		uri = anchor.get ('formDataSet').value;
	}

  if (uri && re){
    txtcode = "oneJSONLD ['"+anchor.get ('formProperties').value+"'] = getInterlink('"+uri+"', getRegexpValue(/"+re+"/, getValue(\"oneJSON"+path+"\")));";
  }
  if (uri && !re){
    txtcode = "oneJSONLD ['"+anchor.get ('formProperties').value+"'] = getInterlink('"+uri+"', getValue(\"oneJSON"+path+"\"));";
  }
  if (!uri && re){
    txtcode = "oneJSONLD ['"+anchor.get ('formProperties').value+"'] = getRegexpValue(/"+re+"/, getValue(\"oneJSON"+path+"\"));";
  }
  if (!uri && !re){
    txtcode = "oneJSONLD ['"+anchor.get ('formProperties').value+"'] = getValue(\"oneJSON"+path+"\");";
  }
anchor.get ('formCodetxt').value = txtcode;
previewEvent();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getInterlink (urlpattern, value){
	try{return urlpattern.replace(/{.*}/, value);}catch(err){return null;}}

function getRegexpValue(regexp, value){
 	try{return value.match(regexp)[0];}catch(err){return null;}}

function getUpperCaseValue(value){
 	try{return value.charAt(0).toUpperCase() + value.slice(1);}catch(err){return null;}}

function getValue(dataPath) {
	try{return eval(dataPath) || null; }catch(err){return null;}}

var oneJSON= {};
function previewEventCODE() {
  var oneJSONLD = {};
  var code2 = anchor.get ('formCodetxt').innerHTML;
  var code = anchor.get ('formCodetxt').value;
var restxt = "??";
try{
  eval (code);
  restxt = JSON.stringify(oneJSONLD);
}catch (e){restxt =  e;}
	anchor.get ('formPreview').innerHTML = restxt;
}

function previewEvent() {
  try{
	var value = anchor.get ('formValue').innerHTML;
	var re = anchor.get ('formRegex').value.trim();
	if (re.trim()){
		var m = value.match(re);
		if (m) {
			value = m[0];
		}else{
			value="";
			}
	}
	var uri="{}";
	if (anchor.get ('formDataSet')){
		uri = anchor.get ('formDataSet').value;
	}
	if (!uri.trim()) {uri="{}";}
	var pattern = '{.*}', reuri = new RegExp(pattern);
	uri = uri.replace(reuri, value);
	anchor.get ('formPreview').innerHTML = '{"'+anchor.get ('formProperties').value+'" : "' + uri+'"}';
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function previewEmbededEvent() {
  try{
var value = anchor.get ('formAttributes').innerHTML;
var value = anchor.get ('formAttributes').options[anchor.get ('formAttributes').selectedIndex].text;
value = value.substring (value.indexOf(':')+1, value.length).toLowerCase();
value = value.replace(new RegExp('"', 'g'), '').trim();
var re = anchor.get ('formRegex').value.trim();
    var embeddedType = anchor.get ('formClasses').value;
    var attributePath=anchor.get ('formAttributes').value;
    var regex = anchor.get ('formRegex').value.trim();
    var uri = setEmbeddedURI (value, regex, embeddedType);

    anchor.get ('formPreview').innerHTML = '';
    anchor.get ('formPreview').innerHTML += '{"'+anchor.get ('formProperties').value+'" : {';
    anchor.get ('formPreview').innerHTML += ' "@type" : "' +embeddedType+'",';
  	anchor.get ('formPreview').innerHTML += ' "@id" : "' + uri + '"}} ';
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

  function openInput (e){
    try{
  	var h ='%20%20%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY...%3C%2Foption%3E%0A%3C%2Fselect%3E%20%0A%3C%2Ftd%3E%0A%3Ctd%3E%0A%3Cspan%20id%3D%22formPath%22%3Eid%3C%2Fspan%3E%3A%20%22%3Cspan%20id%3D%22formValue%22%3Epizza%3C%2Fspan%3E%22%20%0A%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
  	createModalContent('Input parameter annotation', undecode(h));

    anchor.get ('formOntologiesProperties').innerHTML = ontologySelects();
    sortSelect(anchor.get ('formOntologiesProperties'));
    anchor.get ('formOntologiesProperties').onchange = function(e) {ontologyPropertySelectionEvent(e);};
    anchor.get ('formPath').innerHTML = e.target.getAttribute("path");
    anchor.get ('formValue').innerHTML = e.target.getAttribute("value");
    globalSignaler[OBJPROPERTY]=false;
    anchor.get ('formAnnotateButton').onclick = function(e) {annotateInputEvent(e);};
    anchor.get ('formAddOntologyButton').onclick = function(e) {addOntology(e);};
    globalButtonContainner = e.target.parentNode.parentNode;
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function openTypetion (e){
  try{
	var h ='%3Cb%3ETarget%20Class%20(%40type)%3C%2Fb%3E%3Cbr%2F%3E%0AOntology%3A%20%3Cselect%20id%3D%22formOntologiesClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyClassButton%22%3EAdd%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0AClass%3A%20%3Cselect%20id%3D%22formClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Efirst%20select%20an%20ontology%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%3Chr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E';
	createModalContent('Resource type definition', undecode(h));

  anchor.get ('formOntologiesClasses').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesClasses'));
  anchor.get ('formOntologiesClasses').onchange = function(e) {ontologyClassSelectionEvent(e);};
  anchor.get ('formAnnotateButton').onclick = function(e) {typeEvent(e);};
  anchor.get ('formAddOntologyClassButton').onclick = function(e) {addOntologyOnlyClass(e);};
  globalButtonContainner = e.target.parentNode.parentNode;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function openEmbedded (e){
  try{
  var h ='%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%40type%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%40id%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyClassButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Eselect%20a%20CLASS%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3C%2Fspan%3E%20%0A%3Cspan%20id%3D%22formPath%22%20type%3D%22text%22%20hidden%20value%3D%22%22%3E%3C%2Fspan%3E%20%0A%3Cselect%20id%3D%22formAttributes%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20ATTRIBUTE...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%22%3Cspan%20id%3D%22formURIPattern%22%20type%3D%22text%22%20value%3D%22%22%3E%3C%2Fspan%3E%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%7B%22ontology%3Aproperty%22%20%3A%20%7B%22%40type%22%20%3A%20ontology2%3Aproperty2%2C%20%22%40id%22%20%3A%20%22http%3A%2F%2Furi%2Fattributevalue%22%7D%7D%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
  createModalContent('Nested resource mapping', undecode(h));

  anchor.get ('formOntologiesProperties').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesProperties'));
  anchor.get ('formOntologiesProperties').onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchor.get ('formOntologiesClasses').innerHTML = ontologySelects();
  sortSelect(anchor.get ('formOntologiesClasses'));
  anchor.get ('formOntologiesClasses').onchange = function(e) {ontologyClassSelectionEvent(e);};
  var type = ldw.getTypeDataClass();
  type = type.toLowerCase();
  anchor.get ('formPath').innerHTML = e.target.getAttribute("path");
  anchor.get ('formValue').innerHTML = e.target.getAttribute("value");
  anchor.get ('formPreviewButton').onclick = function(e) {previewEmbededEvent(e);};
  anchor.get ('formAnnotateButton').onclick = function(e) {annotateEmbeddedEvent(e);};
  anchor.get ('formAttributes').innerHTML = attributeSelects(e.target.getAttribute("path"));
  sortSelect(anchor.get ('formAttributes'));
  anchor.get ('formAttributes').onchange = function(e) {attributeSelectionEvent(e);};
  anchor.get ('formAddOntologyButton').onclick = function(e) {addOntology(e);};
  anchor.get ('formAddOntologyClassButton').onclick = function(e) {addOntologyClass(e);};
  globalButtonContainner = e.target.parentNode.parentNode;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function sortSelect(selElem) {
  try{
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    //var op = new Option('Select...', '');
    //selElem.options[0] = op;
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
//        selElem.options[i+1] = op;
        selElem.options[i] = op;
    }
    return;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function getAnnotationbyPath (globalannotation, path){
  try{
    path = path.replace(/"/g, '');
	path = path.replace(/\[results\]/g, '');
	return getItByPath(globalannotation, path);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getItByPath (jsSource, path){
  try{
  for (var p in jsSource) {
    	if(jsSource.hasOwnProperty(p) ) {
      var pat = jsSource[p]['path'];
      if (pat == path){
  			var jjss = jsSource[p];
  			return jsSource[p];
  		}else{
        var type = typeof jsSource[p]['datacornejo'];
	  		if (type=="undefined" || type=="number" || type=="string" || jsSource[p]== null){
				      //return null;
			   }else{
           var re= getItByPath (jsSource[p]['datacornejo'], path);
           if (re != null) return re;
  			}
  		}
  	}
  }
  return null;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function attributeSelects(pathOriginal){
  try{
	var path = pathOriginal;
	path = path.replace(/\[/g, '');
	path = path.replace(/'/g, '');
	path = path.replace(/"/g, '');
	var res = path.split("]");
  var data = ldw.getStructure();
	var name='';
  data= getAnnotationbyPath (data, pathOriginal);
  var selects = '<option value="">!@id = URI/{@type}#1 </option>';
var data2 = data;
  while (data2['type'] == 'recursive'){
    data = data2;
    data2 = firstChild (data['datacornejo']);
  }
  data = data['datacornejo'];
  for (var p in data) {
		if(data.hasOwnProperty(p) ) {
 			selects += '<option value="'+data[p]['path']+'">"'+data[p]['name']+'" : "'+data[p]['datacornejo']+'"</option>';
 		}
	}
	return selects;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function attributeSelectionEvent() {
  try{
	var path = anchor.get ('formAttributes').value;
  if (path="") {var value = "";}
  else {var value = runJSON(path);}
 	anchor.get ('formValue').innerHTML= value;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function runJSON(path){
  try{
	var data = ldw.get("globalsource").query.results;
	path = path.replace(/\[/g, '');
	path = path.replace(/'/g, '');
	path = path.replace(/"/g, '');
	var res = path.split("]");
    var name ='';
	for (var i = 0; i<res.length-1; i++){
    name = res[i];
    if (name.indexOf("LOOP") === 0){
      data= data [0];
    }else{
        if (data[0]!= undefined) {data= data [0];}
  		data= data [name];
    }
	}
	return data;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function openOntology (){
  loadNewOntology();
}

///////////////////////////
/////MODAL window Manager  seccion
//////////////////////////

function createModal (){
  try{
  var div1 = document.createElement('div');
    div1.id='modal_wrapper';
    div1.class='';
    var div2 = document.createElement('div');
    div2.id='modal_window';
	  div2.innerHTML='<h3><span id="modaltitle">Fill in the form: <span></h3><span id="modal_content" style="text-align: left;">... </span><button id="modal_close" >Cancel</button>';
    div1.appendChild(div2);

    var div3 = document.createElement('div');
      div3.id='modal_wrapper2';
      div3.class='';
      var div4 = document.createElement('div');
      div4.id='modal_window2';
  	  div4.innerHTML='<h3><span id="modaltitle2">Please, wait. <span></h3><span id="modal_content2" style="text-align: left;">Working... </span>';
      div3.appendChild(div4);

      anchor.get ("Body").appendChild(div1);
      anchor.get ("Body").appendChild(div3);
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createModalContent (name, html){
  try{
   	anchor.get ('modal_content').innerHTML = html;
    anchor.get ('modaltitle').innerHTML = name;
	openModal();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

var isOpenModal = false;
var openModal = function(e) {
   isOpenModal = true;
  	anchor.get ('modal_wrapper').className = "overlay";
//  e.preventDefault ? e.preventDefault() : e.returnValue = false;
};

var closeModal = function(e) {
   isOpenModal = false;
  anchor.get ('modal_wrapper').className = "";
  //e.preventDefault ? e.preventDefault() : e.returnValue = false;
};

var rememberisOpenModal = false;
var working = function() {
  try{
      rememberisOpenModal = isOpenModal;
  logit('I am working!!'+rememberisOpenModal);
  closeModal();
  	anchor.get ('modal_wrapper2').className = "overlay";
//  e.preventDefault ? e.preventDefault() : e.returnValue = false;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

var lazing = function() {
  try{
    anchor.get ('modal_wrapper2').className = "";
    if (rememberisOpenModal) openModal();
  logit('I am lazing!!!'+rememberisOpenModal);
  //e.preventDefault ? e.preventDefault() : e.returnValue = false;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}



var clickHandler = function(e) {
  if (!e.target) e.target = e.srcElement;
  if (e.target.tagName == "DIV") {
       if (e.target.id != "modal_window") ;//closeModal(e);
  }
};

var keyHandler = function(e) {
  if (e.keyCode == 27) openModal(e);
};

var modal_init = function() {
  try{
  createModal ();
  if (document.addEventListener) {
   anchor.get ("modal_close").addEventListener("click", closeModal, false);
   document.addEventListener("click", clickHandler, false);
   document.addEventListener("keydown", keyHandler, false);
  } else {
   anchor.get ("modal_close").attachEvent("onclick", closeModal);
   document.attachEvent("onclick", clickHandler);
   document.attachEvent("onkeydown", keyHandler);
  }
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////////
//// STYLES
//////////////
function appendStyles (){
  try{
    var styles = '#modal_window{display:none;  z-index:2000;  position:fixed;  left:0%;  top:0%;  width:90%;  padding:10px 20px;  background:#fff;  border:5px solid #999;  border-radius:10px;  box-shadow:0 0 10px rgba(0,0,0,.5)}';
    styles +=  ' #modal_wrapper.overlay:before{content:" ";   width:100%;  height:100%;  position:fixed;  z-index:1000;  top:0;  left:0;  background:#000;  background:rgba(0,0,0,.7)}';
    styles += ' #modal_wrapper.overlay';
    styles +=  ' #modal_window{display:block}';
    styles += ' #modal_window2{display:none;  z-index:2000;  position:fixed;  left:0%;  top:0%;  width:90%;  padding:10px 20px;  background:#fff;  border:5px solid #999;  border-radius:10px;  box-shadow:0 0 10px rgba(0,0,0,.5)}';
    styles +=  ' #modal_wrapper2.overlay:before{content:" ";   width:100%;  height:100%;  position:fixed;  z-index:1000;  top:0;  left:0;  background:#000;  background:rgba(0,0,0,.7)}';
    styles += ' #modal_wrapper2.overlay';
    styles +=  ' #modal_window2{display:block}';
    GM_addStyle(styles);
    GM_addStyle("span.blocked > button {border-radius:5px;}");
    GM_addStyle("span.blocked > span {display: none; position: relative;}");//ocultar menu
	  GM_addStyle("span.blockedbutton > button {border-radius:500px; }");//ocultar menu
    GM_addStyle("span.ldwnav > button {border-radius:5px;}");
    GM_addStyle("span.ldwnav > span {display: none; position: relative;}");//ocultar menu
    GM_addStyle("span.ldwnav:hover span {display: inline-block;}");//aparecer menu
 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function undecode (coded){
  try{
var undecoded = decodeURI(coded);
var pattern = "%3A", re = new RegExp(pattern, "g"), value = ':';
undecoded=undecoded.replace (re, value);
pattern = "%2F", re = new RegExp(pattern, "g"), value = '/';
undecoded=undecoded.replace (re, value);
pattern = "%3D", re = new RegExp(pattern, "g"), value = '=';
undecoded=undecoded.replace (re, value);
pattern = "%40", re = new RegExp(pattern, "g"), value = '@';
undecoded=undecoded.replace (re, value);
pattern = "%23", re = new RegExp(pattern, "g"), value = '#';
undecoded=undecoded.replace (re, value);
pattern = "%3B", re = new RegExp(pattern, "g"), value = ';';
undecoded=undecoded.replace (re, value);
pattern = "%2C", re = new RegExp(pattern, "g"), value = ',';
undecoded=undecoded.replace (re, value);
pattern = "%3F", re = new RegExp(pattern, "g"), value = '?';
undecoded=undecoded.replace (re, value);
pattern = "%2B", re = new RegExp(pattern, "g"), value = '+';
undecoded=undecoded.replace (re, value);
pattern = "%26", re = new RegExp(pattern, "g"), value = '&';
undecoded=undecoded.replace (re, value);
return undecoded;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////////
//// DataSets Manager   seccion
//////////////

function datasetSelects(){
  try{
var datasets= readDatasets ();
	var selects = '<option value="">Select or write URI pattern...</option>';
	for (var i =0; i<datasets.length; i++){
		selects += '<option value="'+datasets[i].uri+'">'+datasets[i].uri+'</option>';
	}
	return selects;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function datasetEvent() {
  try{
  var datasets= readDatasets ();
	var uri = anchor.get ('formURIPattern').value;
	if (uri==null || !uri.trim()) return;
	var j = '{"uri":"'+uri+'"}';
    var js = JSON.parse(j);
    datasets.push(js);
    writeDatasets(datasets);
    closeModal();
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function readDatasets (){
  try{
	var datasets = readData("datasets");
  	if (datasets==null){
	  	datasets = JSON.parse('[{"uri":"http://dbpedia.org/resource/{$VALUE}"},{"uri": "http://rdf.onekin.org/API/CLASS/{$VALUE}"}]');
  		writeDatasets(datasets);
  	}
    return datasets;
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function writeDatasets(datasets){
  try{
    writeData("datasets", datasets);
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////////
//// Ontology Manager   seccion
//////////////

function loadNewOntology (){
  try{
  var globalOntologies = readOntologies ();
  window.open(lovurl,'_four');
	var prefix = prompt("Enter an ontology prefix from http://lov.okfn.org/ opened in the tab");
	if (prefix == null) return;
	readOntologies();
	var j = JSON.parse('{"prefix":"'+prefix+'", "url":"", "uri":""}');
	globalOntologies.push (j);
	writeOntologies(globalOntologies);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function readOntologies (){
  try{
	var globalOntologies = readData("globalOntologies");
  	if (globalOntologies==null){
			globalOntologies = JSON.parse('[{"prefix":"rdf", "title": "", "url":"", "uri":""}, {"prefix":"rdfs"}, {"prefix":"schema"}, {"prefix":"foaf"}, {"prefix":"dcterms"}, {"prefix":"owl"}, {"prefix":"geo"}, {"prefix":"sioc"}, {"prefix":"skos"}, {"prefix":"void"}, {"prefix":"bio"}, {"prefix":"qb"}, {"prefix":"rss"}, {"prefix":"con"}, {"prefix":"doap"}, {"prefix":"dcat"}, {"prefix":"adms"}]');
  		writeOntologies(globalOntologies);
  	}
    return globalOntologies
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function writeOntologies(globalOntologies){
  try{
    writeData("globalOntologies", globalOntologies);
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function ontologySelects(){
  try{
  var globalOntologies = readOntologies ();
	var selects = '<option value="">Select an ONTOLOGY...</option>';
	for (var i =0; i<globalOntologies.length; i++){
		if (globalOntologies[i].title)
			selects += '<option value="'+i+'">'+globalOntologies[i].prefix+' = '+globalOntologies[i].title+'</option>';
		else
			selects += '<option value="'+i+'">'+globalOntologies[i].prefix+'</option>';
	}
	return selects;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function ontologyPropertySelectionEvent() {
  try{
working();
  var globalOntologies = readOntologies ();
 	var num = anchor.get ('formOntologiesProperties').value;
 	var ontology = globalOntologies[num];
 	if (ontology == null){
    lazing();
    return ;}
	var url = urlOWL1+ontology['prefix']+urlOWL2;
    globalOntologyNum = num; //ontology.prefix;
    var prefix = globalOntologies[globalOntologyNum].prefix;
	var ontologyDescription = readData('ontology'+prefix);
  if (ontologyDescription == null){
    globalOntologyFunction = loadOntologyAttributes;
    callURLJSON(url, loadOntology);
  }else{
  	if (Math.random()< globalLowRefreshProb) {
  		globalOntologyFunction = loadOntologyAttributes;
  		callURLJSON(url, loadOntology);
	  }else {
	    globalOntologyDescription= ontologyDescription;
		   loadOntologyAttributes(ontologyDescription.n3);
       lazing();
    }
  }
}catch(err){infoit (err.lineNumber+' :: '+ err.message);lazing();}}

function formDataSetSelectEvent() {
  try{

	var value =anchor.get ('formDataSetSelect').value;
	anchor.get ('formDataSet').value= value;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function loadOntology(obj){
  try{
  var globalOntologies = readOntologies ();
obj = obj.query.results.json;
	globalOntologyDescription = JSON.parse ('{"prefix":"'+obj.prefix+'"}');
	globalOntologyDescription.nsp = obj.nsp;
	globalOntologyDescription.uri = obj.uri;
	if (obj.titles.length==null) globalOntologyDescription.title = obj.titles.value;
	else globalOntologyDescription.title = obj.titles[0].value;

	if (obj.versions.length==null) 	globalOntologyDescription.url = obj.versions.fileURL;
	else globalOntologyDescription.url = obj.versions[0].fileURL;
	var url = n3url1 +globalOntologyDescription.url+ n3url2;
	globalOntologies[globalOntologyNum]= globalOntologyDescription;
	callURL(url, globalOntologyFunction);
	writeOntologies(globalOntologies);
  lazing();
}catch(err){lazing();infoit (err.lineNumber+' :: '+ err.message);}}

function loadOntologyAttributes(obj){
  try{
	var prefix = globalOntologyDescription.prefix;
	var nsp =globalOntologyDescription.nsp;
	var url = globalOntologyDescription.url;
	var uri = globalOntologyDescription.uri;
	globalOntologyDescription.n3= obj;
    writeData('ontology'+prefix, globalOntologyDescription);
	if (uri == ""){
		uri=url;
	}
	var find = '\.';
	var re = new RegExp(find, 'g');
	var uri2 = uri.replace('.', '\\.');
	uri2=uri;
	find = "prefix.*"+uri2;
	re = new RegExp(find, 'i');
	var found = obj.match(re);
	if (found==null){
		prefix2=prefix;
	}else{
	for (var i = 0; i< found.length; i++){
    	var prefix2 = found[i];
    	prefix2 = prefix2.substr(prefix2.indexOf (' ')+1);
    	prefix2 = prefix2.substr(0,prefix2.indexOf (':'));
    	if (prefix2.trim () != null) break;
	}
	}
 	if (prefix2.trim () == null) prefix2=prefix;
	 find = prefix2+':';
    re = new RegExp(find, 'g');
     obj = obj.replace(re, nsp);
	var html = "";//'<option value="">Select property...</option>"';
	var addto = true;

	find = nsp+ "[^ ]*";
	re = new RegExp(find, 'gi');
	var found = obj.match(re);
	obj = found;
	var textarr=JSON.parse('{}');
  	for(var i = 0; i <obj.length; i++) {
				addto = false;
				var text = obj[i];
				text= text.replace (nsp, "");
				if(!text) continue;
					text=text.trim();
					if(text[0]=='#') text=text.substr(1);
					if(text[0]=='/') text=text.substr(1);
					if(text[text.length-1]=='"') continue;
					if(text[text.length-1]=="'") continue;
					if(text.indexOf("")>0) continue;
					text=text.replace('>', '');
					text=text.replace('&gt;', '');
					text=text.replace('\\n', '');
				if(!text) continue;
				if (text[0]!= text[0].toUpperCase()){
						text= prefix+":"+text;
						text = text.trim();
						addto = true;
				}
				if (addto){
            		textarr[text]=text;
				}
        }
      for (var prop in textarr) {
        html += "<option value=\"" + prop + "\">" + prop + "</option>";
        }
        anchor.get ('formProperties').innerHTML = html;
        sortSelect(anchor.get ('formProperties'));
      }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function ontologyClassSelectionEvent() {
  try{
  var globalOntologies = readOntologies ();
 	var num = anchor.get ('formOntologiesClasses').value;
	var ontology = globalOntologies[num];
	if (ontology == null) return ;
	var url = urlOWL1+ontology['prefix']+urlOWL2;
    globalOntologyNum = num; //ontology.prefix;
  var prefix = globalOntologies[globalOntologyNum].prefix;
  var ontologyDescription = readData('ontology'+prefix);

  if (ontologyDescription == null){
    globalOntologyFunction = loadOntologyClasses;
    callURLJSON(url, loadOntology);
  }else{
  	if (Math.random()< globalLowRefreshProb) {
  		globalOntologyFunction = loadOntologyClasses;
  		callURLJSON(url, loadOntology);
	}else {
	    globalOntologyDescription= ontologyDescription;
		loadOntologyClasses(ontologyDescription.n3);
    	}
  }
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function loadOntologyClasses(obj){
  try{
	var prefix = globalOntologyDescription.prefix;
	var nsp =globalOntologyDescription.nsp;
	var url = globalOntologyDescription.url;
	var uri = globalOntologyDescription.uri;
	globalOntologyDescription.n3= obj;
    writeData('ontology'+prefix, globalOntologyDescription);
	if (uri == ""){
		uri=url;
	}

	var find = '\.';
	var re = new RegExp(find, 'g');
	var uri2 = uri.replace('.', '\\.');
	uri2=uri;
  find = "prefix.*: &lt;"+nsp;

	re = new RegExp(find, 'i');
	var found = obj.match(re);
	if (found==null){
		prefix2=prefix;
	}else{
	for (var i = 0; i< found.length; i++){
    	var prefix2 = found[i];
    	prefix2 = prefix2.substr(prefix2.indexOf (' ')+1);
    	prefix2 = prefix2.substr(0,prefix2.indexOf (':'));
   	if (prefix2.trim () != null) break;
	}
	}
  	if (prefix2.trim () == null) prefix2=prefix;
	 find = prefix2+':';
     re = new RegExp(find, 'g');
     obj = obj.replace(re, nsp);
	var html = "";//'<option value="">Select Class...</option>"';
	var addto = true;
	find = nsp+ "[^ ]*";
	re = new RegExp(find, 'gi');
	var found = obj.match(re);
	obj = found;
	var textarr=JSON.parse('{}');
		for(var i = 0; i <obj.length; i++) {
				addto = false;
				var text = obj[i];
				text= text.replace (nsp, "");
					if(!text) continue;
					text=text.trim();
					if(text[0]=='#') text=text.substr(1);
					if(text[0]=='/') text=text.substr(1);
					if(text[text.length-1]=='"') continue;
					if(text[text.length-1]=="'") continue;
					if(text.indexOf("")>0) continue;
					text=text.replace('>', '');
					text=text.replace('&gt;', '');
					text=text.replace('\\n', '');
					if(!text) continue;
					if (text[0]== text[0].toUpperCase()){
						text= prefix+":"+text;
						text = text.trim();
						addto = true;
						}
					if (addto){
            			textarr[text]=text;
					}
        }
        for (var prop in textarr) {
        	html += "<option value=\"" + prop + "\">" + prop + "</option>";
        }
		anchor.get ('formClasses').innerHTML = html;
		sortSelect(anchor.get ('formClasses'));
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

////////////////
////Permanent register  seccion
////////////////

function writeData (key, value){
try{
	var data = GM_getValue('LDWdata');
  if (data == null){data = "{}"};
  var jdata = JSON.parse(data);
  jdata[key]= value;
	GM_setValue('LDWdata', JSON.stringify(jdata));
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function readData (key){
try{
	var data = GM_getValue('LDWdata');
  if (data == null){data = "{}"};
  var jdata = JSON.parse(data);
  return jdata[key];
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////////////
////COMUNICATION   seccion
//////////////////


function callURL(url, callback){
try{
  logit ('URLnormal calling: '+url);
  var xmlhttp = createCrossDomainRequest();
  xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }else{
    		alert("Problem retrieving data. Status: "+xmlhttp.status + ' | '+xmlhttp.statusText);
  		}
    }
	};
xmlhttp.send(null);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function callURLJSON(url, callback){
  try{
//  url = url.trim();
  var xmlhttp = createCrossDomainRequest();
  xmlhttp.open('GET', url, true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
            var obj = JSON.parse(xmlhttp.responseText);
            callback (obj);
         }else{
    		alert("Problem retrieving data. Status: "+xmlhttp.status + ' | '+xmlhttp.statusText);
  		}
    }
};
xmlhttp.send(null);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createCrossDomainRequest(){
  try{
var request;
if (window.XDomainRequest){   //IE8
  request = new window.XDomainRequest();
} else if (window.XMLHttpRequest)
  {// code for all new browsers
      request=new XMLHttpRequest();
  }
else if (window.ActiveXObject)
  {// code for IE5 and IE6
      request=new ActiveXObject("Microsoft.XMLHTTP");
  }
if (request!=null)
  {
      return request;
  }
else
  {
      alert("Your browser does not support XMLHTTP.");
  }
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////////////////////////////////
///////////////////////////////////////
////////  EDITOR AUGMENTATION
///////////////////////////////////////
///////////////////////////////////////

/////////////////////
/////Editor augmentation
/////////////////

function augmentEditor(){
  try{
	addPublishButton();
	changeTitles();
	changeTemplates();
//	createODTFolder();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

////////////////////
////////////////////

function changeTitles(){
  try{
	anchor.get ('a+TABLES').innerHTML = 'My YQL Tables / My LDW';
	anchor.get ('option+YQL Table').innerHTML = 'YQL Table / LDW';
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

////////
//Coupled and decoupled templates
////
function decoupledTemplate (){
  try{
	 anchor.get ('select-template').innerHTML=undecode('%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%20%20%20%20%20%20%3Ctable%20xmlns%3D%22http%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fschema%2Ftable.xsd%22%3E%0A%20%20%20%20%3Cmeta%3E%0A%20%20%20%20%20%20%20%20%3Cauthor%3ECOMPANY%20NAME%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3ETABLE%20DESCRIPTION%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3EAPI%20DOCUMENTATION%20URL%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3EURL%20TO%20OBTAIN%20CREDENTIALS%3C%2FapiKeyURL%3E%0A%20%20%20%20%20%20%20%20%3C!--lowering--%3E%0A%20%20%20%20%20%20%20%20%3CsampleQuery%3E%20URIPattern%3A%20http%3A%2F%2Frdf.onekin.org%2FSERVICE%2FTYPE%2F%7BPARAMS%7D%3C%2FsampleQuery%3E%0A%20%20%20%20%20%20%20%20%3CsampleQuery%3E%20URIExample%3A%20http%3A%2F%2Frdf.onekin.org%2F.......%2F....%2F.....%3C%2FsampleQuery%3E%0A%20%20%20%20%3C%2Fmeta%3E%0A%20%20%20%20%3Cbindings%3E%0A%20%20%20%20%20%20%20%20%3C!--grounding--%3E%0A%20%20%20%20%3Cselect%20itemPath%3D%22results.*%22%20produces%3D%22XML%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinputs%3E%0A%09%09%3Ckey%20id%3D%22PARAM%22%20as%3D%22SEMANTIC_ANNOTATION%22%20type%3D%22xs%3Astring%22%20paramType%3D%22query%22%20required%3D%22true%22%2F%3E%0A%09%09%3Ckey%20id%3D%22CREDENTIAL%22%20type%3D%22xs%3Astring%22%20paramType%3D%22query%22%20required%3D%22true%22%20default%3D%22YOUR_CREDENTIAL%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Finputs%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cexecute%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!%5BCDATA%5B%0A%20var%20loweringselect%20%3D%20%22env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3B%20select%20*%20from%20ODT_NAME%20%20where%20PARAM%20%3D%40PARAM%20AND%20CREDENTIAL%20%3D%40CREDENTIAL%22%3B%0A%20var%20loweringparams%20%3D%7B%7D%3B%0A%20loweringparams%20%5B%27PARAM%27%5D%3D%20inputs%5B%27SEMANTIC_ANNOTATION%27%5D%3B%0Aloweringparams%20%5B%27CREDENTIAL%27%5D%3D%20inputs%5B%27CREDENTIAL%27%5D%3B%0A%0A%20var%20loweringquery%20%3D%20y.query%20(loweringselect%2Cloweringparams)%3B%20%0A%20response.object%20%3D%20%20loweringquery.results%3B%0A%20%5D%5D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%0A%20%20%20%20%20%20%3C%2Fselect%3E%0A%3C!--lifting--%3E%0A%20%20%20%20%20%20%3Cfunction%20name%3D%22lifting%22%3E%0A%20%20%20%20%20%20%20%3Cinputs%3E%0A%20%20%20%20%20%20%20%20%3Cpipe%20id%3D%22oneXML%22%20paramType%3D%22variable%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Ckey%20id%3D%22URI%22%20paramType%3D%22variable%22%20%20required%3D%22true%22%2F%3E%0A%20%20%20%20%20%20%20%3C%2Finputs%3E%20%0A%20%09%20%20%20%3Cexecute%3E%3C!%5BCDATA%5B%0Atry%7B%0A%20var%20oneJSON%3D%20y.xmlToJson(oneXML)%3B%0A%09var%20oneJSONLD%3D%7B%7D%3B%0A%09oneJSONLD%5B%27%40id%27%5D%3DURI%3B%0A%09oneJSONLD%5B%27%40context%27%5D%3D%20%7B%22schema%22%3A%22http%3A%2F%2Fschema.org%2F%22%2C%22NS_PREFIX%22%3A%22NS_URI%22%7D%3B%0A%09oneJSONLD%5B%27%40type%27%5D%3D%20%27TYPE%27%3B%0A%20%20%20%20%0A%20%20%2F%2Fmappings%0A%09oneJSONLD%5B%27schema%3Aname%27%5D%20%3D%20getValue(%22oneJSON%5B%27list%27%5D%5B%27name%27%5D%22)%3B%0A%09oneJSONLD%5B%27...%27%5D%20%3D%20getValue(%22oneJSON%5B%27...%27%5D%5B%27name%27%5D%22)%3B%0A%0A%0A%20%20%20%20%20%7Dcatch%20(err)%7B%20y.log(err)%3B%7D%0A%20%20%20%20%2F%2Freturn%20response%0A%20%20%20%20response.object%20%3D%20oneJSONLD%3B%0A%0Afunction%20getInterlink%20(urlpattern%2C%20value)%7B%0A%09try%7Breturn%20value%3F%20urlpattern.replace(%2F%7B.*%7D%2F%2C%20value)%20%3A%20null%3B%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getRegexpValue(regexp%2C%20value)%7B%0A%20%09try%7Breturn%20value.match(regexp)%5B0%5D%3B%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getValue(dataPath)%20%7B%0A%09try%7Breturn%20eval(dataPath)%20%7C%7C%20null%3B%20%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getLength(obj)%20%7B%0A%20%20%09try%7Breturn%20obj%3F%20obj.length%3A%200%3B%20%7Dcatch(err)%7Breturn%200%3B%7D%7D%0A%0A%5D%5D%3E%0A%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%20%0A%20%20%20%20%20%20%3C%2Ffunction%3E%20%0A%20%20%20%20%3C%2Fbindings%3E%20%0A%20%3C%2Ftable%3E');
 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function coupledTemplate (){
  try{
	 anchor.get ('select-template').innerHTML=undecode('%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%20%20%20%20%20%20%3Ctable%20xmlns%3D%22http%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fschema%2Ftable.xsd%22%3E%0A%20%20%20%20%3Cmeta%3E%0A%20%20%20%20%20%20%20%20%3Cauthor%3ECOMPANY%20NAME%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3ETABLE%20DESCRIPTION%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3EAPI%20DOCUMENTATION%20URL%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3EURL%20TO%20OBTAIN%20CREDENTIALS%3C%2FapiKeyURL%3E%0A%20%20%20%20%20%20%20%20%3C!--lowering--%3E%0A%20%20%20%20%20%20%20%20%3CsampleQuery%3E%20URIPattern%3A%20http%3A%2F%2Frdf.onekin.org%2FSERVICE%2FTYPE%2F%7BPARAMS%7D%3C%2FsampleQuery%3E%0A%20%20%20%20%20%20%20%20%3CsampleQuery%3E%20URIExample%3A%20http%3A%2F%2Frdf.onekin.org%2F.......%2F....%2F.....%3C%2FsampleQuery%3E%0A%20%20%20%20%3C%2Fmeta%3E%0A%20%20%20%20%3Cbindings%3E%0A%20%20%20%20%20%20%20%20%3C!--grounding--%3E%0A%20%20%20%20%3Cselect%20itemPath%3D%22results.*%22%20produces%3D%22XML%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinputs%3E%0A%09%09%3Ckey%20id%3D%22PARAM%22%20as%3D%22SEMANTIC_ANNOTATION%22%20type%3D%22xs%3Astring%22%20paramType%3D%22query%22%20required%3D%22true%22%2F%3E%0A%09%09%3Ckey%20id%3D%22CREDENTIAL%22%20type%3D%22xs%3Astring%22%20paramType%3D%22query%22%20required%3D%22true%22%20default%3D%22YOUR_CREDENTIAL%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Finputs%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cexecute%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!%5BCDATA%5B%0A%20var%20loweringselect%20%3D%20%22env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3B%20select%20*%20from%20ODT_NAME%20%20where%20PARAM%20%3D%40PARAM%20AND%20CREDENTIAL%20%3D%40CREDENTIAL%22%3B%0A%20var%20loweringparams%20%3D%7B%7D%3B%0A%20loweringparams%20%5B%27PARAM%27%5D%3D%20inputs%5B%27SEMANTIC_ANNOTATION%27%5D%3B%0Aloweringparams%20%5B%27CREDENTIAL%27%5D%3D%20inputs%5B%27CREDENTIAL%27%5D%3B%0A%0A%20var%20loweringquery%20%3D%20y.query%20(loweringselect%2Cloweringparams)%3B%20%0A%20response.object%20%3D%20%20loweringquery.results%3B%0A%20%5D%5D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%0A%20%20%20%20%20%20%3C%2Fselect%3E%0A%3C!--lifting--%3E%0A%20%20%20%20%20%20%3Cfunction%20name%3D%22lifting%22%3E%0A%20%20%20%20%20%20%20%3Cinputs%3E%0A%20%20%20%20%20%20%20%20%3Cpipe%20id%3D%22oneXML%22%20paramType%3D%22variable%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3Ckey%20id%3D%22URI%22%20paramType%3D%22variable%22%20%20required%3D%22true%22%2F%3E%0A%20%20%20%20%20%20%20%3C%2Finputs%3E%20%0A%20%09%20%20%20%3Cexecute%3E%3C!%5BCDATA%5B%0Atry%7B%0A%20var%20oneJSON%3D%20y.xmlToJson(oneXML)%3B%0A%09var%20oneJSONLD%3D%7B%7D%3B%0A%09oneJSONLD%5B%27%40id%27%5D%3DURI%3B%0A%09oneJSONLD%5B%27%40context%27%5D%3D%20%7B%22schema%22%3A%22http%3A%2F%2Fschema.org%2F%22%2C%22NS_PREFIX%22%3A%22NS_URI%22%7D%3B%0A%09oneJSONLD%5B%27%40type%27%5D%3D%20%27TYPE%27%3B%0A%20%20%20%20%0A%20%20%2F%2Fmappings%0A%09oneJSONLD%5B%27schema%3Aname%27%5D%20%3D%20getValue(%22oneJSON%5B%27list%27%5D%5B%27name%27%5D%22)%3B%0A%09oneJSONLD%5B%27...%27%5D%20%3D%20getValue(%22oneJSON%5B%27...%27%5D%5B%27name%27%5D%22)%3B%0A%0A%0A%20%20%20%20%20%7Dcatch%20(err)%7B%20y.log(err)%3B%7D%0A%20%20%20%20%2F%2Freturn%20response%0A%20%20%20%20response.object%20%3D%20oneJSONLD%3B%0A%0Afunction%20getInterlink%20(urlpattern%2C%20value)%7B%0A%09try%7Breturn%20value%3F%20urlpattern.replace(%2F%7B.*%7D%2F%2C%20value)%20%3A%20null%3B%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getRegexpValue(regexp%2C%20value)%7B%0A%20%09try%7Breturn%20value.match(regexp)%5B0%5D%3B%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getValue(dataPath)%20%7B%0A%09try%7Breturn%20eval(dataPath)%20%7C%7C%20null%3B%20%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getLength(obj)%20%7B%0A%20%20%09try%7Breturn%20obj%3F%20obj.length%3A%200%3B%20%7Dcatch(err)%7Breturn%200%3B%7D%7D%0A%0A%5D%5D%3E%0A%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%20%0A%20%20%20%20%20%20%3C%2Ffunction%3E%20%0A%20%20%20%20%3C%2Fbindings%3E%20%0A%20%3C%2Ftable%3E');
 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function changeTemplates(){
  try{
decoupledTemplate ();
	var a = document.createElement('a');
	a.innerHTML= oneFingerImg;
	var a2 = document.createElement('a');
	a2.innerHTML= tiedHandsImg;
	//a.addEventListener("click", decoupledTemplate, false);
	//a2.addEventListener("click", coupledTemplate, false);
	anchor.get ('a+Insert Template (https)').parentNode.parentNode.insertBefore(anchor.get ('a+Insert Template (https)').parentNode.nextSibling, anchor.get ('a+Insert Template (https)').parentNode);
	anchor.get ('a+Insert Template (https)').style.visibility = "hidden";
	var elm =  findElement('a', 'Select Template');
	elm.innerHTML= 'LDW template';
	//elm.appendChild(a);
	//elm.appendChild(a2);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function clickOnCoupled (){
  try{
	globalYQLTableName = this.getAttribute("data-id");
	var url = this.getAttribute("tableurl");
	callURLJSON(url, function (resp) {showCoupledYQLTable(resp);});
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function clickOnDecoupled (){
  try{
	globalYQLTableName = this.getAttribute("data-id");
	var url = this.getAttribute("tableurl");
	callURLJSON(url, function (resp) {showDecoupledYQLTable(resp);});
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function showCoupledYQLTable (resp){
  try{
	var tableTemplate= undecode('%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%20%20%20%20%20%20%3Ctable%20xmlns%3D%22http%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fschema%2Ftable.xsd%22%3E%0A%20%20%20%20%3Cmeta%3E%0A%20%20%20%20%20%20%20%20%3Cauthor%3E%3C!--%20your%20name%20or%20company%20name%20--%3E%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3E%3C!--%20description%20of%20the%20table%20--%3E%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3E%3C!--%20url%20for%20API%20documentation%20--%3E%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3E%3C!--%20url%20for%20getting%20an%20API%20key%20if%20needed%20--%3E%3C%2FapiKeyURL%3E%0A%20%20%20%20%20%20%20%20%3C!--lowering--%3E%0A%23LOWERING%23%0A%20%20%20%20%3C%2Fmeta%3E%0A%20%20%20%20%3Cbindings%3E%0A%20%20%20%20%20%20%20%20%3Cselect%20itemPath%3D%22results.*%22%20produces%3D%22XML%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinputs%3E%0A%23INPUTS%23%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Finputs%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cexecute%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!%5BCDATA%5B%0A%20var%20loweringselect%20%3D%20%22env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3B%20select%20*%20from%20%23ODTTABLE%23%20where%20%23QUERYPARAMS%23%22%3B%0A%20var%20loweringparams%20%3D%7B%7D%3B%0A%20%23PARAMSPARAMS%23%0A%20var%20loweringquery%20%3D%20y.query%20(loweringselect%2C%20loweringparams)%3B%20%0A%20response.object%20%3D%20%20loweringquery.results%3B%0A%20%5D%5D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%0A%20%20%20%20%20%20%3C%2Fselect%3E%0A%20%23LIFTING%23%0A%20%20%20%20%3C%2Fbindings%3E%20%0A%20%3C%2Ftable%3E%0A');
	var txt= Base64.decode(resp.content);
	var xml = textToXML(txt);
	tableTemplate = completeTable (xml, tableTemplate);
	anchor.get ('insert-template').innerHTML=tableTemplate;
	fireEvent(anchor.get ('a+Insert Template (https)'),"click");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createExample(template, variables, data) {
  try{
	var str = data.toLowerCase();
	if (str.indexOf ('select')==-1) return "";
	var begin = str.indexOf("where");
	if (begin==-1) return "";
	data = data.substring(begin+5, data.length);
    var find = ' ';
	var spliting = new RegExp(find, 'g');
    find = '"';
	var comillas = new RegExp(find, 'g');
    find = "'";
	var comillasimple = new RegExp(find, 'g');
	data = data.replace(comillasimple, '"');
    var pieces = data.split('"');
	for (var i=0; i< variables.length; i++){
		var variable=variables[i];
		for (var j=0; j<pieces.length; j=j+2){
			var piece=pieces[j];
			piece=piece.replace(spliting, '');
			if (piece.indexOf(variable)>-1){
				template=template.replace ('{'+variable+'}', pieces[j+1]);
			}
		}
	}
	return template;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function completeTable (xml, tableTemplate){
  try{
  anchor.get ('tname').value =ldw.get('ldwname').trim();
  var selects = xml.getElementsByTagName( "select" );
	var inputs = selects[0].getElementsByTagName( "key" );
	var sampleQuery = xml.getElementsByTagName( "sampleQuery" );
	var txturipattern = '\t\t<sampleQuery> URIPattern: '+globalBaseURI+ ldw.get('tablename')+'/CLASS';
  	var txturiexample = '\n\t\t<sampleQuery> URIExample: '+globalBaseURI+ ldw.get('tablename')+'/CLASS';
	var txtINPUTS = "";
	var txtQUERY ="";
	var txtPARAMS ="";
	var variables =[];
	var first =true;
	for (var i=0; i<inputs.length; i++){
		var inputid= inputs[i].id;
		var str = (new XMLSerializer()).serializeToString(inputs[i]);
		str = str.replace ('xmlns="http://query.yahooapis.com/v1/schema/table.xsd"', '');
		txturipattern += '/{'+ inputid+'}';
		txturiexample += '/{'+ inputid+'}';
		variables.push(inputid);
    	txtINPUTS +=  '\n\t\t'+str;
		//PARAM =@PARAM
		if (first){
			first=false;
			txtQUERY += inputid+' =@'+inputid;
		}else{
			txtQUERY += ' AND '+inputid+' =@'+inputid;
		}
	  txtPARAMS += "loweringparams ['"+inputid+"'] = "+inputid+";\n";
	}
	txturipattern += '</sampleQuery>';
	txturiexample += '</sampleQuery>';
	var txtLOWERING= txturipattern;
	if (sampleQuery.length==0){
		txtLOWERING+=  txturiexample;
	}
	for (var i=0; i<sampleQuery.length; i++){
		var str = (new XMLSerializer()).serializeToString(sampleQuery[i]);
		txtLOWERING+= createExample(txturiexample, variables, str);
	}

	tableTemplate= tableTemplate.replace ("#ODTTABLE#", ldw.get('tablename'));
  tableTemplate= tableTemplate.replace ("#LOWERING#", txtLOWERING);
  tableTemplate= tableTemplate.replace ("#INPUTS#", txtINPUTS);
 tableTemplate= tableTemplate.replace ("#QUERYPARAMS#", txtQUERY);
 tableTemplate= tableTemplate.replace ("#PARAMSPARAMS#", txtPARAMS);
  return tableTemplate;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function showDecoupledYQLTable (resp){
  try{
	var txt= Base64.decode(resp.content);
	var xml = textToXML(txt);
	var txturi = '<!--lowering-->\n#LOWERING#\n</meta>';
	txt= txt.replace ("</meta>", txturi);
   	var txtfunction = '\t<function name="lifting">\n\t\t<inputs>\n\t\t  <pipe id="oneXML" paramType="variable" />\n\t\t   <key id="URI" paramType="variable"  required="true"/>\n\t\t</inputs>\n\t\t<execute> <![CDATA[\n\t\t\tvar oneJSON= y.xmlToJson(oneXML);\n\t\t\t\n\t\t\toneJSONLD["@id"]= URI;//context\n\t\tvar oneJSONLD={};\n\t\toneJSONLD["@context"]={};\n\t\toneJSONLD["@context"]["rdfs"]="http://www.w3.org/2000/01/rdf-schema#";\n\t\t\toneJSONLD["@type"]= "NS:CLASS";\n\t\t\toneJSONLD["rdfs:label"]=oneJSON["PATHATTRIBUTE1"]["PATHATTRIBUTE2"];\n\t\t\t...\n\t\t\tresponse.object = oneJSONLD;]]>\n\t\t</execute>\n\t</function>\n\t</bindings>';
    txt= txt.replace ("</bindings>", txtfunction);
  tableTemplate = completeTable (xml, txt);
	anchor.get ('insert-template').innerHTML=tableTemplate;
	fireEvent(anchor.get ('a+Insert Template (https)'),"click");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addPublishButton (){
  try{
	var container = anchor.get ('file-buttons');
	var elmNewContent = document.createElement('button');
	elmNewContent.id = 'idPublish';
	elmNewContent.setAttribute('class', 'btn btn-primary');
	elmNewContent.setAttribute('title', 'publish');
	if (readData('deploying')) elmNewContent.innerHTML = 'Deploy';
	else elmNewContent.innerHTML = 'Redeploy';
	anchor.get ('file-buttons').parentNode.insertBefore(elmNewContent, anchor.get ('file-buttons'));
	elmNewContent.addEventListener("click", sendLDW, false);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////////////////////

function sendLDW(e){
  try{
    if (anchor.get ('templates-container').getAttribute("hidden")!="true"){
    	alert ("You must 'save' the file in your private space before 'publish' it.");
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		return;
	}
	var token = anchor.get ('label+Select').nextSibling.nextSibling.getAttribute("value");
	var user = anchor.get ('span+salute').innerHTML;
//  var envToken = prompt(user + ", is an environment-EXECUTE-key required for derefencing URIs? Paste store://... here.\n A tab will be opened to continue the registration process. Check it please!", "");
  var envToken = "";
  	if (envToken==null){
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		return; }

  var url3 = ldwURL+"?file="+token+"&env="+envToken+"&type=ODT";
//	GM_openInTab(url3,true);
 window.open(url3,'_four');
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//////////////////////
////ODT Folder
/////////////////////


function loadWrapper(wrapper){
  try{
	var wrappertxt = JSON.stringify (wrapper);
	wrappertxt = wrappertxt.substring(1, wrappertxt.length-1);
	var exp = /\\n/g;
   	wrappertxt = wrappertxt.replace(exp,"\n");
	var exp = /\\"/g;
   	wrappertxt = wrappertxt.replace(exp,'"');
	var exp = /\\t/g;
   	wrappertxt = wrappertxt.replace(exp,'\t');
	 anchor.get ('insert-template').innerHTML=wrappertxt;
	fireEvent(anchor.get ('a+Insert Template (https)'),"click");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function showCoupledAnnotation (){
try{
  showCoupledAnnotationNext (ldw.getXML());
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function showCoupledAnnotationNext (tableTemplate){
try{
  anchor.get ('tname').value = ldw.get ("ldwname").trim();
  anchor.get ('insert-template').innerHTML=tableTemplate;
	fireEvent(anchor.get ('a+Insert Template (https)'),"click");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function completeTableAnnotation (tableTemplate){
  try{
    var txtns = "";
    if (ldw.globalwrapper.inputs) {
      var pars = ldw.globalwrapper.inputs;
      var ontos = {};
      for (var i in pars){
          var j = pars[i];
          ontos[j.ontologyprefix]=j.ontologyuri;
        }
        for (var i in ontos){
            txtns+= ' xmlns:'+i+'="'+ontos[i]+'"\n ';
        }
      }

var select = ldw.get ("ldwquery");
var str="";
      try{
         str = select.match(/where((.|\n)*)/i);
          str =  str[1];
          str = str.substring(0, str.indexOf('|'));
        }catch(err){str=null;}
      var res = formatDataPiece (str);
      var find = '\"';
      var re = new RegExp(find, 'g');
      var ldwquery = "use '"+executeToken+"' as t; select * from t";
      var values =[];
      var names =[];
      for (var i=0; i< res.length; i++){
          var resi = res[i].replace(/like/ig, '=');
          var res2 = resi.split("=");
        var value = getDataPiece(res2[1]);
        var name = getDataPiece(res2[0]);
        values[i]= value;
        names [i]=name;
      }

var getme= function (name, names, values){
  var value ="";
  for (var i=0; i< names.length; i++){
    if (names[i]==name){value=values[i];}
  }
  return value;
};

  var inputs = ldw.get ("uripattern").match(/\{[^}]*\}/g);
  var inputsSemantic = ldw.getURIPattern().match(/\{[^}]*\}/g);

  if (inputs == null) inputs =[];
  var sampleQuery = ldw.get ("samplequery");
  var launchedQuery = ldw.get ("launchedquery");
  var tablename = ldw.get ("tablename");
  //var txturipattern = '\t\t<sampleQuery> URIPattern: '+ annotation["uripattern"]+ '</sampleQuery>';
	//var txturiexample = '\n\t\t<sampleQuery> URIExample: '+ annotation["uriexample"]+ '</sampleQuery>';
  var txturipattern = '\n\t\t<sampleQuery> URIPattern: '+ ldw.getURIPatternCredentialLess()+ '</sampleQuery>';
  var txturiexample = '\n\t\t<sampleQuery> URIExample: '+ ldw.getURIExampleCredentialLess()+ '</sampleQuery>';
  var txtINPUTS = "";
  var txtQUERY ="";
  var txtPARAMS ="";
	var variables =[];
	var first =true;
  for (var i=0; i<inputs.length; i++){
    var inputid= inputs[i];
    var inputidSem= inputsSemantic[i];
    inputidSem = inputidSem.replace ("\}","");
		inputidSem = inputidSem.replace ("\{","");
    inputid = inputid.replace ("\}","");
		inputid = inputid.replace ("\{","");
    var inputvalue = getme(inputid, names, values);
		txtINPUTS += '\n\t\t<key id="'+inputid+'" as="'+inputidSem+'" type="xs:string" paramType="query" required="true" default="'+inputvalue+'"/>';
		if (first){
			first=false;
			txtQUERY += inputid+' =@'+inputidSem;
		}else{
			txtQUERY += ' AND '+inputid+' =@'+inputidSem;
		}
	  txtPARAMS += "loweringparams ['"+inputidSem+"']= inputs['"+inputidSem+"'];\n";
	}
  launchedQuery=launchedQuery.substring(0,launchedQuery.toLowerCase().indexOf('where'));
  launchedQuery += ' where ' + txtQUERY;
  var txtLOWERING= txturipattern;
  txtLOWERING+=  txturiexample;
  tableTemplate= tableTemplate.replace ("#NS#", txtns);
  tableTemplate= tableTemplate.replace ("#METAS#", ldw.get ("metas"));
  tableTemplate= tableTemplate.replace ("#ODTTABLE#", tablename);
  	tableTemplate= tableTemplate.replace ("#LOWERING#", txtLOWERING);
  		tableTemplate= tableTemplate.replace ("#INPUTS#", txtINPUTS);
    	//tableTemplate= tableTemplate.replace ("#QUERYPARAMS#", txtQUERY);
      tableTemplate= tableTemplate.replace ("#LAUNCHEDQUERY#", launchedQuery);
    	tableTemplate= tableTemplate.replace ("#PARAMSPARAMS#", txtPARAMS);
  tableTemplate= tableTemplate.replace ("#LIFTING#", ldw.getLifting());
  tableTemplate=tableTemplate.replace(/\n\n/, '\n');
  tableTemplate=tableTemplate.replace(/\n\n/, '\n');
  return tableTemplate;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createODTFolder (){
  try{
	var elmNewContent = document.createElement('div');
	elmNewContent.id = 'dtColumnInner';
	elmNewContent.innerHTML = '<span class="nav-header">Public YQL Tables <span id="count">(0)</span></span> ';
	anchor.get ('templates-container').insertBefore(elmNewContent, anchor.get ('templates-container').firstChild);
    elmNewContent.appendChild(createNewAccordion ());
	anchor.hide ('rightView');
  globalTableCount=0;

  var obj = readData('folders');
  if (obj == null){
     callURLJSON(yqlgithuburl, function (obj) {getFolders(obj)});
  }else{
    if (Math.random()< globalHighRefreshProb) callURLJSON(yqlgithuburl, function (obj) {getFolders(obj)});
    else getFolders(obj);
  }
	anchor.show ('rightView');
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getFolders (obj){
  try{
	writeData('folders', obj);
	for ( var i = 0; obj.tree.length>i; i++) {
			var el = obj.tree[i];
			if (el.type== "blob"){
				var path = el.path;
				var pos = path.lastIndexOf("/");
				if (pos>-1){
				var name = path.substring(pos+1,path.length);
				var folder = path.substring(0, pos);
				folder = folder.replace(/\//g, '-');
				 createNewLi(name, folder, el.url);
				}
			}
	}
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function addCount (){
  try{
	globalTableCount++;
	anchor.get ('count').innerHTML= "("+globalTableCount+")";
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//////
//accordion
/////
function createNewAccordion (){
  try{
	var div = document.createElement('div');
	div.id='odt-data-accordion';
	div.class='accordion';
	div.style = "height: 300px";
	div.style.overflow="scroll";
	var div1 = document.createElement('div');
	div1.id='odt-group';
	div1.class='accordion-group';
	div.insertBefore(div1, div.firstChild);
	return div;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createNewHeadingBody (name){
  try{
	var div = document.createElement('div');
	div.id=name+'-id';
	div.setAttribute("class",'accordion-heading collapsed');
	var i = document.createElement('i');
	i.setAttribute("class",'icon-caret-right');
	var a = document.createElement('a');
	a.id=name+'-id-a';
	a.setAttribute("class",'accordion-toggle');
	a.setAttribute("data-parent","odt-data-accordion");
	a.setAttribute("data-toggle","collapse");
	a.href="#"+name;
	a.text=name;
	div.insertBefore(a, div.firstChild);
	div.insertBefore(i, div.firstChild);
	var div0 = document.createElement('div');
	div0.id=name;
	div0.setAttribute("class",'accordion-body collapse');
	var ul = document.createElement('ul');
	ul.id=name+'-id-ul';
	ul.setAttribute("class",'unstyled');
	div0.insertBefore(ul, div0.firstChild);
	anchor.get ('odt-data-accordion').appendChild(div);
	anchor.get ('odt-data-accordion').appendChild(div0);
return ul;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createNewLi (name, folder, url){
  try{
   var li = document.createElement('li');
   li.id=name;
   li.setAttribute("tableurl",url);
	var i = document.createElement('span');
	i.innerHTML= name;
	var a = document.createElement('a');
	a.setAttribute("data-id",name);
	a.innerHTML= oneFingerImg;
	a.setAttribute("tableurl",url);
	var a2 = document.createElement('a');
	a2.setAttribute("data-id",name);
	a2.innerHTML= tiedHandsImg;
	a2.setAttribute("tableurl",url);
	li.insertBefore(a2, li.firstChild);
	li.insertBefore(a, li.firstChild);
	li.insertBefore(i, li.firstChild);
	a.addEventListener("click", clickOnDecoupled, false);
	a2.addEventListener("click", clickOnCoupled, false);
	var anchor2=  anchor.get (folder+'-id-ul');
	if (anchor2 == null){anchor2 = createNewHeadingBody (folder);}
	anchor2.insertBefore(li, anchor2.firstChild);
	addCount();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///UTILS
/////////////////////////////////////////////////////////////////////////////////////////////////////////



function srcURL(obj){
  try{
	var res = obj.query.results;
	if (res == null) {
		ldw.set ('tableurl', null);
		return;
	}
	var src = res.table.src;
	var urlA ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'";
	var urlB ="'&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	ldw.set ('tableurl',urlA+src+urlB);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////////////
////Launch events
////////////////////////

function launchDesc(e){
  try{
var select = e.target.getAttribute("desc");
anchor.get ('qid').value = select;
fireEvent(anchor.get ('submitMeButton'),"click");
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


  function launchEdit(e){
    try{
  var target= e.target;
  e.preventDefault ? e.preventDefault() : e.returnValue = false;
  e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
  globalLDWurl = target.getAttribute("tableurl");
  ldw = new LDW();
  callURL(globalLDWurl, function (obj) {launchingEdit(obj)});
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

  function launchingEdit (obj){
    try{
  var xml = obj;
  savestorageWrapper(xml);
  openCoupledLDW ();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function launchExampleURI(e){
  try{working();
    writeData('deploying', false);

var target= e.target;
e.preventDefault ? e.preventDefault() : e.returnValue = false;
e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
globalLDWurl = target.getAttribute("tableurl");
ldw = new LDW();
callURL(globalLDWurl, function (obj) {launchingExampleURI(obj)});
}catch(err){lazing();infoit (err.lineNumber+' :: '+ err.message);}}

// Evaluate an XPath expression aExpression against a given DOM node
// or Document object (aNode), returning the results as an array
// thanks wanderingstan at morethanwarm dot mail dot com for the
// initial work.
function evaluateXPath(aNode, aExpr) {
  var xpe = new XPathEvaluator();
  var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
    aNode.documentElement : aNode.ownerDocument.documentElement);
    var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
  var found = [];
  var res;
  while (res = result.iterateNext())
    found.push(res);
  return found;
}

function launchingExampleURI (obj){
  try{
    ldw = new LDW();
    var x= obj.replace('xmlns="http://query.yahooapis.com/v1/schema/table.xsd"', '');
    var oParser = new DOMParser();
    var wxml = oParser.parseFromString(x, "text/xml");
    var results = evaluateXPath(wxml, "//meta/sampleQuery");
    var uripattern="";
      for (var i in results){
        if (results[i].textContent.match(/URIPattern/i)){
          uripattern= results[i].textContent;
          uripattern= uripattern.replace(' ', '');
          uripattern= uripattern.replace(/URIPattern:/i, '');
        }
        if (results[i].textContent.match(/URIExample/i)){
          uriexample= results[i].textContent;
          uriexample= uriexample.replace(' ', '');
          uriexample= uriexample.replace(/URIExample:/i, '');
          }
      }
var xml = obj;
obj = obj.toLowerCase();
var uripatternparams = uripattern.replace(globalBaseURI,"");
var globalAPI = uripatternparams.substring(0, uripatternparams.indexOf('/'));
uripatternparams = uripatternparams.replace(globalAPI+'/', "");
var type = uripatternparams.substring(0, uripatternparams.indexOf('/'));
uripatternparams = uripatternparams.replace(type,"");
var uriexampleparams = uriexample.replace(globalBaseURI,"");
uriexampleparams = uriexampleparams.replace(globalAPI+'/',"");
uriexampleparams = uriexampleparams.replace(type,"");
if (uripattern.indexOf("//")>-1){
	uripattern=uripattern.substring(uripattern.indexOf("//")+2, uripattern.length);
	uripattern=uripattern.substring(uripattern.indexOf("/")+1, uripattern.length);
}
if (uriexample.indexOf("//")>-1){
	uriexample=uriexample.substring(uriexample.indexOf("//")+2, uriexample.length);
	uriexample=uriexample.substring(uriexample.indexOf("/")+1, uriexample.length);
}
if (uriexample.indexOf("/")==0){
	uriexample=uriexample.substring(uriexample.indexOf("/"), uriexample.length);
}
if (uripattern.indexOf("/")==0){
	uripattern=uripattern.substring(uripattern.indexOf("/"), uripattern.length);
}

//crear la select.
var select = createSelect (uripattern, uriexample);
if (obj.indexOf("alltableswithkeys';")==-1){
  var select2=select;
}else{
  var select2=xml.substring(xml.indexOf("alltableswithkeys';"),obj.length);
  select2=select2.substring(select2.indexOf(";")+1).trim();
  select2=select2.substring(0, select2.indexOf('";')).trim();
}

var results = evaluateXPath(wxml, "//bindings/select/inputs/key");
for (var i in results){
  var asv= results[i].getAttribute("as");
  var idv= results[i].getAttribute("id");
  if (asv) select2=  select2.replace('@'+idv, '@'+asv);
  }

var str ="";
try{
   str = select.match(/where((.|\n)*)/i);
    str =  str[1];
  }catch(err){str=null;}
res = formatDataPiece (str);
var find = '\"';
var re = new RegExp(find, 'g');
select2 = select2.replace(re, "'");
var firstly = true;
var ldwquery = "use '"+executeToken+"' as t; select * from t";
var uriexampleparams ="";
var uripatternparams ="";
for (var i=0; i< res.length; i++){
    var resi = res[i].replace(/like/ig, '=');
    var res2 = resi.split("=");
  var datapiece1 = getDataPiece(res2[1]);
  uriexampleparams += '/'+datapiece1.toString();
  var datapiece2 = getDataPiece(res2[0]);
  uripatternparams += '/{'+datapiece2+'}';
  select2=  select2.replace ('@'+datapiece2, "'" +datapiece1 + "'");
  if (firstly){
    firstly=false;
    ldwquery = ldwquery + " where " + datapiece2 + "= '" + datapiece1 + "'";
  }else{
    ldwquery = ldwquery + " and " + datapiece2 + "= '" + datapiece1 + "'";
  }
}
var uripatterncredentialless = uriexampleparams;
var uriexamplecredentialless = uripatternparams;

uriexampleparams ="";
uripatternparams ="";

 var results = evaluateXPath(wxml, "//bindings/select/inputs/key");
for (var i in results){
    var defaultv= results[i].getAttribute("default");
    var idv= results[i].getAttribute("id");
    if (defaultv) select2=  select2.replace('@'+idv, "'"+defaultv+"'");
}
        var str ="";
        try{
      	   str = select2.match(/where((.|\n)*)/i);
      	    str =  str[1];
          }catch(err){str=null;}
      	res = formatDataPiece (str);
        var find = '\"';
      	var re = new RegExp(find, 'g');
      	select2 = select2.replace(re, "'");
      	var firstly = true;
        var tokens = readStorageTokens();
        executeToken = tokens.executeToken;
      	var ldwquery = "use '"+executeToken+"' as t; select * from t";
      	for (var i=0; i< res.length; i++){
            var resi = res[i].replace(/like/ig, '=');
          	var res2 = resi.split("=");
      		var datapiece1 = getDataPiece(res2[1]);
          uriexampleparams += '/'+datapiece1.toString();
          var datapiece2 = getDataPiece(res2[0]);
          uripatternparams += '/{'+datapiece2+'}';
      		if (firstly){
      			firstly=false;
      			ldwquery = ldwquery + " where " + datapiece2 + "= '" + datapiece1 + "'";
      		}else{
      			ldwquery = ldwquery + " and " + datapiece2 + "= '" + datapiece1 + "'";
      		}
      	}

anchor.get ('qid').value = select2;
//anchor.get ('uripattern').value = globalBaseURI+uripattern;
//anchor.get ('uriexample').value = globalBaseURI+uriexample;
  checkSelectPermanence();
  resetSignalers();
  globalSignaler[ANNOTATED] =true;
  globalSignaler[XMLREANNOTATION]=true;

  var url1 = 'https://query.yahooapis.com/v1/public/yql?q=';
  var url2 = "&debug=true&format=json&callback=&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var url = url1+select+url2;
  anchor.get ('yqlurl').value = url;
  var table=uriexample.substring(0, uriexample.indexOf("/"));
  infoit('laundhingexampleuri');
  if (type != null) {
    var cl= obj.substring(obj.indexOf("@type"),obj.length);
    cl=cl.trim();
    cl=cl.substring(8, cl.indexOf("';"));
    cl=cl.substring(cl.indexOf("'")+1);
    var ns = cl.substring(0, cl.indexOf(":")-1);
    j= JSON.parse('{"type":"'+cl+'","class":"'+type+'","classontologyprefix":"'+ns+'","classontologyuri":"...."}');
    cl = j;
  }

  var metas=xml.substring(xml.indexOf('<meta>')+6, xml.indexOf('<sampleQuery>'));
  setGlobalData (uriexampleparams, uripatternparams, select, select2, ldwquery, table, xml, cl, globalAPI,uripatterncredentialless, uriexamplecredentialless, metas);
  fireEvent(annotationTab,"click");
//  globalSignaler[XMLREANNOTATION]=false;
lazing();
}catch(err){lazing();infoit (err.lineNumber+' :: '+ err.message);}}

function setAnnotationViewXML(json){//incrementar annotaciones.  IKER fijar las anotacione existentes.
  try{
  createAnnotationView(json)
  oneJSON=json.query.results;
  //señalar que es un wrapper

//  fireEvent(annotationButton,"click");
  //loadstorageWrapper(blockAnnotated)
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function createSelect (pattern, example){
  try{
    var table=example.substring(0, example.indexOf("/"));
  	var select = "use '"+globalLDWurl+"' as "+table+"; select * from " + table ;
  	var first = true;

	var list = patternMatches (pattern, example);
  for (var name in list) {
      var value = list[name];
  		if(list.hasOwnProperty(name) ) {
        if (first){
  			  select += " where " + name +"= '"+ value +"'";
  			  first = false;
  		  }else{
  			  select += " and "+ name +"= '"+ value+"'";
  		    }
        }
      }
	return select;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function uriMatchesPattern (pattern, example){
  try{
  var res = true;
  var begin = pattern.indexOf('{');
  while (begin > 0){
    prepattern = pattern.substring(0, begin);
    preexample = example.substring(0, begin);
    if (prepattern != preexample) return false;
    var end1 = pattern.indexOf('}');
    var end2 = example.indexOf('/');
    pattern = pattern.substring(end1);
    example = example.substring(end2);
  }
  return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function patternMatches (pattern, example){
  try{
  var list = {};
  var begin = pattern.indexOf('{');
  while (begin > 0){
    pattern = pattern.substring(begin);
    example = example.substring(begin);
    var end1 = pattern.indexOf('}');
      var end2 = example.indexOf('/');
      var name = pattern.substring(1, end1);
    if (end2<0){
      var value = example;
    }else {
      var value = example.substring(0, end2);
      example = example.substring(end2-1);
    }
    list[name]= value;
    pattern = pattern.substring(end1);
    begin = pattern.indexOf('{');
  }
  return list;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//////
function resetSignalers(){
  try{
  globalSignaler[ANNOTATED]=false;
  globalSignaler[PUSHEDANNOTATIONBUTTON]=false;
  globalSignaler[XMLANNOTATION]=false;
  globalSignaler[XMLREANNOTATION]=false;
  globalSignaler[RENEWANNOTATION]=false;
  consoleGlobalSignalers();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function checkSelectPermanence(){
  try{
  var quidValue = anchor.get ('qid').value;
  var newquidHash = hashIt (quidValue);
  var chkvalue = globalquidHash == newquidHash;
  if (!chkvalue){
    globalSignaler[RENEWANNOTATION]=true;
  	globalquidHash = newquidHash;
  }
  return chkvalue;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function creatingSemanticView(){
  try{
  annotateLowering();
  showVisualElementsSemanticView();
  var w = anchor.get ('yqlurl').offsetWidth - 10;
  var h =anchor.get ('outputTabContent').offsetHeight-(anchor.get ('yqlurl').offsetHeight * 7);
  anchor.get ('semanticViewContent').style.height =h+"px";
  anchor.get ('semanticViewContent').style.width =w+"px";
  if (!globalSignaler[ANNOTATED]){
   	anchor.get ('semanticViewContent').innerHTML = "NOTE: 'First you must work on the Annotation View'";
    return;
  }
 checkSelectPermanence();
 if (!globalSignaler[PUSHEDANNOTATIONBUTTON] || globalSignaler[RENEWANNOTATION]){
   disableLDWGenerationButton();
   return;
}
  enableLDWGenerationButton();
  createIndividual();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createIndividual() {
  try{
   var select = anchor.get ('qid').value;
   var lowselect = select.toLowerCase();
  var begin = lowselect.indexOf ('from');
   var end = lowselect.indexOf ('where');
   //var newselect = select.substring (0, begin+5) + ' t ' + select.substring (end)+ " | t.lifting('"+anchor.get ('uriexample').value+"')";
	 var newselect = ldw.getLDWQuery();
   // If it gets too big it needs to be a post...
   var url = "https://query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent(newselect)+ "&format=json&diagnostics=false&debug=true&callback=";
   callURLJSON(url, function (resp) {individualLoaded(resp);});
 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getFirst(jsonObj){
  var firstProp;
for(var key in jsonObj) {
    if(jsonObj.hasOwnProperty(key)) {
        firstProp = jsonObj[key];
        break;
    }
}
return firstProp;
}

function individualLoaded(resp){
  try{
//    var h = resp.query.results.result;
    var h = getFirst(resp.query.results);

  h= JSON.stringify(h);
  anchor.get ('semanticViewContent').innerHTML=linkify(h);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function findElementClass(tagname, text){
  try{
    var elems = document.getElementsByTagName(tagname);
    for(var i = 0; i < elems.length; i++){
      var elm = elems[i];
      if(elm.getAttribute ("class") !== text) continue;
      return elm;
    }
	return null;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function findElement(tagname, text){
  try{
    var elems = document.getElementsByTagName(tagname);
    for(var i = 0; i < elems.length; i++){
      var elm = elems[i];
      if(elm.innerHTML !== text) continue;
      return elm;
    }
	return null;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

// Convert a string to XML Node Structure
// Returns null on failure
function textToXML ( text ) {
      try {
        var xml = null;

        if ( window.DOMParser ) {

          var parser = new DOMParser();
          xml = parser.parseFromString( text, "text/xml" );

          var found = xml.getElementsByTagName( "parsererror" );

          if ( !found || !found.length || !found[ 0 ].childNodes.length ) {
            return xml;
          }

          return null;
        } else {

          xml = new ActiveXObject( "Microsoft.XMLDOM" );

          xml.async = false;
          xml.loadXML( text );

          return xml;
        }
    }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//
 // trigger a DOM event via script
 // @param {Object,String} element a DOM node/node id
 // @param {String} event a given event to be fired - click,dblclick,mousedown,etc.
 //

var fireEvent = function(element, event) {
  try{
    var evt;
    var isString = function(it) {
        return typeof it == "string" || it instanceof String;
    }
    element = (isString(element)) ? anchor.get (element) : element;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();
        return element.fireEvent('on' + event, evt)
    }
    else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////////
//////Semantic Viever
///////////////////

function hashIt (s) {
  try{
var hash = 0, strlen = s.length, i, c;
if (strlen === 0 ) {
return hash;
}
for (i = 0; i < strlen; i++ ) {
c = s.charCodeAt( i );
hash += c;
}
return hash;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////////
//////YQL Storage
///////////////////

function readStorageTokens(){
  try{
	var tokens = readData ('storagetokens');
//var tokens = null;
	if (tokens == null){
  		newstorage();
  }
  return tokens;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function newed(response) {
  try{
   var inserted = response.query.results.inserted;
   executeToken = inserted.execute;
   selectToken = inserted.select;
   updateToken = inserted.update;
   writeData ('storagetokens', {'executeToken':executeToken, 'selectToken': selectToken, 'updateToken':updateToken});
   consoleTokens();
 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function newstorage() {
  try{
   var url = "https://query.yahooapis.com/v1/public/yql?q=insert%20into%20yql.storage.admin%20(value)%20values%20('iker%20')&format=json&callback=";
   callURLJSON(url, function (resp) {newed (resp);});
 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function clearStorage() {
  try{
   savestorageWrapper("");
 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function savestorage() {
  try{
  var value =createCoupledWrapper();
  savestorageWrapper(value);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

  function savestorageWrapper(xml) {
    try{
  var value = xml;
  var tokens = readStorageTokens();
  updateToken = tokens.updateToken;
  var name = updateToken;
       // If it gets too big it needs to be a post...
       var url = "https://query.yahooapis.com/v1/public/yql?q=update%20yql.storage%20set%20value%3D%40value%20where%20name%3D%40name&format=json&diagnostics=false&callback=&value=" + encodeURIComponent(value) + "&name=" + encodeURIComponent(name);
      callURLJSON(url, function (resp) { logit (JSON.stringify(resp));});
      ldw.setXML(xml);
    }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

  function loadstorageWrapper(callback) {
    try{
    var tokens = readStorageTokens();
    selectToken = tokens.selectToken;
    var name = selectToken;
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yql.storage%20where%20name%3D%40name&format=json&diagnostics=false&callback=&name="+name;
    callURLJSON(url, function (resp) {callback(resp.query.results.result.value)});
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createCoupledWrapper (){
  try{
	var tableTemplate= undecode('%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%20%20%20%20%20%20%3Ctable%20%23NS%23%20xmlns%3D%22http%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fschema%2Ftable.xsd%22%3E%0A%20%20%20%20%3Cmeta%3E%23METAS%23%0A%23LOWERING%23%0A%20%20%20%20%3C%2Fmeta%3E%0A%20%20%20%20%3Cbindings%3E%0A%20%20%20%20%20%20%20%20%3Cselect%20itemPath%3D%22results.*%22%20produces%3D%22XML%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinputs%3E%0A%23INPUTS%23%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Finputs%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cexecute%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!%5BCDATA%5B%0A%20var%20loweringselect%20%3D%20%22env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3B%20%23LAUNCHEDQUERY%23%22%3B%0A%20var%20loweringparams%20%3D%7B%7D%3B%0A%20%23PARAMSPARAMS%23%0A%20var%20loweringquery%20%3D%20y.query%20(loweringselect%2Cloweringparams)%3B%20%0A%20response.object%20%3D%20%20loweringquery.results%3B%0A%20%5D%5D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%0A%20%20%20%20%20%20%3C%2Fselect%3E%0A%20%23LIFTING%23%0A%20%20%20%20%3C%2Fbindings%3E%20%0A%20%3C%2Ftable%3E%0A%0A');
  if (globalSignaler[XMLREANNOTATION]){
    tableTemplate=ldw.getXML ();
    var begin = tableTemplate.indexOf('<function');
    var end = tableTemplate.indexOf('</bindings');
    tableTemplate = tableTemplate.substr(0,begin)+'#LIFTING#'+tableTemplate.substr(end);
  }
  annotateLowering();
	tableTemplate = completeTableAnnotation (tableTemplate);

	return tableTemplate;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

    //////////////////////////
	//// LDW Folder
	//////////////////////////

function createLDWFolder (){
  try{

 	anchor.get ('dtAccordion').insertBefore(createNewLDWAccordion (), anchor.get ('dtDefaultContainer'));
 globalTableCount=0;

   var obj = readData('ldwfolders');
  if (obj == null || Math.random()< globalHighRefreshProb){
     callURLJSON(ldwgithuburl, function (obj) {getLDWFolders(obj)});
  }else{
      	getLDWFolders(obj);
      }
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getLDWFolders (obj){
  try{
	writeData('ldwfolders', obj);
var anns = {};
  for ( var i = 0; obj.tree.length>i; i++) {
    var el = obj.tree[i];
    if (el.type== "blob"){
        anns[el.path]= el;
    }
  }
	for ( var i = 0; obj.tree.length>i; i++) {
			var el = obj.tree[i];
			if (el.type== "blob" ){
        var ann = anns[el.path];
        var annurl= null;
        if (ann) annurl = ann.url;
				var path = el.path;
				var pos = path.lastIndexOf("/");
				if (pos>-1){
				var name = path.substring(pos+1,path.length);
				var folder = path.substring(0, pos);
				folder = folder.replace(/\//g, '-');
        var li = createNewLDWLi(name, folder, el.url, annurl);
        var anchor2=  anchor.get (folder+'-id-ul');
       	if (anchor2 == null){anchor2 = createNewLDWHeadingBody (folder);}
       	anchor2.appendChild(li);
       	addCount();
				}
			}
	}

  resizeLDWFolder();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createNewLDWAccordion (){
  try{
	var div = document.createElement('div');
	div.id='odt-data-accordion';
	div.class='accordion';
	div.style = "height: 300px";
	div.style.overflow="scroll";
	var div1 = document.createElement('div');
	div1.id='odt-group';
	div1.class='accordion-group';
	div.insertBefore(div1, div.firstChild);
	return div;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createNewLDWHeadingBody (name){
  try{
	var divldw = document.createElement('div');
	divldw.id=name+'-ldw';
	divldw.setAttribute("class",'accordion-group');
	var div = document.createElement('div');
	div.id=name+'-id';
	div.setAttribute("class",'accordion-heading collapsed');
	var i = document.createElement('i');
	i.setAttribute("class",'icon-caret-right');
	var a = document.createElement('a');
	a.id=name+'-id-a';
	a.setAttribute("class",'accordion-toggle');
	a.setAttribute("data-parent","odt-data-accordion");
	a.setAttribute("data-toggle","collapse");
	a.href="#"+name;
	a.text=name;
	div.insertBefore(a, div.firstChild);
	div.insertBefore(i, div.firstChild);
	var div0 = document.createElement('div');
	div0.id=name;
	div0.setAttribute("class",'accordion-body collapse');
	var ul = document.createElement('ul');
	ul.id=name+'-id-ul';
	ul.setAttribute("class",'unstyled');
	div0.insertBefore(ul, div0.firstChild);
	divldw.appendChild(div);
	divldw.appendChild(div0);
	anchor.get ('odt-data-accordion').appendChild(divldw);
return ul;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function createNewLDWLi (name, folder, url, annurl){
  try{
   var li = document.createElement('li');
   li.id=name;
   li.setAttribute("tableurl",url);
   li.setAttribute("annotationurl",annurl);
	li.setAttribute("class","datatableNode "+folder);
	var a3 = document.createElement('a');
	a3.setAttribute("data-rapid_p","7");
	a3.setAttribute("title",name);
	a3.innerHTML= name;
  var n = Math.floor(Math.random()*1000);
	a3.setAttribute("tableurl","https://raw.githubusercontent.com/onekin/ldw/master/"+folder+"/"+name+"?id="+n);
    a3.addEventListener("click", launchExampleURI, false);
	var a22 = document.createElement('span');
	a22.setAttribute("class","label");
	a22.setAttribute("style","display: display: inline-block;");

//	var a = document.createElement('a');
//	a.setAttribute("data-rapid_p","9");
//	a.setAttribute("class","src rapidnofollow");
//	a.setAttribute("data-ylk","slk:source "+name);
//	a.setAttribute("target","_blank");
//	a.setAttribute("href","https://raw.githubusercontent.com/onekin/ldw/master/"+folder+"/"+name);
//	a.innerHTML= 'src';
//	a22.appendChild (a);

	var a21 = document.createElement('span');
	a21.setAttribute("class","meta");
	a21.setAttribute("style","display: none;");
	var a2 = document.createElement('a');
	a2.setAttribute("data-rapid_p","8");
	a2.setAttribute("class","label rapidnofollow");
	a2.setAttribute("data-name",name);
	a2.setAttribute("data-ylk","slk: "+name);
	var descselect = " use 'https://raw.githubusercontent.com/onekin/ldw/master/"+folder+"/"+name+"' as "+name+"; desc "+name;
	a2.setAttribute("desc",descselect);
	a2.setAttribute("target","_blank");
	a2.innerHTML= 'desc';
	a2.addEventListener("click", launchDesc, false);

	var a23 = document.createElement('a');
	a23.setAttribute("data-rapid_p","8");
	a23.setAttribute("class","label rapidnofollow");
	a23.setAttribute("data-name",name);
	a23.setAttribute("data-ylk","slk: "+name);
	a23.setAttribute("tableurl","https://raw.githubusercontent.com/onekin/ldw/master/"+folder+"/"+name);
  a23.setAttribute("target","_blank");
	a23.innerHTML= 'Edit';
	a23.addEventListener("click", launchEdit, false);

	a21.appendChild (a2);
	//a21.appendChild (a22);
	a21.appendChild (a23);
	li.insertBefore(a21, li.firstChild);
	li.insertBefore(a3, li.firstChild);
  return li;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function resizeLDWFolder(){
  try{
  var w = anchor.get ('dtAccordion').offsetWidth +5;
  var h =anchor.get ('dtAccordion').offsetHeight;
  anchor.get ('odt-data-accordion').style.height =h+"px";
  anchor.get ('odt-data-accordion').style.width =w+"px";
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function blockingAnnotated(el){//IKER
  try{
	var color = 'LightCoral';
	el.setAttribute('style', 'background-color:'+color);
	el.setAttribute('class', 'blocked');
	el.setAttribute ('disabled','active');
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function blockAnnotated (wrapper){
  try{
  if (wrapper.indexOf ('@type')>0){
		blockingAnnotated(anchor.get ("results"));
	}
	var re = /=\s*oneJSON[^;=]*/ig;
	var m = wrapper.match(re);
    if (m){
	for (var i= 0; i<m.length; i++) {
		value = m[i].trim();
		var begin = value.indexOf ("[");
		value = value.substring	(begin);
		blockingAnnotated(anchor.get (value));
	}
	}
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

var inputmatching={};
function creatingReannotation (wrapper){
  try{
    var ontologies = {};
    var ns = wrapper.split (/xmlns:/i);
    for (var i=1; i < ns.length; i++){
      var n = ns[i];
      var oprefix = n.substring(0,n.indexOf('='));
      var ouri = n.substring(n.indexOf('"')+1);
      ouri = ouri.substring(0, ouri.indexOf('"'));
        ontologies[oprefix]= ouri;
    }

    for (var i in inputmatching){
      var prop = inputmatching[i];
      var id = i;
      var ontprefix = prop.substring(0, prop.indexOf(':'));
      var onturi = ontologies[oprefix];
        var j = '{"type":"input","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+prop+'","dataset":"'+null+'","path":"'+id+'", "regex":"'+null+'"}';
      var js = JSON.parse(j);
        js.objproperty=  false;
      ldw.annotate('input_'+id, js);
    }
  wrapper = wrapper.substr(wrapper.indexOf('"lifting"'));
  var annotation = {};
  var m = wrapper.match(/^.*((\r\n|\n|\r)|$)/gm);
 if (m){
	for (var i= 0; i<m.length; i++) {
		var line = m[i].trim();
		if (getTypetion(line)>0){
        annotateIt (line);
      }
	}
	}
//  globalSignaler[XMLREANNOTATION]=false;
//    ldw.set('deploying', true);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///////
///Parse LDW
/////

function getTypeClass (txt){
  try{
  var res='';
  try{
  var re = /=\s'[^']*/ig;
  var m = txt.match(re);
   re = /'[^']*/ig;
   m = m[0].match(re);
   res = m[0].replace(/'/g, '');
}catch (error){
  return null;
}
return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getProperty (txt){
  try{
  var res;
  txt = txt.replace(/ /g, '');
  try{
    var re = /onejsonld[^\]]*/ig;
  var m = txt.match(re);
   res = m[0].replace(/'/g, '');
   res = res.replace(/onejsonld/ig, '');
   res = res.replace(/\[/g, '');
}catch (error){
  return null;
}
return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getPath (txt){
  try{
  var res;
  try{
  var re = /onejson\['.*'\]/ig;
  var m = txt.match(re);
   res = m[0].replace(/onejson/ig, '');
}catch (error){
  return null;
}
return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getTypeJLD (txt){
  try{
  var res;
  try{
  var re = /^[^\[]*/ig;
  var m = txt.match(re);
  res = m[0].replace(/\[/g, "");
  res = res.replace(/\r/g, "");
  res = res.replace(/\n/g, "");
}catch (error){
  return null;
}
return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getLink(txt){
  try{
  var res;
  try{
  var re = /\'http[^\']*/ig;
  var m = txt.match(re);
  res = m[0].replace(/\'/g, "");
}catch (error){
  return null;
}
return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getRegexp(txt){
  try{
    var res;
    try{
//      var re = /,[^\']*\)/ig;
      var re = /\(\/.*\//ig;
      var m = txt.match(re);
      res = m[0].replace(/\(/g, "");
//      res = res.replace(/\)/g, "");
    res = res.trim();
    }catch (error){
      return null;
    }
    if (res) res = Base64.encode(res);
    return res;
  }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

////////////////////


///////////////////

function getContext(txt){
  try{
   var contJS={};
   var res;
      try{
        var re = /{.*}/ig;
        var m = txt.match(re);
        res = m[0].replace(/ /g, "");
        res = res.replace(/\\/g, "");
        res = res.replace(/\{/g, "");
        res = res.replace(/\}/g, "");
        var res2 = res.split(",");
        for (var i = 0; i<res2.length; i++){
          var res3 = res2[i].split('":"');
            var prefix = res3[0];
            var onto = res3[1];
            prefix = prefix.replace(/\"/g, "");
            onto = onto.replace(/\"/g, "");
            contJS[prefix]=onto;
        }
      }catch (error){
        infoit(error);
        return contJS;
      }
      return contJS;
    }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

    function getPrefix(txt){
      try{
      var res = txt.split(":");
      var prefix = null;
      if (res[1]) prefix= res[0];
      return prefix;
    }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

    function getClas(txt){
      try{
      var res = txt.split(":");
      var clas = null;
      if (res[1]) clas= res[1];
      return clas;
    }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getOntologyUri(txt){
  try{
  if (txt == null) return null;
  var onto = contextJS[txt]
  return onto;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

var typeNULL=0;
var typeTYPE=1;
var typeNORMAL=2;
var typeEMBEDDEDTYPE=3;
var typeEMBEDDEDID=4;
var typeEMBEDDEDPROPERTY=5;
var typeCONTEXT=6;
var embeddedElementContainner={};
var contextJS={};

function getTypetion (txt){
  try{
  txt = txt.replace(/ /g, '');
  txt= txt.toLowerCase();
  if (txt.indexOf("onejsonld['@context']")>-1) return typeCONTEXT;
  if (txt.indexOf("onejsonld['@type']")>-1) return typeTYPE;
  if (txt.indexOf("onejsonld['@id']")>-1  || txt.indexOf("varloop=")>-1 ) return typeNULL;
  if (txt.indexOf("['@type']")>-1) return typeEMBEDDEDTYPE;
  if (txt.indexOf("['@id']")>-1) return typeEMBEDDEDID;
  if (txt.indexOf("onejsonld['")>-1 && txt.indexOf("=[]")==-1) return typeNORMAL;
  if (txt.indexOf("=get")==-1 && txt.indexOf("=[]")==-1 && (txt.indexOf("']=")>-1 || txt.indexOf("'].push")>-1)) return typeEMBEDDEDPROPERTY;
  return typeNULL;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function annotateIt (line){
//@type
try{
var j={};
var typetion=getTypetion(line);
if (typeTYPE == typetion){
  var type=getTypeClass(line);
  var clas = getClas(type);
  var classontologyprefix = getPrefix(clas);
  var classontologyuri = getOntologyUri(classontologyprefix);
    j = {};
    j["type"]=type;
    j["class"]=clas;
    j["classontologyprefix"]=classontologyprefix;
    j["classontologyuri"]=classontologyuri;
    ldw.setTypeData (j);
 }
  //embedded
 if (typeEMBEDDEDTYPE == typetion){
   var clas=getTypeClass(line);
   var classontologyprefix = getPrefix(clas);
   var classontologyuri = getOntologyUri(classontologyprefix);

    var oneJLD=getTypeJLD(line);
    j = embeddedElementContainner[oneJLD];
   if (!j){
     var j = {};
    }
      j["type"]="embedded";
      j["class"]=clas;
      j["classontologyprefix"]=classontologyprefix;
      j["classontologyuri"]=classontologyuri;
    embeddedElementContainner[oneJLD]=j;
    if (j["attribute"] && j["property"] && j["class"]){
      j.path= "['query']['results']"+j.path;
      ldw.annotate (j.path, j);
      embeddedElementContainner[oneJLD]= null;
    }
 }
 if (typeEMBEDDEDID == typetion){
   var path = getPath(line);
   var attribute = path;
   var uripattern = getLink(line);
   var regex = getRegexp(line);
   var oneJLD=getTypeJLD(line);  //???
   j = embeddedElementContainner[oneJLD];
   if (!j){
     var j = {};
   }
     j["type"]="embedded";
     j["path"]=path;
     j["attribute"]=attribute;
     j["uripattern"]=uripattern;
     j["regex"]= regex;
   embeddedElementContainner[oneJLD]=j;
   if (j["attribute"] && j["property"] && j["class"]){
     j.path= "['query']['results']"+j.path;
     ldw.annotate (j.path, j);
     embeddedElementContainner[oneJLD]= null;
   }
}
if (typeEMBEDDEDPROPERTY == typetion){
  var property = getProperty(line);
  var ontologyprefix = getPrefix(property);
  var ontologyuri = getOntologyUri(ontologyprefix);

  j = embeddedElementContainner[oneJLD];
  if (!j){
    var j = {};
  }
    j["type"]="embedded";
    j["property"]=property;
    j["ontologyprefix"]=ontologyprefix;
    j["ontologyuri"]=ontologyuri;
  embeddedElementContainner[oneJLD]=j;
  if (j["attribute"] && j["property"] && j["class"]){
    j.path= "['query']['results']"+j.path;
    ldw.annotate (j.path, j);
    embeddedElementContainner[oneJLD]= null;
  }
}
//others
//  var j = '{"type":"normal","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+anchor.get ('formProperties').value+'","dataset":"'+dataSetValue+'","path":"'+path+'", "regex":"'+re+'"}';
if (typeNORMAL == typetion){
  var property = getProperty(line);
  var ontologyprefix = getPrefix(property);
  var ontologyuri = getOntologyUri(ontologyprefix);
  var path = getPath(line);
  var uripattern = getLink(line);
  var regex = getRegexp(line);
  var j = {};
  j["type"]="normal";
  j["property"]=property;
  j["ontologyprefix"]=ontologyprefix;
  j["ontologyuri"]=ontologyuri;
  j["path"]=path;
  j["attribute"]=attribute;
  j["uripattern"]=uripattern;
  if (uripattern) {j["objproperty"]=true; }
  else j["objproperty"]=false;
  j["dataset"]=uripattern;
  j["regex"]= regex;
  j["line"]= line;
  j.path= "['query']['results']"+j.path;
  ldw.annotate (j.path, j);
}
if (typeCONTEXT == typetion){
  contextJS = getContext(line);
}
}catch(err){
    infoit (err.lineNumber+' :: '+ err.message);}
}

 function linkify2(txt){
   try{
    var exp = /htt[^"]*/g;
     txt = txt.replace(exp,"<a href='$1'>$1</a>");
     exp = /,/g;
     txt = txt.replace(exp,"\n");
     return txt;
   }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

 function linkify(text){
   try{
     if (text) {
     	var exp = /,/g;
     	text = text.replace(exp,",\n");
         text = text.replace(/htt[^"]*/g,
             function(url){
                 return '<a href="' + url + '" target="_one">' + url + '</a>';
             }
         );
     }
     return text;
   }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function consoleGlobalSignalers(){
  try{
/*  logit ('ANNOTATED '+globalSignaler[ANNOTATED]);
  logit ('PUSHEDANNOTATIONBUTTON: ' + globalSignaler[PUSHEDANNOTATIONBUTTON]);
  logit ('XMLANNOTATION' +globalSignaler[XMLANNOTATION]);
  logit ('XMLREANNOTATION '+globalSignaler[XMLREANNOTATION]);
  logit ('RENEWANNOTATION ' +globalSignaler[RENEWANNOTATION]);*/
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function consoleTokens(){
  try{
    var tokens = readStorageTokens();
    executeToken = tokens.executeToken;
 		selectToken = tokens.selectToken;
		updateToken = tokens.updateToken;
  logit('executeToken: '+executeToken);
  logit('selectToken: '+selectToken);
  logit('updateToken: '+updateToken);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function logit(txt){
    console.log (txt);
}

function infoit(txt){
    console.info (txt);
}

var switchON=true;
function switchIt(hidenow){
  try{
if (hidenow) switchON = false;
if (!switchON){
  hideIt (anchor.get ('formCode'));
  switchON=true;
}else{
  switchON=false;
  showIt (anchor.get ('formCode'));
}
previewCode();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function hideIt (elements) {
  try{
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = 'none';
  }
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function showIt (elements, specifiedDisplay) {
  try{
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = specifiedDisplay || 'block';
  }
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////////
//////LDW prototype
////////////////////

function Anchor(){
  try{
  ///attributes:
     this.body = document.getElementsByTagName("body")[0];

 }catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///methods

Anchor.prototype.get = function (name){
  try{
  if (name === "Body") return this.body;
     if (name === 'a+TABLES') return  findElement('a', 'TABLES');
     if (name === 'option+YQL Table') return  findElement('option', 'YQL Table');
     if (name === 'a+Insert Template (https)') return  findElement('a', 'Insert Template (https)');
     if (name === 'a+Sign In') return  findElement('a', 'Sign In');
     if (name === 'label+Select') return  findElement('label', 'Select');
     if (name === 'span+salute') return  findElementClass('span', 'salute');
  return document.getElementById(name);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///operations on elements
//function eraseElement (name){
Anchor.prototype.eraseElement = function (name){
  try{
	var elmDeleted = document.getElementById(name);
	elmDeleted.parentNode.removeChild(elmDeleted);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function addIn (parentname, elmNewContent){
  Anchor.prototype.addIn = function (parentname, elmNewContent){
    try{
	var elmFoo = document.getElementById(parentname);
	elmFoo.parentNode.insertBefore(elmNewContent, elmFoo);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function hide (name){
  Anchor.prototype.hide = function (name){
    try{
	var elmDeleted = document.getElementById(name);
	elmDeleted.style.visibility = "hidden";
	elmDeleted.style.zIndex = "-999";
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function show (name){
  Anchor.prototype.show = function (name){
    try{
	var elmDeleted = document.getElementById(name);
	elmDeleted.style.visibility = "";
	elmDeleted.style.zIndex = "1";
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

/////////////////////
//////LDW prototype
////////////////////

// ver las fucnions auxiliares utilizadas abajo.
//ver embeddedElementContainner
//tableTemplate=ldw.get ('wrapperxml');  ?????
//	select src from yql.table.desc where name="local.search.ldw"    ???
//don't continue if not logged in

function LDW(){
  try{
  ///attributes:
  var gb= readData ('globalwrapper');
  if (gb == null || globalSignaler[ANNOTATED]==false){
    this.globalwrapper = {};
  }else{
      this.globalwrapper = gb;
  }
    this.globalwrapper.ldwtype =  JSON.parse('{"type":"NS:CLASS","class":"CLASS","classontologyprefix":"NS","classontologyuri":""}');
    this.globalwrapper.annotations = JSON.parse('[]');
    this.globalwrapper.globalannotation = JSON.parse('{}');
    this.globalwrapper.inputs = JSON.parse('{}');
var metas = undecode ("%3Cauthor%3E%3C!--%20your%20name%20or%20company%20name%20--%3E%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3E%3C!--%20description%20of%20the%20table%20--%3E%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3E%3C!--%20url%20for%20API%20documentation%20--%3E%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3E%3C!--%20url%20for%20getting%20an%20API%20key%20if%20needed%20--%3E%3C%2FapiKeyURL%3E");

//setGlobalData ("", "", "", "", "", "", ldw.get('wrapperxml'), "", "", "","", metas);
//setGlobalData ("", "", "", "", "", "", "", "", "", "","", metas);
//setGlobalData ( undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, metas);

    var page = window.location.href;
    if (page.indexOf ('developer.yahoo.com/yql/console')>-1) {
      this.globalwrapper.wrapperxml= "VOID" ;
    }
    writeData ('globalwrapper', this.globalwrapper);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

///methods

//function createLifting(){
LDW.prototype.getLifting = function (){
  try{
  var template = undecode ('%3Cfunction%20name%3D%22lifting%22%3E%0A%20%20%3Cinputs%3E%0A%20%20%20%20%20%3Cpipe%20id%3D%22oneXML%22%20paramType%3D%22variable%22%2F%3E%0A%20%20%20%20%20%3Ckey%20id%3D%22URI%22%20paramType%3D%22variable%22%20required%3D%22true%22%2F%3E%0A%20%20%3C%2Finputs%3E%0A%20%3Cexecute%3E%3C!%5BCDATA%5B%0Atry%7B%0A%20var%20oneJSON%3D%20y.xmlToJson(oneXML)%3B%0A%09var%20oneJSONLD%3D%7B%7D%3B%0A%09oneJSONLD%5B%27%40id%27%5D%3DURI%3B%0A%09oneJSONLD%5B%27%40context%27%5D%3D%20%23CONTEXT%23%0A%09oneJSONLD%5B%27%40type%27%5D%3D%20%27%23TYPE%23%27%3B%20%23MATCHINGS%23%0A%20%20%20%20%20%7Dcatch%20(err)%7B%20y.log(err)%3B%7D%0A%20%20%20%20response.object%20%3D%20oneJSONLD%3B%0A%0Afunction%20getInterlink%20(urlpattern%2C%20value)%7B%0A%09try%7Breturn%20value%3F%20urlpattern.replace(%2F%7B.*%7D%2F%2C%20value)%20%3A%20null%3B%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getRegexpValue(regexp%2C%20value)%7B%0A%20%09try%7Breturn%20value.match(regexp)%5B0%5D%3B%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getValue(dataPath)%20%7B%0A%09try%7Breturn%20eval(dataPath)%20%7C%7C%20null%3B%20%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0Afunction%20getLength(obj)%20%7B%0A%20%20%09try%7Breturn%20obj%3F%20obj.length%3A%200%3B%20%7Dcatch(err)%7Breturn%200%3B%7D%7D%0A%0A%5D%5D%3E%0A%20%20%20%3C%2Fexecute%3E%0A%3C%2Ffunction%3E');
  template= template.replace ("#CONTEXT#", ldw.getContext());
  template= template.replace ("#TYPE#", ldw.getTypeData()['type']);
  template= template.replace ("#MATCHINGS#", ldw.annotationMappings());
  return template;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function annotationContext(annotations, type){
LDW.prototype.getContext = function (){
  try{
  var txt ='';
	var jcontext= JSON.parse('{}');
  var annot = this.getAnnotations(this.globalwrapper.globalannotation);
  logit ("ANN: "+JSON.stringify(annot));
	for (var i =0; i<annot.length; i++){
    var ann = annot[i];
		jcontext[ann.ontologyprefix] = ann.ontologyuri;
		if (ann.classontologyprefix != null){
			jcontext[ann.classontologyprefix] = ann.classontologyuri;
			}
      if (ann.objproperty == true){
  			jcontext[ann.property] = {"@type": "@id"};
  			}
	}
  var t = this.getTypeData();
  var t2 = JSON.stringify(t);
	if (t.classontologyprefix != null){
			jcontext[t.classontologyprefix] = t.classontologyuri;
		}
	txt = JSON.stringify(jcontext)+';';
	return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


LDW.prototype.set = function (name, value){
  try{
  this.globalwrapper[name] = value;
  writeData ('globalwrapper', this.globalwrapper);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.get = function (name){
  try{
  return this.globalwrapper[name];
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getTypeData = function (){
  try{
  return this.globalwrapper.ldwtype;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.setTypeData = function (js){
  try{
    this.globalwrapper.ldwtype = js;
  writeData ('globalwrapper', this.globalwrapper);
  globalButtonContainner = anchor.get ("results");
  changeButtonColorAnnotated();
  return true;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getLDWQuery = function (){
  try{
    var ldwquery = ldw.get('ldwquery');
    var inputs = ldw.get ("uripattern").match(/\{[^}]*\}/g);
    var inputsSemantic = ldw.getURIPattern().match(/\{[^}]*\}/g);
    if (inputs == null) inputs =[];

    var first =true;
    for (var i=0; i<inputs.length; i++){
      var inputid= inputs[i];
      var inputidSem= inputsSemantic[i];
      inputidSem = inputidSem.replace ("\}","");
  		inputidSem = inputidSem.replace ("\{","");
      inputid = inputid.replace ("\}","");
  		inputid = inputid.replace ("\{","");
      ldwquery= ldwquery.replace(inputid, inputidSem);
  	}
    return ldwquery;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getURIPattern = function (){
  try{
    if (!this.globalwrapper.inputs) this.globalwrapper.inputs={};
  var params = ldw.get('uripatternparams');
  var pars = params.split('/');
 for (var i = 1; i< pars.length; i++){
    var p = pars[i].replace('{','').replace('}','');
    var pj= this.globalwrapper.inputs[p];
    if (pj != null) params = params.replace (pars[i],'{'+pj.property+'}');
  }
  return ldw.get('baseuri')+ ldw.get('api') +'/'+ldw.get('class')+params;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getURIPatternCredentialLess = function (){
  try{
    if (!this.globalwrapper.inputs) this.globalwrapper.inputs={};
  var params = ldw.get('uripatternparamscredentialless');
  var pars = params.split('/');
 for (var i = 1; i< pars.length; i++){
    var p = pars[i].replace('{','').replace('}','');
    var pj= this.globalwrapper.inputs[p];
    if (pj != null) params = params.replace (pars[i],'{'+pj.property+'}');
  }
  return ldw.get('baseuri')+ ldw.get('api') +'/'+ldw.get('class')+params;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getURIExampleCredentialLess = function (){
  try{
    if (!this.globalwrapper.inputs) this.globalwrapper.inputs={};
    var params = ldw.get('uriexampleparamscredentialless');
    var pars = params.split('/');
    for (var i = 1; i< pars.length; i++){
      var p = pars[i].replace('{','').replace('}','');
      var pj= this.globalwrapper.inputs[p];
      if (pj != null) params = params.replace (pars[i],'{'+pj.property+'}');
    }
  return ldw.get('baseuri')+ ldw.get('api') +'/'+ldw.get('class')+params;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.setInput = function (js){
  try{
    if (!this.globalwrapper.inputs) this.globalwrapper.inputs={};
    this.globalwrapper.inputs[js.path]=js;

  writeData ('globalwrapper', this.globalwrapper);
  return true;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getTypeDataClass = function (){
  try{
var clas = ldw.getTypeData()['type'];
clas = clas.substring (clas.indexOf(':')+1, clas.length);
return clas;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getXML = function (){
  try{
//    var gb= readData ('globalwrapper');
  //  return gb.XML;
  return this.globalwrapper.wrapperxml;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.setXML = function (xml){
  try{
  this.globalwrapper.wrapperxml = xml;
  writeData ('globalwrapper', this.globalwrapper);
  infoit('done');
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.cleanLDW = function (queryResults){
  try{
  this.globalwrapper.globalannotation= cleanAnnotate(queryResults, '', 0);
  this.globalwrapper.globalannotationclean=this.globalwrapper.globalannotation;
  writeData ('globalwrapper', this.globalwrapper);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.annotate = function (path, js){
  try{
  if (js.type == 'input'){
    this.setInput(js);
    logit('annotating input:'+JSON.stringify(js));
  }else{
    this.globalwrapper.globalannotation=annotateJSON(path, js, this.globalwrapper.globalannotation);
    logit(JSON.stringify(this.globalwrapper.globalannotation));
    writeData ('globalwrapper', this.globalwrapper);
    logit('exists? '+path)
  }
  globalButtonContainner = anchor.get(path);
  changeButtonColorAnnotated();
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.getStructure = function (){
  try{
  return this.globalwrapper.globalannotationclean;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function annotationMatchings(gAnnotation){
LDW.prototype.annotationMappings = function (){
  try{
  var res = this.annotationMappingDeep (this.globalwrapper.globalannotation, "oneJSONLD", 1, false);
  return res;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

LDW.prototype.annotationMappingDeep = function (jsSource, containner, level, isFored){
  try{
//    logit(level);
var result1  = "";
  var counter = 0;
  for (var p in jsSource) {
   	if(jsSource.hasOwnProperty(p) && typeof jsSource[p] == "object") {
      //DATA
      counter += 1;
      var annotation = jsSource[p]['annotation'];
      var datacornejo = jsSource[p]['datacornejo'];
      var count = (p.match(/\]\[/g) || []).length;
      var variable = jsSource[p]['var'];
      var patha = p.replace(/\['/g, "[");
	    patha = patha.replace(/\']/g, "]");
	    patha = patha.replace(/\[/g, "['");
	    patha = patha.replace(/\]/g, "']");
      patha = patha.replace("['query']['results']", "");
      //STATE
      var isBranch = datacornejo != null;   //is not leave.
    	var isAnnotated = annotation != null;
      var isEmbedded = false;
      if (annotation) isEmbedded = jsSource[p]['annotation']['type']=='embedded';
  		var isFor = jsSource[p]['type']=='for';
      isFored = isFored ||isFor;
      var isPushed =isFored && !isEmbedded;
      var deepinitialization = "";
      var deepassignments = "";
      var initialization = "";
      var assignments = "";
      var result2 = ""
      if (isFor) level++;
        if (isAnnotated && isEmbedded){
          var containner2 = containner;
          containner = containner+count;
          result2 = this.embeddedMapping(datacornejo, containner, level, isFored, annotation, containner2);
          initialization = getInitialization (result2);
          assignments = getAssignations (result2);
        }else if (isAnnotated && ! isEmbedded){
          result2 = this.annotationMapping(datacornejo, containner, level, isPushed, annotation);
          initialization = getInitialization (result2);
          assignments = getAssignations (result2);
        }else{
        var result3 = ""
        if (isBranch){
          result3 =  this.annotationMappingDeep(datacornejo, containner, level, isPushed);
          deepinitialization = getInitialization (result3);
          deepassignments = getAssignations (result3);
        }}

      initialization += deepinitialization;
      assignments = deepassignments +assignments;
      var pre = "";
      var post = "";
      if (isFor){
        level --;
        pre = levelblank2 (level)+"for (var "+variable+" = 0; "+variable+" < getLength(oneJSON"+patha+"); "+variable+"++){";
        post = levelblank2 (level)+"}";
        if (assignments.trim()){
          result1 = result1 + initialization + "\n" + pre + assignments + "\n" + post;
        }else {
          result1 = initialization+ '\n'+ result1 + assignments;
        }
  		}else{
        if (isFored && initialization.trim()){
         result1 = initialization+ '###'+ result1 + assignments;
        }else{
         result1=result1+assignments;
        }
      }
      }
    }
  logit (p +' result: '+result1);
    return result1;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getInitialization (resu){
  try{
  var initialization = "";
  while (resu.indexOf('###')>0){
    initialization += resu.substring (0, resu.indexOf('###'));
    resu = resu.substring (resu.indexOf('###')+3);
  }
  return initialization;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

function getAssignations (resu){
  try{
  while (resu.indexOf('###')>0){
    resu = resu.substring (resu.indexOf('###')+3);
  }
  return resu;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function annotationMapping(annotation, containner, level, isFored) {
LDW.prototype.embeddedMapping = function (datacornejo, containner2, level, isFored, annotation, containner){
  try{
  var type = annotation.type;
	var ontologyprefix = annotation.ontologyprefix;
	var ontologyuri = annotation.ontologyuri;
	var property = annotation.property;
	var uripattern = annotation.uripattern;
  var dataset = annotation.dataset;
	var path = annotation.path;
  path = path.replace ("['query']", "");
  path = path.substring (path.indexOf(']')+1, path.length);
	var attribute = annotation.attribute;
	var regex = annotation.regex;
  if (regex != null)  regex= Base64.decode(regex);
  var classontologyprefix = annotation.classontologyprefix;
	var classontologyuri = annotation.classontologyuri;
	var clas = annotation['class'];
  var deepinitialization = "";
  var deepassignments = "";

  var result3 = ""
  if (datacornejo){
    result3 =  this.annotationMappingDeep(datacornejo, containner2, level, false);
    deepinitialization = getInitialization (result3);
    deepassignments = getAssignations (result3);
  }

  var txt=deepinitialization;

  if (isFored){
    txt = "\n"+levelblank2 (level-1)+containner+"['"+property+"']=[];";
  }
  txt += "###";
  txt += "\n"+levelblank2 (level)+"var "+containner2+"={};";
    txt += "\n"+levelblank2 (level)+containner2+"['@type']= '" +clas+"';";
  	if (regex){
      var cls = clas.substring (clas.indexOf(':')+1, clas.length).toLowerCase();
			if (attribute){
        txt += "\n"+levelblank2 (level)+containner2+"['@id']= getInterlink('"+uripattern+"', getRegexpValue ("+regex+",getValue(\"oneJSON"+attribute+"\")));";
			}else{
        txt += "\n"+levelblank2 (level)+containner2+"['@id'] = URI+'/"+cls+"';";
			}
		}else{
			if (attribute){
        attribute2 = attribute.replace("['query']['results']", "");
        txt += "\n"+levelblank2 (level)+containner2+"['@id']= getInterlink('"+uripattern+"', getValue(\"oneJSON"+attribute2+"\"));";
    	}else{
				txt += "\n"+levelblank2 (level)+containner2+"['@id'] = URI+'#"+clas+"';";
			}
		}
    if (isFored){
      txt +=deepassignments+ "\n"+levelblank2 (level)+containner+"['"+property+"'].push ("+containner2+");";
    }else{
        txt +=deepassignments+ "\n"+levelblank2 (level)+containner+"['"+property+"'] = "+containner2+";";
    }
	return txt;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function annotationMapping(annotation, containner, level, isFored) {
LDW.prototype.annotationMapping = function (datacornejo, containner, level, isFored, annotation){
  try{
  var type = annotation.type;
	var ontologyprefix = annotation.ontologyprefix;
	var ontologyuri = annotation.ontologyuri;
	var property = annotation.property;
	var uripattern = annotation.uripattern;
  var dataset = annotation.dataset;
	var path = annotation.path;
  path = path.replace ("['query']", "");
  path = path.substring (path.indexOf(']')+1, path.length);
	var attribute = annotation.attribute;
	var regex = annotation.regex;
  if (regex != null)  regex= Base64.decode(regex);
  var classontologyprefix = annotation.classontologyprefix;
	var classontologyuri = annotation.classontologyuri;
	var clas = annotation['class'];
  var deepinitialization = "";
  var deepassignments = "";

    var result3 = ""
    if (datacornejo){
      result3 =  this.annotationMappingDeep(datacornejo, containner, level, isFored);
      deepinitialization = getInitialization (result3);
      deepassignments = getAssignations (result3);
    }
	var txt=deepinitialization;
 if (dataset && regex){
    	if (isFored){
				txt = "\n"+levelblank2 (level-1)+containner+"['"+property+"']=[];###";
        txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getInterlink('"+dataset+"', getRegexpValue ("+regex+",getValue(\"oneJSON"+path+"\"))));";
    	}else{
        txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getInterlink('"+dataset+"', getRegexpValue ("+regex+",getValue(\"oneJSON"+path+"\")));";
			}
		}else if (!dataset && regex) {
			if (isFored){
				txt = "\n"+levelblank2 (level-1)+containner+"['"+property+"']=[];###";
        txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getRegexpValue("+regex+", getValue(\"oneJSON"+path+"\")));";
    		}else{
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getRegexpValue("+regex+", getValue(\"oneJSON"+path+"\"));";
			}
		}else if (!dataset && !regex) {
			if (isFored){
				txt = "\n"+levelblank2 (level-1)+containner+"['"+property+"']=[];###";
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getValue(\"oneJSON"+path+"\"));";
    		}else{
		    txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getValue(\"oneJSON"+path+"\");";
			}
		}else if (dataset && !regex){
    		if (isFored){
				txt = "\n"+levelblank2 (level-1)+containner+"['"+property+"']=[];###";
        txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getInterlink('"+dataset+"' ,getValue(\"oneJSON"+path+"\")));";
    		}else{
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getInterlink('"+dataset+"' ,getValue(\"oneJSON"+path+"\"));";
			}
		}
	return txt+deepassignments;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

//function annotationMatchingDeep (jsSource, containner, level, isFored){
LDW.prototype.getAnnotations = function (jsSource){
  var result = [];
  try{
  for (var p in jsSource) {
   	if(jsSource.hasOwnProperty(p) && typeof jsSource[p] == "object") {
    	var annotated = jsSource[p]['annotation'] != null;
      if (annotated){
      		var annotation = jsSource[p]['annotation'];
          result.push(annotation);
  		}
   		if (jsSource[p]['datacornejo'] != null){
        var res =this.getAnnotations(jsSource[p]['datacornejo']);
        for (var i =0; i<res.length; i++){
            result.push(res[i]);
          }
  		}
  	}}
  return result;
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}


function setGlobalData (URIExampleParams, URIPatternParams, select, select2, ldwquery, table, wrapperxml, type, globalAPI, URIExampleParamsCredentialLess, URIPatternParamsCredentialLess, metas){

  try{
  var j;
  if (ldw.getTypeData() == null) j= JSON.parse('{"type":"NS:CLASS","class":"CLASS","classontologyprefix":"NS","classontologyuri":""}');
  else j = ldw.getTypeData();
  if (type != null) {
    j= type;
  }

if (metas == undefined){
  metas = undecode ("%3Cauthor%3E%3C!--%20your%20name%20or%20company%20name%20--%3E%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3E%3C!--%20description%20of%20the%20table%20--%3E%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3E%3C!--%20url%20for%20API%20documentation%20--%3E%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3E%3C!--%20url%20for%20getting%20an%20API%20key%20if%20needed%20--%3E%3C%2FapiKeyURL%3E");
}

if (URIExampleParamsCredentialLess == undefined) URIExampleParamsCredentialLess = URIExampleParams;
if (URIPatternParamsCredentialLess == undefined) URIPatternParamsCredentialLess = URIPatternParams;

  var js = j;
  ldw.set('ldwtype', js);
  var cls = js['type'];
  if (cls)  cls = cls.substring(cls.indexOf(':')+1).toLowerCase().trim();
  else cls='CLASS';
  ldw.set('metas', metas);
  ldw.set('class', cls);
  ldw.set('baseuri', globalBaseURI);
  ldw.set('api', globalAPI);
  ldw.set('uriexampleparams', URIExampleParams);
	ldw.set('uripatternparams', URIPatternParams);
  ldw.set('uriexampleparamscredentialless', URIExampleParamsCredentialLess);
	ldw.set('uripatternparamscredentialless', URIPatternParamsCredentialLess);
  ldw.set('uriexample', globalBaseURI+ globalAPI +'/'+cls+URIExampleParams);
	ldw.set('uripattern', globalBaseURI+ globalAPI +'/'+cls+URIPatternParams);
	ldw.set('samplequery', select);
	ldw.set('launchedquery', select2);
	ldw.set('ldwquery', ldwquery +" | t.lifting('"+ldw.get('uriexample')+"')");
  ldw.set('tablename', table);
  ldw.set('ldwname', globalAPI+'.'+cls+'.ldw');
  ldw.set('wrapperxml', wrapperxml);
  ldw.set('baseuri', globalBaseURI);
}catch(err){infoit (err.lineNumber+' :: '+ err.message);}}

console.log('the end');
