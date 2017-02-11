This additional chords function was for OpenLP and it was described in <a href="http://forums.openlp.org/discussion/2544/chords-in-openlp">forums.openlp.org</a>

Conversion tool from text lyrics to openlp try <a href="https://github.com/tomasss1024/txt_to_openlp">txt_to_openlp</a>.

Import chords_tags.conf as OpenLP configuration or add formating tags:

   {cl}: &lt;span class="chordline"&gt; .. &lt;/span&gt;

   {c}: &lt;span class="chord" style="display:none;"&gt; .. &lt;/span&gt;


For OpenLP 2.5 and newer

as described in manual OpenLP <a href="https://manual.openlp.org/stage_view.html#custom-stage-views">Custom Stage Views</a>

unzip directory "stages" into the OpenLP Data Folder by going to Tools &gt; Open Data Folder.

and open url in your browser:

http://localhost:4316/stage/chords

or for print (put lyrics to the service for title):

http://localhost:4316/stage/print
   

   
For OpenLP v 2.4 and older   

and unzip these files under plugins/remotes/html to OpenLP directory or manualy copy slide.html and slide.js to plugins\remotes\html\

Enable Remote module and check:

http://localhost:4316/files/slide.html

http://localhost:4316/files/print.html

<img src="https://dl.dropboxusercontent.com/u/2855699/openlp_chords.gif"/>

For printing:

<img src="https://dl.dropboxusercontent.com/u/2855699/openlp_print.gif"/>


