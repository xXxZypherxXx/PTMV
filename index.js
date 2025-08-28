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
};
//A function for a terminal to display red text.
function red(message) {
    return "[[gb;#FF0000;black]" + message + "]";
}
function blue(message) {
    return "[[gb;#08FFEB;black]" + message + "]";
}
//Animation function?
var animation;

//Below this is edited terminal shit.
var shell = $('.shell').resizable({
    minHeight: 100,
    minWidth: 760,
    maxHeight: 800,
    aspectRatio: 16/9,
    animate: true,
}).draggable({
    handle: '> .status-bar .title'
});
// Fake in memory filesystem
var fs = {
    'FOR-30DE': {
        'Journal02_17_1516u.txt': Journal1516u.innerHTML ,
        'FBIMemo.txt': FBINotice.innerHTML ,
        'InABottle.msg': InABottle.innerHTML ,
        'Krypt.msg': Krypt.innerHTML ,
        'GoldenRule.tab': GoldenRule.innerHTML,
        "JAMES_ORCHARD_HALLIWELL-PHILLIPPS": {
                "A dictionary of archaic and provincial words":{
                        "Volume1": Volume1.innerHTML,}
        } ,
        "PerfectDrawLeaksDoNotLook": {
                "Test1": Monoceros.innerHTML,
                "Test2": val3.innerHTML,
                "Test3": val4.innerHTML, 
        }
    }
};

var path = [];
var cwd = fs;
function restore_cwd(fs, path) {
    path = path.slice();
    while (path.length) {
        var dir_name = path.shift();
        if (!is_dir(fs[dir_name])) {
            throw new Error('Internal Error Invalid directory ' +
                            $.terminal.escape_brackets(dir_name));
        }
        fs = fs[dir_name];
    }
    return fs;
}
function red(message) {
    return "[[gb;#FF0000;black]" + message + "]";
}
function is_dir(obj) {
    return typeof obj === 'object';
}
function is_file(obj) {
    return typeof obj === 'string';
}
var commands = {
    cd: function(dir) {
        this.pause();
        if (dir === '/') {
            path = [];
            cwd = restore_cwd(fs, path);
        } else if (dir === '..') {
            if (path.length) {
                path.pop(); // remove from end
                cwd = restore_cwd(fs, path);
            }
        } else if (dir.match(/\//)) {
            var p = dir.replace(/\/$/, '').split('/').filter(Boolean);
            if (dir[0] !== '/') {
                p = path.concat(p);
            }
            cwd = restore_cwd(fs, p);
            path = p;
        } else if (!is_dir(cwd[dir])) {
            this.error($.terminal.escape_brackets(dir) + ' is not a directory');
        } else {
            cwd = cwd[dir];
            path.push(dir);
        }
        this.resume();
    },
    ls: function() {
        if (!is_dir(cwd)) {
            throw new Error('Internal Error Invalid directory');
        }
        var dir = Object.keys(cwd).map(function(key) {
            if (is_dir(cwd[key])) {
                return key.pop() + '/';
            }
            return key;
        });
        this.echo(dir.join('\n'));
    },
    open: function(file) {
        if (!is_file(cwd[file])) {
            this.error($.terminal.escape_brackets(file) + " does not exist!");
        } else {
            this.echo(cwd[file]);
        }
    },
    help: function() {
        this.echo('Available commands: ' + Object.keys(commands).join(', '));
    }
};
function completion(string, callback) {
    var command = this.get_command();
    var cmd = $.terminal.parse_command(command);
    function dirs(cwd) {
        return Object.keys(cwd).filter(function(key) {
            return is_dir(cwd[key]);
        }).map(function(dir) {
            return dir + '/';
        });
    }
    if (cmd.name === 'ls') {
        callback([]);
    } else if (cmd.name === 'cd') {
        var p = string.split('/').filter(Boolean);
        if (p.length === 1) {
            if (string[0] === '/') {
                callback(dirs(fs));
            } else {
                callback(dirs(cwd));
            }
        } else {
            if (string[0] !== '/') {
                p = path.concat(p);
            }
            if (string[string.length - 1] !== '/') {
                p.pop();
            }
            var prefix = string.replace(/\/[^/]*$/, '');
            callback(dirs(restore_cwd(fs, p)).map(function(dir) {
                return prefix + '/' + dir;
            }));
        }
    } else if (cmd.name === 'open') {
        var files = Object.keys(cwd).filter(function(key) {
            return is_file(cwd[key]);
        });
        callback(files);
    } else {
        callback(Object.keys(commands));
    }
};
////THIS BEGINS CODERIP
////THIS ENDS CODERIP
var term = $('.cmdcontent').terminal(commands, {
    animation,
    greetings: red("Error: Unable to access A.L.E.X.I.O.S.-Terminal, Horus node appears offline. Intercepting nearest rogue communications.") + val1.innerHTML + red("ERROR: Decryption Failure. Un［r|d］efined media codecs not found. Displaying as rawtext.") + blue(RobinMech.innerHTML) + val5.innerHTML + "30DE terminal currently open. Please type help for a list of commands.",  
    prompt: prompt(),
    completion: completion,
    // detect iframe codepen preview
    enabled: $('body').attr('onload') === undefined,
});

// for codepen preview
if (!term.enabled()) {
    term.find('.cursor').addClass('blink');
}
function prompt(type) {
    return function(callback) {
        var prompt;
            prompt = 'admin@GHMC:/' + path.join('/') + '$ ';
        $('.title').html(prompt);
        callback(prompt);
    };
}

$('#type').on('change', function() {
    shell.removeClass('osx windows ubuntu default custom').addClass(this.value);
    term.toggleClass('underline-animation', this.value == 'windows');
    term.set_prompt(prompt(this.value));
});
$('#dark').on('change', function() {
    shell.removeClass('dark light');
    if (this.checked) {
        shell.addClass('dark');
    } else {
        shell.addClass('light');
    }
});
$('#type, #dark').on('change', function() {
    setTimeout(function() {
        term.focus();
    }, 400);
});

