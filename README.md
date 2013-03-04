# projmate-shell

Helpers to simplify Node.js scriptingand within projmate Projfiles specifically.

## Examples

To run multiple node and CoffeeScript scripts, with the ability to interact
in the console.

    sh.runner
      .node('test.js arg1 arg2')
      .coffee('other.coffee')           # uses local coffee if it exists
      .start(cb);

Shell shares prototype with [ShellJS](https://github.com/arturadib/shelljs)

    sh.cp('-rf', 'client/css', 'public/css');

## License

Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>

See the file LICENSE for copying permission.


