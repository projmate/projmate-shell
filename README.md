# projmate-shell

Helpers to simplify Node.js scriptingand within projmate Projfiles specifically.

## Examples

Require it

    var $ = require('projmate-shell');

To run single command

    $.run('cat test.js test2.js > test3.js');

To run multiple node and CoffeeScript scripts

    $.runner
      .run('cat test.js test1.js > test2.js')
      .node('test.js arg1 arg2')
      .coffee('other.coffee')           # uses local coffee if it exists
      .start(cb);

Shell shares prototype with [ShellJS](https://github.com/arturadib/shelljs)

    $.cp('-rf', 'client/css', 'public/css');

## New Methods

Name | Description | Example
-----|-------------|---------
inside | Run operations within a directory | `$.inside('build', function(){})`
open | Opens a document | `$.open('index.html')`
run | Runs a single command | `$.run('cat test.js test1.js')`
which | Enhanced which which searches node_modules | `$.which('coffee')`


## License

Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>

See the file LICENSE for copying permission.


