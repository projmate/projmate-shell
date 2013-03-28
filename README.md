# projmate-shell

Cross-platform shell utiliites. It's the `$` in Projfiles.

## Examples

Require it

    var $ = require('projmate-shell');

Shell extends [ShellJS](https://github.com/arturadib/shelljs)

    $.cp('-rf', 'client/css', 'public/css');

To run single command

    $.run('cat test.js test2.js > test3.js');

To run multiple node and CoffeeScript scripts

    $.runner
      .run('cat test.js test1.js > test2.js')
      .node('test.js arg1 arg2')
      .coffee('other.coffee')           # uses local coffee if it exists
      .start(cb);


## Methods

Name        | Description                       | Example
------------|-----------------------------------|---------------------------------------------------------------------
coffee      | Runs a CoffeeScript script        | `$.coffee('hello.coffee')`
inside      | Run operations within a directory | `$.inside('build', callback){})`
node        | Runs a node script                | `$.node('hello.js')`
open        | Opens a document                  | `$.open('index.html')`
outdated    | Tests if arg1 older than arg2     | `$.outdated(file, againstFile)`
run         | Runs a single command             | `$.run('cat test.js test1.js')`
runner      | Chain sequence of commands        | `$.runner.run('echo $PATH').node('script.js').start()`
unpack      | Unpack (.tar|.tar.gz|.zip) archives| `$.unpack('archive.tgz', 'components', callback)`
wget        | Downloads a file                  | `$.wget('http://github.com', 'index.html')`
which       | Finds exe in [node_modules, path] | `$.which('coffee')`


## Attributes

Name        | Description                       | Example
------------|-----------------------------------|---------------------------------------------------------------------
HOME        | User's home directory             | `console.log('Home: ', $.HOME)`
isWindows   | Test if running on Windows.       | `$.isWindows && console.log('Running on Windows.')`
isMac       | Test if running on Darwin.        | `$.isMac && console.log('Running on Mac.')`
isLinux     | Test if running on Linux.         | `$.isLinux && console.log('Running on Linux.')`

## License

Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>

See the file LICENSE for copying permission.


