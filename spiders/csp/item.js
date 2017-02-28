




var casper = require('casper').create({
    // verbose: true,
    // logLevel: 'debug',
    // sslProtocol: 'any',
    // ignoreSslErrors: true,
    // 'javascript.options.strict': false,

    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    }
    // onError: function(msg, backtrace){this.echo("msg")}
});


casper.on("resource.error", function(resourceError){
    // this.echo('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
    // this.echo('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
});

// url = "https://detail.yao.95095.com/item.htm?id=19639953532"

var url = casper.cli.get('item-url');

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36');

// casper.on("page.error", function(msg, backtrace) {
//      var msgStack = ['Page Error: ' + msg];
//      //TODO add backtrace
//       // if (backtrace && backtrace.length) {
//       //   msgStack.push('TRACE:');
//       //   backtrace.forEach(function(t) {
//       //     msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
//       //   });
//       // }
//       this.echo(msgStack.join('\n'),"ERROR");
// });


casper.on('step.error', function(err, backtrace) {
     this.die("Step has failed: " + err);
});


casper.on("remote.message", function(msg,backtrace){
    // this.echo("Remote Msg: "+msg); TODO
});

casper.start(url);


function parseItem(document) {
    var item = this.evaluate(function(){
        if(document.querySelector(".slogo .slogo-shopname strong")){
          var shop_name = document.querySelector(".slogo .slogo-shopname strong").innerHTML  
        } else if(document.querySelector("#mallLogo .mlogo a")){
          var shop_name = document.querySelector("#mallLogo .mlogo a").title  
        }
        var pannel = document.querySelector(".tm-ind-panel");
        if(pannel){
            var month_sale_num = pannel.querySelector("[data-label='月销量'] .tm-count").innerHTML
            if(pannel.querySelector("#J_ItemRates .tm-count")){
                var accumulate_rate_num = pannel.querySelector("#J_ItemRates .tm-count").innerHTML
            }else{
                var accumulate_rate_num = -1
            }
        }else{
            accumulate_rate_num = -1
            month_sale_num = -1
        }

        if(document.querySelector("#detail .tm-price")){
            var promotion_price = document.querySelector("#detail .tm-price").innerHTML;
        }else{
            var promotion_price = -1;
        }
        if(document.querySelector("#J_EmStock")){
            var stock = document.querySelector("#J_EmStock").innerHTML;            
        }else{
            var stock = -1
        }
        if(document.querySelector("#J_AttrUL")){
            var item_attr = document.querySelector("#J_AttrUL").innerHTML; 
            item_attr = encodeURI(item_attr);
        }else{
            var item_attr = "无"
        }
        
        // var accumulate_rate_num = pannel.querySelector("#J_ItemRates .tm-count").innerHTML
        return {"month_sale_num": month_sale_num, "accumulate_rate_num": accumulate_rate_num, "shop_name": shop_name, "stock": stock, "item_attr": item_attr, "promotion_price": promotion_price}
        // this.console.log(accumulateRateNum);
    });
    this.echo("Browser Spider:" + JSON.stringify(item));
}



casper.waitFor(function check() {
    return this.evaluate(function() {
        return document.querySelectorAll('.tm-ind-panel').length > 0 || document.querySelectorAll('#J_TabBarBox').length > 0;
    });
}, function then() {
    // this.echo("Hello");
    // this.capture("screen_capture.png");
    parseItem.call(this, document);
}, function timeout(){
    // this.echo(this.getHTML());
    this.echo("Haha Timeout");
    this.capture("screen_capture.png");
}, 10 * 1000);

// casper.thenOpen(nextPage, function parseItems(){
//     if(hasNext){

//     }else{

//     }
// })


casper.run();


