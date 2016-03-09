// ==UserScript==
// @name           ODT to LDW
// @author         	Iker Azpeitia
// @version        2016.03.09
// @namespace      odt2ldw
// @description	   ODT to LDW
// @include        http://developer.yahoo.com/yql/*
// @include        https://developer.yahoo.com/yql/*
// @require https://raw.githubusercontent.com/onekin/ikerisworking/master/ldw/library/base64.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_addStyle
// ==/UserScript==

//////////////////
/// GLOBAL VARIABLES
//////////////////

//TODO: -ARREGLAR EL MAPPIN GTHE PATTERN Y EXAMPLE. matching enmedio???
//por que mete " al nombre la segunda vez de reannotation
//createLDWWrapper newmappings to add the new anotatitons.
//embedded1 2 3
//oneJSONLD['embeded2'] = oneJSONLD1; con push por estar en for??
// la segunda anotación  use "https:/
//weather forecas as embedded??? embedde array or array of embeddeds?
//mete los \/ scaped en la dereferenciacion.

// require https://raw.githubusercontent.com/onekin/ikerisworking/master/menu/jquery-1.10.2.min.js

/*
<function name="lifting">
  <inputs>
     <pipe id="oneXML" paramType="variable"/>
     <key id="URI" paramType="variable" required="true"/>
  </inputs>
 <execute><![CDATA[
//interlink with regexp
function getRegexpInterlink (dataPath, urlpattern, regexp){
	return urlpattern.replace(/{.*}/, getRegexpValue(dataPath, regexp));}

//interlink without regexp
function getInterlink (dataPath, urlpattern){
	return urlpattern.replace(/{.*}/, getValue(dataPath));}

//direct mapping with regexp
function getRegexpValue(dataPath, regexp){
 	try{return getValue(dataPath).match(regexp)[0];}catch(err){return null;}}

//direct mapping without regexp
function getValue(dataPath) {
	try{return eval(dataPath) || null; }catch(err){return null;}}

function setArray(dataPath) {
  var begin=dataPath.indexOf(']',0)+1;
  beginnext = dataPath.indexOf(']',begin+1)
  while (begin>0 && beginnext>0){
    	var dPath = dataPath.substring(0,begin);
	var objs= getValue(dPath);
	if (objs=== null) {eval(dPath+'={};');}
	begin = dataPath.indexOf(']',begin+1)+1;
   	beginnext = dataPath.indexOf(']',begin+1)
  }
  var res = [];
  var objs= getValue(dataPath);
  if (objs=== null) {eval(dataPath+'=[];');}
  else {if (!objs[0]) {eval(dataPath+'=[];'+dataPath+'.push(objs);');}}
}

try{
 var oneJSON= y.xmlToJson(oneXML);
	var oneJSONLD={};
	oneJSONLD['@id']=URI;
	oneJSONLD['@context']= #CONTEXT#
	oneJSONLD['@type']= '#TYPE#';
    #MATCHINGS#
     }catch (err){ y.log(err);}
    response.object = oneJSONLD;]]>
   </execute>
</function>
*/


var version = {number :'2016.03.09'};
console.log ('Loading '+version.number);

///
//URLs
///
var yqlgithuburl = "https://api.github.com/repos/yql/yql-tables/git/trees/master?recursive=1";
var ldwgithuburl = "https://api.github.com/repos/onekin/ldw/git/trees/master?recursive=1";
var tableurl = "https://api.github.com/repos/onekin/owc/contents/";
var serviceurl2 ="http://localhost:8080/LinkedDataWeb/?uri=";
var serviceurl ="http://rdf.onekin.org/?uri=";
var mode = "&mode=";
var format ="RDF/XML-ABBREV"; //default

var urlOWL1B ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fpublic%2Fyql%3Fq%3Dselect%2520*%2520from%2520xml%2520where%2520url%253D'";
var urlOWL2B ="'%26format%3Djson%26diagnostics%3Dtrue%26callback%3D%22%20and%20itemPath%20%3D%20%22query.results.RDF.*.about%22%20%7C%20unique(field%3D%22about%22%2C%20hideRepeatCount%3D%22true%22)&debug=true&format=json&diagnostics=true&callback=";
var urlOWL1c ="lov.okfn.org/dataset/lov/api/v2/vocabulary/info?vocab=";
var urlOWL2c ="";

var urlOWL1 ='https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22http%3A%2F%2Flov.okfn.org%2Fdataset%2Flov%2Fapi%2Fv2%2Fvocabulary%2Finfo%3Fvocab%3D';
var urlOWL2 ='%22&debug=true&format=json&diagnostics=true&callback=';

var n3url1 = "https://query.yahooapis.com/v1/public/yql?q=use%20'https%3A%2F%2Fraw.githubusercontent.com%2Fiker%2Fyql-tables%2Fmaster%2Fdata%2Fdata.httpsconversor.xml'%20as%20t%3B%20select%20*%20from%20t%20where%20url%3D%22";
var n3url2 = "%22%20&diagnostics=true";


var ldwURL="http://rdf.onekin.org/ldw/newwrapperfile";
//var ldwURL="http://localhost:8080/ldw/ldw/newwrapperfile";
//var ldwURL2="http://localhost:8080/ldw/ldw/page/yqlpublishing/";
var ldwURL2="http://rdf.onekin.org/ldw/page/yqlpublishing/";
////

var logo ="url(data:image/png;base64,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)";
var oneFingerImg ='&nbsp;<img  width="10" height="10" title="" title="DECoupled LDW" alt="DECoupled LDW" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAA0klEQVRIie3WsQ3CMBAFUI/ACDSJ7rqMwAgZgREY4W8QNiAbQId/mniDsAFsEDYITZDSIOwTSYFy0hW2bD357JPsXETkYKlgr/CHmPXmEDAoOCjYzQ3dRmiYFXojK7RCfw4JrjuBbxWsMjSFgmcFqxkgf5+OJ/MnBTsB8RMoJjM0xSKQwh8XgQQMyYiAdfqJ2C+BpLWBgLAiqVBYBFL4ixUR8BkNjV1vhUI0NJbPdE8C1kmQc7YS5mCZDG3Rbqafk+/pH8mIBRM0ezPkXPzj+LT/BX/7O08t261FAAAAAElFTkSuQmCC" />&nbsp;';
var tiedHandsImg ='&nbsp;<img  width="10" height="10" title="" title="Coupled LDW" alt="Coupled LDW" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABbUlEQVRIie3U0Y2DMAwA0IzQEfIZ7B9+qrO/ygbHBscmZYPrBmWD6wYOXaBs0Nug2YD7oBREIAKE7qtIFhIEv9hyUEopJQS5ZayFIFcbXaM5LWPdxlZQL+fjv6A6/PANzYWE0AlH6VaQcJQKofMhjlJhPFnGumT8Xg/gyTI+hDATjlIPau+vIDgvRgiL4ViPtM4kbUVrsAFSC+NJyCRC6PqLnGW4Sax3ww/mYB5CWEisd5bhJoS2W/iqZDkWQrxf0DN5FcLG/oPDVvsIFv7OBtj1Az49bI9xV4lJPISjtIdUgV4b3c7+WPR3KAyXwLpKYr2bhJRSSvYYT2IE93ZdAHFCRgeRbrfNQRuLECSErt/eeRhhtgLKFiGhZHPerYaavqMVhktXMeTNyTfJaqBLZrSQ0Vc2hyubQ0n4VRIcS4KjJThbQmkC7s9j8bMcCYzv5MT1Kl4MCcOvENpnFE3LIBfCrG3d7HEOgu/WTVx/HAZGEDSg3bQAAAAASUVORK5CYII=" />&nbsp;';

var editorpage = false;
var consolepage = false;
var loadingwrapper = false;
var globalResultsElement = false;
var anchorBody = document.getElementsByTagName("body")[0];
var anchorModalContent = document.getElementById('modal_content');
var anchorModalTitle = document.getElementById('modaltitle');
var anchorModalWrapper = document.getElementById("modal_wrapper");
var anchorOwlSelect = document.getElementById("owlselect");
var anchorResultsNav = document.getElementById("resultsNav");
var anchorViewTab = document.getElementById("viewMenu");
var anchorViewContent = document.getElementById("viewContent");
var anchorFormattedView = document.getElementById("formattedView");
var anchorYqlurl = document.getElementById("yqlurl");
var anchorOutputTabContent = document.getElementById("outputTabContent");
var anchorFormattedTab = document.getElementById("formattedTab");
var anchorAnnotationViewContent = document.getElementById("annotationViewContent");
var anchorAnnotationView=document.getElementById("annotationView");
var anchorPerfView = document.getElementById("perfView");
var anchorFormOntologiesProperties = document.getElementById("formOntologiesProperties");
var anchorFormAddOntologyButton = document.getElementById("formAddOntologyButton");
var anchorFormAddOntologyClassButton = document.getElementById("formAddOntologyClassButton");
var anchorFormProperties = document.getElementById("formProperties");
var anchorFormOntologiesClasses = document.getElementById("formOntologiesClasses");
var anchorFormClasses = document.getElementById("formClasses");
var anchorFormDataSet = document.getElementById("formDataSet");
var anchorFormDataSetSelect = document.getElementById("formDataSetSelect");
var anchorFormPath = document.getElementById("formPath");
var anchorFormValue = document.getElementById("formValue");
var anchorFormPreviewButton = document.getElementById("formPreviewButton");
var anchorFormPreview = document.getElementById("formPreview");
var anchorFormAnnotateButton = document.getElementById("formAnnotateButton");
var anchorFormRegex = document.getElementById("formRegex");
var anchorLoadButton = document.getElementById("loadButton");
var anchorFormURIPattern = document.getElementById("formURIPattern");
var anchorFormAttributes = document.getElementById("formAttributes");
var anchorqid = document.getElementById("qid");
var anchorURIExample = document.getElementById("uriexample");
var anchorURIPattern = document.getElementById("uripattern");

var anchorYQLLogo = document.getElementById('yql-logo');
var anchorMyTables;
var anchorYQLTable ;
var anchorSelectTemplate = document.getElementById('select-template');
var anchorInsertTemplate ;
var	anchorInsertTemplateText = document.getElementById('insert-template');
var anchorTName = document.getElementById('tname');
var anchorFileButtons = document.getElementById('file-buttons');
//var anchorNewButton = document.getElementById('newButton');

var anchorTempContainer = document.getElementById('templates-container');
var anchorLabelSelect ;
var anchorSalutes;
var anchorCounter=  document.getElementById("count");
var anchorTablePanel=  document.getElementById("dtDefaultContainer");

var anchorODTDataAccordion=  document.getElementById("odt-data-accordion");
var anchorAnnotationButton=  document.getElementById("annotationButton");
var anchorEditCoupledButton=  document.getElementById("editCoupledButton");
var anchorTheRestQuery=  document.getElementById("theRestQuery");
var anchorSubmitMeButton=  document.getElementById("submitMeButton");

//global vars;
var globalTableCount=0;
var globalLowRefreshProb = 0.05;
var globalHighRefreshProb = 0.5;

var annotations = JSON.parse("[]");

var globalOntologyNum;
var globalSource;
var globalAPI;
var globalYQLTableName;
var globalButtonContainner;
var globalButtonContainner2;
var ANNOTATED = 1;
var PUSHEDANNOTATIONBUTTON = 2;
var XMLANNOTATION = 3;
var XMLREANNOTATION=4;
var RDFANNOTATION=5;
var RENEWANNOTATION=6;
var globalSignaler=[];
globalSignaler[ANNOTATED] = false;
globalSignaler[PUSHEDANNOTATIONBUTTON] = false;
globalSignaler[XMLANNOTATION] = false;
globalSignaler[XMLREANNOTATION] = false;
globalSignaler[RDFANNOTATION] = false;
globalSignaler[RENEWANNOTATION] = true;

var globalLDWurl;
var globalAnnotationurl;
var globalOntologyFunction;
var globalOntologyDescription;

var anchorShowCommunityTables=  document.getElementById("showCommunityTables");
var anchordtQuestion=  document.getElementById("dtQuestion");
var anchorRadioshowldw=  document.getElementById("radioshowldw");
var anchorHelpldw=  document.getElementById("helpldw");

var anchorSemanticTab = document.getElementById("semanticTab");
var anchorSemanticViewContent = document.getElementById("semanticViewContent");
var anchorSemanticView=document.getElementById("semanticView");
var anchorTheURIs=document.getElementById("theURIs");
var anchorShareContainer=document.getElementById('shareContainer');
var anchorCreateQueryAliasLink=document.getElementById('createQueryAliasLink');
var anchordtAccordion=document.getElementById('dtAccordion');
var anchordtDefaultContainer=document.getElementById('dtDefaultContainer');
var anchorSemanticLi=  document.getElementById("semanticLi");
var anchorAnnotationLi=  document.getElementById("annotationLi");

var globalquidHash = 0;

//////////////////
/// INIT  seccion
//////////////////

window.addEventListener("load",mod,true);

function mod(){
   modal_init();
   anchors_init();
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
		editorpage=true;
		augmentEditor();
		if (page.indexOf ('loadingcoupledwrapper')>-1){
      showCoupledAnnotation();
		}
	}
	if (page.indexOf ('developer.yahoo.com/yql/console')>-1) {
		consolepage=true;
		augmentConsole();
		}
  console.log ('Loaded');
}

function resetData(){
    GM_setValue('LDWdata', '{}');
    newstorage();
}

///////////////////////////
/////Anchor Manager seccion
//////////////////////////

  var anchors_init = function() {
   anchorBody = document.getElementsByTagName("body")[0];
   anchorModalContent = document.getElementById('modal_content');
   anchorModalTitle = document.getElementById('modaltitle');
   anchorModalWrapper = document.getElementById("modal_wrapper");
   anchorOwlSelect = document.getElementById("owlselect");
   anchorResultsNav = document.getElementById("resultsNav");
   anchorViewTab =document.getElementById("viewMenu");
   anchorViewContent =document.getElementById("viewContent");
   anchorFormattedView =document.getElementById("formattedView");
   anchorYqlurl =document.getElementById("yqlurl");
   anchorOutputTabContent=document.getElementById("outputTabContent");
   anchorFormattedTab = document.getElementById("formattedTab");
   anchorAnnotationViewContent=document.getElementById("annotationViewContent");
   anchorAnnotationView=document.getElementById("annotationView");
   anchorPerfView = document.getElementById("perfView");
   anchorFormOntologiesProperties = document.getElementById("formOntologiesProperties");
   anchorFormAddOntologyButton = document.getElementById("formAddOntologyButton");
   anchorFormAddOntologyClassButton = document.getElementById("formAddOntologyClassButton");
	anchorFormProperties = document.getElementById("formProperties");
   anchorFormOntologiesClasses = document.getElementById("formOntologiesClasses");
   anchorFormClasses = document.getElementById("formClasses");
   anchorFormDataSet = document.getElementById("formDataSet");
	 anchorFormDataSetSelect = document.getElementById("formDataSetSelect");
   anchorFormPath = document.getElementById("formPath");
   anchorFormValue = document.getElementById("formValue");
   anchorFormPreviewButton = document.getElementById("formPreviewButton");
   anchorFormPreview = document.getElementById("formPreview");
   anchorFormAnnotateButton = document.getElementById("formAnnotateButton");
   anchorFormRegex = document.getElementById("formRegex");
   anchorLoadButton = document.getElementById("formLoadButton");
   anchorFormURIPattern = document.getElementById("formURIPattern");
  anchorFormAttributes = document.getElementById("formAttributes");
 anchorqid = document.getElementById("qid");
 anchorURIExample = document.getElementById("uriexample");
 anchorURIPattern = document.getElementById("uripattern");

  anchorYQLLogo = document.getElementById('yql-logo');
 anchorMyTables =  findElement('a', 'TABLES');
 anchorYQLTable =  findElement('option', 'YQL Table');
 anchorSelectTemplate = document.getElementById('select-template');
 anchorInsertTemplate =  findElement('a', 'Insert Template (https)');
 anchorInsertTemplateText = document.getElementById('insert-template');
 anchorTName = document.getElementById('tname');
 anchorFileButtons = document.getElementById('file-buttons');
 anchorTempContainer = document.getElementById('templates-container');
 anchorLabelSelect =  findElement('label', 'Select');
 anchorSalute =  findElementClass('span', 'salute');
 anchorCounter=  document.getElementById("count");
 anchorTablePanel=  document.getElementById("dtDefaultContainer");
 anchorODTDataAccordion=  document.getElementById("odt-data-accordion");

 anchorShowCommunityTables=  document.getElementById("showCommunityTables");
 anchordtQuestion=  document.getElementById("dtQuestion");
 anchorRadioshowldw=  document.getElementById("radioshowldw");
 anchorHelpldw=  document.getElementById("helpldw");

 anchorSemanticTab = document.getElementById("semanticTab");
 anchorSemanticViewContent = document.getElementById("semanticViewContent");
 anchorSemanticView=document.getElementById("semanticView");
 anchorTheURIs=document.getElementById("theURIs");
 anchorShareContainer=document.getElementById('shareContainer');
 anchorCreateQueryAliasLink=document.getElementById('createQueryAliasLink');
 anchordtAccordion=document.getElementById('dtAccordion');
 anchordtDefaultContainer=document.getElementById('dtDefaultContainer');
 anchorAnnotationButton=  document.getElementById("annotationButton");
 anchorEditCoupledButton=  document.getElementById("editCoupledButton");

 anchorTheRestQuery=  document.getElementById("theRestQuery");
 anchorSubmitMeButton=  document.getElementById("submitMeButton");
 anchorSemanticLi=  document.getElementById("semanticLi");
 anchorAnnotationLi=  document.getElementById("annotationLi");
  }

/////////////////////
/////console augmentation
/////////////////

function augmentConsole(){
  readOntologies ();
  var a = readWrapper ();
  appendStyles();
  addVisualElementsConsole();
  checkSelectPermanence();
  }

///////////////////
////VISUAL ELEMENTS seccion
//////////////////

function addOnekinLogo (){
	anchors_init();
	var elmNewContent = document.createElement('a');
	elmNewContent.href = 'http://www.onekin.org';
	elmNewContent.innerHTML = 'Enhaced by <img src="http://www.onekin.org/sites/default/files/danland_logo.png" alt="logo" height="50" width="100"> ';
	anchorYQLLogo.parentNode.insertBefore(elmNewContent, anchorYQLLogo);
}

function showVisualElementsAnnotationView(){
    resizeAnnotationview();
	hideVisualElementsSemanticView();
	show ("annotationViewContent");
}

function hideVisualElementsAnnotationView(){
	hide ("annotationViewContent");
}

function showVisualElementsSemanticView(){
	hideVisualElementsAnnotationView();
	show ("theURIs");
	show ("semanticViewContent");
}

function hideVisualElementsSemanticView(){
	hide ("theURIs");
	hide ("semanticViewContent");
}

function addVisualElementsAnnotationView(){
//Annotation tab.
  var li = document.createElement('li');
  li.id ="annotationLi";
  li.setAttribute ("class","tab results-tab nav-tab");
  var html = '<a id="annotation" data-rapid_p="3" class="rapidnofollow" href="#annotationView" data-toggle="tab" hidden="true"><span id="annotationTab">Annotator</span></a>';
  li.innerHTML = html;
  anchors_init();
  anchorResultsNav.insertBefore(li, anchorViewTab);
  anchors_init();
  fireEvent(li,"click");
  li.addEventListener("click", creatingAnnotationView, false);
  var div = document.createElement('div');
  div.setAttribute ("class","tab-pane active in");
  div.setAttribute ("id","annotationView");
  div.innerHTML='<pre style="background-color: rgb(255, 255, 255);overflow:auto;resize:none" id="annotationViewContent"></pre>';
  anchorOutputTabContent.insertBefore(div, anchorPerfView);
  anchors_init();
}

function addOtherElements(){
	anchors_init();
	//Community LDW radio button
	var cln = anchorShowCommunityTables.cloneNode(true);
	cln.id ="CommunityLDW";
	cln.innerHTML= '<input id ="radioshowldw" type="radio" name="showldw" value="">Show Community Wrappers<a href="http://rdf.onekin.org/ldw/page" target="_blank"><i id ="helpldw" class="icon-question-sign"></i></a>';
	cln.setAttribute("class", "democlass");
    anchorShowCommunityTables.parentNode.insertBefore(cln, anchordtQuestion);
    anchors_init();
    anchorRadioshowldw.onclick = function (e){createLDWFolder ();};
  var generateLDWButton = createButton ("Generate", "editCoupledButton");//document.createElement('button');
	var annotationButton = createButton ("Annotate", "annotationButton");//document.createElement('button');
    anchorSubmitMeButton.parentNode.insertBefore(generateLDWButton, anchorSubmitMeButton.nextSibling);
    anchorSubmitMeButton.parentNode.insertBefore(annotationButton, anchorSubmitMeButton.nextSibling);
	anchors_init();
	anchorAnnotationButton.addEventListener("click", startAnnotation, false);
    anchorEditCoupledButton.addEventListener("click", openCoupledLDW, false);
	disableLDWGenerationButton();
	// select the target node
/*var target = document.querySelector('#resultsNav');
 // create an observer instance
observer = new MutationObserver(function(mutations) {
	if (!checkSelectPermanence()) {
	//renewSelectPermanence();
    disableLDWGenerationButton();
  }
});
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true, subtree: true };
// pass in the target node, as well as the observer options
observer.observe(target, config);
*/
	}
var observer;

function startAnnotation (){
   anchors_init();
	anchorAnnotationLi.style.visibility = "";
	anchorSemanticLi.style.visibility = "";
	//showVisualElementsAnnotationView();
	//creatingAnnotationView();
    //renewSelectPermanence();
	enableLDWGenerationButton();
	fireEvent(anchorAnnotationLi,"click");
}

function disableLDWGenerationButton(){
	anchors_init();
  anchorEditCoupledButton.disabled=true;
  anchorAnnotationButton.disabled=false;
	anchorSemanticLi.style.visibility = "hidden";
	anchorAnnotationLi.style.visibility = "hidden";
}

function enableLDWGenerationButton(){
	anchors_init();
  anchorEditCoupledButton.disabled=false;
  anchorAnnotationButton.disabled=true;
	anchorSemanticLi.style.visibility = "";
	anchorAnnotationLi.style.visibility = "";
}

function createButton (text, id){
	var button = document.createElement('button');
    //buttons.innerHTML += '<button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="annotationButton" data-rapid_p="8">Annotate</button><button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="editCoupledButton" data-rapid_p="8">Generate LDW</button>';
//	button.setAttribute("data-ylk", "ltxt:"+text+";"); //test
	button.setAttribute("style", "margin-left: 1em;");
	button.setAttribute("class", "btn btn-primary");
	button.setAttribute("type", "button");
	button.setAttribute("id", id);
//	button.setAttribute("rapid_p", "8");
	button.innerHTML=text;
	return button;

}

function addVisualElementsSemanticView(){
  var li2 = document.createElement('li');
  li2.id ="semanticLi";
  li2.setAttribute ("class","tab results-tab nav-tab");
  var html2 = '<a id="semantic" data-rapid_p="3" class="rapidnofollow" href="#semanticView" data-toggle="tab" hidden="true"><span id="semanticTab">Semantic View</span></a>';
  li2.innerHTML = html2;
  anchorResultsNav.insertBefore(li2, anchorViewTab);
  anchors_init();
  //anchorSemanticTab.addEventListener("click", creatingSemanticView, false);
  li2.addEventListener("click", creatingSemanticView, false);
  var div2 = document.createElement('div');
  div2.setAttribute ("class","tab-pane active in");
  div2.setAttribute ("id","semanticView");
  div2.innerHTML='<pre style="background-color: rgb(255, 255, 255);overflow:auto;resize:none" id="semanticViewContent"></pre>';
  anchorOutputTabContent.insertBefore(div2, anchorPerfView);
  anchors_init();
  var div1 = document.createElement('div');
  div1.id='theURIs';
  div1.innerHTML = '';
  // div1.innerHTML += '<h4><span>THE URI example and pattern</span><a style="font-weight: normal; margin-left: .7em;" target="_blank" href="http://onekin.org">How do I use this?</a> Generate LDW through:<button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="editButton" data-rapid_p="8">Edit LDW</button><button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="editCoupledButton" data-rapid_p="8">reference</button><button data-ylk="ltxt:test;" style="margin-left: 1em;" class="btn btn-primary" type="button" id="editDecoupledButton" data-rapid_p="8">cloning</button></h4>';
  div1.innerHTML += '<h4><span>THE URI example and pattern</span><a style="font-weight: normal; margin-left: .7em;" target="_blank" href="http://onekin.org">How do I use this?</a></h4>';
  div1.innerHTML += '<input type="text" readonly="readonly" name="copytoclip" id="uriexample" class="span12"><input type="text" readonly="readonly" name="copytoclip" id="uripattern" class="span12">';
  anchors_init();
  anchorSemanticView.appendChild(div1);
  anchors_init();
}

function addVisualElementsConsole(){
  //Annotation tab.
  addVisualElementsAnnotationView();
  //Semantic View tab.
  addVisualElementsSemanticView();
  //Community LDW radio button
  addOtherElements();
  hideVisualElementsSemanticView();
  hideVisualElementsAnnotationView();
  fireEvent(anchorFormattedTab,"click");
}

function openDecoupledLDW (){
	var url = "https://developer.yahoo.com/yql/editor/?loadingdecoupledwrapper";
	window.open(url,'_one');
}

function openLDW (){
	var url = "https://developer.yahoo.com/yql/editor/?loadingwrapper";
	window.open(url,'_three');
}

function openCoupledLDW (){
	var url = "https://developer.yahoo.com/yql/editor/?loadingcoupledwrapper";
  window.open(url,'_two');
//w.location.reload();
/*  var tokens = readStorageTokens();
  selectToken = tokens.selectToken;
	var name = selectToken;
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yql.storage%20where%20name%3D%40name&format=json&diagnostics=false&callback=&name="+name;
    callURLJSON(url, function (resp) {});*/
}


function wrapperHashId(wrpp){
    var begin = wrpp.indexOf('y.xmlToJson(oneXML)');
	var end = wrpp.indexOf('</execute>', begin);
	var newHash = 0;
	if (end ==-1) {
		newHash = hashIt (wrpp.substring(begin));
	}else{
		newHash = hashIt (wrpp.substring(begin, end));
	}
	return newHash;
}

function createMenuObjectProperty(path, name){
    var color = '#1E90FF';
	var txt ='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"<button >'+name+'</button>"<span><button path="'+path+'" class="ldwembedded" type="button">Annnotate embedded class</button></span></span>';
	return txt;
}

function createMenuDatatypeProperty(path, name, value){
  var color ='#1E90FF';
  var txt ='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"<button  >'+name+'</button>"<span><button path="'+path+'" value="'+value+'" class="ldwdataprop" type="button">Attribute mapping</button></span><span><button path="'+path+'" value="'+value+'" class="ldwobjprop" type="button">Association mappping</button></span></span>';
  return txt;
}

function createMenuDatatypePropertyR2R(path, name, value){
  var color ='#FF00FF';
  var txt ='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"<button  >'+name+'</button>"<span><button path="'+path+'" value="'+value+'" class="ldwobjprop" type="button">Association mappping</button></span></span>';
  return txt;
}

function createOtherR2R(path, name){
  var color ='#FF00FF';
  var txt ='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"'+name+'"</span>';
  return txt;
}


function createMenuResults(path, name){
	var color ='#1E90FF';
    var txt='<span class="ldwnav" style="background-color:'+color+'" id="'+path+'">"<button class="button" type="button">'+name+'</button>"<span id="individualtype"><button path="'+path+'" class="ldwtype button" type="button">Define the @type</button></span></span>';
	return txt;
}

///////////
//LOWERING
///////////

function annotateLowering(){
  if (globalSignaler[XMLREANNOTATION]){return;}
  var urlA='https://query.yahooapis.com/v1/public/yql?q=select%20src%20from%20yql.table.desc%20where%20name%3D%22';
	var urlB='%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
  anchors_init();
	var select = anchorqid.value.toLowerCase();
	var table = select.match("from(.*)where")[1].trim();
	if (table.indexOf(' ')>0){
		table = table.substring(0, table.indexOf(' '));
	}
if (!table){
		alert ('The select is not correct: ' + select);
		return;
	}
  table = table+ '.ldw';
	callURLJSON(urlA+table+urlB, srcURL);
	globalAPI = table.substring(0,table.indexOf("."));
	var URIExample = 'http://rdf.onekin.org/'+table;
	var URIPattern = 'http://rdf.onekin.org/'+table;
	var str = select.match("where((.|\n)*)");
	str =  str[1];
	res = formatDataPiece (str);
	var select2=select;
	var find = '\'';
	var re = new RegExp(find, 'g');
	//select2 = select2.replace(re, '"');
	var firstly = true;
  var tokens = readStorageTokens();
  executeToken = tokens.executeToken;
	var ldwquery = "use '"+executeToken+"' as t; select * from t";
	for (var i=0; i< res.length; i++){
    	var res2 = res[i].split("=");
		var datapiece1 = getDataPiece(res2[1]);
		URIExample += '/'+datapiece1;
		var datapiece2 = getDataPiece(res2[0]);
		URIPattern += '/{'+datapiece2+'}';
		select2=  replaceDataPiece(select2, datapiece1, '@'+datapiece2);
		if (firstly){
			firstly=false;
			ldwquery = ldwquery + " where " + datapiece2 + "= '" + datapiece1 + "'";
		}else{
			ldwquery = ldwquery + " and " + datapiece2 + "= '" + datapiece1 + "'";
		}
	}
	ldwquery = ldwquery + " | t.lifting('"+URIExample+"')";
	anchorURIPattern.value = URIPattern;
	anchorURIExample.value = URIExample;
  setGlobalData (URIExample, URIPattern, select, select2, ldwquery, table, null);
}

function setGlobalData (URIExample, URIPattern, select, select2, ldwquery, table, wrapperxml){
  var globalWrapper=readWrapper();
	globalWrapper['uriexample']= URIExample;
	globalWrapper['uripattern']= URIPattern;
	globalWrapper['samplequery']= select;
	globalWrapper['launchedquery']= select2;
	globalWrapper['ldwquery']= ldwquery;
	globalWrapper['tablename']= table;
  globalWrapper['wrapperxml']= wrapperxml;
	writeWrapper(globalWrapper);
}


function replaceDataPiece(str, data, newdata){
    find = '\"'+data+'\"';
	re = new RegExp(find, 'g');
	str = str.replace(re, newdata);
  find = '\''+data+'\'';
re = new RegExp(find, 'g');
str = str.replace(re, newdata);
	return str;
}
function formatDataPiece (str){
    var find = '\'';
	var re = new RegExp(find, 'g');
	str = str.replace(re, '"');
	var res = str.split(" and ");
	return res;
}
function getDataPiece (d){
    data=d;
	var data = data.match("\'(.*)\'");
	if (data != null) {
	  return data[1].trim();
	}
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
}
/////////////////////////
////ANNOTATION seccion
/////////////////////////

function creatingAnnotationView(e){
  consoleGlobalSignalers();
  showVisualElementsAnnotationView();
  anchors_init();
  var chkvalue = checkSelectPermanence();

  var url1 = 'https://query.yahooapis.com/v1/public/yql?q=';
  var select = anchorqid.value;
  var url2 = "&debug=true&format=json&callback=&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var url = url1+select+url2;

  //var url = anchorqid.value.trim();
  if (globalSignaler[RENEWANNOTATION]){
    var globalWrapper=readWrapper();
  	URIPattern = globalWrapper['uripattern'];
    anchorAnnotationViewContent.innerHTML="Loading data...";
    if (globalSignaler[RDFANNOTATION] && uriMatchesPattern (URIPattern, url)){
      resetSignalers();
      globalSignaler[RDFANNOTATION]=true;
      globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
      callURLJSON(url, setAnnotationViewR2R);
    }else{      ///LA PRIMERA ANOTACIÓN DESDE XML.
      newWrapper();
      annotateLowering();
      resetSignalers();
      globalSignaler[XMLANNOTATION]=true;
      globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
      callURLJSON(url, setAnnotationViewXML);
    }
  }else{
    if (!globalSignaler[PUSHEDANNOTATIONBUTTON]){
      anchorAnnotationViewContent.innerHTML="Loading data...";
      if (globalSignaler[XMLANNOTATION]){   ///SEGUIMOS LA ANOTACIÓN EN XML
       newWrapper();
       annotateLowering();
       resetSignalers();
       globalSignaler[XMLANNOTATION]=true;
       globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
       globalSignaler[ANNOTATED]=true;
       callURLJSON(url, setAnnotationViewXML);
     }
     if (globalSignaler[XMLREANNOTATION]){////SEGUIMOS REANOTANDO EN XML
       globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
      setReAnnotationViewXML();
    }
    if (globalSignaler[RDFANNOTATION] && anchorqid.value.trim().startsWith("http")){
      resetSignalers();
      globalSignaler[RDFANNOTATION]=true;
      globalSignaler[PUSHEDANNOTATIONBUTTON]=true;
      globalSignaler[ANNOTATED]=true;
      callURLJSON(url, setAnnotationViewR2R);
    }
   }
  }
  consoleGlobalSignalers();
  e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

function setReAnnotationViewXML(){
  logit('setReAnnotationViewXML');
  anchors_init();
  var url1 = 'https://query.yahooapis.com/v1/public/yql?q=';
  var select = anchorqid.value;
  var url2 = "&debug=true&format=json&callback=&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var url = url1+select+url2;
  anchorYqlurl.value = url;
  callURLJSON(url, createReAnnotationView);
 }

function rdfAnnotatorView(){
  anchors_init();
  var url1 = 'https://query.yahooapis.com/v1/public/yql?q=';
  var select = anchorqid.value;
  var url2 = "&debug=true&format=json&callback=&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var url = url1+select+url2;
  anchorYqlurl.value = url;
  e.preventDefault ? e.preventDefault() : e.returnValue = false;
  callURLJSON(url, createAnnotationView);
}

function resizeAnnotationview(){
  var w = anchorYqlurl.offsetWidth - 10;
	var h =anchorOutputTabContent.offsetHeight-(anchorYqlurl.offsetHeight * 3);
  anchorAnnotationViewContent.style.height =h+"px";
  anchorAnnotationViewContent.style.width =w+"px";
}

function createAnnotationView(json){
  anchorAnnotationViewContent.style.display = "block";
  globalResultsElement=false;
  globalSource = json;
	var processed = '{\n"query":{\n'+iterateJsonPath(json.query, '', 0) +" }\n}";
 anchorAnnotationViewContent.innerHTML=processed;
  IterateAnnotationsEvents();
  createCleanAnnotation ();
}

function createReAnnotationView(json){
  //IKER. Coger el wrapper y obtener anotaciones
  //cambiar color botones.
  logit('createReAnnotationView');
  anchorAnnotationViewContent.style.display = "block";
  globalResultsElement=false;
  var globalWrapper=readWrapper();
  consoleGlobalSignalers();
  var wrapperxml=globalWrapper['wrapperxml'];
  logit(wrapperxml);
  writeWrapper(globalWrapper);
  globalSource = json;
	var processed = '{\n"query":{\n'+iterateJsonPath(json.query, '', 0) +" }\n}";
  anchorAnnotationViewContent.innerHTML=processed;
  IterateAnnotationsEvents();
  createCleanAnnotation ();
  creatingReannotation (wrapperxml);
  var globalWrapper=readWrapper();
logit ('type '+globalWrapper.type);
  if (globalWrapper.type){
       globalButtonContainner = document.getElementById("results");
      changeButtonColorAnnotated();
  }
  changeButtonColors(globalWrapper.globalannotation);
  savestorage();
}

function changeButtonColors(gAnnotation){
  console.log('x2: '+ JSON.stringify(gAnnotation));
  for (var p in gAnnotation) {
   	if(gAnnotation.hasOwnProperty(p) ) {
      //console.log('x3: ' + p + 'x3type: ' + gAnnotation[p]["type"]);
  		var annotated = gAnnotation[p]['annotation'] != null;
      if (annotated){
           globalButtonContainner = document.getElementById(p);
          changeButtonColorAnnotated();
      }
      if (gAnnotation[p]["type"]!= 'value'){
        changeButtonColors(gAnnotation[p]["data"]);
      }
  //createCleanAnnotation ();
  }
  }
}

function iterateJsonPath (json, jpath, level){
  level +=1;
	return keyvaluePath(json, jpath, level);
}

function keyvaluePath (json, jpath, level){
 var result = "";
	if (globalResultsElement){
	 result = keyvaluePathProcessed (json, jpath, level);
 }else{
	 result = keyvaluePathNeutral (json, jpath, level);
 }
  return result;
}

function keyvaluePathNeutral (json, jpath, level){
 var result = "";
 var type = typeof json;
 for (var p in json) {
if(json.hasOwnProperty(p) ) {
  	var jpath2 = jpath+ '[\''+p+'\']';
    var type = typeof json[p];
		if (type=="undefined" || type=="number" || type=="string" || json[p]== null){
			result += levelblank (level)+'"'+p+': "'+json[p]+'",\n';
		}else{
			if (jpath2=="['results']"){
				globalResultsElement = true;
				jpath='';
				result += levelblank (level)+ createMenuResults('results',p)+': {\n'+iterateJsonPath (json[p], jpath, level)+levelblank (level)+'},\n';
			}else{
 				result += levelblank (level)+ '"'+p+'": {\n'+iterateJsonPath (json[p], jpath2, level)+levelblank (level)+'},\n';
			}
		}
  	}
  }
  return result;
  }

function keyvaluePathProcessed (json, jpath, level){
 var result = "";
 var type = typeof json;
 for (var p in json) {
  if(json.hasOwnProperty(p) ) {
  	var jpath2 = jpath+ '[\''+p+'\']';
    var type = typeof json[p];
  	if (type=="undefined" || type=="number" || type=="string" || json[p]== null){
		result += levelblank (level)+createMenuDatatypeProperty(jpath2,p, json[p])+': "'+json[p]+'",\n';
	}else{

	   var isArray = json[p][0]!= undefined;

	  if ( !isArray) {
	   result += levelblank (level)+ createMenuObjectProperty(jpath2,p)+': {\n'+iterateJsonPath (json[p], jpath2, level)+levelblank (level)+'},\n';
      }
      if (isArray && level <=2) {
        result += levelblank (level)+ createMenuObjectProperty(jpath2,p) +": [\n";
        var jpath2 = jpath+ '[\''+p+'\']';
        for (var i=0; i<json[p].length; i++){
    	   result += levelblank (level)+ '{\n'+iterateJsonPath (json[p][i], jpath2, level)+levelblank (level)+'},\n';
	    }
        result += levelblank (level)+"]\n";
	  }
    if (isArray && level > 2){
     result += levelblank (level)+ createMenuObjectProperty(jpath2,p) +": [\n";
      var jpath2 = jpath+ '[\''+p+'\']'+'[LOOP' + level + ']';
      for (var i=0; i<json[p].length; i++){
    	result += levelblank (level)+ '{\n'+iterateJsonPath (json[p][i], jpath2, level)+levelblank (level)+'},\n';
	  }
      result += levelblank (level)+"]\n";
	 }
	}
	}
  }
  return result;
}

////

function iterateJsonPathR2R (json, jpath, level){
  level +=1;
	return keyvaluePathProcessedR2R(json, jpath, level);
}

function keyvaluePathProcessedR2R (json, jpath, level){
 var result = "";
 var type = typeof json;
 for (var p in json) {
   if (p.startsWith('prv:')) {
     continue;
   }
  if(json.hasOwnProperty(p) ) {
  	var jpath2 = jpath+ '[\''+p+'\']';
    var type = typeof json[p];
  	if (type=="undefined" || type=="number" || type=="string" || json[p]== null){
      if (type=="string" && json[p].startsWith('http')) {
        result += levelblank (level)+createOtherR2R(jpath2,p)+': "'+json[p]+'",\n';
      }else {
        result += levelblank (level)+createMenuDatatypePropertyR2R(jpath2,p, json[p])+': "'+json[p]+'",\n';}
    }else{

	   var isArray = json[p][0]!= undefined;

	  if ( !isArray) {
	   result += levelblank (level)+createOtherR2R(jpath2,p)+': {\n'+iterateJsonPathR2R (json[p], jpath2, level)+levelblank (level)+'},\n';
      }
      if (isArray && level <=2) {
        result += levelblank (level)+createOtherR2R(jpath2,p)+': [\n';
        var jpath2 = jpath+ '[\''+p+'\']';
        for (var i=0; i<json[p].length; i++){
    	   result += levelblank (level)+ '{\n'+iterateJsonPathR2R (json[p][i], jpath2, level)+levelblank (level)+'},\n';
	    }
        result += levelblank (level)+"]\n";
	  }
    if (isArray && level > 2){
     result += levelblank (level)+createOtherR2R(jpath2,p)+': [\n';
      var jpath2 = jpath+ '[\''+p+'\']'+'[LOOP' + level + ']';
      for (var i=0; i<json[p].length; i++){
    	result += levelblank (level)+ '{\n'+iterateJsonPathR2R (json[p][i], jpath2, level)+levelblank (level)+'},\n';
	  }
      result += levelblank (level)+"]\n";
	 }
	}
	}
  }
  return result;
}

///

function levelblank (n){
	var txt = "";
 	for (var i =0; i<n*2; i++){
 		txt += '&nbsp;';
 	}
 	return txt;
 }

function levelblank2 (n){
	var txt = "";
 	for (var i =0; i<n*2; i++){
 		txt += ' ';
 	}
 	return txt;
 }

/////////////////

function IterateAnnotationsEvents(){
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
}

function createCleanAnnotation (){
	var globalWrapper=readWrapper();
  globalWrapper.globalannotation= cleanAnnotate(globalSource.query.results, '', 1);
  globalWrapper.globalannotationclean=globalWrapper.globalannotation;
  writeWrapper(globalWrapper);
}

function cleanAnnotate (json, jpath, level){
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
			var jpath2 = jpath+'['+p+']';
			var jpath3 = jpath+'[\''+p+'\']';
			var recursiveJS= JSON.parse ("{}");
			for (var i=0; i<json[p].length; i++){
				recursiveJS = jsonAdd (recursiveJS, cleanAnnotate (json[p][i], jpath3, level));
			}
			result[jpath2] = createJSONObjectProperty(jpath2, p, recursiveJS);
		}
		if (isArray && level > 2){
			var jpath2 = jpath+'['+p+']';
			result[jpath2] = createJSONArrayObjectProperty(jpath2, p, 'LOOP' + level);
			var jpath3 = jpath+'[\''+p+'\'][LOOP' + level + ']';
			for (var i=0; i<json[p].length; i++){
				result[jpath2]['data'] = jsonAdd (result[jpath2]['data'], cleanAnnotate (json[p][i], jpath3, level));
			}
		}
	}
	}
  }
  return result;
}

function annotateJSON (path, js, globalannotation){
 	 //path = path.replace(/'/g, '');
   path = path.replace(/"/g, '');
	path = path.replace(/\[results\]/g, '');
	return annotateJSONDeep(globalannotation, path, js);
	}

function annotateJSONDeep (jsSource, path, js){
  var result = JSON.parse ("{}");
  for (var p in jsSource) {
    //logit('AnnJsonDeep1>>  '+p +' == '+path);
  	if(jsSource.hasOwnProperty(p) ) {
  //    logit('AnnJsonDeep>>  '+p +' == '+path);
      if (p == path){
logit('AnnJsonDeep>>  '+p +' == '+path);
  			var jjss = jsSource[p];
  			jjss['annotation']= js;
  			result[p]=jjss;
  		}else{
	  		var type = typeof jsSource[p];
  			if (type=="undefined" || type=="number" || type=="string" || jsSource[p]== null){
				      result[p] = jsSource[p];
			   }else{
  				result[p]=annotateJSONDeep (jsSource[p], path, js);
  			}
  		}
  	}
  }
  return result;
}



function createLifting(wannotation){
//  logit(JSON.stringify (wannotation));
//  var template= Base64.decode('PGZ1bmN0aW9uIG5hbWU9ImxpZnRpbmciPg0KICA8aW5wdXRzPg0KICAgICA8cGlwZSBpZD0ib25lWE1MIiBwYXJhbVR5cGU9InZhcmlhYmxlIi8+DQogICAgIDxrZXkgaWQ9IlVSSSIgcGFyYW1UeXBlPSJ2YXJpYWJsZSIgcmVxdWlyZWQ9InRydWUiLz4NCiAgPC9pbnB1dHM+DQogPGV4ZWN1dGU+PCFbQ0RBVEFbDQovL2ludGVybGluayB3aXRoIHJlZ2V4cA0KZnVuY3Rpb24gZ2V0UmVnZXhwSW50ZXJsaW5rIChkYXRhUGF0aCwgdXJscGF0dGVybiwgcmVnZXhwKXsNCglyZXR1cm4gdXJscGF0dGVybi5yZXBsYWNlKC97Lip9LywgZ2V0UmVnZXhwVmFsdWUoZGF0YVBhdGgsIHJlZ2V4cCkpO30NCg0KLy9pbnRlcmxpbmsgd2l0aG91dCByZWdleHANCmZ1bmN0aW9uIGdldEludGVybGluayAoZGF0YVBhdGgsIHVybHBhdHRlcm4pew0KCXJldHVybiB1cmxwYXR0ZXJuLnJlcGxhY2UoL3suKn0vLCBnZXRWYWx1ZShkYXRhUGF0aCkpO30NCg0KLy9kaXJlY3QgbWFwcGluZyB3aXRoIHJlZ2V4cA0KZnVuY3Rpb24gZ2V0UmVnZXhwVmFsdWUoZGF0YVBhdGgsIHJlZ2V4cCl7DQogCXRyeXtyZXR1cm4gZ2V0VmFsdWUoZGF0YVBhdGgpLm1hdGNoKHJlZ2V4cClbMF07fWNhdGNoKGVycil7cmV0dXJuIG51bGw7fX0NCg0KLy9kaXJlY3QgbWFwcGluZyB3aXRob3V0IHJlZ2V4cA0KZnVuY3Rpb24gZ2V0VmFsdWUoZGF0YVBhdGgpIHsNCgl0cnl7cmV0dXJuIGV2YWwoZGF0YVBhdGgpIHx8IG51bGw7IH1jYXRjaChlcnIpe3JldHVybiBudWxsO319DQoNCmZ1bmN0aW9uIHNldEFycmF5KGRhdGFQYXRoKSB7DQogIHZhciBiZWdpbj1kYXRhUGF0aC5pbmRleE9mKCddJywwKSsxOw0KICBiZWdpbm5leHQgPSBkYXRhUGF0aC5pbmRleE9mKCddJyxiZWdpbisxKQ0KICB3aGlsZSAoYmVnaW4+MCAmJiBiZWdpbm5leHQ+MCl7DQogICAgCXZhciBkUGF0aCA9IGRhdGFQYXRoLnN1YnN0cmluZygwLGJlZ2luKTsNCgl2YXIgb2Jqcz0gZ2V0VmFsdWUoZFBhdGgpOyAgCQkNCglpZiAob2Jqcz09PSBudWxsKSB7ZXZhbChkUGF0aCsnPXt9OycpO30NCgliZWdpbiA9IGRhdGFQYXRoLmluZGV4T2YoJ10nLGJlZ2luKzEpKzE7DQogICAJYmVnaW5uZXh0ID0gZGF0YVBhdGguaW5kZXhPZignXScsYmVnaW4rMSkNCiAgfQ0KICB2YXIgcmVzID0gW107DQogIHZhciBvYmpzPSBnZXRWYWx1ZShkYXRhUGF0aCk7DQogIGlmIChvYmpzPT09IG51bGwpIHtldmFsKGRhdGFQYXRoKyc9W107Jyk7fQ0KICBlbHNlIHtpZiAoIW9ianNbMF0pIHtldmFsKGRhdGFQYXRoKyc9W107JytkYXRhUGF0aCsnLnB1c2gob2Jqcyk7Jyk7fX0NCn0gIA0KDQp0cnl7DQogdmFyIG9uZUpTT049IHkueG1sVG9Kc29uKG9uZVhNTCk7DQoJdmFyIG9uZUpTT05MRD17fTsNCglvbmVKU09OTERbJ0BpZCddPVVSSTsNCglvbmVKU09OTERbJ0Bjb250ZXh0J109ICNDT05URVhUIw0KCW9uZUpTT05MRFsnQHR5cGUnXT0gJyNUWVBFIyc7DQogICAgI01BVENISU5HUyMNCiAgICAgfWNhdGNoIChlcnIpeyB5LmxvZyhlcnIpO30NCiAgICByZXNwb25zZS5vYmplY3QgPSBvbmVKU09OTEQ7XV0+DQogICA8L2V4ZWN1dGU+DQo8L2Z1bmN0aW9uPg==');
  var template = undecode ('%3Cfunction%20name%3D%22lifting%22%3E%0A%20%20%3Cinputs%3E%0A%20%20%20%20%20%3Cpipe%20id%3D%22oneXML%22%20paramType%3D%22variable%22%2F%3E%0A%20%20%20%20%20%3Ckey%20id%3D%22URI%22%20paramType%3D%22variable%22%20required%3D%22true%22%2F%3E%0A%20%20%3C%2Finputs%3E%0A%20%3Cexecute%3E%3C!%5BCDATA%5B%0A%0Atry%7B%0A%20var%20oneJSON%3D%20y.xmlToJson(oneXML)%3B%0A%09var%20oneJSONLD%3D%7B%7D%3B%0A%09oneJSONLD%5B%27%40id%27%5D%3DURI%3B%0A%09oneJSONLD%5B%27%40context%27%5D%3D%20%23CONTEXT%23%0A%09oneJSONLD%5B%27%40type%27%5D%3D%20%27%23TYPE%23%27%3B%0A%20%20%20%20%23MATCHINGS%23%0A%20%20%20%20%20%7Dcatch%20(err)%7B%20y.log(err)%3B%7D%0A%20%20%20%20response.object%20%3D%20oneJSONLD%3B%0A%0A%2F%2Finterlink%20with%20regexp%0Afunction%20getRegexpInterlink%20(dataPath%2C%20urlpattern%2C%20regexp)%7B%0A%09return%20urlpattern.replace(%2F%7B.*%7D%2F%2C%20getRegexpValue(dataPath%2C%20regexp))%3B%7D%0A%0A%2F%2Finterlink%20without%20regexp%0Afunction%20getInterlink%20(dataPath%2C%20urlpattern)%7B%0A%09return%20urlpattern.replace(%2F%7B.*%7D%2F%2C%20getValue(dataPath))%3B%7D%0A%0A%2F%2Fdirect%20mapping%20with%20regexp%0Afunction%20getRegexpValue(dataPath%2C%20regexp)%7B%0A%20%09try%7Breturn%20getValue(dataPath).match(regexp)%5B0%5D%3B%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0A%2F%2Fdirect%20mapping%20without%20regexp%0Afunction%20getValue(dataPath)%20%7B%0A%09try%7Breturn%20eval(dataPath)%20%7C%7C%20null%3B%20%7Dcatch(err)%7Breturn%20null%3B%7D%7D%0A%0A%2F%2Fcreate%20array%20even%20the%20path%20is%20broken%0Afunction%20setArray(dataPath)%20%7B%0A%20%20var%20begin%3DdataPath.indexOf(%27%5D%27%2C0)%2B1%3B%0A%20%20beginnext%20%3D%20dataPath.indexOf(%27%5D%27%2Cbegin%2B1)%0A%20%20while%20(begin%3E0%20%26%26%20beginnext%3E0)%7B%0A%20%20%20%20%09var%20dPath%20%3D%20dataPath.substring(0%2Cbegin)%3B%0A%09var%20objs%3D%20getValue(dPath)%3B%20%20%09%09%0A%09if%20(objs%3D%3D%3D%20null)%20%7Beval(dPath%2B%27%3D%7B%7D%3B%27)%3B%7D%0A%09begin%20%3D%20dataPath.indexOf(%27%5D%27%2Cbegin%2B1)%2B1%3B%0A%20%20%20%09beginnext%20%3D%20dataPath.indexOf(%27%5D%27%2Cbegin%2B1)%0A%20%20%7D%0A%20%20var%20res%20%3D%20%5B%5D%3B%0A%20%20var%20objs%3D%20getValue(dataPath)%3B%0A%20%20if%20(objs%3D%3D%3D%20null)%20%7Beval(dataPath%2B%27%3D%5B%5D%3B%27)%3B%7D%0A%20%20else%20%7Bif%20(!objs%5B0%5D)%20%7Beval(dataPath%2B%27%3D%5B%5D%3B%27%2BdataPath%2B%27.push(objs)%3B%27)%3B%7D%7D%0A%7D%20%20%0A%0A%5D%5D%3E%0A%20%20%20%3C%2Fexecute%3E%0A%3C%2Ffunction%3E');
logit ('yy1');
  template= template.replace ("#CONTEXT#", annotationContext(wannotation.annotations, wannotation.type));
  logit ('yy2');
  template= template.replace ("#TYPE#", wannotation.type.type);
  logit ('yy3: ' + JSON.stringify (wannotation.globalannotation));
  template= template.replace ("#MATCHINGS#", annotationMatchings(wannotation.globalannotation));
  logit ('yy4');
  return template;
}

function annotationContext(annotations, type){
  var txt ='';
	var jcontext= JSON.parse('{}');
	for (var i =0; i<annotations.length; i++){
		jcontext[annotations[i].ontologyprefix] = annotations[i].ontologyuri;
		if (annotations[i].classontologyprefix != null){
			jcontext[annotations[i].classontologyprefix] = annotations[i].classontologyuri;
			}
	}
	if (type.classontologyprefix != null){
			jcontext[type.classontologyprefix] = type.classontologyuri;
		}
	var context = JSON.parse('{}');
	txt = JSON.stringify(jcontext)+';';
	return txt;
}

function annotationMatchings(gAnnotation){
  return annotationMatchingDeep (gAnnotation, "oneJSONLD", 1, false);
}

function annotationMatchingDeep (jsSource, containner, level, isFored){
  var result ='';
  for (var p in jsSource) {
   	if(jsSource.hasOwnProperty(p) ) {
    	var annotated = jsSource[p]['annotation'] != null;
  		var embedded = false;
  		var isFor = jsSource[p]['type']=='for';
      if (annotated){
      		embedded = jsSource[p]['annotation']['type']=='embedded';
  		  	var annotation = jsSource[p]['annotation'];
  		}
		  var isPushed = isFor || (isFored && !embedded);
  		var count = (p.match(/\]\[/g) || []).length;
      var variable = jsSource[p]['var'];
      var patha = p.replace(/\['/g, "[");
	    patha = patha.replace(/\']/g, "]");
	    patha = patha.replace(/\[/g, "['");
	    patha = patha.replace(/\]/g, "']");
	  	var containner2 = containner;
  		var result2="";
  		if (isFor){
            level ++;
  		}
  		if (embedded){
  			containner2 = containner+count;
  			result += "\n"+levelblank2 (level)+"var "+containner2+"={};";
  		}
      if (annotated){
			  var result3;
  			result3 = annotationMatching(annotation, containner2, level, isPushed);
			  var initialization = "";
			  while (result3.indexOf('###')>0){
				  initialization += result3.substring (0, result3.indexOf('###'));
				  result3 = result3.substring (result3.indexOf('###')+3, result3.length);
			  }
			  if (initialization.trim()){
				 result = initialization+ '###'+ result + result3;
			  }else{
				 result=result+result3;
			  }
		  }
   		if (jsSource[p]['data'] != null){
  			result2 += annotationMatchingDeep(jsSource[p]['data'], containner2, level, isPushed);
  		}
      if (isFor && result2.trim()){
			//result +=containner+"['"+property+"']==[]" //para todos los que contiene. IKER
			var initialization = "";
			while (result2.indexOf('###')>0){
				initialization += result2.substring (0, result2.indexOf('###'));
				result2 = result2.substring (result2.indexOf('###')+3, result2.length);
			}
			level--;
            result += initialization+"\n"+levelblank2 (level)+"for (var "+variable+" = 0; "+variable+" < oneJSON"+patha+".length; "+variable+"++){";
			result += result2 + "\n"+levelblank2 (level)+"}";
  		}else{
  			result +=result2;
  		}
 		if (embedded){
 			var property = annotation.property;
		 	result += "\n"+levelblank2 (level)+containner+"['"+property+"']";
		 	if (isFored){
		 		result += ".push ("+containner2+");";
		 	}else{
		 		result += " = "+containner2+";";
		 	}
  		}
  	 }
  	}
  return result;
}

function annotationMatching(annotation, containner, level, isFored) {
	var type = annotation.type;
	var ontologyprefix = annotation.ontologyprefix;
	var ontologyuri = annotation.ontologyuri;
	var property = annotation.property;
	var uripattern = annotation.uripattern;
  var dataset = annotation.dataset;
	var path = annotation.path;
	var attribute = annotation.attribute;
	var regex = annotation.regex;
  logit('regex'+regex);
  if (regex != null)  regex= Base64.decode(regex);
  //alert('regex '+regex);
  var classontologyprefix = annotation.classontologyprefix;
	var classontologyuri = annotation.classontologyuri;
	var clas = annotation['class'];
	var txt="";
	if (type == 'embedded'){
		if (regex){
			//txt += "\n"+levelblank2 (level)+"var "+containner+"= {};";
			txt += "\n"+levelblank2 (level)+containner+"['@type']= '" +clas+"';";
			if (attribute){
        txt += "\n"+levelblank2 (level)+containner+"['@id']= getRegexpInterlink(\"oneJSON"+attribute+"\", '"+uripattern+"', "+regex+");";
			}else{
	    		txt += "\n"+levelblank2 (level)+containner+"['@id'] = URI+'#"+clas+"';";
			}
		}else{
			txt += "\n"+levelblank2 (level)+containner+"['@type']= '" +clas+"';";
			if (attribute){
        txt += "\n"+levelblank2 (level)+containner+"['@id']= getInterlink(\"oneJSON"+attribute+"\", '"+uripattern+"');";
    	}else{
				txt += "\n"+levelblank2 (level)+containner+"['@id'] = URI+'#"+clas+"';";
			}
		}
	}else if (dataset && regex){
    	if (isFored){
				txt = "\n"+levelblank2 (level)+containner+"['"+property+"']=[];###" + txt;
        txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getRegexpInterlink(\"oneJSON"+path+"\", '"+dataset+"', "+regex+"));";
    	}else{
        txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getRegexpInterlink(\"oneJSON"+path+"\", '"+dataset+"', "+regex+");";
			}
		}else if (!dataset && regex) {
			if (isFored){
				txt = "\n"+levelblank2 (level)+containner+"['"+property+"']=[];###" + txt;
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getRegexpValue(\"oneJSON"+path+"\", "+regex+"));";
    		}else{
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getRegexpValue(\"oneJSON"+path+"\", "+regex+");";
			}
		}else if (!dataset && !regex) {
			if (isFored){
				txt = "\n"+levelblank2 (level)+containner+"['"+property+"']=[];###" + txt;
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getValue(\"oneJSON"+path+"\"));";
    		}else{
		    txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getValue(\"oneJSON"+path+"\");";
			}
		}else if (dataset && !regex){
    		if (isFored){
				txt = "\n"+levelblank2 (level)+containner+"['"+property+"']=[];###" + txt;
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'].push (getInterlink(\"oneJSON"+path+"\", '"+dataset+"'));";
    		}else{
          txt += "\n"+levelblank2 (level)+containner+"['"+property+"'] = getInterlink(\"oneJSON"+path+"\", '"+dataset+"');";
			}
		}
	return txt;
}

function typeEvent() {
  console.log('qq1');
	anchors_init();
  console.log('qq2');
  var globalOntologies = readOntologies ();
	var type = anchorFormClasses.value;
	var type2 = type.substring (type.indexOf(':')+1, type.length);
	var ontNum2 = anchorFormOntologiesClasses.value;
    var ontprefix2 = globalOntologies[ontNum2].prefix;
   var onturi2 = globalOntologies[ontNum2].uri;
    var j = '{"type":"'+type+'","classontologyprefix":"'+ontprefix2+'","classontologyuri":"'+onturi2+'","class":"'+type2+'"}';
    var js = JSON.parse(j);
    console.log('qq3');
	var globalWrapper=readWrapper();
	globalWrapper.type = js;
    writeWrapper(globalWrapper);
    closeModal();
    changeButtonColorAnnotated();
    if (globalSignaler[XMLANNOTATION] || globalSignaler[XMLREANNOTATION]){
          savestorage();
    }
    globalSignaler[ANNOTATED] = true;
    consoleGlobalSignalers();
   }

function annotateEvent() {
anchors_init();
var globalOntologies = readOntologies ();
  	var value = anchorFormValue.innerHTML;
	var re = anchorFormRegex.value.trim();
  if (re.trim()){
    logit(re);
		var m = value.match(re);
    logit('tt1');

		if (m) {
			value = m[0];
		}else{
			value="";
			}
      logit(value);
	}
	var uri="{}";
  logit(re);
	if (anchorFormDataSet){
		uri = anchorFormDataSet.value;
	}
  logit('tt11');
if (!uri) {uri="{}";}
	if (!uri.trim()) {uri="{}";}
  logit('tt12');
var pattern = '{.*}', reuri = new RegExp(pattern);
	uri = uri.replace(reuri, value);
  logit('tt13');
	var ontNum = anchorFormOntologiesProperties.value;
  logit('tt131');
    var ontprefix = globalOntologies[ontNum].prefix;
    logit('tt132');
    var onturi = globalOntologies[ontNum].uri;
    logit('tt133');
    var path = anchorFormPath.innerHTML;
    logit('tt13');
	var dataSetValue = '';
  logit('tt134');
	if (anchorFormDataSet){
		dataSetValue = anchorFormDataSet.value;
	}
  logit('tt135');
	if (dataSetValue){
		datasetSave(dataSetValue);
	}
  if (re) re = Base64.encode("/"+re+"/");
  logit(re);
	var j = '{"type":"normal","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+anchorFormProperties.value+'","dataset":"'+dataSetValue+'","path":"'+path+'", "regex":"'+re+'"}';
  logit(j);
	var js = JSON.parse(j);
  logit('tt137');
	var globalWrapper=readWrapper();
logit('tt1');
  if (globalSignaler[RDFANNOTATION]){
    globalWrapper.globalannotation= globalWrapper.globalannotationclean;
    changeButtonColorR2R();
  }
  logit('tt2');
  globalWrapper.annotations.push(js);
  globalWrapper.globalannotation=annotateJSON(path, js, globalWrapper.globalannotation);
  logit('tt3');
  changeButtonColorAnnotated();
  logit('tt4');
  writeWrapper(globalWrapper);
  closeModal();
  logit('tt5');
  consoleGlobalSignalers();
  if (globalSignaler[XMLANNOTATION] || globalSignaler[XMLREANNOTATION]){
    savestorage();
  }
  globalSignaler[ANNOTATED] = true;
  }

function datasetSave(uri) {
  var datasets= readDatasets ();
	if (uri==null || !uri.trim()) return;
	for(var i=0;i<datasets.length;i++){
        if (datasets[i]['uri']===uri) return;
    }
	var j = '{"uri":"'+uri+'"}';
    var js = JSON.parse(j);
  datasets.push(js);
    writeDatasets(datasets);
}

function annotateEmbeddedEvent() {
  var globalOntologies = readOntologies ();
	anchors_init();
  	var value = anchorFormValue.innerHTML;
	var re = anchorFormRegex.value.trim();
	if (re.trim()){
		var m = value.match(re);
		if (m) {
			value = m[0];
		}else{
			value="";
			}
	}
	var type = anchorFormClasses.value;
	type = type.substring (type.indexOf(':')+1, type.length);
	var index = anchorFormProperties.value;
	index = index.substring (index.indexOf(':')+1, index.length);
	var uri = anchorFormURIPattern.innerHTML;
	uri = uri.replace('{type}', type.toLowerCase());
    uri = uri.replace('{attributevalue}', '{'+index+'}');
    var ontNum = anchorFormOntologiesProperties.value;
    var ontprefix = globalOntologies[ontNum].prefix;
    var onturi = globalOntologies[ontNum].uri;
    var ontNum2 = anchorFormOntologiesClasses.value;
    var ontprefix2 = globalOntologies[ontNum2].prefix;
    var onturi2 = globalOntologies[ontNum2].uri;
    var path=anchorFormPath.innerHTML;
    if (re) re = Base64.encode("/"+re+"/");
    var j = '{"type":"embedded","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+anchorFormProperties.value+'","uripattern":"'+uri+'","path":"'+path+'","attribute":"'+anchorFormAttributes.value+'","regex":"'+re+'","classontologyprefix":"'+ontprefix2+'","classontologyuri":"'+onturi2+'","class":"'+anchorFormClasses.value+'"}';
    var js = JSON.parse(j);
    var globalWrapper=readWrapper();
    globalWrapper.annotations.push(js);
    globalWrapper.globalannotation=annotateJSON(path, js, globalWrapper.globalannotation);
    writeWrapper(globalWrapper);
    closeModal();
    changeButtonColorAnnotated();
    if (globalSignaler[XMLANNOTATION] || globalSignaler[XMLREANNOTATION]){
      savestorage();
    }
    globalSignaler[ANNOTATED] = true;
 }

function changeButtonColorAnnotated(){
  var color = 'cyan';
  globalButtonContainner.setAttribute('style', 'background-color:'+color);

}

function changeButtonColorBlocked(){
	var color = 'LightCoral';
	globalButtonContainner.setAttribute('style', 'background-color:'+color);
}

function changeButtonColorR2R(){
	var color = '#FF00FF';
  if (globalButtonContainner2)	globalButtonContainner2.setAttribute('style', 'background-color:'+color);
}
/////////////////

function createJSONDataType(path,name, value){
	var j = JSON.parse('{}');
	j['data']=value;
	j['type']='value';
	return j;
}

function createJSONObjectProperty(path,name, js){
	var j = JSON.parse('{}');
	j['data']=js;
	j['type']='recursive';
	return j;
}

function createJSONArrayObjectProperty(path,name,variable){
	var j = JSON.parse('{}');
	j['data']=JSON.parse('{}');
	j['type']='for';
	j['var']=variable;
	return j;
}

function jsonAdd (target, source){
	for (var p in source) {
  		if(source.hasOwnProperty(p) ) {
  			target[p]= source[p];
  		}
  	}
  	return target;
}

////////////////////////////
/////Windows seccion
///////////////////////////

function openObjProp (e){
var hActual = 'Ontology%3A%20%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3EAdd%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0AProperty%3A%20%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Efirst%20select%20an%20ontology%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%3Chr%3E%0AData%20set%3A%20%3Cselect%20id%3D%22formDataSetSelect%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20Dataset%20URI-pattern...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%3Cinput%20id%3D%22formDataSet%22%20type%3D%22text%22%20name%3D%22formDataSet%22%20value%3D%22%22%2F%3E%0A%3Cbr%2F%3E%0A%3Chr%2F%3E%0APath%3A%20%3Cspan%20id%3D%22formPath%22%3E...%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0AValue%3A%20%22%3Cspan%20id%3D%22formValue%22%3E...%3C%2Fspan%3E%22%20%0A%3Cbr%2F%3ERegex%3A%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%0A%3Chr%2F%3E%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E...%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E';
var h1 = '%20%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%3C%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%20INTERLINK%20URI%20PATTERN%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0AATTRIBUTE%20VALUE%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3EAdd%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20property...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formDataSetSelect%22%3E%0A%3Coption%20value%3D%22%22%3ESelect%20URI-pattern...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%3Cinput%20id%3D%22formDataSet%22%20type%3D%22text%22%20name%3D%22formDataSet%22%20value%3D%22%22%2F%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0APath%3A%20%3Cspan%20id%3D%22formPath%22%3E%5B%27person%27%5D%5B%27name%27%5D%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0AValue%3A%20%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%3Cbr%2F%3ERegex%3A%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%22ontology%3Aproperty%22%20%3C%3D%20%22http%3A%2F%2Furipattern%2Fattribute%22%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
var h2 = '%20%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%3C%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%20INTERLINK%20URI%20PATTERN%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cspan%20id%3D%22formPath%22%3E%5B%27person%27%5D%5B%27name%27%5D%3C%2Fspan%3E%20ATTRIBUTE%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20property...%3C%2Foption%3E%0A%3C%2Fselect%3E%20%3C%3D%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formDataSetSelect%22%3E%0A%3Coption%20value%3D%22%22%3ESelect%20interlink%20URI%20pattern...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%3Cinput%20id%3D%22formDataSet%22%20type%3D%22text%22%20name%3D%22formDataSet%22%20value%3D%22http%3A%2F%2Fdbpedia.org%2Fresource%2F%7Bid%7D%22%20size%3D%2230%22%2F%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%3Cbutton%20id%3D%22formPreviewButton%22%3EApply%20Regex%20%3C%2Fbutton%3E%0A%3Cbr%2F%3E%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%0A%3Cspan%20id%3D%22formPreview%22%3E%22ontology%3Aproperty%22%20%3C%3D%3D%20%22http%3A%2F%2Furipattern%2Fattribute%22%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
var h ='%20%20%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%20%20colspan%3D%222%22%20%20align%3D%22center%22%3E%0A%20INTERLINK%20URI%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%20%0A%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%20URI%20PATTERN%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%20VALUE%20PATTERN%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY...%3C%2Foption%3E%0A%3C%2Fselect%3E%20%3C%3D%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formDataSetSelect%22%3E%0A%3Coption%20value%3D%22%22%3ESelect%20INTERLINK%20URI%20PATTERN...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%3Cinput%20id%3D%22formDataSet%22%20type%3D%22text%22%20name%3D%22formDataSet%22%20value%3D%22%22%20size%3D%2233%22%2F%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%3Cspan%20id%3D%22formPath%22%20hidden%3E%5B%27person%27%5D%5B%27name%27%5D%3C%2Fspan%3E%20%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%7B%22ontology%3Aproperty%22%20%3A%20%22http%3A%2F%2Furipattern%2Fattributevalue%22%7D%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
  createModalContent('Association mapping', undecode(h));
  anchors_init();
  anchorFormOntologiesProperties.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesProperties);
  anchorFormOntologiesProperties.onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchorFormDataSetSelect.innerHTML = datasetSelects();
  sortSelect(anchorFormDataSetSelect);
	anchorFormDataSetSelect.onchange = function(e) {formDataSetSelectEvent(e);};
  anchorFormPath.innerHTML = e.target.getAttribute("path");
  anchorFormValue.innerHTML = e.target.getAttribute("value");
  anchorFormPreviewButton.onclick = function(e) {previewEvent(e);};
  anchorFormAnnotateButton.onclick = function(e) {annotateEvent(e);};
  anchorFormAddOntologyButton.onclick = function(e) {addOntology(e);};
  globalButtonContainner2 = globalButtonContainner;
  globalButtonContainner = e.target.parentNode.parentNode;
}

function addOntology (){
  loadNewOntology();
  anchorFormOntologiesProperties.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesProperties);
  anchorFormOntologiesProperties.onchange = function(e) {ontologyPropertySelectionEvent(e);};
}

function addOntologyClass (){
  loadNewOntology();
  anchorFormOntologiesProperties.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesProperties);
  anchorFormOntologiesProperties.onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchorFormOntologiesClasses.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesClasses);
  anchorFormOntologiesClasses.onchange = function(e) {ontologyClassSelectionEvent(e);};
  }

function addOntologyOnlyClass (){
  loadNewOntology();
  anchorFormOntologiesClasses.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesClasses);
  anchorFormOntologiesClasses.onchange = function(e) {ontologyClassSelectionEvent(e);};
  }

function openDataProp (e){
 var h1 = 'Ontology%3A%20%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3EAdd%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0AProperty%3A%20%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Efirst%20select%20an%20ontology%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%3Chr%2F%3E%0APath%3A%20%3Cspan%20id%3D%22formPath%22%3E...%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0AValue%3A%20%22%3Cspan%20id%3D%22formValue%22%3E...%3C%2Fspan%3E%22%20%0A%3Cbr%2F%3ERegex%3A%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%0A%3Chr%2F%3E%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E...%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E';
var h2='%20%20%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%0A%20%20%20%20%3Ctd%3E%0A%3Cspan%20id%3D%22formPath%22%3E%5B%27person%27%5D%5B%27name%27%5D%3C%2Fspan%3E%20ATTRIBUTE%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY...%3C%2Foption%3E%0A%3C%2Fselect%3E%20%3C%3D%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%0A%20%20%20%20%3Ctd%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%7B%22ontology%3Aproperty%22%20%3A%20%22attributevalue%22%7D%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
var h ='%20%20%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%20VALUE%20PATTERN%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY...%3C%2Foption%3E%0A%3C%2Fselect%3E%20%3C%3D%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%3Cspan%20id%3D%22formPath%22%20hidden%3E%5B%27person%27%5D%5B%27name%27%5D%3C%2Fspan%3E%20%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%7B%22ontology%3Aproperty%22%20%3A%20%22http%3A%2F%2Furipattern%2Fattributevalue%22%7D%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
 createModalContent('Property mapping', undecode(h));
  anchors_init();
  anchorFormOntologiesProperties.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesProperties);
  anchorFormOntologiesProperties.onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchorFormPath.innerHTML = e.target.getAttribute("path");
  anchorFormValue.innerHTML = e.target.getAttribute("value");
  anchorFormPreviewButton.onclick = function(e) {previewEvent(e);};
  anchorFormAnnotateButton.onclick = function(e) {annotateEvent(e);};
  anchorFormAddOntologyButton.onclick = function(e) {addOntology(e);};
  globalButtonContainner = e.target.parentNode.parentNode;
}

function previewEvent() {
	var value = anchorFormValue.innerHTML;
	var re = anchorFormRegex.value.trim();
	if (re.trim()){
		var m = value.match(re);
		if (m) {
			value = m[0];
		}else{
			value="";
			}
	}
	var uri="{}";
	if (anchorFormDataSet){
		uri = anchorFormDataSet.value;
	}
	if (!uri.trim()) {uri="{}";}
	var pattern = '{.*}', reuri = new RegExp(pattern);
	uri = uri.replace(reuri, value);
	anchorFormPreview.innerHTML = '{"'+anchorFormProperties.value+'" : "' + uri+'"}';
}

function previewEmbededEvent() {
	anchors_init();
var value = anchorFormValue.innerHTML;
var re = anchorFormRegex.value.trim();
  if (re.trim()){
		var m = value.match(re);
		if (m) {
			value = m[0];
		}else{
			value="";
			}
	}
  var type = anchorFormClasses.value;
	type = type.substring (type.indexOf(':')+1, type.length);
  var uri = anchorFormURIPattern.innerHTML;
	uri = uri.replace('{type}', type.toLowerCase());
    uri = uri.replace('{attributevalue}', value);
    anchorFormPreview.innerHTML = '';
  	anchorFormPreview.innerHTML += 'embeddedJSONLD["@id"]= "' + uri + '";';
  	anchorFormPreview.innerHTML += '<br/>embeddedJSONLD["@type"]= "' +anchorFormClasses.value+'";';
  	anchorFormPreview.innerHTML += '<br/>oneJSONLD["'+anchorFormProperties.value+'"] = embeddedJSONLD;';
    anchorFormPreview.innerHTML = '';
    anchorFormPreview.innerHTML += '{"'+anchorFormProperties.value+'" : {';
    anchorFormPreview.innerHTML += ' "@type" : "' +anchorFormClasses.value+'",';
  	anchorFormPreview.innerHTML += '<br/>"@id" : "' + uri + '"}} ';
}

function openTypetion (e){
	var h ='%3Cb%3ETarget%20Class%20(%40type)%3C%2Fb%3E%3Cbr%2F%3E%0AOntology%3A%20%3Cselect%20id%3D%22formOntologiesClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyClassButton%22%3EAdd%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0AClass%3A%20%3Cselect%20id%3D%22formClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Efirst%20select%20an%20ontology%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%3Chr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E';
	createModalContent('Define instances type:', undecode(h));
	anchors_init();
  anchorFormOntologiesClasses.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesClasses);
  anchorFormOntologiesClasses.onchange = function(e) {ontologyClassSelectionEvent(e);};
  anchorFormAnnotateButton.onclick = function(e) {typeEvent(e);};
  anchorFormAddOntologyClassButton.onclick = function(e) {addOntologyOnlyClass(e);};
  globalButtonContainner = e.target.parentNode.parentNode;
}

function openEmbedded (e){
    var hOriginal ='%3Cb%3EAssociation%20property%3C%2Fb%3E%20%3Cbr%2F%3E%0AOntology%3A%20%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3EAdd%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0AProperty%3A%20%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Efirst%20select%20an%20ontology%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%3Chr%2F%3E%0A%3Cb%3EURI%20(%40id)%3C%2Fb%3E%20%0A%3Cbr%2F%3E%3Cspan%20id%3D%22formURIPattern%22%20type%3D%22text%22%20hidden%20value%3D%22%22%3E%3C%2Fspan%3E%20%0A%3Cspan%20id%3D%22formPath%22%20type%3D%22text%22%20hidden%20value%3D%22%22%3E%3C%2Fspan%3E%20%0ASource%20attributes%3A%20%3Cselect%20id%3D%22formAttributes%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20attribute...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0AValue%3A%20%22%3Cspan%20id%3D%22formValue%22%3E...%3C%2Fspan%3E%22%20%0A%3Cbr%2F%3ERegex%3A%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%0A%3Chr%2F%3E%0A%3Cb%3ETarget%20Class%20(%40type)%3C%2Fb%3E%3Cbr%2F%3E%0AOntology%3A%20%3Cselect%20id%3D%22formOntologiesClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyClassButton%22%3EAdd%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0AClass%3A%20%3Cselect%20id%3D%22formClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Efirst%20select%20an%20ontology%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%3Chr%2F%3E%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E...%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E';
  var h1 = '%0A%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0ATARGET%20CLASS%20%40id%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0ATARGET%20CLASS%20%40type%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY%3C%2Foption%3E%0A%3C%2Fselect%3E%20%3C%3D%3D%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cspan%20id%3D%22formURIPattern%22%20type%3D%22text%22%20hidden%20value%3D%22%22%3E%3C%2Fspan%3E%20%0A%3Cspan%20id%3D%22formPath%22%20type%3D%22text%22%20hidden%20value%3D%22%22%3E%3C%2Fspan%3E%20%0A%3Cselect%20id%3D%22formAttributes%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20ATTRIBUTE...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%22%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ontology...%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyClassButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Eselect%20a%20PROPERTY%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%22ontology%3Aproperty%22%20%3C%3D%3D%20%22attribute%22%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
  var h ='%3Ctable%20style%3D%22width%3A100%25%22%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0AONTOLOGY%3APROPERTY%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%40type%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%40id%20%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%3C%2Ftr%3E%0A%20%20%3Ctr%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formProperties%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20a%20PROPERTY%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3Cselect%20id%3D%22formOntologiesClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20an%20ONTOLOGY%3C%2Foption%3E%0A%3C%2Fselect%3E%3Cbutton%20type%3D%22button%22%20id%3D%22formAddOntologyClassButton%22%3E%2B%3C%2Fbutton%3E%0A%3Cbr%2F%3E%0A%3Cselect%20id%3D%22formClasses%22%3E%0A%20%20%3Coption%20value%3D%22%22%3Eselect%20a%20PROPERTY%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%20%20%20%20%3C%2Ftd%3E%0A%20%20%20%20%3Ctd%3E%0A%3C%2Fspan%3E%20%0A%3Cspan%20id%3D%22formPath%22%20type%3D%22text%22%20hidden%20value%3D%22%22%3E%3C%2Fspan%3E%20%0A%3Cselect%20id%3D%22formAttributes%22%3E%0A%20%20%3Coption%20value%3D%22%22%3ESelect%20ATTRIBUTE...%3C%2Foption%3E%0A%3C%2Fselect%3E%0A%3Cbr%2F%3E%0A%2F%3Cinput%20id%3D%22formRegex%22%20type%3D%22text%22%20name%3D%22fname%22%20value%3D%22%22%2F%3E%2Fg%20%0A%3Ca%20href%3D%22http%3A%2F%2Fwww.regexpal.com%2F%22%20target%3D%22regexpal%22%3ERegexp%20info%3C%2Fa%3E%0A%3Cbr%2F%3E%22%3Cspan%20id%3D%22formURIPattern%22%20type%3D%22text%22%20value%3D%22%22%3E%3C%2Fspan%3E%3Cspan%20id%3D%22formValue%22%3EIker%20Azpeitia%3C%2Fspan%3E%22%20%0A%20%20%20%20%3C%2Ftd%3E%0A%0A%20%20%3C%2Ftr%3E%0A%3C%2Ftable%3E%0A%3Cbutton%20id%3D%22formPreviewButton%22%3EPreview%3A%20%3C%2Fbutton%3E%0A%3Cspan%20id%3D%22formPreview%22%3E%7B%22ontology%3Aproperty%22%20%3A%20%7B%22%40type%22%20%3A%20ontology2%3Aproperty2%2C%20%22%40id%22%20%3A%20%22http%3A%2F%2Furi%2Fattributevalue%22%7D%7D%20%3C%2Fspan%3E%20%0A%3Cbr%2F%3E%0A%3Cbr%2F%3E%0A%20%20%3Cbutton%20type%3D%22submit%22%20id%3D%22formAnnotateButton%22%3EAnnotate%3C%2Fbutton%3E%20';
  createModalContent('Annotate embedded individual', undecode(h));
	anchors_init();
  anchorFormOntologiesProperties.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesProperties);
  anchorFormOntologiesProperties.onchange = function(e) {ontologyPropertySelectionEvent(e);};
  anchorFormOntologiesClasses.innerHTML = ontologySelects();
  sortSelect(anchorFormOntologiesClasses);
  anchorFormOntologiesClasses.onchange = function(e) {ontologyClassSelectionEvent(e);};
  var urip = 'http://rdf.onekin.org/'+globalAPI+'.{type}/{attributevalue}';
  anchorFormURIPattern.innerHTML = urip;
  anchorFormPath.innerHTML = e.target.getAttribute("path");
  anchorFormValue.innerHTML = e.target.getAttribute("value");
  anchorFormPreviewButton.onclick = function(e) {previewEmbededEvent(e);};
  anchorFormAnnotateButton.onclick = function(e) {annotateEmbeddedEvent(e);};
  anchorFormAttributes.innerHTML = attributeSelects(e.target.getAttribute("path"));
  sortSelect(anchorFormAttributes);
  anchorFormAttributes.onchange = function(e) {attributeSelectionEvent(e);};
  anchorFormAddOntologyButton.onclick = function(e) {addOntology(e);};
  anchorFormAddOntologyClassButton.onclick = function(e) {addOntologyClass(e);};
  globalButtonContainner = e.target.parentNode.parentNode;
 }

function sortSelect(selElem) {
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
}

function attributeSelects(pathOriginal){
	var path = pathOriginal;
	var data = globalSource.query.results;
	path = path.replace(/\[/g, '');
	path = path.replace(/'/g, '');
	path = path.replace(/"/g, '');
	var res = path.split("]");
	var name='';
	for (var i = 0; i<res.length-1; i++){
    name = res[i];
    if (name.indexOf("LOOP") === 0){
      data= data [0];
    }else{
  		if (data[0]!= undefined) {data= data [0];}
  		data= data [name];
    }
	}
	var selects = "";//'<option value="">Select an attribute ...</option>';

	if (data[0]!= undefined) {
		data = data[0];
		pathOriginal +="[0]";
	}
	for (var p in data) {
		if(data.hasOwnProperty(p) ) {
 			selects += '<option value="'+pathOriginal+'[\''+p+'\']">"'+p+'" : "'+data[p]+'"</option>';
 		}
	}
	return selects;
}

function attributeSelectionEvent() {
 	var path = anchorFormAttributes.value;
 	var value = runJSON(path);
 	anchorFormValue.innerHTML= value;
}

function runJSON(path){
	var data = globalSource.query.results;
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
}

function openOntology (){
  loadNewOntology();
}

///////////////////////////
/////MODAL window Manager  seccion
//////////////////////////

function createModal (){
  var div1 = document.createElement('div');
    div1.id='modal_wrapper';
    div1.class='';
    var div2 = document.createElement('div');
    div2.id='modal_window';
	  div2.innerHTML='<h3><span id="modaltitle">Fill in the form: <span></h3><span id="modal_content" style="text-align: left;">... </span><button id="modal_close" >Cancel</button>';
    div1.appendChild(div2);
    anchorBody.appendChild(div1);
}

function createModalContent (name, html){
   	anchorModalContent.innerHTML = html;
    anchorModalTitle.innerHTML = name;
	openModal();
}

var openModal = function(e) {
	anchors_init();
  	anchorModalWrapper.className = "overlay";
//  e.preventDefault ? e.preventDefault() : e.returnValue = false;
};

var closeModal = function(e) {
  anchors_init();
  anchorModalWrapper.className = "";
  //e.preventDefault ? e.preventDefault() : e.returnValue = false;
};

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
  createModal ();
  if (document.addEventListener) {
   document.getElementById("modal_close").addEventListener("click", closeModal, false);
   document.addEventListener("click", clickHandler, false);
   document.addEventListener("keydown", keyHandler, false);
  } else {
   document.getElementById("modal_close").attachEvent("onclick", closeModal);
   document.attachEvent("onclick", clickHandler);
   document.attachEvent("onkeydown", keyHandler);
  }
};

///////////////
//// STYLES
//////////////
function appendStyles (){
    var styles = '#modal_window{display:none;  z-index:2000;  position:fixed;  left:0%;  top:0%;  width:90%;  padding:10px 20px;  background:#fff;  border:5px solid #999;  border-radius:10px;  box-shadow:0 0 10px rgba(0,0,0,.5)}';
    styles +=  ' #modal_wrapper.overlay:before{content:" ";   width:100%;  height:100%;  position:fixed;  z-index:1000;  top:0;  left:0;  background:#000;  background:rgba(0,0,0,.7)}';
    styles += ' #modal_wrapper.overlay';
    styles +=  ' #modal_window{display:block}';
    GM_addStyle(styles);
    GM_addStyle("span.blocked > button {border-radius:5px;}");
    GM_addStyle("span.blocked > span {display: none; position: relative;}");//ocultar menu
	  GM_addStyle("span.blockedbutton > button {border-radius:500px; }");//ocultar menu
    GM_addStyle("span.ldwnav > button {border-radius:5px;}");
    GM_addStyle("span.ldwnav > span {display: none; position: relative;}");//ocultar menu
    GM_addStyle("span.ldwnav:hover span {display: inline-block;}");//aparecer menu
    // GM_addStyle(".free > button {background-color: #00FFFF}");
   // GM_addStyle(".annotated > button {background-color: #E0FFFF}");
   // GM_addStyle(".blocked > button {background-color: #D8BFD8}");
}

function undecode (coded){
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
}

///////////////
//// DataSets Manager   seccion
//////////////

function datasetSelects(){
var datasets= readDatasets ();
	var selects = '<option value="">Select or write URI pattern...</option>';
	for (var i =0; i<datasets.length; i++){
		selects += '<option value="'+datasets[i].uri+'">'+datasets[i].uri+'</option>';
	}
	return selects;
}

function datasetEvent() {
  var datasets= readDatasets ();
	var uri = anchorFormURIPattern.value;
	if (uri==null || !uri.trim()) return;
	var j = '{"uri":"'+uri+'"}';
    var js = JSON.parse(j);
    datasets.push(js);
    writeDatasets(datasets);
    closeModal();
}

function readDatasets (){
	var datasets = readData("datasets");
  	if (datasets==null){
	  	datasets = JSON.parse('[{"uri":"http://dbpedia.org/resource/{$VALUE}"}]');
  		writeDatasets(datasets);
  	}
    return datasets;
}

function writeDatasets(datasets){
    writeData("datasets", datasets);
}

///////////////
//// Ontology Manager   seccion
//////////////

function loadNewOntology (){
  var globalOntologies = readOntologies ();
var url = "http://lov.okfn.org/dataset/lov/";
  window.open(url,'_four');
	var prefix = prompt("Enter an ontology prefix from http://lov.okfn.org/ opened in the tab");
	if (prefix == null) return;
	readOntologies();
	var j = JSON.parse('{"prefix":"'+prefix+'", "url":"", "uri":""}');
	globalOntologies.push (j);
	writeOntologies(globalOntologies);
}

function readOntologies (){
	var globalOntologies = readData("globalOntologies");
  	if (globalOntologies==null){
			globalOntologies = JSON.parse('[{"prefix":"rdf", "title": "", "url":"", "uri":""}, {"prefix":"rdfs"}, {"prefix":"schema"}, {"prefix":"foaf"}, {"prefix":"dcterms"}, {"prefix":"owl"}, {"prefix":"geo"}, {"prefix":"sioc"}, {"prefix":"skos"}, {"prefix":"void"}, {"prefix":"bio"}, {"prefix":"qb"}, {"prefix":"rss"}, {"prefix":"con"}, {"prefix":"doap"}, {"prefix":"bibo"}, {"prefix":"dcat"}, {"prefix":"adms"}]');
  		writeOntologies(globalOntologies);
  	}
    return globalOntologies
}

function writeOntologies(globalOntologies){
    writeData("globalOntologies", globalOntologies);
}

function ontologySelects(){
  var globalOntologies = readOntologies ();
	var selects = '<option value="">Select an ONTOLOGY...</option>';
	for (var i =0; i<globalOntologies.length; i++){
		if (globalOntologies[i].title)
			selects += '<option value="'+i+'">'+globalOntologies[i].prefix+' = '+globalOntologies[i].title+'</option>';
		else
			selects += '<option value="'+i+'">'+globalOntologies[i].prefix+'</option>';
	}
	return selects;
}

function ontologyPropertySelectionEvent() {
  var globalOntologies = readOntologies ();
 	var num = anchorFormOntologiesProperties.value;
 	var ontology = globalOntologies[num];
 	if (ontology == null) return ;
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
    	}
  }
}

function formDataSetSelectEvent() {
	anchors_init();
	var value =anchorFormDataSetSelect.value;
	anchorFormDataSet.value= value;
}

function loadOntology(obj){
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
}

function loadOntologyAttributes(obj){
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
        anchorFormProperties.innerHTML = html;
        ontologySelects(anchorFormProperties);
	}

function ontologyClassSelectionEvent() {
  var globalOntologies = readOntologies ();
 	var num = anchorFormOntologiesClasses.value;
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
}


function loadOntologyClasses(obj){
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
	find = "prefix.*"+nsp;
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
		anchorFormClasses.innerHTML = html;
		sortSelect(anchorFormClasses);
	}

////////////////
////Permanent register  seccion
////////////////

function writeData (key, value){
	var data = GM_getValue('LDWdata');
  if (data == null){data = "{}"};
  var jdata = JSON.parse(data);
  jdata[key]= value;
  //console.info('LDW wd: '+ JSON.stringify(jdata));
	GM_setValue('LDWdata', JSON.stringify(jdata));
  //console.info('writeData: '+ key+' : '+value);
}

function readData (key){
	var data = GM_getValue('LDWdata');
  if (data == null){data = "{}"};
  var jdata = JSON.parse(data);
  //console.info('readData: '+ data);
  return jdata[key];
}


///////////////////
////COMUNICATION   seccion
//////////////////


function callURL(url, callback){
  console.log ('URLnormal calling: '+url);
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
}

function callURLJSON(url, callback){
//  url = url.trim();
  console.log ('URLjson calling: '+url);
  var xmlhttp = createCrossDomainRequest();
  xmlhttp.open('GET', url, true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
        if(xmlhttp.status == 200) {
          //console.log('xmlhttp.status::  '+xmlhttp.status);
            var obj = JSON.parse(xmlhttp.responseText);
            callback (obj);
         }else{
    		alert("Problem retrieving data. Status: "+xmlhttp.status + ' | '+xmlhttp.statusText);
  		}
    }
};
xmlhttp.send(null);
}

function createCrossDomainRequest(){
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
}

///////////////////////////////////////
///////////////////////////////////////
////////  EDITOR AUGMENTATION
///////////////////////////////////////
///////////////////////////////////////

/////////////////////
/////Editor augmentation
/////////////////

function augmentEditor(){
	addPublishButton();
	changeTitles();
	changeTemplates();
	createODTFolder();
}

////////////////////
////////////////////

function changeTitles(){
	anchorMyTables.innerHTML = 'My YQL Tables / My LDW';
	anchorYQLTable.innerHTML = 'YQL Table / LDW';
}

////////
//Coupled and decoupled templates
////

function decoupledTemplate (){
	 anchorSelectTemplate.innerHTML=Base64.decode('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCiAgICAgIDx0YWJsZSB4bWxucz0iaHR0cDovL3F1ZXJ5LnlhaG9vYXBpcy5jb20vdjEvc2NoZW1hL3RhYmxlLnhzZCI+DQogICAgPG1ldGE+DQogICAgICAgIDxhdXRob3I+PCEtLSB5b3VyIG5hbWUgb3IgY29tcGFueSBuYW1lIC0tPjwvYXV0aG9yPg0KICAgICAgICA8ZGVzY3JpcHRpb24+PCEtLSBkZXNjcmlwdGlvbiBvZiB0aGUgdGFibGUgLS0+PC9kZXNjcmlwdGlvbj4NCiAgICAgICAgPGRvY3VtZW50YXRpb25VUkw+PCEtLSB1cmwgZm9yIEFQSSBkb2N1bWVudGF0aW9uIC0tPjwvZG9jdW1lbnRhdGlvblVSTD4NCiAgICAgICAgPGFwaUtleVVSTD48IS0tIHVybCBmb3IgZ2V0dGluZyBhbiBBUEkga2V5IGlmIG5lZWRlZCAtLT48L2FwaUtleVVSTD4NCiAgICAgICAgPCEtLWxvd2VyaW5nLS0+DQogICAgICAgIDxzYW1wbGVRdWVyeT4gVVJJUGF0dGVybjogPCEtLXlvdXIgVVJJIHBhdHRlcm4gIC9TRVJWSUNFLlRZUEUuTUVUSE9EL3tQQVJBTX0gLS0+PC9zYW1wbGVRdWVyeT4NCiAgICAgICAgPHNhbXBsZVF1ZXJ5PiBVUklFeGFtcGxlOiA8IS0teW91ciBVUkkgZXhhbXBsZSAvU0VSVklDRS5UWVBFLk1FVEhPRC8xMjM0IC0tPjwvc2FtcGxlUXVlcnk+DQogICAgPC9tZXRhPg0KICAgIDxiaW5kaW5ncz4NCiAgICAgICAgPCEtLWdyb3VuZGluZy0tPg0KICAgICAgICA8c2VsZWN0IGl0ZW1QYXRoPSIiIHByb2R1Y2VzPSJYTUwiPg0KICAgICAgICAgICAgPHVybHM+DQogICAgICAgICAgICAgICAgPHVybD48IS0tIFJFU1QgZW5kcG9pbnQgdG8gc2VsZWN0IGRhdGEgZnJvbSAtLT48L3VybD4NCiAgICAgICAgICAgIDwvdXJscz4NCiAgICAgICAgICAgPGlucHV0cz4NCiAgICAgICAgICAgICAgICA8a2V5IGlkPSJQQVJBTSIgdHlwZT0ieHM6c3RyaW5nIiBwYXJhbVR5cGU9InF1ZXJ5IiByZXF1aXJlZD0idHJ1ZSIgLz4NCiAgICAgICAgICAgICA8L2lucHV0cz4NCiAgICAgICAgICAgICA8ZXhlY3V0ZT4NCiAgICAgICAgICAgICAgICA8IVtDREFUQVsNCg0KIF1dPg0KICAgICAgICAgICAgPC9leGVjdXRlPg0KICAgICAgICA8L3NlbGVjdD4NCjwhLS1saWZ0aW5nLS0+DQogICAgICA8ZnVuY3Rpb24gbmFtZT0ibGlmdGluZyI+DQogICAgICAgPGlucHV0cz4NCiAgICAgICAgPHBpcGUgaWQ9Im9uZVhNTCIgcGFyYW1UeXBlPSJ2YXJpYWJsZSIgLz4NCiAgICAgICAgPGtleSBpZD0iVVJJIiBwYXJhbVR5cGU9InZhcmlhYmxlIiAgcmVxdWlyZWQ9InRydWUiLz4NCiAgICAgICA8L2lucHV0cz4gDQogCSAgIDxleGVjdXRlPiAgPCFbQ0RBVEFbDQoJdmFyIG9uZUpTT049IHkueG1sVG9Kc29uKG9uZVhNTCk7DQoJdmFyIG9uZUpTT05MRD17fTsNCgkvL1VSSQ0KCW9uZUpTT05MRFsnQGlkJ109VVJJOw0KICAgIC8vY29udGV4dA0KCW9uZUpTT05MRFsnQGNvbnRleHQnXT17fTsNCglvbmVKU09OTERbJ0Bjb250ZXh0J11bJ3JkZnMnXT0naHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hIyc7ICAgIA0KCS8vVHlwZQ0KCW9uZUpTT05MRFsnQHR5cGUnXT0nLi4uJzsNCiAgICAvL21hcHBpbmdzDQoJb25lSlNPTkxEWydyZGZzOmxhYmVsJ109b25lSlNPTlsnLi4uJ11bJ25hbWUnXTsgDQoJLy9yZXR1cm4gcmVzcG9uc2UNCiAgICByZXNwb25zZS5vYmplY3QgPSBvbmVKU09OTEQ7XV0+DQogICAgICAgIDwvZXhlY3V0ZT4gDQogICAgICA8L2Z1bmN0aW9uPiANCiAgICA8L2JpbmRpbmdzPiANCiA8L3RhYmxlPg==');
    }

function coupledTemplate (){
	anchorSelectTemplate.innerHTML=Base64.decode('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCiAgICAgIDx0YWJsZSB4bWxucz0iaHR0cDovL3F1ZXJ5LnlhaG9vYXBpcy5jb20vdjEvc2NoZW1hL3RhYmxlLnhzZCI+DQogICAgPG1ldGE+DQogICAgICAgIDxhdXRob3I+PCEtLSB5b3VyIG5hbWUgb3IgY29tcGFueSBuYW1lIC0tPjwvYXV0aG9yPg0KICAgICAgICA8ZGVzY3JpcHRpb24+PCEtLSBkZXNjcmlwdGlvbiBvZiB0aGUgdGFibGUgLS0+PC9kZXNjcmlwdGlvbj4NCiAgICAgICAgPGRvY3VtZW50YXRpb25VUkw+PCEtLSB1cmwgZm9yIEFQSSBkb2N1bWVudGF0aW9uIC0tPjwvZG9jdW1lbnRhdGlvblVSTD4NCiAgICAgICAgPGFwaUtleVVSTD48IS0tIHVybCBmb3IgZ2V0dGluZyBhbiBBUEkga2V5IGlmIG5lZWRlZCAtLT48L2FwaUtleVVSTD4NCiAgICAgICAgPCEtLWxvd2VyaW5nLS0+DQogICAgICAgIDxzYW1wbGVRdWVyeT4gVVJJUGF0dGVybjogPCEtLXlvdXIgVVJJIHBhdHRlcm4gIC9TRVJWSUNFLlRZUEUuTUVUSE9EL3tQQVJBTX0gLS0+PC9zYW1wbGVRdWVyeT4NCiAgICAgICAgPHNhbXBsZVF1ZXJ5PiBVUklFeGFtcGxlOiA8IS0teW91ciBVUkkgZXhhbXBsZSAvU0VSVklDRS5UWVBFLk1FVEhPRC8xMjM0IC0tPjwvc2FtcGxlUXVlcnk+DQogICAgPC9tZXRhPg0KICAgIDxiaW5kaW5ncz4NCiAgICAgICAgPCEtLWdyb3VuZGluZy0tPg0KICAgICAgICA8c2VsZWN0IGl0ZW1QYXRoPSJyZXN1bHRzLioiIHByb2R1Y2VzPSJYTUwiPg0KICAgICAgICAgICAgPGlucHV0cz4NCiAgICAgICAgICAgICAgICA8a2V5IGlkPSJQQVJBTSIgdHlwZT0ieHM6c3RyaW5nIiBwYXJhbVR5cGU9InF1ZXJ5IiByZXF1aXJlZD0idHJ1ZSIgLz4NCiAgICAgICAgICAgICA8L2lucHV0cz4NCiAgICAgICAgICAgICA8ZXhlY3V0ZT4NCiAgICAgICAgICAgICAgICA8IVtDREFUQVsNCiB2YXIgcSA9ICJlbnYgJ3N0b3JlOi8vZGF0YXRhYmxlcy5vcmcvYWxsdGFibGVzd2l0aGtleXMnOyBzZWxlY3QgKiBmcm9tIE9EVFRBQkxFIHdoZXJlIFBBUkFNID1AUEFSQU0nOw0KIHZhciBwYXJhbXMgPXsnUEFSQU0nOiBQQVJBTX07DQogdmFyIHF1ZXJ5ID0geS5xdWVyeSAocSxwYXJhbXMpOyANCiByZXNwb25zZS5vYmplY3QgPSAgcXVlcnkucmVzdWx0czsNCiBdXT4NCiAgICAgICAgICAgIDwvZXhlY3V0ZT4NCiAgICAgICAgPC9zZWxlY3Q+DQo8IS0tbGlmdGluZy0tPg0KICAgICAgPGZ1bmN0aW9uIG5hbWU9ImxpZnRpbmciPg0KICAgICAgIDxpbnB1dHM+DQogICAgICAgIDxwaXBlIGlkPSJvbmVYTUwiIHBhcmFtVHlwZT0idmFyaWFibGUiIC8+DQogICAgICAgIDxrZXkgaWQ9IlVSSSIgcGFyYW1UeXBlPSJ2YXJpYWJsZSIgIHJlcXVpcmVkPSJ0cnVlIi8+DQogICAgICAgPC9pbnB1dHM+IA0KIAkgICA8ZXhlY3V0ZT4gIDwhW0NEQVRBWw0KCXZhciBvbmVKU09OPSB5LnhtbFRvSnNvbihvbmVYTUwpOw0KCXZhciBvbmVKU09OTEQ9e307DQoJLy9VUkkNCglvbmVKU09OTERbJ0BpZCddPVVSSTsNCiAgICAvL2NvbnRleHQNCglvbmVKU09OTERbJ0Bjb250ZXh0J109e307DQoJb25lSlNPTkxEWydAY29udGV4dCddWydyZGZzJ109J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSMnOyAgICANCgkvL1R5cGUNCglvbmVKU09OTERbJ0B0eXBlJ109Jy4uLic7DQogICAgLy9tYXBwaW5ncw0KCW9uZUpTT05MRFsncmRmczpsYWJlbCddPW9uZUpTT05bJy4uLiddWyduYW1lJ107IA0KCS8vcmV0dXJuIHJlc3BvbnNlDQogICAgcmVzcG9uc2Uub2JqZWN0ID0gb25lSlNPTkxEO11dPg0KICAgICAgICA8L2V4ZWN1dGU+IA0KICAgICAgPC9mdW5jdGlvbj4gDQogICAgPC9iaW5kaW5ncz4gDQogPC90YWJsZT4=');
}

function changeTemplates(){
decoupledTemplate ();
	var a = document.createElement('a');
	a.innerHTML= oneFingerImg;
	var a2 = document.createElement('a');
	a2.innerHTML= tiedHandsImg;
	a.addEventListener("click", decoupledTemplate, false);
	a2.addEventListener("click", coupledTemplate, false);
	anchorInsertTemplate.parentNode.parentNode.insertBefore(anchorInsertTemplate.parentNode.nextSibling, anchorInsertTemplate.parentNode);
	anchorInsertTemplate.style.visibility = "hidden";
	var elm =  findElement('a', 'Select Template');
	elm.innerHTML= 'LDW template';
	elm.appendChild(a);
	elm.appendChild(a2);
}

function clickOnCoupled (){
	globalYQLTableName = this.getAttribute("data-id");
	var url = this.getAttribute("tableurl");
	callURLJSON(url, function (resp) {showCoupledYQLTable(resp);});
}

function clickOnDecoupled (){
	globalYQLTableName = this.getAttribute("data-id");
	var url = this.getAttribute("tableurl");
	callURLJSON(url, function (resp) {showDecoupledYQLTable(resp);});
}

function showCoupledYQLTable (resp){
	var tableTemplate= undecode('%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%20%20%20%20%20%20%3Ctable%20xmlns%3D%22http%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fschema%2Ftable.xsd%22%3E%0A%20%20%20%20%3Cmeta%3E%0A%20%20%20%20%20%20%20%20%3Cauthor%3E%3C!--%20your%20name%20or%20company%20name%20--%3E%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3E%3C!--%20description%20of%20the%20table%20--%3E%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3E%3C!--%20url%20for%20API%20documentation%20--%3E%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3E%3C!--%20url%20for%20getting%20an%20API%20key%20if%20needed%20--%3E%3C%2FapiKeyURL%3E%0A%20%20%20%20%20%20%20%20%3C!--lowering--%3E%0A%23LOWERING%23%0A%20%20%20%20%3C%2Fmeta%3E%0A%20%20%20%20%3Cbindings%3E%0A%20%20%20%20%20%20%20%20%3Cselect%20itemPath%3D%22results.*%22%20produces%3D%22XML%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinputs%3E%0A%23INPUTS%23%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Finputs%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cexecute%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!%5BCDATA%5B%0A%20var%20loweringselect%20%3D%20%22env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3B%20select%20*%20from%20%23ODTTABLE%23%20where%20%23QUERYPARAMS%23%22%3B%0A%20var%20loweringparams%20%3D%7B%7D%3B%0A%20%23PARAMSPARAMS%23%0A%20var%20loweringquery%20%3D%20y.query%20(loweringselect%2C%20loweringparams)%3B%20%0A%20response.object%20%3D%20%20loweringquery.results%3B%0A%20%5D%5D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%0A%20%20%20%20%20%20%3C%2Fselect%3E%0A%20%23LIFTING%23%0A%20%20%20%20%3C%2Fbindings%3E%20%0A%20%3C%2Ftable%3E%0A');
	var txt= Base64.decode(resp.content);
	var xml = textToXML(txt);
	var ldwname = globalYQLTableName.replace('.xml','.ldw.xml');
	tableTemplate = completeTable (ldwname, globalYQLTableName, xml, tableTemplate);
	anchorInsertTemplateText.innerHTML=tableTemplate;
	fireEvent(anchorInsertTemplate,"click");
	}

function createExample(template, variables, data) {
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
}

function completeTable (ldwname, tablename, xml, tableTemplate){
  anchorTName.value =ldwname;
  var selects = xml.getElementsByTagName( "select" );
	var inputs = selects[0].getElementsByTagName( "key" );
	var sampleQuery = xml.getElementsByTagName( "sampleQuery" );
	var txturipattern = '\t\t<sampleQuery> URIPattern: http://rdf.onekin.org/'+ tablename;
  	var txturiexample = '\n\t\t<sampleQuery> URIExample: http://rdf.onekin.org/'+ tablename;
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

	tableTemplate= tableTemplate.replace ("#ODTTABLE#", tablename);
  tableTemplate= tableTemplate.replace ("#LOWERING#", txtLOWERING);
  tableTemplate= tableTemplate.replace ("#INPUTS#", txtINPUTS);
 tableTemplate= tableTemplate.replace ("#QUERYPARAMS#", txtQUERY);
 tableTemplate= tableTemplate.replace ("#PARAMSPARAMS#", txtPARAMS);
  return tableTemplate;
	}

function showDecoupledYQLTable (resp){
	var txt= Base64.decode(resp.content);
	var xml = textToXML(txt);
	var txturi = '<!--lowering-->\n#LOWERING#\n</meta>';
	txt= txt.replace ("</meta>", txturi);
   	var txtfunction = '\t<function name="lifting">\n\t\t<inputs>\n\t\t  <pipe id="oneXML" paramType="variable" />\n\t\t   <key id="URI" paramType="variable"  required="true"/>\n\t\t</inputs>\n\t\t<execute> <![CDATA[\n\t\t\tvar oneJSON= y.xmlToJson(oneXML);\n\t\t\t\n\t\t\toneJSONLD["@id"]= URI;//context\n\t\tvar oneJSONLD={};\n\t\toneJSONLD["@context"]={};\n\t\toneJSONLD["@context"]["rdfs"]="http://www.w3.org/2000/01/rdf-schema#";\n\t\t\toneJSONLD["@type"]= ...;\n\t\t\toneJSONLD["rdfs:label"]=oneJSON["..."]["..."];\n\t\t\t...\n\t\t\tresponse.object = oneJSONLD;]]>\n\t\t</execute>\n\t</function>\n\t</bindings>';
    txt= txt.replace ("</bindings>", txtfunction);
    var ldwname = globalYQLTableName.replace('.xml','.ldw.xml');
 tableTemplate = completeTable (ldwname, globalYQLTableName, xml, txt);
	anchorInsertTemplateText.innerHTML=tableTemplate;
	fireEvent(anchorInsertTemplate,"click");
	}

function addPublishButton (){
	var container = document.getElementById('file-buttons');
	var elmNewContent = document.createElement('button');
	elmNewContent.id = 'idPublish';
	elmNewContent.setAttribute('class', 'btn btn-primary');
	elmNewContent.setAttribute('title', 'publish');
	elmNewContent.innerHTML = 'Publish';
	anchorFileButtons.parentNode.insertBefore(elmNewContent, anchorFileButtons);
	elmNewContent.addEventListener("click", sendLDW, false);
	}

///////////////////////


function sendLDW(){
	anchors_init();
	if (anchorTempContainer.getAttribute("hidden")!="true"){
		alert ("You must 'save' the file in your private space before 'publish' it.");
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		return;
	}
	var token = anchorLabelSelect.nextSibling.nextSibling.getAttribute("value");
	var user = anchorSalute.innerHTML;
	var envToken = prompt(user + ", is an environment-EXECUTE-key required for derefencing URIs? Paste store://... here.\n A tab will be opened to continue the registration process. Check it please!", "");
	if (envToken==null){
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		return; }
	var url3 = ldwURL+"?user_id="+user+"&file="+token+"&env="+envToken;
	GM_openInTab(url3,true);
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
}

//////////////////////
////ODT Folder
/////////////////////


function loadWrapper(wrapper){
	var wrappertxt = JSON.stringify (wrapper);
	wrappertxt = wrappertxt.substring(1, wrappertxt.length-1);
	var exp = /\\n/g;
   	wrappertxt = wrappertxt.replace(exp,"\n");
	var exp = /\\"/g;
   	wrappertxt = wrappertxt.replace(exp,'"');
	var exp = /\\t/g;
   	wrappertxt = wrappertxt.replace(exp,'\t');
	 anchorInsertTemplateText.innerHTML=wrappertxt;
	fireEvent(anchorInsertTemplate,"click");
}

function clickOnDecoupledAnnotation (){
	var wannotation = readWrapper();
	var url = wannotation["tableurl"];
	if (url == null){
		alert ("Sorry! It is not possible to access the table's ODT description");
	}else{
		callURL(url, function (resp) {showDecoupledAnnotation(resp);});
	}
}


function showEditWrapper (resp){
	var wrapper = JSON.stringify(resp.results);
	anchors_init();
	var wannotation = readWrapper();
	anchorTName.value = wannotation ["tablename"];
	anchorInsertTemplateText.innerHTML=wrapper;
	fireEvent(anchorInsertTemplate,"click");
	}

function showCoupledAnnotation (){
  loadstorageWrapper(showCoupledAnnotationNext);
}

function showCoupledAnnotationNext (tableTemplate){
	anchors_init();
  var wannotation = readWrapper();
	anchorTName.value = wannotation ["tablename"];
	anchorInsertTemplateText.innerHTML=tableTemplate;
	fireEvent(anchorInsertTemplate,"click");
	}

function showDecoupledAnnotation (resp){
	resp= resp.substr (resp.indexOf('<table'), resp.indexOf('</table'));
	resp= resp.substr (0, resp.indexOf('</table')+8);
	var txt = resp;
	var txturi = '<!--lowering-->\n#LOWERING#\n</meta>';
	txt= txt.replace ("</meta>", txturi);
    var txtfunction = '<!--lifting-->\n#LIFTING#\n</bindings>';
    txt= txt.replace ("</bindings>", txtfunction);
    var wannotation = readWrapper();
	tableTemplate = completeTableAnnotation (txt, wannotation);
	anchors_init();
	anchorTName.value = wannotation ["tablename"];
	anchorInsertTemplateText.innerHTML=tableTemplate;
	fireEvent(anchorInsertTemplate,"click");
	}

function completeTableAnnotation (tableTemplate, annotation){
  var inputs = annotation["uripattern"].match(/\{[^}]*\}/g);
  var sampleQuery = annotation["samplequery"];
  var launchedQuery = annotation["launchedquery"];
  var tablename = annotation["tablename"];
  var txturipattern = '\t\t<sampleQuery> URIPattern: '+ annotation["uripattern"]+ '</sampleQuery>';
  	var txturiexample = '\n\t\t<sampleQuery> URIExample: '+ annotation["uriexample"]+ '</sampleQuery>';
  var txtINPUTS = "";
  var txtQUERY ="";
  var txtPARAMS ="";
	var variables =[];
	var first =true;
  for (var i=0; i<inputs.length; i++){
		var inputid= inputs[i];
		inputid = inputid.replace ("\}","");
		inputid = inputid.replace ("\{","");
		variables.push(inputid);
		txtINPUTS +=  '\n\t\t<key id="'+inputid+'" type="xs:string" paramType="variable" required="true"/>';
		if (first){
			first=false;
			txtQUERY += inputid+' =@'+inputid;
		}else{
			txtQUERY += ' AND '+inputid+' =@'+inputid;
		}
	  txtPARAMS += "loweringparams ['"+inputid+"']= "+inputid+";\n";
	}
  var txtLOWERING= txturipattern;
  txtLOWERING+=  txturiexample;
  tableTemplate= tableTemplate.replace ("#ODTTABLE#", tablename);
  	tableTemplate= tableTemplate.replace ("#LOWERING#", txtLOWERING);
  		tableTemplate= tableTemplate.replace ("#INPUTS#", txtINPUTS);
    	tableTemplate= tableTemplate.replace ("#QUERYPARAMS#", txtQUERY);
    	tableTemplate= tableTemplate.replace ("#LAUNCHEDQUERY#", launchedQuery);
    	tableTemplate= tableTemplate.replace ("#PARAMSPARAMS#", txtPARAMS);
  tableTemplate= tableTemplate.replace ("#LIFTING#", createLifting(annotation));
  return tableTemplate;
	}

function createODTFolder (){
	var elmNewContent = document.createElement('div');
	elmNewContent.id = 'dtColumnInner';
	elmNewContent.innerHTML = '<span class="nav-header">Public YQL Tables <span id="count">(0)</span></span> ';
	anchorTempContainer.insertBefore(elmNewContent, anchorTempContainer.firstChild);
    elmNewContent.appendChild(createNewAccordion ());
	hide ('rightView');
  globalTableCount=0;
  anchors_init();
  var obj = readData('folders');
  if (obj == null){
     callURLJSON(yqlgithuburl, function (obj) {getFolders(obj)});
  }else{
    if (Math.random()< globalLowRefreshProb) callURLJSON(yqlgithuburl, function (obj) {getFolders(obj)});
    else getFolders(obj);
  }
	show ('rightView');
}

function getFolders (obj){
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
  anchors_init();
}

function addCount (){
	globalTableCount++;
	anchorCounter.innerHTML= "("+globalTableCount+")";
}

//////
//accordion
/////
function createNewAccordion (){
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
}

function createNewHeadingBody (name){
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
	anchorODTDataAccordion.appendChild(div);
	anchorODTDataAccordion.appendChild(div0);
return ul;
}

function createNewLi (name, folder, url){
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
	var anchor=  document.getElementById(folder+'-id-ul');
	if (anchor == null){anchor = createNewHeadingBody (folder);}
	anchor.insertBefore(li, anchor.firstChild);
	addCount();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///UTILS
/////////////////////////////////////////////////////////////////////////////////////////////////////////


function writeWrapper(globalWrapper){
	writeData ('globalwrapper', globalWrapper);
	}

function readWrapper(){
	var globalWrapper = readData ('globalwrapper');
	if (globalWrapper==null){
	   console.log ('NO GLOBAL WRAPPER DATA STORED');
	  	globalWrapper = JSON.parse('{}');
  		globalWrapper.annotations = JSON.parse('[]');
  		globalWrapper.globalannotation = JSON.parse('{}');
  		globalWrapper.type = JSON.parse('{"type":"..."}');
  		writeWrapper(globalWrapper);
  	}
  	//console.info('readwrapper GlobalWrapper: ' + JSON.stringify(globalWrapper));
  	return globalWrapper;
}

function newWrapper(){
//    var globalWrapper=readWrapper();
//    if (globalWrapper==null){
	  	globalWrapper = JSON.parse('{}');
//	}
	globalWrapper.annotations = JSON.parse('[]');
  	globalWrapper.globalannotation = JSON.parse('{}');
  	globalWrapper.type = JSON.parse('{"type":"..."}');
  	writeWrapper(globalWrapper);
}

function srcURL(obj){
	var res = obj.query.results;
	var globalWrapper=readWrapper();
	if (res == null) {
		globalWrapper['tableurl'] = null;
		writeWrapper(globalWrapper);
		return;
	}
	var src = res.table.src;
	var urlA ="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'";
	var urlB ="'&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	globalWrapper['tableurl']=urlA+src+urlB;
	writeWrapper(globalWrapper);
}

/////////////////////////
////Launch events
////////////////////////

function launchDesc(e){
var select = e.target.getAttribute("desc");
anchorqid.value = select;
fireEvent(anchorSubmitMeButton,"click");
}


  function launchEdit(e){
  var target= e.target;
  e.preventDefault ? e.preventDefault() : e.returnValue = false;
  e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
  globalLDWurl = target.getAttribute("tableurl");
  newWrapper();
  callURL(globalLDWurl, function (obj) {launchingEdit(obj)});
  }


  function launchingEdit (obj){
  var xml = obj;
  savestorageWrapper(xml);
  openCoupledLDW ();
    }

function launchURI(e){
  var target= e.target;
  e.preventDefault ? e.preventDefault() : e.returnValue = false;
  e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
  globalLDWurl = target.getAttribute("tableurl");
  //newWrapper();
  callURL(globalLDWurl, function (obj) {launchingURI(obj)});
  }

  function launchingURI (obj){
  var xml = obj;
  obj = obj.toLowerCase();
  var uripattern=obj.substring(obj.indexOf("uripattern:"),obj.length);
  uripattern=uripattern.substring(11, uripattern.indexOf("</")).trim();
  var uriexample=obj.substring(obj.indexOf("uriexample:"),obj.length);
  uriexample=uriexample.substring(11, uriexample.indexOf("</")).trim();
  anchorqid.value = uriexample;
  var uriexample2 = uriexample;
  var uripattern2 = uripattern;
  if (uripattern.indexOf("//")>-1){
  	uripattern=uripattern.substring(uripattern.indexOf("//")+2, uripattern.length);
  	uripattern=uripattern.substring(uripattern.indexOf("/")+1, uripattern.length);
  }
  if (uriexample.indexOf("//")>-1){
  	uriexample=uriexample.substring(uriexample.indexOf("//")+2, uriexample.length);
  	uriexample=uriexample.substring(uriexample.indexOf("/")+1, uriexample.length);
  }
  if (uriexample.indexOf("/")==0){
  	uriexample=uriexample.substring(uriexample.indexOf("/")+1, uriexample.length);
  }
  if (uripattern.indexOf("/")==0){
  	uripattern=uripattern.substring(uripattern.indexOf("/")+1, uripattern.length);
  }
    globalSignaler[RDFANNOTATION] =true;
    globalSignaler[XMLREANNOTATION]=false;
    globalSignaler[XMLANNOTATION]=false;
    anchorYqlurl.value = uriexample;
    var select = createSelect (uripattern, uriexample);
    var table=uriexample.substring(0, uriexample.indexOf("/"));
    ldwquery = select + "| " + table + ".lifting('"+uriexample2+"')";
    setGlobalData (uriexample2, uripattern2, select, select, ldwquery, table, xml);
    fireEvent(annotationButton,"click");
  }


function launchExampleURI(e){
var target= e.target;
e.preventDefault ? e.preventDefault() : e.returnValue = false;
e.stopPropagation ? e.stopPropagation() : e.returnValue = false;
globalLDWurl = target.getAttribute("tableurl");
newWrapper();
callURL(globalLDWurl, function (obj) {launchingExampleURI(obj)});
}


function launchingExampleURI (obj){
var xml = obj;
//savestorageWrapper(xml);
//extraer el uriexample.
obj = obj.toLowerCase();
var uripattern=obj.substring(obj.indexOf("uripattern:"),obj.length);
uripattern=uripattern.substring(11, uripattern.indexOf("</")).trim();
var uriexample=obj.substring(obj.indexOf("uriexample:"),obj.length);
uriexample=uriexample.substring(11, uriexample.indexOf("</")).trim();
if (uripattern.indexOf("//")>-1){
	uripattern=uripattern.substring(uripattern.indexOf("//")+2, uripattern.length);
	uripattern=uripattern.substring(uripattern.indexOf("/")+1, uripattern.length);
}
if (uriexample.indexOf("//")>-1){
	uriexample=uriexample.substring(uriexample.indexOf("//")+2, uriexample.length);
	uriexample=uriexample.substring(uriexample.indexOf("/")+1, uriexample.length);
}
if (uriexample.indexOf("/")==0){
	uriexample=uriexample.substring(uriexample.indexOf("/")+1, uriexample.length);
}
if (uripattern.indexOf("/")==0){
	uripattern=uripattern.substring(uripattern.indexOf("/")+1, uripattern.length);
}
//crear la select.
var select = createSelect (uripattern, uriexample);
logit(select);
var select2=select;
var find = "use.* as";
var re = new RegExp(find, 'ig');

/////
var str = select.match("where((.|\n)*)");
str =  str[1];
res = formatDataPiece (str);
var select2=select;
var firstly = true;
var tokens = readStorageTokens();
executeToken = tokens.executeToken;
var ldwquery = "use '"+executeToken+"' as t; select * from t";
for (var i=0; i< res.length; i++){
    var res2 = res[i].split("=");
  var datapiece1 = getDataPiece(res2[1]);
  var datapiece2 = getDataPiece(res2[0]);
  select2=  replaceDataPiece(select2, datapiece1, '@'+datapiece2);
  if (firstly){
    firstly=false;
    ldwquery = ldwquery + " where " + datapiece2 + "= '" + datapiece1 + "'";
  }else{
    ldwquery = ldwquery + " and " + datapiece2 + "= '" + datapiece1 + "'";
  }
}
ldwquery = ldwquery + " | t.lifting('http://rdf.onekin.org/"+uriexample+"')";
anchorURIPattern.value = uripattern;
anchorURIExample.value = uriexample;
logit (ldwquery);
anchorqid.value = select;
  checkSelectPermanence();
  resetSignalers();
  globalSignaler[ANNOTATED] =true;
  globalSignaler[XMLREANNOTATION]=true;
  var url1 = 'https://query.yahooapis.com/v1/public/yql?q=';
  var url2 = "&debug=true&format=json&callback=&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  var url = url1+select+url2;
  anchorYqlurl.value = url;
  var table=uriexample.substring(0, uriexample.indexOf("/"));
  setGlobalData ('http://rdf.onekin.org/'+uriexample, 'http://rdf.onekin.org/'+uripattern, select, select2, ldwquery, table, xml);
  //  callURLJSON(url, setReAnnotationViewXML);
  fireEvent(annotationButton,"click");
}

function setAnnotationViewR2R(json){//incrementar annotaciones.  IKER fijar las anotacione existentes.
  //anchorAnnotationViewContent.style.display = "block";
  globalResultsElement=false;
  globalSource = json;
  //var processed = '{'+iterateJsonPathR2R(json.query.results.result, '', 0) +"}";
  var processed = '{'+iterateJsonPathR2R(json.query.results.json, '', 0) +"}";
  anchorAnnotationViewContent.innerHTML=processed;
  IterateAnnotationsEvents();
  createCleanAnnotation ();//señalar que es un wrapper
  anchors_init();
  //fireEvent(annotationButton,"click");
  //loadstorageWrapper(blockAnnotated)
}

function setAnnotationViewXML(json){//incrementar annotaciones.  IKER fijar las anotacione existentes.
  createAnnotationView(json)
  //señalar que es un wrapper
  anchors_init();
  fireEvent(annotationButton,"click");
  //loadstorageWrapper(blockAnnotated)
}

function createSelect (pattern, example){
    var table=example.substring(0, example.indexOf("/"));
  	var select = "use '"+globalLDWurl+"' as "+table+"; select * from " + table ;
  	var first = true;

	var list = patternMatches (pattern, example);
  for (var name in list) {
    console.info('p9 '+name);
      var value = list[name];
  		if(list.hasOwnProperty(name) ) {
        console.info('p91 '+value);
        if (first){
  			  select += " where " + name +"= '"+ value +"'";
  			  first = false;
  		  }else{
  			  select += " and "+ name +"= '"+ value+"'";
  		    }
        }
      }
	return select;
}

function uriMatchesPattern (pattern, example){
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
}

function patternMatches (pattern, example){
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
}

//////
function resetSignalers(){
  globalSignaler[ANNOTATED]=false;
  globalSignaler[PUSHEDANNOTATIONBUTTON]=false;
  globalSignaler[XMLANNOTATION]=false;
  globalSignaler[XMLREANNOTATION]=false;
  globalSignaler[RDFANNOTATION]=false;
  globalSignaler[RENEWANNOTATION]=false;
  consoleGlobalSignalers();
}

function checkSelectPermanence(){
  anchors_init();
  var quidValue = anchorqid.value;
  var newquidHash = hashIt (quidValue);
  var chkvalue = globalquidHash == newquidHash;
  if (!chkvalue){
    globalSignaler[RENEWANNOTATION]=true;
  	globalquidHash = newquidHash;
  }
  return chkvalue;
}


function creatingSemanticView(){
  checkSelectPermanence();
   if (!globalSignaler[PUSHEDANNOTATIONBUTTON] || globalSignaler[RENEWANNOTATION]){
     disableLDWGenerationButton();
     return;
  }
  anchorSemanticViewContent.innerHTML="Loading data....";
  annotateLowering();
  showVisualElementsSemanticView();
  var w = anchorYqlurl.offsetWidth - 10;
  var h =anchorOutputTabContent.offsetHeight-(anchorYqlurl.offsetHeight * 7);
  anchorSemanticViewContent.style.height =h+"px";
  anchorSemanticViewContent.style.width =w+"px";
  if (!globalSignaler[ANNOTATED]){
   	anchorSemanticViewContent.innerHTML = "";
   	alert ('First you must work on the Annotation View');
    return;
}
  enableLDWGenerationButton();
  createIndividual();
}

function createIndividual() {
   var select = anchorqid.value;
   var lowselect = select.toLowerCase();
  var begin = lowselect.indexOf ('from');
   var end = lowselect.indexOf ('where');
   //var newselect = select.substring (0, begin+5) + ' t ' + select.substring (end)+ " | t.lifting('"+anchorURIExample.value+"')";
   var globalWrapper=readWrapper();
	var newselect = globalWrapper['ldwquery'];
   // If it gets too big it needs to be a post...
   var url = "https://query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent(newselect)+ "&format=json&diagnostics=false&debug=true&callback=";
   callURLJSON(url, function (resp) {individualLoaded(resp);});
}

function individualLoaded(resp){
  var h = resp.query.results.result;

  h= JSON.stringify(h);
  anchorSemanticViewContent.innerHTML=linkify(h);
}

function findElementClass(tagname, text){
    var elems = document.getElementsByTagName(tagname);
    for(var i = 0; i < elems.length; i++){
      var elm = elems[i];
      if(elm.getAttribute ("class") !== text) continue;
      return elm;
    }
	return null;
}

function findElement(tagname, text){
    var elems = document.getElementsByTagName(tagname);
    for(var i = 0; i < elems.length; i++){
      var elm = elems[i];
      if(elm.innerHTML !== text) continue;
      return elm;
    }
	return null;
}


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
      } catch ( e ) {
        // suppress
      }
    }

//
 // trigger a DOM event via script
 // @param {Object,String} element a DOM node/node id
 // @param {String} event a given event to be fired - click,dblclick,mousedown,etc.
 //

var fireEvent = function(element, event) {
    var evt;
    var isString = function(it) {
        return typeof it == "string" || it instanceof String;
    }
    element = (isString(element)) ? document.getElementById(element) : element;
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
}

///operations on elements

function eraseElement (name){
	var elmDeleted = document.getElementById(name);
	elmDeleted.parentNode.removeChild(elmDeleted);
}

function addIn (parentname, elmNewContent){
	var elmFoo = document.getElementById(parentname);
	elmFoo.parentNode.insertBefore(elmNewContent, elmFoo);
}

function hide (name){
	var elmDeleted = document.getElementById(name);
	elmDeleted.style.visibility = "hidden";
	elmDeleted.style.zIndex = "-999";
}

function show (name){
	var elmDeleted = document.getElementById(name);
	elmDeleted.style.visibility = "";
	elmDeleted.style.zIndex = "1";
}


/////////////////////
//////Semantic Viever
///////////////////

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



/////////////////////
//////YQL Storage
///////////////////

function readStorageTokens(){
	var tokens = readData ('storagetokens');
//var tokens = null;
	if (tokens == null){
  		newstorage();
  }
  return tokens;
}

function newed(response) {
   var inserted = response.query.results.inserted;
   executeToken = inserted.execute;
   selectToken = inserted.select;
   updateToken = inserted.update;
   writeData ('storagetokens', {'executeToken':executeToken, 'selectToken': selectToken, 'updateToken':updateToken});
   consoleTokens();
}

function newstorage() {
   var url = "https://query.yahooapis.com/v1/public/yql?q=insert%20into%20yql.storage.admin%20(value)%20values%20('iker%20')&format=json&callback=";
   callURLJSON(url, function (resp) {newed (resp);});
}

function clearStorage() {
   savestorageWrapper("");
}

function savestorage() {
  var value =createCoupledWrapper();
  savestorageWrapper(value);
}

 function savestorageWrapper(xml) {
 var value = xml;
 var tokens = readStorageTokens();
 updateToken = tokens.updateToken;
 var name = updateToken;
      // If it gets too big it needs to be a post...
      var url = "https://query.yahooapis.com/v1/public/yql?q=update%20yql.storage%20set%20value%3D%40value%20where%20name%3D%40name&format=json&diagnostics=false&callback=&value=" + encodeURIComponent(value) + "&name=" + encodeURIComponent(name);
     callURLJSON(url, function (resp) { logit (JSON.stringify(resp));});

    }

 function loadstorageWrapper(callback) {
   var tokens = readStorageTokens();
   selectToken = tokens.selectToken;
   var name = selectToken;
   var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yql.storage%20where%20name%3D%40name&format=json&diagnostics=false&callback=&name="+name;
   callURLJSON(url, function (resp) {callback(resp.query.results.result.value)});
    }

function createCoupledWrapper (){
//	var tableTemplate= undecode('%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%20%20%20%20%20%20%3Ctable%20xmlns%3D%22http%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fschema%2Ftable.xsd%22%3E%0A%20%20%20%20%3Cmeta%3E%0A%20%20%20%20%20%20%20%20%3Cauthor%3E%3C!--%20your%20name%20or%20company%20name%20--%3E%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3E%3C!--%20description%20of%20the%20table%20--%3E%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3E%3C!--%20url%20for%20API%20documentation%20--%3E%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3E%3C!--%20url%20for%20getting%20an%20API%20key%20if%20needed%20--%3E%3C%2FapiKeyURL%3E%0A%20%20%20%20%20%20%20%20%3C!--lowering--%3E%0A%23LOWERING%23%0A%20%20%20%20%3C%2Fmeta%3E%0A%20%20%20%20%3Cbindings%3E%0A%20%20%20%20%20%20%20%20%3Cselect%20itemPath%3D%22results.*%22%20produces%3D%22XML%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinputs%3E%0A%23INPUTS%23%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Finputs%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cexecute%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!%5BCDATA%5B%0A%20var%20q%20%3D%20%22env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3B%20select%20*%20from%20%23ODTTABLE%23%20where%20%23QUERYPARAMS%23%22%3B%0A%20var%20params%20%3D%7B%7D%3B%0A%20%23PARAMSPARAMS%23%0A%20var%20query%20%3D%20y.query%20(q%2Cparams)%3B%20%0A%20response.object%20%3D%20%20query.results%3B%0A%20%5D%5D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%0A%20%20%20%20%20%20%3C%2Fselect%3E%0A%20%23LIFTING%23%0A%20%20%20%20%3C%2Fbindings%3E%20%0A%20%3C%2Ftable%3E%0A');
	var tableTemplate= undecode('%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%20%20%20%20%20%20%3Ctable%20xmlns%3D%22http%3A%2F%2Fquery.yahooapis.com%2Fv1%2Fschema%2Ftable.xsd%22%3E%0A%20%20%20%20%3Cmeta%3E%0A%20%20%20%20%20%20%20%20%3Cauthor%3E%3C!--%20your%20name%20or%20company%20name%20--%3E%3C%2Fauthor%3E%0A%20%20%20%20%20%20%20%20%3Cdescription%3E%3C!--%20description%20of%20the%20table%20--%3E%3C%2Fdescription%3E%0A%20%20%20%20%20%20%20%20%3CdocumentationURL%3E%3C!--%20url%20for%20API%20documentation%20--%3E%3C%2FdocumentationURL%3E%0A%20%20%20%20%20%20%20%20%3CapiKeyURL%3E%3C!--%20url%20for%20getting%20an%20API%20key%20if%20needed%20--%3E%3C%2FapiKeyURL%3E%0A%20%20%20%20%20%20%20%20%3C!--lowering--%3E%0A%23LOWERING%23%0A%20%20%20%20%3C%2Fmeta%3E%0A%20%20%20%20%3Cbindings%3E%0A%20%20%20%20%20%20%20%20%3Cselect%20itemPath%3D%22results.*%22%20produces%3D%22XML%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinputs%3E%0A%23INPUTS%23%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Finputs%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cexecute%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C!%5BCDATA%5B%0A%20var%20loweringselect%20%3D%20%22env%20%27store%3A%2F%2Fdatatables.org%2Falltableswithkeys%27%3B%20%23LAUNCHEDQUERY%23%22%3B%0A%20var%20loweringparams%20%3D%7B%7D%3B%0A%20%23PARAMSPARAMS%23%0A%20var%20loweringquery%20%3D%20y.query%20(loweringselect%2Cloweringparams)%3B%20%0A%20response.object%20%3D%20%20loweringquery.results%3B%0A%20%5D%5D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fexecute%3E%0A%20%20%20%20%20%20%3C%2Fselect%3E%0A%20%23LIFTING%23%0A%20%20%20%20%3C%2Fbindings%3E%20%0A%20%3C%2Ftable%3E%0A%0A');
if (globalSignaler[XMLREANNOTATION]){
  var globalWrapper=readWrapper();
  tableTemplate=globalWrapper['wrapperxml'];
  var begin = tableTemplate.indexOf('<function');
  var end = tableTemplate.indexOf('</bindings');
  tableTemplate = tableTemplate.substr(0,begin)+'#LIFTING#'+tableTemplate.substr(end);
}
	var wannotation = readWrapper();
	tableTemplate = completeTableAnnotation (tableTemplate, wannotation);
	anchors_init();
	return tableTemplate;
	}

    //////////////////////////
	//// LDW Folder
	//////////////////////////

function createLDWFolder (){
anchors_init();
 	anchordtAccordion.insertBefore(createNewLDWAccordion (), anchordtDefaultContainer);
 globalTableCount=0;
  anchors_init();
   var obj = readData('ldwfolders');
  if (obj == null || Math.random()< globalHighRefreshProb){
     callURLJSON(ldwgithuburl, function (obj) {getLDWFolders(obj)});
  }else{
      	getLDWFolders(obj);
      }
 }

function getLDWFolders (obj){
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
        var anchor=  document.getElementById(folder+'-id-ul');
       	if (anchor == null){anchor = createNewLDWHeadingBody (folder);}
       	anchor.appendChild(li);
       	addCount();
				}
			}
	}
	anchors_init();
  resizeLDWFolder();
}

function createNewLDWAccordion (){
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
}

function createNewLDWHeadingBody (name){
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
	anchorODTDataAccordion.appendChild(divldw);
return ul;
}

function createNewLDWLi (name, folder, url, annurl){
   var li = document.createElement('li');
   li.id=name;
   li.setAttribute("tableurl",url);
   li.setAttribute("annotationurl",annurl);

	li.setAttribute("class","datatableNode "+folder);
	var a3 = document.createElement('a');
	a3.setAttribute("data-rapid_p","7");
	a3.setAttribute("title",name);
	a3.innerHTML= name;
	a3.setAttribute("tableurl","https://raw.githubusercontent.com/onekin/ldw/master/"+folder+"/"+name);
    a3.addEventListener("click", launchExampleURI, false);
	var a22 = document.createElement('span');
	a22.setAttribute("class","label");
	a22.setAttribute("style","display: display: inline-block;");
	var a = document.createElement('a');
	a.setAttribute("data-rapid_p","9");
	a.setAttribute("class","src rapidnofollow");
	a.setAttribute("data-ylk","slk:source "+name);
	a.setAttribute("target","_blank");
	a.setAttribute("href","https://raw.githubusercontent.com/onekin/ldw/master/"+folder+"/"+name);
	a.innerHTML= 'src';
	a22.appendChild (a);
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

/*	var a23 = document.createElement('a');
	a23.setAttribute("data-rapid_p","8");
	a23.setAttribute("class","label rapidnofollow");
	a23.setAttribute("data-name",name);
	a23.setAttribute("data-ylk","slk: "+name);
	a23.setAttribute("tableurl","https://raw.githubusercontent.com/onekin/ldw/master/"+folder+"/"+name);
  a23.setAttribute("target","_blank");
	a23.innerHTML= 'URI';
	a23.addEventListener("click", launchURI, false);
*/

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
	a21.appendChild (a22);
	a21.appendChild (a23);
	li.insertBefore(a21, li.firstChild);
	li.insertBefore(a3, li.firstChild);
  return li;
}

function resizeLDWFolder(){
  var w = anchordtAccordion.offsetWidth +5;
  var h =anchordtAccordion.offsetHeight;
  anchorODTDataAccordion.style.height =h+"px";
  anchorODTDataAccordion.style.width =w+"px";
}

function blockingAnnotated(el){//IKER
	var color = 'LightCoral';
	el.setAttribute('style', 'background-color:'+color);
	el.setAttribute('class', 'blocked');
	el.setAttribute ('disabled','active');
}

function blockAnnotated (wrapper){
  if (wrapper.indexOf ('@type')>0){
		blockingAnnotated(document.getElementById("results"));
	}
  y.log('va')
	var re = /=\s*oneJSON[^;=]*/ig;
	var m = wrapper.match(re);
    if (m){
	for (var i= 0; i<m.length; i++) {
		value = m[i].trim();
		var begin = value.indexOf ("[");
		value = value.substring	(begin);
		blockingAnnotated(document.getElementById(value));
	}
	}
 }

function creatingReannotation (wrapper){
//  wrapper = JSON.stringify(wrapper);
  wrapper = wrapper.substr(wrapper.indexOf('"lifting"'));
  var annotation = {};
//	var re = /\\n/;
  var m = wrapper.match(/^.*((\r\n|\n|\r)|$)/gm);
//  var m = wrapper.split( /\\n/);
logit(m);
 if (m){
	for (var i= 0; i<m.length; i++) {
		var line = m[i].trim();
		if (getTypetion(line)>0){
        console.info(i+' line ' + line);
        annotateIt (line);
      }
	}
	}
 }

function getTypeClass (txt){
  var res='';
  try{
  var re = /=\s'[^']*/ig;
  var m = txt.match(re);
  var re = /'[^']*/ig;
  var m = m[0].match(re);
  var res = m[0].replace(/'/g, '');
}catch (error){
  return null;
}
return res;
}

function getProperty (txt){
  var res;
  txt = txt.replace(/ /g, '');
  try{
    var re = /onejsonld[^\]]*/ig;
  //var re = /'.*'\S=/ig;
//  var m = txt.match(re);
//  var res = m[0].replace(/'/g, '');
//  var res = res.replace(/\]=/g, '');
  var m = txt.match(re);
  var res = m[0].replace(/'/g, '');
  var res = res.replace(/onejsonld/ig, '');
  var res = res.replace(/\[/g, '');
  logit('PROP: '+res)
}catch (error){
  logit('PROP NO: '+txt)

  return null;
}
return res;
}

function getPath (txt){
  var res;
  try{
  var re = /onejson\['.*'\]/ig;
  var m = txt.match(re);
  var res = m[0].replace(/onejson/ig, '');
}catch (error){
  return null;
}
return res;
}

function getTypeJLD (txt){
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
}

function getInterlink(txt){
  var res;
  try{
  var re = /\'http[^\']*/ig;
  var m = txt.match(re);
  res = m[0].replace(/\'/g, "");
}catch (error){
  return null;
}
return res;
}

function getRegexp(txt){
    var res;
    try{
      var re = /,[^\']*\)/ig;
      var m = txt.match(re);
      res = m[0].replace(/,/g, "");
      res = res.replace(/\)/g, "");
    res = res.trim();
    }catch (error){
      return null;
    }
    if (res) res = Base64.encode(res);
    return res;
  }

function getContext(txt){
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
        console.log(error);
        return contJS;
      }
      return contJS;
    }

    function getPrefix(txt){
      var res = txt.split(":");
      var prefix = null;
      if (res[1]) prefix= res[0];
      return prefix;
    }

    function getClas(txt){
      var res = txt.split(":");
      var clas = null;
      if (res[1]) clas= res[1];
      return clas;
    }

function getOntologyUri(txt){
  logit("get onto1: " + txt);
  if (txt == null) return null;
  var onto = contextJS[txt]
  logit("get onto2: " + onto);
  return onto;
}

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
  txt = txt.replace(/ /g, '');
  txt= txt.toLowerCase();
  if (txt.indexOf("onejsonld['@context']")>-1) return typeCONTEXT;
  if (txt.indexOf("onejsonld['@type']")>-1) return typeTYPE;
  if (txt.indexOf("onejsonld['@id']")>-1 || txt.indexOf("onejsonld['@context']")>-1 || txt.indexOf("varloop=")>-1 ) return typeNULL;
  if (txt.indexOf("['@type']")>-1) return typeEMBEDDEDTYPE;
  if (txt.indexOf("['@id']")>-1) return typeEMBEDDEDID;
  if (txt.indexOf("onejsonld['")>-1 && txt.indexOf("=[]")==-1) return typeNORMAL;
  if (txt.indexOf("=get")==-1 && txt.indexOf("=[]")==-1 && (txt.indexOf("']=")>-1 || txt.indexOf("'].push")>-1)) return typeEMBEDDEDPROPERTY;
  return typeNULL;
}

function annotateIt (line){
//@type
var globalWrapper=readWrapper();
var j={};
var typetion=getTypetion(line);
logit(typetion);
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
    globalWrapper.type = j;
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
      globalWrapper.annotations.push(j);
      globalWrapper.globalannotation=annotateJSON(j.path, j, globalWrapper.globalannotation);
      embeddedElementContainner[oneJLD]= null;
    }
 }
 if (typeEMBEDDEDID == typetion){
   var path = getPath(line);
   var attribute = path;
   var uripattern = getInterlink(line);
   var regex = getRegexp(line);
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
     globalWrapper.annotations.push(j);
     globalWrapper.globalannotation=annotateJSON(j.path, j, globalWrapper.globalannotation);
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
    globalWrapper.annotations.push(j);
    globalWrapper.globalannotation=annotateJSON(j.path, j, globalWrapper.globalannotation);
    embeddedElementContainner[oneJLD]= null;
  }
}
//others
//  var j = '{"type":"normal","ontologyprefix":"'+ontprefix+'","ontologyuri":"'+onturi+'","property":"'+anchorFormProperties.value+'","dataset":"'+dataSetValue+'","path":"'+path+'", "regex":"'+re+'"}';
if (typeNORMAL == typetion){
  logit('m1');
  var property = getProperty(line);
  logit('m12');
  var ontologyprefix = getPrefix(property);
  logit('m13');
  var ontologyuri = getOntologyUri(ontologyprefix);
  logit('m14');
  var path = getPath(line);
  logit('m15');
  var uripattern = getInterlink(line);
  logit('m16');
  var regex = getRegexp(line);
  logit('m17');
  var j = {};
  j["type"]="normal";
  j["property"]=property;
  j["ontologyprefix"]=ontologyprefix;
  j["ontologyuri"]=ontologyuri;
  j["path"]=path;
  j["attribute"]=attribute;
  j["uripattern"]=uripattern;
  j["regex"]= regex;
  globalWrapper.annotations.push(j);
  globalWrapper.globalannotation=annotateJSON(j.path, j, globalWrapper.globalannotation);
}
if (typeCONTEXT == typetion){
  contextJS = getContext(line);
}
writeWrapper(globalWrapper);
}

 function linkify2(txt){
    var exp = /htt[^"]*/g;
     txt = txt.replace(exp,"<a href='$1'>$1</a>");
     exp = /,/g;
     txt = txt.replace(exp,"\n");
     return txt;
 }

 function linkify(text){
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
 }

 function linkify2(txt){
    var exp = /htt[^"]*/g;
     txt = txt.replace(exp,"<a href='$1'>$1</a>");
     exp = /,/g;
     txt = txt.replace(exp,"\n");
     return txt;
 }

 function linkify(text){
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
 }

function consoleGlobalSignalers(){
  console.log ('ANNOTATED '+globalSignaler[ANNOTATED]);
  console.log ('PUSHEDANNOTATIONBUTTON: ' + globalSignaler[PUSHEDANNOTATIONBUTTON]);
  console.log ('XMLANNOTATION' +globalSignaler[XMLANNOTATION]);
  console.log ('XMLREANNOTATION '+globalSignaler[XMLREANNOTATION]);
  console.log ('RDFANNOTATION '+globalSignaler[RDFANNOTATION]);
  console.log ('RENEWANNOTATION ' +globalSignaler[RENEWANNOTATION]);
}

function consoleTokens(){
    var tokens = readStorageTokens();
    executeToken = tokens.executeToken;
 		selectToken = tokens.selectToken;
		updateToken = tokens.updateToken;
  console.log('executeToken: '+executeToken);
  console.log('selectToken: '+selectToken);
  console.log('updateToken: '+updateToken);
}

function logit(txt){
    console.log (txt);
}

console.log('the end');
