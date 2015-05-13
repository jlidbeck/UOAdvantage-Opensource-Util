// dependencies:
// jQuery
// moment.js

// param: experience object, with start_date and/or start_time defined as Y-M-D strings
// returns string with date (and time, if present) in locale-appropriate, friendly format
function formatExperienceDateTime(exp) {
  
  if(exp['start_date']) {
    if(exp['start_time']) {

      var dtStart = moment(exp['start_date']+' '+exp['start_time'], "YYYY-MM-DD HH:mm");
      if(dtStart.isValid()) {
        return (dtStart.format('dddd, MMMM Do YYYY LT'));
      }
    }
    else {
      var dtStart = moment(exp['start_date'], "YYYY-MM-DD");
      if(dtStart.isValid()) {
        return (dtStart.format('dddd, MMMM Do YYYY'));
      }
    }

  }
  return '';
}

// param: date string in Y-M-D format
// returns string with date in concise, locale-appropriate, friendly format
function friendlyFormatDate(dt) {
  
  if(dt) {
    var dtStart = moment(dt, "YYYY-MM-DD");
    if(dtStart.isValid()) {
      return (dtStart.format('l'));
    }
  }

  return '';
}

// uses browser's native html encoding
function htmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  return el.innerHTML;
}

// given a template in the format "Hello %1$s" and a list of args,
// replaces each $d$s with args[d-1].
// only strings are supported
function ghetto_sprintf(template, args) {
  return template.replace(/\%\d\$s/g, function(match, number) {
    match = match.split('%')[1].split('$')[0];
    return args[match-1];
  });
}

// removes div permanently from, after animation
jQuery.fn.fadeOutAndRemove = function() {
  $(this).slideUp(400, function() {
    $(this).remove();
  });
}

function prettyFilter(container, allElements, showHideCallback, sizeIn, sizeOut) {
    var countVisibleAfter = 0; // items visible after filter applied
    var countVisibleBeforeAndAfter = 0;
    var fadeInElements = [];
    var fadeOutElements = [];
    
    allElements.each(function() {
      var show = showHideCallback($(this));
      if(show) {
        ++countVisibleAfter;
        if($(this).is(':visible')) {
          ++countVisibleBeforeAndAfter;
        }
        else {
          fadeInElements.push($(this));
        }
      }
      if(!show && $(this).is(':visible')) {
        fadeOutElements.push($(this));
      }
    });

    // manage series of animations to fade out, shrink, and remove some elements and grow and fade in others

    container.find('.empty_msg').hide();

    // Phase 1: fade some elements to opacity=0, while preserving their space
    var d = 0;
    $.each(fadeOutElements, function() {
      $(this).delay(d+=50).fadeTo(400, 0.01);
    });

    allElements.promise().done(function() {
      // Phase 2: resize spacers.
      d=0;
      var e = 300;
      // if nothing's visible right now, don't take too long
      if(countVisibleBeforeAndAfter==0) { e = 1; }
      // simultaneously animate all size changes (only invisible (opacity=0) elements are being resized)
      $.each(fadeOutElements, function() {
        $(this).animate(_.extend({easing:'linear', toggle:'hide'}, sizeOut), e);
      });
      $.each(fadeInElements, function() {
        $(this).animate(_.extend({easing:'linear', toggle:'show'}, sizeIn), e);
      });

      d=0;
      allElements.promise().done(function() {
        // Phase 3: fade in new elements (their size should already be set)
        $.each(fadeInElements, function() {
          $(this).delay(d+=50).animate({duration:400, opacity:1.0});
        });
        
        allElements.promise().done(function() {
          container.find('.empty_msg').toggle(countVisibleAfter == 0);
        });
      });
    });
}
