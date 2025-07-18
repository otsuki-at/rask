// Get URL params as Object
function getUrlParams() {
  const params = {};
  const pairs = window.location.search.substr(1).split('&');
  for (const pair of pairs) {
    const [key, val] = pair.split('=');
    params[key] = decodeURIComponent(val || '');
  }
  return params;
}

// Get current region selected by mouse.
function getSelectionRange() {
  const sel = window.getSelection();
  if (!sel.isCollapsed) {
    const range = sel.getRangeAt(0);
    return {
      fst: range.startContainer.parentNode,
      lst: range.endContainer.parentNode,
    };
  }
}

// Get Current line numbers selected by mouse.
function getSelectionLineRange() {
  const range = getSelectionRange();
  if (!range) return;

  const fst = Number(findNearestLinenum(range.fst, -1));
  const lst = Number(findNearestLinenum(range.lst, 1));
  if (isNaN(fst) || isNaN(lst)) return;

  return { fst, lst };
}

// Get the nearest data-linenum attribute from ELEMENT
function findNearestLinenum(element, direction = -1) {
  const name = 'data-linenum';
  const selector = `[${name}]`;

  if (element.closest(selector)) {
    return element.closest(selector).getAttribute(name);
  }

  // Inject dummy attr and find index
  element.setAttribute(name, '??');
  const elements = Array.from(document.querySelectorAll(selector));
  const index = elements.findIndex(el => el.getAttribute(name) === '??');
  element.removeAttribute(name);

  const buddy = elements[index + direction];
  return buddy?.getAttribute(name);
}

// Scroll to ELEMENT at the center of window
function scrollToCenter(element) {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const offset = rect.top + scrollTop - (window.innerHeight / 2) + (element.offsetHeight / 2);
  window.scrollTo({ top: offset, behavior: 'smooth' });
}

// Scroll to AI at the center of window and highlight
function markAndScrollToActionItem(ai) {
  const ele = document.querySelector(`[data-action-item='${ai}']`);
  if (ele) {
    ele.parentElement.classList.add('marked');
    scrollToCenter(ele);
  }
}

// Get the JSON format of the current page (sync)
function getCurrentPageAsJSON() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', window.location.pathname + '.json', false); // sync
  xhr.send(null);
  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}

// Remove Headings like "* (A)"
function removeHeader(string) {
  return string.replace(/^ *[*+-] */, '');
}

// Remove trailer like "-->(...)"
function removeTrailer(string) {
  return string.replace(/(．)? *--(>|&gt;)\(.*\) */, '');
}

// Get the minimum indent level
function getIndentLevel(lines) {
  return lines
    .split("\n")
    .reduce((min, line) => {
      const match = line.match(/^ */);
      return match ? Math.min(min, match[0].length) : min;
    }, Infinity);
}

// Decrease indents of LINES by LEVEL
function chopIndentLevel(lines, level) {
  if (level === 0) return lines;
  const regex = new RegExp("^" + ' '.repeat(level));
  return lines.split("\n").map(line => line.replace(regex, '')).join("\n");
}

// Decrease indents to zero
function chopIndent(lines) {
  return chopIndentLevel(lines, getIndentLevel(lines));
}

// Extract lines from line number FST to LST
function extractLines(lines, fst, lst) {
  return lines.split("\n").slice(fst - 1, lst).join("\n");
}

// Main entry point
function ready() {
  const ai = getUrlParams().ai;
  if (ai) {
    markAndScrollToActionItem(ai);
  }

  document.querySelectorAll('div.markdown-body a').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const new_task_url = new URL(event.target.href);

      const range = getSelectionLineRange();
      if (range) {
        const minute = getCurrentPageAsJSON();
        const description = chopIndent(extractLines(minute.description, range.fst, range.lst));
        const title = removeHeader(removeTrailer(description.trim().split("\n").slice(-1)[0]));
        const ai_num = this.getAttribute("data-action-item");

        const params = new_task_url.searchParams;
        const desc_header = (params.get("desc_header") || "") + "\n" + title;
        params.set("desc_header", desc_header);
        params.set("ai", ai_num);
        params.set("selected_str", title);

        window.location.href = new_task_url.toString();
      } else {
        window.location.href = new_task_url.toString();
      }
    });
  });
}

// DOMContentLoaded = jQuery's $(document).ready
document.addEventListener("DOMContentLoaded", ready);
