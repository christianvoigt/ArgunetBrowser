Argunet Browser
===============

Argunet Browser is an embeddable Javascript widget that visualizes Argunet argument maps (www.argunet.org) on the Html Canvas, allowing users to surf through complex debates. The widget reads .graphml maps that can be exported from Argunet Editor and creates a force directed graph using Arbor.js (http://arborjs.org/) and EaselJS (http://www.createjs.com/#!/EaselJS).

Try out a Demo here: http://christianvoigt.github.com/ArgunetBrowser/

For further information about Argument Maps, visit www.argunet.org


1. License
----------

Argunet Browser is released under the MIT license. http://en.wikipedia.org/wiki/MIT_License

2. Deployment
-------------
There are three different ways in which Argunet Browser can be deployed.

###2.1 The easy way

First, you will need an argument map in Argunet's graphml format and decide, which node should be selected first. Look up the nodes' id in the graphml file and copy it. Then you only have to paste the following code into your page to load the map with ArgunetBrowser:

	<script src="http://christianvoigt.github.com/ArgunetBrowser/lib/ArgunetBrowser.load.min.js" type="text/javascript"></script>
	<script type="text/javascript">
		argunet("createArgunetBrowser",{debateUrl:"[PATH-TO-YOUR-MAP]", firstNode:"[ID-OF-FIRST-NODE-TO-SELECT]"});
	</script>		

By default, Argunet Browser will be inserted after the script tag that loads ArgunetBrowser.load.min.js.

###2.2 Hosting the files

If you want to host all the files on your own server, you can also download the repository and upload the /lib directory to your own webspace. You can even put the ArgunetBrowser.min.css into your default css folder. To load Argunet Browser from your own webspace use the following embed code (after changing the paths in the code):

```html
	<script type="text/javascript">
		window.lightningjs||function(c){function g(b,d){d&&(d+=(/\?/.test(d)?"&":"?")+"lv=1");c[b]||function(){var i=window,h=document,j=b,g=h.location.protocol,l="load",k=0;(function(){function b(){a.P(l);a.w=1;c[j]("_load")}c[j]=function(){function m(){m.id=e;return c[j].apply(m,arguments)}var b,e=++k;b=this&&this!=i?this.id||0:0;(a.s=a.s||[]).push([e,b,arguments]);m.then=function(b,c,h){var d=a.fh[e]=a.fh[e]||[],j=a.eh[e]=a.eh[e]||[],f=a.ph[e]=a.ph[e]||[];b&&d.push(b);c&&j.push(c);h&&f.push(h);return m};
return m};var a=c[j]._={};a.fh={};a.eh={};a.ph={};a.l=d?d.replace(/^\/\//,(g=="https:"?g:"http:")+"//"):d;a.p={0:+new Date};a.P=function(b){a.p[b]=new Date-a.p[0]};a.w&&b();i.addEventListener?i.addEventListener(l,b,!1):i.attachEvent("on"+l,b);var q=function(){function b(){return["<head></head><",c,' onload="var d=',n,";d.getElementsByTagName('head')[0].",d,"(d.",g,"('script')).",i,"='",a.l,"'\"></",c,">"].join("")}var c="body",e=h[c];if(!e)return setTimeout(q,100);a.P(1);var d="appendChild",g="createElement",
i="src",k=h[g]("div"),l=k[d](h[g]("div")),f=h[g]("iframe"),n="document",p;k.style.display="none";e.insertBefore(k,e.firstChild).id=o+"-"+j;f.frameBorder="0";f.id=o+"-frame-"+j;/MSIE[ ]+6/.test(navigator.userAgent)&&(f[i]="javascript:false");f.allowTransparency="true";l[d](f);try{f.contentWindow[n].open()}catch(s){a.domain=h.domain,p="javascript:var d="+n+".open();d.domain='"+h.domain+"';",f[i]=p+"void(0);"}try{var r=f.contentWindow[n];r.write(b());r.close()}catch(t){f[i]=p+'d.write("'+b().replace(/"/g,
String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};a.l&&q()})()}();c[b].lv="1";return c[b]}var o="lightningjs",k=window[o]=g(o);k.require=g;k.modules=c}({});
window.argunet = lightningjs.require("argunet", "[YOUR-PATH-TO-ArgunetBrowser.load.min.js]");
		argunet("createArgunetBrowser",{debateUrl:"[PATH-TO-YOUR-MAP]", firstNode:"[ID-OF-FIRST-NODE-TO-SELECT]", jsUrl:"[YOUR-PATH-TO-THE-LIB-FOLDER]",cssUrl:"[YOUR-PATH-TO-ArgunetBrowser.min.css]", htmlElement:"[#HTML-ID]"});
	</script>		
```	

###2.3 Loading ArgunetBrowser directly

By default, Argunet Browser is loaded into an iframe via the lightningjs-Loader. This prevents it from blocking the loading process of your site and interfering with your own code. But in some cases it may be useful to load ArgunetBrowser directly into your page. You can do this by using the following steps:


1. Copy the contents of /lib to your webspace.
3. Include ArgunetBrowser.min.js at the end of the body section of your html page:

```html
    <script src="lib/ArgunetBrowser.min.js" type="text/javascript"></script>
```	

4. Upload your debate in graphml format to your webspace. You can export any debate from Argunet Editor into this format.
5. Instantiate Argunet Browser in your html page, at the end of your body section:
    
```html
    <script type="text/javascript">
    	$(function() { //Jquery's document ready event
    		new argunet.ArgunetBrowser({mapUrl: "yourmap.graphml", firstNode:"[NODE-ID]", htmlElement:"[#HTML-ID]", embedded:false);
    	});	
    </script>
```

###2.4 Testing locally: Don't use Google Chrome
In its default mode Google Chrome doesn't allow us to load local xml files with Javascript. If yout want to test Argunet Browser locally, please use another browser or start Chrome with the following parameters (this example is for OSX): 
	
```
		/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files --enable-webgl --ignore-gpu-blacklist %U    
```
    
###Parameters

ArgunetBrowser accepts the following parameters/options: 

**`argunet("createArgunetBrowser",{debateUrl: , htmlElement: , firstNode: , width: , height: , jsUrl, cssUrl: , embedd:})`**
**`new ArgunetBrowser(debateUrl, htmlElement, firstNode, width, height, jsUrl, cssUrl, embedded)`**
**`new ArgunetBrowser({debateUrl: , htmlElement: , firstNode: , width: , height: , jsUrl, cssUrl: , embedd:})`**
				
<dl>
<dt>debateUrl:</dt> 
<dd>The url to your .graphml file.</dd>

<dt>htmlElement:</dt> 
<dd>The html element into which the Argunet Browser widget should be placed (or a jquery selector for this element, i.e. "#id").</dd>

<dt>firstNode:<dt> 
<dd>The Argunet id of the first node to be selected. If firstNode is undefined Argunet Browser will simply select the first node in your .graphml file.</dd> 

<dt>width:<dt> 	
<dd>The width of the Argunet Browser widget. Default is 640.</dd>

<dt>height:</dt>
<dd>The height of the Argunet Browser widget. Default is 385.</dd>
</dl>

<dt>cssPath:</dt>
<dd>By default Argunet Browser assumes that the ArgunetBrowser.min.css can be found in the same directory as ArgunetBrowser.min.js and embeds it dynamically so that you don't have to take care of it. If you want to put the ArgunetBrowser.min.css into another directory than ArgunetBrowser.min.js you can either embed the stylesheet directly into your html page or set the cssPath to the css's url. In the former case Argunet Browser will recognize that the css has already been loaded.</dd>
</dl>

###Methods

**`selectNode(nodeId)`**

Selects a node in the graph.

<dl>
<dt>nodeId:</dt><dd>the Argunet id of the node to select.</dd>
</dl>

Example:

```html
    <a href='' id='nodeSelectionTest'>Select Node</a>
    <script type="text/javascript">
    $(function() { //Jquery's document ready event
    	var argunetBrowser = new argunet.ArgunetBrowser("yourmap.graphml",$("#htmlId"));
    	$("#nodeSelectionTest").click(function(evt){ //Jquery's click handler
    		argunetBrowser.selectNode("501839"); //change this to an argunet node id of your debate
    		evt.preventDefault();
    	});
    });	
    </script>
```
	
**`addEventListener(eventType, listener)`**

<dl>
<dt>eventType:</dt><dd>The type of the event. ArgunetBrowser dispatches the following events: mousedown, dblclick, nodeSelection.</dd>
<dt>listener:</dt><dd>a function or an object with a handleEvent(evt) method.</dd>
</dl>

Example:

```html
    <script type="text/javascript">
    	$(function() { //Jquery's document ready event
    		var argunetBrowser = new argunet.ArgunetBrowser("yourmap.graphml",$("#htmlId"));
    		var listener = function(evt){
	            if(evt.type == "nodeSelection"){
  		          	console.log("Node id of selected node: "+evt.nodeId);
 	           }
    		}
    		argunetBrowser.addEventListener("mousedown",listener);
    		argunetBrowser.addEventListener("dblclick",listener);
    		argunetBrowser.addEventListener("nodeSelection",listener);
    	});	
    </script>
```

3. Dependancies
---------------
Argunet Browser uses the following libraries:

Modernizr: http://modernizr.com/

Jquery 1.8.3: http://jquery.com/

EaselJS: http://www.createjs.com/#!/EaselJS

Arbor.js: http://arborjs.org/

Jquery UI: http://jqueryui.com/

Jquery xColor: http://www.xarg.org/project/jquery-color-plugin-xcolor/

Jquery zTree: http://www.ztree.me/v3/main.php#_zTreeInfo

Lightningjs: http://www.lightningjs.com

All of these are already included in ArgunetBrowser.min.js.
If you are already using some of these libraries on your page, you could build a custom version of ArgunetBrowser.min.js without these libraries.

4. Building
-----------
ArgunetBrowser.min.js is created with Ant (build.xml) and Yuicompressor (http://yui.github.com/yuicompressor/). Here is a good guide for getting this to work on a Mac: http://paulpeelen.com/2012/10/06/getting-yui-compressor-to-work-with-ant-on-os-x/

5. Development
--------------
For debugging purposes you can use the index-dev.html which includes all unminimized javascript files separately.