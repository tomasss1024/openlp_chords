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
 * Added chord formating: Tomasss, STEPHANVS                                   *
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
 var lastChord;

function transposeChord(chord, transposeValue) {
	var chordSplit = chord.replace('♭', 'b').split('/'), transposedChord = '', note, notenumber, rest, currentChord, lastBass,
	notesSharp = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'],
	notesFlat = ['C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'H'],
	notesPreferred = ['b','#','#','#','#','#','#','#','#','#','#','#'];

	for (i = 0; i <= chordSplit.length - 1; i++) {
		if (i > 0) {
			transposedChord += '/';
		}
		currentchord = chordSplit[i];
		if (currentchord.charAt(0) === '(') {
			transposedChord += '(';
			if (currentchord.length > 1) {
				currentchord = currentchord.substr(1);
			} else {
				currentchord = "";
			}
		}
		if (currentchord.length > 0) {
			if (currentchord.length > 1) {
				if ('#b'.indexOf(currentchord.charAt(1)) === -1) {
					note = currentchord.substr(0, 1);
					rest = currentchord.substr(1);
				} else {
					note = currentchord.substr(0, 2);
					rest = currentchord.substr(2);
				}
			} else {
				note = currentchord;
				rest = "";
			}
			if (notesFlat.indexOf(note.charAt(0).toUpperCase() + note.substr(1)) === -1 && notesSharp.indexOf(note.charAt(0).toUpperCase() + note.substr(1)) === -1) return chord;
			notenumber = notesSharp.indexOf(note.charAt(0).toUpperCase() + note.substr(1)) === -1 ? notesFlat.indexOf(note.charAt(0).toUpperCase() + note.substr(1)) : notesSharp.indexOf(note.charAt(0).toUpperCase() + note.substr(1));
			notenumber -= parseInt(transposeValue);
			while (notenumber > 11) {notenumber -= 12;}
			while (notenumber < 0) {notenumber += 12;}
			if (i === 0) {
				lastChord = notesPreferred[notenumber] === '#' ? notesSharp[notenumber] : notesFlat[notenumber];
				transposedChord += note.charAt(0) === note.charAt(0).toLowerCase() ? lastChord.charAt(0).toLowerCase() + lastChord.substr(1) : lastChord;
			}else {
				lastBass = notesSharp.indexOf(lastChord) === -1 ? notesFlat[notenumber] : notesSharp[notenumber];
				transposedChord += note.charAt(0) === note.charAt(0).toLowerCase() ? lastBass.charAt(0).toLowerCase() + lastBass.substr(1) : lastBass;
			}
			transposedChord += rest;
		}
	}
	return transposedChord;
}

var OpenLPChordOverflowFillCount = 0;
window.OpenLP = {
        showchords:true,
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
						$("#songtitle").html(data.results.items[idx]["title"].replace(/\n/g, "<br />"));
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
					} else {
						if ((slide["html"] == data.results.slides[lastChange]["html"]) && (data.results.slides.length > idx + (idx - lastChange))) {
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
		var transposeValue = OpenLP.getTransposeValue(OpenLP.currentSlide),//(OpenLP.currentSlides, OpenLP.currentSlide),
		chordclass=/class="[a-z\s]*chord[a-z\s]*"\s*style="display:\s?none"/g,
		chordclassshow='class="chord" style="display:inline"',
		regchord=/<span class="chord" style="display:inline">[\[{]([\(\w#b♭\+\*\d/\)]+)[\]}]<\/span>([\u0080-\uFFFF,\w]*)([\u0080-\uFFFF,\w,\s,\.,\,,\!,\?,\;,\:,\|,\",\',\-,\_]*)(<br>)?/g,
		replaceChords=function(mstr,$1,$2,$3,$4) {
			var v='', w='';
			var $1len = 0, $2len = 0, slimchars='fiíIÍjlĺľrtť.,;/ ()|"\'!:\\';
			$1 = transposeChord($1, transposeValue);
			for (var i = 0; i < $1.length; i++) switch (true) {case (slimchars.indexOf($1.charAt(i)) >= 0): $1len += 1; break; case (slimchars.indexOf($1.charAt(i)) < 0): $1len += 2; break;}
			for (var i = 0; i < $2.length + $3.length; i++) switch (true) {case (slimchars.indexOf($2.charAt(i)) >= 0): $2len += 1; break; case (slimchars.indexOf($2.charAt(i)) < 0): $2len += 2; break;}
			//for (var i = 0; i < $3.length; i++) switch (true) {case (slimchars.indexOf($2.charAt(i)) > 0): $2len += 1; break; case (slimchars.indexOf($2.charAt(i)) < 0): $2len += 2; break;}
			if ($1len >= $2len && !$4) {
				if ($2.length){
					if (!$3.length) {
						for (c = 0; c < Math.ceil(($1len - $2len) / 2) + 1; c++) {w += '_';}
					} else {
						for (c = 0; c < $1len - $2len + 2; c++) {w += '&nbsp;';}
					}
				} else {
					if (!$3.length) {
						for (c = 0; c < Math.floor(($1len - $2len) / 2) + 1; c++) {w += '_';}
					} else {
						for (c = 0; c < $1len - $2len + 1; c++) {w += '&nbsp;';}
					}
				};
			} else {
				if (!$2 && $3.charAt(0) == ' ') {for (c = 0; c < $1len; c++) {w += '&nbsp;';}}
			}
			return $.grep(['<span class="chord" style="display:inline"><span><strong>', $1, '</strong></span>', $2, w, $3, '</span>', $4], Boolean).join('');
		};
		$("#verseorder span").removeClass("currenttag");
		$("#tag" + OpenLP.currentTags[OpenLP.currentSlide]).addClass("currenttag");
		var slide = OpenLP.currentSlides[OpenLP.currentSlide];
		if ($('#transposevalue').text() == transposeValue || ($('#transposevalue').text() == '') && (transposeValue == 0)) {
			$('#transposecontainer').removeAttr('style');
		} else {
			$('#transposecontainer').attr('style', 'background: red;color: white;');
			setTimeout(function(){$('#transposecontainer').removeAttr('style');},5000);
		}
		$('#transposevalue').text(transposeValue);
		var text = "";
		// use title if available
		if (slide["title"]) {
			text = slide["title"];
		} else {
			text = slide["html"];
                        if(OpenLP.showchords) {
			   text = text.replace(chordclass,chordclassshow)
			   text = text.replace(regchord, replaceChords);
                        }
		}
		// use thumbnail if available
		if (slide["img"]) {
			text += "<br /><img src='" + slide["img"].replace("/thumbnails/", "/thumbnails320x240/") + "'><br />";
		}
		// use notes if available
		if (slide["slide_notes"]) {
			text += '<br />' + slide["slide_notes"];
		}
		text = text.replace(/\n/g, "<br />");
		$("#currentslide").html(text);
		text = "";
		if (OpenLP.currentSlide < OpenLP.currentSlides.length - 1) {
			for (var idx = OpenLP.currentSlide + 1; idx < OpenLP.currentSlides.length; idx++) {
				if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1])
					text = text + "<div class=\"nextslide\">";
				if (OpenLP.currentSlides[idx]["title"]) {
					text = text + OpenLP.currentSlides[idx]["title"];
				} else {
					if (transposeValue != OpenLP.getTransposeValue(idx)) {
						transposeValue = OpenLP.getTransposeValue(idx);
						if (parseInt(transposeValue) >= 0) {
							text = text + "<div id=\"nexttransposevalue\">Transpose (capo): " + transposeValue + "</div>";
						} else {
							text = text + "<div id=\"nexttransposevalue\">Transposee: " + transposeValue + "</div>";
						}
						
					} else {
						text = text + "<div id=\"nexttransposevalue\">&nbsp;</div>";
					};
					text = text + OpenLP.currentSlides[idx]["html"];
                                        if(OpenLP.showchords) {
					   text = text.replace(chordclass,chordclassshow)
					   text = text.replace(regchord, replaceChords);
                                        }
				}
			if (OpenLP.currentTags[idx] != OpenLP.currentTags[idx - 1])
				text = text + "</div>";
			else
				text = text + "<br />";
			}
			text = text.replace(/\n/g, "<br />");
			$("#nextslide").html(text);
		} else {
			text = "<div class=\"nextslide\">" + $("#next-text").val() + ": " + OpenLP.nextSong + "</div>";
			$("#nextslide").html(text);
		}
        if(!OpenLP.showchords) $(".chordline").toggleClass('chordline1');
	},
	updateClock: function(data) {
		var div = $("#clock");
		var t = new Date();
		var h = t.getHours();
		if (data.results.twelve && h > 12)
		h = h - 12;
		if (h < 10) h = '0' + h + '';
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
				if (OpenLP.currentItem != data.results.item || OpenLP.currentService != data.results.service) {
					OpenLP.currentItem = data.results.item;
					OpenLP.currentService = data.results.service;
					OpenLP.loadSlides();
				} else if (OpenLP.currentSlide != data.results.slide) {
					OpenLP.currentSlide = parseInt(data.results.slide, 10);
					OpenLP.updateSlide();
				}
			}
		);
		//	$('span.chord').each(function(){this.style.display="inline"});
	},
	getTransposeValue: function (slideNumber) {
		//var slide = OpenLP.currentSlide;
		while (!localStorage.getItem(OpenLP.currentSlides[0].text.split("\n")[0] + '_transposeValue[' + slideNumber + ']') && slideNumber > 0) {
			slideNumber -= 1;
		}
		if (localStorage.getItem(OpenLP.currentSlides[0].text.split("\n")[0] + '_transposeValue[' + slideNumber + ']')) {
			return localStorage.getItem(OpenLP.currentSlides[0].text.split("\n")[0] + '_transposeValue[' + slideNumber + ']')
		} else {
			return 0
		}
	},
	storeTransposeValue: function () {
		localStorage.setItem(OpenLP.currentSlides[0].text.split("\n")[0] + '_transposeValue[' + OpenLP.currentSlide + ']', $('#transposevalue').text());
	}
}
$.ajaxSetup({ cache: false });
setInterval("OpenLP.pollServer();", 500);
OpenLP.pollServer();
$(document).ready(function() {
	$('#transposeup').click(function(e) {
		$('#transposevalue').text(parseInt($('#transposevalue').text()) + 1);
		OpenLP.storeTransposeValue();
		OpenLP.updateSlide();
	});
	$('#transposedown').click(function(e) {  
		$('#transposevalue').text(parseInt($('#transposevalue').text()) - 1);
		OpenLP.storeTransposeValue();
		OpenLP.updateSlide();
	});
	$("#chords").click(function(){ OpenLP.showchords=OpenLP.showchords?false:true; OpenLP.updateSlide(); });
	$('#plus').click(function() { var fs=$('#currentslide').css('font-size').match(/\d+/); $('#currentslide').css("font-size",+fs+10+"px");$('#nextslide').css("font-size",+fs+10+"px"); } );
	$("#minus").click(function() {var fs=$('#currentslide').css('font-size').match(/\d+/); $('#currentslide').css("font-size",+fs-10+"px");$('#nextslide').css("font-size",+fs-10+"px"); } );
	$('body').hover(function(){ $('#controls').fadeIn(500);},function(){ $('#controls').fadeOut(500);});
});
