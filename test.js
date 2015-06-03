var shelltest = require("./shelltest");

shelltest()
.cmd("ls -l")
.expect(0)
.end();
