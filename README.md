This additional chords function was for OpenLP and it was described in <a href="http://forums.openlp.org/discussion/2544/chords-in-openlp">forums.openlp.org</a>

Conversion tool from text lyrics to openlp try <a href="https://github.com/tomasss1024/txt_to_openlp">txt_to_openlp</a>.

Import chords_tags.conf as OpenLP configuration or add formating tags:

```
   {cl}: <span class="chordline"> .. </span>

   {c}: <span class="chord" style="display:none> .. </span>
```

## For OpenLP 2.5 and newer

There is possibility to create <a href="https://manual.openlp.org/stage_view.html#custom-stage-views">Custom Stage Views</a> in OpenLP 2.5 and newer.

Than you can unzip directory "stages" into the OpenLP Data Folder (by going to *Tools &gt; Open Data Folder*).

and open url in your browser:

http://localhost:4316/stage/chords

or for print (put lyrics to the service for title):

http://localhost:4316/stage/print
   

   
## For OpenLP v 2.4 and older   

Go to OpenLP application directory and unzip these files under plugins/remotes/html or manualy copy slide.html and slide.js to plugins\remotes\html\

Enable Remote module and check:

http://localhost:4316/files/slide.html

http://localhost:4316/files/print.html

## Screenshots

Chords stage view:

<img src="https://www.dropbox.com/sh/gp46izjujzg7k13/AADu10r8hfdQqz_g-AiL6Az7a/openlp_chords.gif?raw=1"/>

Chords off:

<img src="https://www.dropbox.com/sh/gp46izjujzg7k13/AAC3QAb2LEHyBIsr9EQOO671a/openlp_chordsoff.gif?raw=1"/>

For printing:

<img src="https://www.dropbox.com/sh/gp46izjujzg7k13/AACw5A4n0nk2Cel8UL21i1lwa/openlp_print.gif?raw=1"/>

Print - chords off

<img src="https://www.dropbox.com/sh/gp46izjujzg7k13/AACTTaaEHs2hVykpx-Q8gkG1a/openlp_print_chordsoff.gif?raw=1"/>

Print preview

<img src="https://www.dropbox.com/sh/gp46izjujzg7k13/AAAeDXWOYWQPC-jCY_p6SNtza/openlp_printpreview.gif?raw=1"/>

