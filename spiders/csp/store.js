var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    },
    // waitTimeout: 10*10000,
    // clientScripts: [+ '/jquery-3.1.1.min.js']

    // onError: function(msg, backtrace){this.echo("msg")}
});




var dir = casper.cli.get('dir-path');
casper.options.clientScripts = [dir + "/jquery-3.1.1.min.js"]

casper.on("page.error", function(msg, backtrace) {
     var msgStack = ['Page Error: ' + msg];
     //TODO add backtrace
      // if (backtrace && backtrace.length) {
      //   msgStack.push('TRACE:');
      //   backtrace.forEach(function(t) {
      //     msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
      //   });
      // }
      this.echo(msgStack.join('\n'),"ERROR");
});


casper.on('step.error', function(err, backtrace) {
     this.die("Step has failed: " + err);
});


casper.on("remote.message", function(msg,backtrace){
    this.echo("Remote Msg: "+msg);
});

function hasNextPage(){
    return this.evaluate(function() {
        return document.querySelectorAll('.pagination .next').length > 0;
    });
}

function nextPageURL(){
    return this.evaluate(function() {
        return document.querySelector('.pagination .next').href;
    });
}

function executeParse(){
    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('.J_TItems .pagination').length > 0;
        });
    }, function then() {
        // this.capture("screen_capture.png");
        parseItems.call(this, document);
        if(hasNextPage.call(this)){
            this.wait(3 * 1000 , function(){
                var nextPage= nextPageURL.call(this)
                casper.thenOpen(nextPage, executeParse)
            })
        }
    });
}

var url = casper.cli.get('store-url');
// var url = "https://runhuansb.tmall.com/category.htm"
// var url = "https://deejdyf.yao.95095.com/category.htm"
casper.start(url , executeParse);

function parseItems(document) {
    // this.echo('First Page: ' + this.getTitle());
    var items = this.evaluate(function(){
        var itemsBag = document.querySelector(".J_TItems");
        var line_selector = "";
        if(itemsBag.querySelector(".item4line1")){
            line_selector = ".item4line1";
        }else{
            line_selector = ".item5line1";
        }
        var $j = jQuery.noConflict();
        var jLinesBag = $j(".J_TItems .pagination").prevAll();
        // var linesBag = itemsBag.querySelectorAll(line_selector);

        function extractItems(jLinesBag){
            var items = [];
            jLinesBag.each(function(i, line){
                var lineBag = line.querySelectorAll(".item");
                for(var j=0; j < lineBag.length; j++){
                    itemBag = lineBag[j]
                    item = {}
                    item['name'] = itemBag.querySelector(".detail .item-name").text;
                    item['url'] = itemBag.querySelector(".detail .item-name").href;
                    item['price'] = itemBag.querySelector(".detail .attribute .c-price").innerHTML; //TODO Strip
                    item['total_sale_num'] = itemBag.querySelector(".detail .attribute .sale-num").innerHTML;
                    if(itemBag.querySelector(".rates span")){
                        item['rate_num'] = itemBag.querySelector(".rates span").innerHTML;    
                    }else{
                        item['rate_num'] = "None"
                    }
                    items.push(item)
                }
            })
                
            return items
        }
        // this.console.log(linesBag.length);
        return extractItems(jLinesBag);
    });
    this.echo("Browser Spider:" + JSON.stringify(items));
}



casper.run();