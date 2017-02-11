This additional function was for OpenLP and it was described in http://forums.openlp.org/discussion/2544/chords-in-openlp

Import chords_tags.conf as OpenLP configuration or add formating tags:
{cl}: <span class="chordline"> .. </span>
{c}: <span class="chord" style="display:none;"> .. </span>

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

Tomas
