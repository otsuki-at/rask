var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

setupAutoCompleteTag = function(element) {
  $.ajax({
    async: false,
    type: "GET",
    url: "/tags",
    dataType: "json",
    success: function(tags, status, xhr) {
      return window.tag_list = $.map(tags, function(tag) {
        return tag.name;
      });
    }
  });
  return $(element).textcomplete([
    {
      match: /([\-+\w]*)$/,
      search: function(term, callback) {
        return callback($.map(window.tag_list, function(tag) {
          if (tag.indexOf(term) >= 0) {
            return tag;
          }
          return null;
        }));
      },
      replace: function(value) {
        return "" + value;
      },
      index: 1
    }
  ], {
    onKeydown: function(e, commands) {
      if (e.ctrlKey && e.keyCode === 74) {
        return commands.KEY_ENTER;
      }
    },
    zIndex: 10000,
    listPosition: function(position) {
      this.$el.css(this._applyPlacement(position));
      this.$el.css('position', 'absolute');
      return this;
    }
  });
};

setupTagForm = function(selector) {
  var add_tags, redisplay, remove_tag, set_tags, str_to_ary, tags;
  str_to_ary = function(str) {
    str = str.trim();
    if (str === '') {
      return [];
    }
    return str.split(/\s+/);
  };
  tags = function() {
    return str_to_ary($('#tag-names').val());
  };
  set_tags = function(tag_array) {
    $('#tag-names').val(tag_array.join(' '));
    return tags();
  };
  add_tags = function(tag_array) {
    var ary;
    ary = tags();
    tag_array.map(function(tag) {
      if (!(indexOf.call(ary, tag) >= 0)) {
        return ary.push(tag);
      }
    });
    return set_tags(ary);
  };
  remove_tag = function(tag) {
    var ary;
    ary = tags().filter(function(x) {
      return x !== tag.trim();
    });
    return set_tags(ary);
  };
  redisplay = function() {
    $('#current-tags').empty();
    return tags().map(function(tag_name) {
      return $('#current-tags').append("<span class=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\">\n" + tag_name + "\n  <span id=\"" + tag_name + "\"<button class=\"remove-tag\" type=\"button\"><svg class=\"h-5 w-5 text-white\"  width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" stroke-width=\"2\" stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">  <path stroke=\"none\" d=\"M0 0h24v24H0z\"/>  <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\" />  <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\" /></svg></button></span></span>");
    });
  };
  $('#current-tags').on('click', '.remove-tag', function(e) {
    remove_tag($(this).attr('id'));
    return redisplay();
  });
  $('#tag-add-button').on('click', function(e) {
    add_tags(str_to_ary($('#tag-name').val()));
    $('#tag-name').val('');
    return redisplay();
  });
  $('#tag-name').on('keypress', function(e) {
    if (e.keyCode === 13) {
      return e.preventDefault();
    }
  });
  if ($('#tag-names').val() != null) {
    redisplay();
  }
  return setupAutoCompleteTag('#tag-name');
};

ready = function() {
  setupTagForm('#tag-form');
};

$(document).ready(ready);
