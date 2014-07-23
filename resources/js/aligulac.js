// Generated by CoffeeScript 1.7.1
var aligulacAutocompleteTemplates, getResults;

aligulacAutocompleteTemplates = function(obj) {
  var flag, name, race, team;
  if (obj.type === '--') {
    obj.key = '-';
    return "<a>BYE</a>";
  }
  if (!((obj.tag != null) || (obj.name != null) || (obj.fullname != null))) {
    return "<span class='autocomp-header'>" + autocomp_strings[obj.label] + "</span>";
  }
  switch (obj.type) {
    case 'player':
      obj.key = obj.tag + ' ' + obj.id;
      team = ((obj.teams != null) && obj.teams.length > 0 ? "<span class='autocomp-team pull-right'>" + obj.teams[0][0] + "</span>" : '');
      flag = (obj.country != null ? "<img src='" + (flags_dir + obj.country.toLowerCase()) + ".png' />" : '');
      race = "<img src='" + (races_dir + obj.race.toUpperCase()) + ".png' />";
      name = "<span>" + obj.tag + "</span>";
      return "<a>" + flag + race + name + team + "</a>";
    case 'team':
      obj.key = obj.name;
      return "<a>" + obj.name + "</a>";
    case 'event':
      obj.key = obj.fullname;
      return "<a>" + obj.fullname + "</a>";
  }
  return "<a>" + obj.value + "</a>";
};

getResults = function(term, restrict_to) {
  var deferred, url;
  if (restrict_to == null) {
    restrict_to = ['players', 'teams', 'events'];
  } else if (typeof restrict_to === 'string') {
    restrict_to = [restrict_to];
  }
  deferred = $.Deferred();
  url = '/search/json/';
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    data: {
      q: term,
      search_for: restrict_to.join(',')
    }
  }).success(function(ajaxData) {
    return deferred.resolve(ajaxData);
  });
  return deferred;
};

$(document).ready(function() {
  return $('#search_box').autocomplete({
    source: function(request, response) {
      return $.when(getResults(request.term)).then(function(result) {
        var eventresult, playerresult, prepare_response, teamresult;
        prepare_response = function(list, type, label) {
          var x, _i, _len;
          if ((list == null) || list.length === 0) {
            return [];
          }
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            x = list[_i];
            x.type = type;
          }
          return [
            {
              label: label
            }
          ].concat(list);
        };
        playerresult = prepare_response(result.players, 'player', 'Players');
        teamresult = prepare_response(result.teams, 'team', 'Teams');
        eventresult = prepare_response(result.events, 'event', 'Events');
        return response(playerresult.concat(teamresult.concat(eventresult)));
      });
    },
    minLength: 2,
    select: function(event, ui) {
      $('#search_box').val(ui.item.key).closest('form').submit();
      return false;
    },
    open: function() {
      return $('.ui-menu').width('auto');
    }
  }).data('ui-autocomplete')._renderItem = function(ul, item) {
    return $('<li></li>').append(aligulacAutocompleteTemplates(item)).appendTo(ul);
  };
});

$(document).ready(function() {
  try {
    return $('.event-ac').autocomplete({
      source: function(request, response) {
        return $.when(getResults(request.term, 'events')).then(function(result) {
          var x, _i, _len, _ref;
          if ((result == null) || (result.events == null) || result.events.length === 0) {
            return [];
          }
          _ref = result.events;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            x.type = 'event';
          }
          return response(result.events);
        });
      },
      minLength: 2,
      select: function(event, ui) {
        $('.event-ac').val(ui.item.key);
        return false;
      },
      open: function() {
        return $('.ui-menu').width('auto');
      }
    }).data('ui-autocomplete')._renderItem = function(ul, item) {
      return $('<li></li>').append(aligulacAutocompleteTemplates(item)).appendTo(ul);
    };
  } catch (_error) {}
});

$(document).ready(function() {
  var idPlayersTextArea;
  idPlayersTextArea = $("#id_players");
  idPlayersTextArea.tagsInput({
    autocomplete_opt: {
      minLength: 2,
      select: function(event, ui) {
        idPlayersTextArea.addTag(ui.item.key);
        $("#id_players_tag").focus();
        return false;
      },
      open: function() {
        return $('.ui-menu').width('auto');
      }
    },
    autocomplete_url: function(request, response) {
      return $.when(getResults(request.term, 'players')).then(function(result) {
        var p, _i, _len, _ref;
        if (result.players != null) {
          _ref = result.players;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            p.type = 'player';
          }
          if (global_player_autocomplete_allow_byes && (request.term === 'bye' || request.term === '--')) {
            result.players = [
              {
                type: '--'
              }
            ].concat(result.players);
          }
          return response(result.players);
        }
      });
    },
    defaultText: autocomp_strings['Players'],
    placeholderColor: '#9e9e9e',
    delimiter: '\n',
    width: '100%',
    formatAutocomplete: aligulacAutocompleteTemplates
  });
  return $("#id_players_addTag").keydown(function(event) {
    if (event.which === 13 && $("#id_players_tag").val() === "") {
      return $(this).closest("form").submit();
    }
  });
});

$(document).ready(function() {
  return $('input#id_players_tag').focus(function() {
    return $(this).parent().parent().css('box-shadow', 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 4px rgba(0,0,0,.4)').css('-webkit-box-shadow', 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 4px rgba(0,0,0,.4)').css('border-color', '#000000');
  }).focusout(function() {
    return $(this).parent().parent().css('box-shadow', 'inset 0 1px 1px rgba(0,0,0,.075)').css('-webkit-box-shadow', 'inset 0 1px 1px rgba(0,0,0,.075)').css('border-color', '#cccccc');
  });
});
// Generated by CoffeeScript 1.7.1
var mobile_regex, toggle_navbar_method;

mobile_regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i;

toggle_navbar_method = function() {
  if (mobile_regex.test(navigator.userAgent) || $(window).width() <= 768) {
    return $('a.dropdown-toggle').off('click');
  } else {
    return $('a.dropdown-toggle').on('click', function() {
      return window.location.href = this.href;
    });
  }
};

$(document).ready(toggle_navbar_method);

$(window).resize(toggle_navbar_method);
// Generated by CoffeeScript 1.7.1
var gen_short;

gen_short = function(path) {
  return $.get("/m/new/?url=" + encodeURIComponent(path), function(data) {
    $("#gen_short").hide();
    $("#disp_short").html("<a href=\"/m/" + data + "/\">/m/" + data + "</a>");
    return $("#disp_short").show();
  });
};
// Generated by CoffeeScript 1.7.1
var create_tag, toggle_block;

create_tag = function(tag_name) {
  return $(document.createElement(tag_name));
};

toggle_block = function(id) {
  $('#lm-' + id).toggle();
  return $('#lma-' + id).html($('#lma-' + id).html() === autocomp_strings['hide'] ? autocomp_strings['show'] : autocomp_strings['hide']);
};
// Generated by CoffeeScript 1.7.1
var generate_player_info_form;

generate_player_info_form = function(player_id) {
  var i, new_row, row, _i;
  row = $("[data-id=" + player_id + "]");
  new_row = create_tag("tr");
  for (i = _i = 0; _i <= 6; i = ++_i) {
    new_row.append(create_tag("td"));
  }
  new_row.insertAfter(row);
  return false;
};
