##
# Copyright (c) 2013 Mario Gutierrez <mario@projmate.com>
#
# See the file LICENSE for copying permission.

exports.project = (pm) ->
  f = pm.filters()
  $ = pm.shell()

  pm.registerTasks
    dist:
      pre: ["addCopyright"]

    addCopyright:
      desc: "Adds copyright to files"
      files: [
        "lib/**/*js"
        "test/**/*js"
        "index.js"
        "Projfile.coffee"
      ]

      development: [
        f.addHeader(filename: "doc/copyright.js", $if: {extname: ".js"})
        f.addHeader(filename: "doc/copyright.coffee", $if: {extname: ".coffee"})
        f.writeFile
      ]

