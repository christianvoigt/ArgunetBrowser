Argunet Browser
===============

Argunet Browser is a Javascript application that visualizes Argunet argument maps (www.argunet.org) on the Html Canvas and allows the user to surf through complex debates. It reads .graphml maps that can be exported from Argunet Editor and creates a force directed graph using Arbor.js (http://arborjs.org/) and EaselJS (http://www.createjs.com/#!/EaselJS).

1. License
----------

Argunet Browser is released under the MIT license. http://en.wikipedia.org/wiki/MIT_License

2. Deployment
-------------

1. Copy the contents of /lib to your webspace.
2. Include ArgunetBrowser.min.css in the head section of your html page:
    `<link rel="stylesheet" href="lib/ArgunetBrowser.min.css" type="text/css" />`
3. Include ArgunetBrowser.min.js at the end of the body section of your html page:
    `<script src="lib/ArgunetBrowser.min.js" type="text/javascript"></script>`
4. Upload your debate in graphml format to your webspace. You can export any debate from Argunet Editor into this format.
5. Instantiate Argunet Browser in your html page, at the end of your body section:
    
    ```html
    <script type="text/javascript">
    	$(function() { //Jquery's document ready event
    		new argunet.ArgunetBrowser("yourmap.graphml",$("#htmlId"));
    	});	
    </script>
    ```

ArgunetBrowser accepts the following parameters: 

**`new ArgunetBrowser(debateUrl, htmlElement, firstNode, width, height)`**

Only the first two parameters are required.
				
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

All of these are already included in ArgunetBrowser.min.js.
If you are already using some of these libraries on your page, you should build a custom version of ArgunetBrowser.min.js without these libraries.

4. Building
-----------
ArgunetBrowser.min.js is created with Ant (build.xml) and Yuicompressor (http://yui.github.com/yuicompressor/). Here is a good guide for getting this to work on a Mac: http://paulpeelen.com/2012/10/06/getting-yui-compressor-to-work-with-ant-on-os-x/

5. Development
--------------
For debugging purposes you can use the index-dev.html which includes all unminimized javascript files separately.