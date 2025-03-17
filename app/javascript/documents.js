//
// Get URL params as Object
//
getUrlParams = function() {
  var i, key, len, param, params, ref, ref1, val;
  params = {};
  ref = window.location.search.substr(1).split('&');
  for (i = 0, len = ref.length; i < len; i++) {
    param = ref[i];
    ref1 = param.split('='), key = ref1[0], val = ref1[1];
    params[key] = decodeURIComponent(val);
  }
  return params;
};

// Get current region selected by mouse.
// returns {fst: FIRST_ELEMENT, lst: LAST_ELEMENT}
getSelectionRange = function() {
  var range, sel;
  sel = window.getSelection();
  if (!sel.isCollapsed && (range = sel.getRangeAt(0))) {
    return {
      fst: range.startContainer.parentNode,
      lst: range.endContainer.parentNode
    };
  }
};

// Get Current line numbers selected by mouse.
// returns {fst: FIRST_LINE_NUMBER, lst: LAST_LINE_NUMBER}
getSelectionLineRange = function() {
  var fst, lst, range;
  if (!(range = getSelectionRange())) {
    return void 0;
  }
  fst = Number(findNearestLinenum($(range.fst), -1));
  lst = Number(findNearestLinenum($(range.lst), 1));
  if (isNaN(fst) || isNaN(lst)) {
    return void 0;
  }
  return {
    fst: fst,
    lst: lst
  };
};

// Get the nearest data-linenum attribute from ELEMENT
// including itself. DIRECTION should be +1 or -1
//
// returns: value of data-linenum attribute
//
findNearestLinenum = function(element, direction) {
  var buddy, ele, index, name, sel;
  if (direction == null) {
    direction = -1;
  }
  name = 'data-linenum';
  sel = "[" + name + "]";
  ele = $(element);
  if (ele.is(sel)) {
    return ele.attr(name);
  }

  // Since ele does not have data-linenum,
  // inject a dummy data-linenum to ele, and
  // find its index among the other data-lineum holders.
  ele.attr(name, '??');
  index = $(sel).index(ele);
  buddy = $(sel)[index + direction];
  ele.removeAttr(name);
  return $(buddy).attr(name);
};

// Scroll to ELEMENT at the center of window
scrollToCenter = function(element) {
  var ele, eleH, offset, winH;
  ele = $(element);
  eleH = ele.height();
  winH = $(window).height();
  offset = ele.offset().top;
  if (eleH < winH) {
    offset = offset - ((winH / 2) - (eleH / 2));
  }
  return $('html, body').animate({
    scrollTop: offset
  }, 600);
};

// Scroll to AI at the center of window and
// add class="marked" to highlight
markAndScrollToActionItem = function(ai) {
  var ele;
  ele = $("[data-action-item='" + ai + "']");
  ele.parent().addClass('marked');
  return scrollToCenter(ele);
};

// Get the JSON format of the current page.
//
// If the current page is /mintes/1, it will return /minutes/1.json.
// This function is supposed to be used to get a JSON-style content of
// currently displayed minute.
//
// returns JSON encoded structure.
//
getCurrentPageAsJSON = function() {
  var json, res;
  res = $.ajax({
    url: window.location.pathname + ".json",
    async: false,
    dataType: 'json'
  });
  json = res.responseJSON;
  return json;
};

// Remove Headings of list item ``+ (A) ``
removeHeader = function(string) {
  return string.replace(/^ *[*+-] */, '');
};

// Remove trailing ``-->(...)'' from STRING.
removeTrailer = function(string) {
  return string.replace(/(．)? *--(>|&gt;)\(.*\) */, '');
};

// Get the minimum indent level of LINES.
// LINES has multiple lines separated by "\n".
//
// For example, if LINES has these three lines:
//
// |    first line
// |      second line
// |  third line
//
// this function returns the minimum indent level as 2.
// calculated from the third line.
//
getIndentLevel = function(lines) {
  var i, indent, len, line, match, ref;
  indent = 9999;
  ref = lines.split("\n");
  for (i = 0, len = ref.length; i < len; i++) {
    line = ref[i];
    match = /^ */.exec(line);
    if (match && match[0].length < indent) {
      indent = match[0].length;
    }
  }
  return indent;
};

// Decrease indents of LINES by LEVEL.
// LINES has multiple lines separated by "\n".
//
// For example, if you call this function with LEVEL is 2 and LINES has
// these three lines:
//
// |    first line
// |      second line
// |  third line
//
// this function returns:
//
// |  first line
// |    second line
// |third line
//
chopIndentLevel = function(lines, level) {
  var i, len, line, ref, result, space;
  if (level === 0) {
    return lines;
  }
  space = new RegExp("^" + (' '.repeat(level)));
  result = '';
  ref = lines.split("\n");
  for (i = 0, len = ref.length; i < len; i++) {
    line = ref[i];
    result += line.replace(space, '') + "\n";
  }
  return result;
};

// Decrease indents of LINES to zero.
chopIndent = function(lines) {
  return chopIndentLevel(lines, getIndentLevel(lines));
};

// Extract lines from line number FST to LST.
extractLines = function(lines, fst, lst) {
  return lines.split("\n").slice(fst - 1, +(lst - 1) + 1 || 9e9).join("\n");
};

ready = function() {
  var ai;
  if (ai = getUrlParams().ai) {
    markAndScrollToActionItem(ai);
  }
  $('div.markdown-body a').on('click', function(event) {
    var ai_num, description, form, minute, range, title, url, params, desc_header;
    event.preventDefault();
    const new_task_url = event.target;
    if (range = getSelectionLineRange()) {
      minute = getCurrentPageAsJSON();
      description = chopIndent(extractLines(minute.description, range.fst, range.lst));
      title = removeHeader(removeTrailer(description.trim().split("\n").slice(-1)[0]));
      ai_num = $(this).attr("data-action-item");
      url = (this.href.split('?')[0]) + "?ai=" + ai_num;
      params = new URLSearchParams(new_task_url.search);
      desc_header = params.get("desc_header") + "\n" + title;
      params.set('desc_header', desc_header);
      new_task_url.search = params.toString();
      window.location.href = new_task_url + "&selected_str=" + title;
    } else {
      window.location.href = new_task_url;
    }
  });
};

$(document).ready(ready);
