# shelltest
[![Build Status](https://travis-ci.org/jolshevski/shelltest.svg?branch=master)](https://travis-ci.org/jolshevski/shelltest)

JS acceptance testing framework for CLI applications.


## Purpose
This framework is intended to serve as a friendly layer of abstraction for testing the stdout, stderr, and exit code of shell commands. It's like supertest, but for CLI apps.


## Example
```javascript
shelltest()
.cmd("/usr/bin/my_command")
.expect('stdout', /^regex.match/)
.end();
```

### With Mocha
```javascript
it('should run the command', function(done){
  shelltest()
  .cmd("/usr/bin/my_command")
  .expect('stdout', /^match/)
  .expect(0)
  .end(done);
});
```


## API

### .cmd(command)
Sets the command to be executed.
```javascript
.cmd("/bin/my_command")
```

### .expect(value, match)
Adds an assertion.  All assertions are evaluated when `.end(fn)` is called.
```javascript
.expect('stderr', /^regex.match/) //Asserts stderr
.expect('stdout', 'string match') //Asserts stdout
.expect(0)                        //Asserts exit code
```

### .cwd(cwd)
Sets `child_process` cwd option.
```javascript
.cwd('/var')
```

### .env(env)
Sets `child_process` env option.
```javascript
.env({"PATH": "/usr/cust:/usr/bin"})
```

### .timeout(timeout)
Sets `child_process` timeout option.
```javascript
.timeout(10)
```

### .uid(uid)
Sets `child_process` uid option.
```javascript
.uid(0)
```

### .gid(gid)
Sets `child_process` gid option.
```javascript
.gid(0)
```

### .end(fn)
Executes command and evaluates assertions. Callback is fired without arguments.
```javascript
.end(callback_function)
```
