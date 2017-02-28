var casper = require('casper').create();
casper.start('https://www.baidu.com/');

casper.on("remote.message", function(msg,backtrace){
    this.echo(msg);
});

casper.on('step.error', function(err) {
    this.die("Step has failed: " + err);
});

function HelloWorld(document){
  this.evaluate(function(){
    var a = document.querySelector(".aas");
    this.console.log("hello world");
  });
    
}

casper.then(function() {
    HelloWorld.call(this, document);
});

casper.run();