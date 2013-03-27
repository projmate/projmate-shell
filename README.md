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

Name        | Description                       | Example
------------|-----------------------------------|---------
coffee      | Runs a CoffeeScript script        | `$.coffee('hello.coffee')`
inside      | Run operations within a directory | `$.inside('build', function(){})`
node        | Runs a node script                | `$.node('hello.coffee')`
open        | Opens a document                  | `$.open('index.html')`
run         | Runs a single command             | `$.run('cat test.js test1.js')`
runner      | Chain sequence of commands        | `$.runner.run('echo $PATH').node('script.js').start()`
wget        | Downloads a file                  | `$.wget('http://github.com', 'index.html')`
which       | Finds exe in [node_modules, path] | `$.which('coffee')`


## License

Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>

See the file LICENSE for copying permission.


