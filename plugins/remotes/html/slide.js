/******************************************************************************
 * OpenLP - Open Source Lyrics Projection                                      *
 * --------------------------------------------------------------------------- *
 * Copyright (c) 2008-2014 Raoul Snyman                                        *
 * Portions copyright (c) 2008-2014 Tim Bentley, Gerald Britton, Jonathan      *
 * Corwin, Samuel Findlay, Michael Gorven, Scott Guerrieri, Matthias Hub,      *
 * Meinert Jordan, Armin Köhler, Erik Lundin, Edwin Lunando, Brian T. Meyer.   *
 * Joshua Miller, Stevan Pettit, Andreas Preikschat, Mattias Põldaru,          *
 * Christian Richter, Philip Ridout, Simon Scudder, Jeffrey Smith,             *
 * Maikel Stuivenberg, Martin Thompson, Jon Tibble, Dave Warnock,              *
 * Frode Woldsund, Martin Zibricky                                             *
 * Chords: Tomas                                                               *
 * --------------------------------------------------------------------------- *
 * This program is free software; you can redistribute it and/or modify it     *
 * under the terms of the GNU General Public License as published by the Free  *
 * Software Foundation; version 2 of the License.                              *
 *                                                                             *
 * This program is distributed in the hope that it will be useful, but WITHOUT *
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or       *
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for    *
 * more details.                                                               *
 *                                                                             *
 * You should have received a copy of the GNU General Public License along     *
 * with this program; if not, write to the Free Software Foundation, Inc., 59  *
 * Temple Place, Suite 330, Boston, MA 02111-1307 USA                          *
 ******************************************************************************/
window.OpenLP = {
  loadService: function (event) {
    $.getJSON(
      "/api/service/list",
      function (data, status) {
        OpenLP.nextSong = "";
        $("#notes").html("");
        for (idx in data.results.items) {
          idx = parseInt(idx, 10);
          if (data.results.items[idx]["selected"]) {
            $("#notes").html(data.results.items[idx]["notes"].replace(/\n/g, "<br />"));
            if (data.results.items.length > idx + 1) {
              OpenLP.nextSong = data.results.items[idx + 1]["title"];
            }
            break;
          }
        }
        OpenLP.updateSlide();
      }
    );
  },
  loadSlides: function (event) {
    $.getJSON(
      "/api/controller/live/text",
      function (data, status) {
        OpenLP.currentSlides = data.results.slides;
        OpenLP.currentSlide = 0;
        OpenLP.currentTags = Array();
        var div = $("#verseorder");
        div.html("");
        var tag = "";
        var tags = 0;
        var lastChange = 0;
        $.each(data.results.slides, function(idx, slide) {
          var prevtag = tag;
          tag = slide["tag"];
          if (tag != prevtag) {
            // If the tag has changed, add new one to the list
            lastChange = idx;
            tags = tags + 1;
            div.append("&nbsp;<span>");
            $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
          }
          else {
            if ((slide["html"] == data.results.slides[lastChange]["html"]) &&
              (data.results.slides.length > idx + (idx - lastChange))) {
              // If the tag hasn't changed, check to see if the same verse
              // has been repeated consecutively. Note the verse may have been
              // split over several slides, so search through. If so, repeat the tag.
              var match = true;
              for (var idx2 = 0; idx2 < idx - lastChange; idx2++) {
                if(data.results.slides[lastChange + idx2]["html"] != data.results.slides[idx + idx2]["html"]) {
                    match = false;
                    break;
                }
              }
              if (match) {
                lastChange = idx;
                tags = tags + 1;
                div.append("&nbsp;<span>");
                $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
              }
            }
          }
          OpenLP.currentTags[idx] = tags;
          if (slide["selected"])
            OpenLP.currentSlide = idx;
        })
        OpenLP.loadService();
      }
    );
  },
  updateSlide: function() {
    // Show the current slide on top. Any trailing slides for the same verse
    // are shown too underneath in grey.
    // Then leave a blank line between following verses
    var chordclass=/class="[a-z\s]*chord[a-z\s]*"\s*style="display:\s?none"/g,
    chordclassshow='class="chord" style="display:inline"',
    regchord=/[\[{]([\w#\+\*\d/]+)[\]}]<\/span>([\u0080-\uFFFF\w]*)([\s,\.]*)/g,
    replaceChords=function(mstr,$1,$2,$3) {var w='';if($1.length>$2.length) for(c in $1)(($2.length&&!$3.length)?w+='&middot;':w+='&nbsp;');return '<span><strong><span>[</span>'+$1+'<span>]</span></strong>'+$2+w+$3+'</span>'};
    $("#verseorder span").removeClass("currenttag");
    $("#tag" + OpenLP.currentTags[OpenLP.currentSlide]).addClass("currenttag");
    var slide = OpenLP.currentSlides[OpenLP.currentSlide];
    var text = "";
    // use title if available
    if (slide["title"]) {
        text = slide["title"];
    } else {
        text = slide["html"];
        text = text.replace(chordclass,chordclassshow)
        text = text.replace(regchord, replaceChords);
    }
    // use thumbnail if available
    if (slide["img"]) {
        text += "<br /><img src='" + slide["img"].replace("/thumbnails/", "/thumbnails320x240/") + "'><br />";
    }
    // use notes if available
	/*
    if (slide["notes"]) {
        text += '<br />' + slide["notes"];
    }
	*/
    text = text.replace(/\n/g, "<br />");
    $("#currentslide").html(text);
    text = "";
    if (OpenLP.currentSlide < OpenLP.currentSlides.length - 1) {
      for (var idx = OpenLP.currentSlide + 1; idx < OpenLP.currentSlides.length; idx++) {
        if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1])
            text = text + "<p class=\"nextslide\">";
        if (OpenLP.currentSlides[idx]["title"]) {
            text = text + OpenLP.currentSlides[idx]["title"];
        } else {
            text = text + OpenLP.currentSlides[idx]["html"];
            text = text.replace(chordclass,chordclassshow)
            text = text.replace(regchord, replaceChords);
        }
        if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1])
            text = text + "</p>";
        else
            text = text + "<br />";
      }
    text = text.replace(/\n/g, "<br />");
      $("#nextslide").html(text);
    }
    else {
      text = "<p class=\"nextslide\">" + $("#next-text").val() + ": " + OpenLP.nextSong + "</p>";
      $("#nextslide").html(text);
    }
  },
  updateClock: function(data) {
    var div = $("#clock");
    var t = new Date();
    var h = t.getHours();
    if (data.results.twelve && h > 12)
      h = h - 12;
    var m = t.getMinutes();
    if (m < 10)
      m = '0' + m + '';
    div.html(h + ":" + m);
  },
  pollServer: function () {
    $.getJSON(
      "/api/poll",
      function (data, status) {
        OpenLP.updateClock(data);
        if (OpenLP.currentItem != data.results.item ||
            OpenLP.currentService != data.results.service) {
          OpenLP.currentItem = data.results.item;
          OpenLP.currentService = data.results.service;
          OpenLP.loadSlides();
        }
        else if (OpenLP.currentSlide != data.results.slide) {
          OpenLP.currentSlide = parseInt(data.results.slide, 10);
          OpenLP.updateSlide();
        }
      }
    );
  }
}
$.ajaxSetup({ cache: false });
setInterval("OpenLP.pollServer();", 500);
OpenLP.pollServer();
