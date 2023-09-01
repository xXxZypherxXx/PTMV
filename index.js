// javascript
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
function red(message) {
    return "[[gb;#FF0000;black]" + message + "]";
}
function white(message) {
    return "[[gb;#000000;white]" + message + "]";
}

$(function() {
    var anim = false;
    function typed(finish_typing) {
        return function(term, message, delay, finish) {
            anim = true;
            var prompt = term.get_prompt();
            var c = 0;
            if (message.length > 0) {
                term.set_prompt('');
                var new_prompt = '';
                var interval = setInterval(function() {
                    var chr = $.terminal.substring(message, c, c+1);
                    new_prompt += chr;
                    term.set_prompt(new_prompt);
                    c++;
                    if (c == length(message)) {
                        clearInterval(interval);
                        // execute in next interval
                        setTimeout(function() {
                            // swap command with prompt
                            finish_typing(term, message, prompt);
                            anim = false
                            finish && finish();
                        }, delay);
                    }
                }, delay);
            }
        };
    }
    function length(string) {
        string = $.terminal.strip(string);
        return $('<span>' + string + '</span>').text().length;
    }
    var typed_prompt = typed(function(term, message, prompt) {
        term.set_prompt(message + ' ');
    });
    var typed_message = typed(function(term, message, prompt) {
        term.echo(message)
        term.set_prompt(prompt);
    });

    $('body').terminal(function(cmd, term) {
        var finish = false;
        var msg = "Response undefined";
        term.set_prompt('> ');
        typed_message(term, msg, 200, function() {
            finish = true;
        });
        var args = {command: cmd};
        $.get('commands.php', args, function(result) {
            (function wait() {
                if (finish) {
                    term.echo(result);
                } else {
                    setTimeout(wait, 500);
                }
            })();
        });
    }, {
        name: 'xxx',
        greetings: null,
        width: 500,
        height: 300,
        onInit: function(term) {
            // first question
            var msg = "You are seeing this in error.";
            typed_message(term, msg, 200, function() {
                typed_prompt(term, "You should not be here.", 100);
            });
        },
        keydown: function(e) {
            //disable keyboard when animating
            if (anim) {
                return false;
            }
        }
    });
});
