//https://list.tmall.com/search_product.htm?
//spm=a220m.1000858.1000724.4.7CwVbY&
//brand=3228590&q=%B6%AB%B0%A2%B0%A2%BD%BA
//&sort=d&style=g&from=95095.detail.pc_1_searchbutton
//&smAreaId=110100#J_Filter

//https://list.tmall.com/search_product.htm?
//spm=a220m.1000858.1000724.1.VwP9PA
//&brand=3228590&q=%B6%AB%B0%A2%B0%A2%BD%BA
//&sort=s&style=g&from=95095.detail.pc_1_searchbutton
//&smAreaId=110100#J_Filter

var casper = require('casper').create({
    // verbose: true,
    // logLevel: 'debug',
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    }
    // onError: function(msg, backtrace){this.echo("msg")}
});

// url = "https://list.tmall.com/search_product.htm?q=%B6%AB%B0%A2%B0%A2%BD%BA&type=p"
var url = casper.cli.get('search-url');

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36');

casper.on("page.error", function(msg, backtrace) {
     var msgStack = ['Page Error: ' + msg];
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
        return document.querySelectorAll('.ui-page .ui-page-next').length > 0;
    });
}

function nextPageURL(){
    return this.evaluate(function() {
        return document.querySelector('.ui-page .ui-page-next').href;
    });
}

function nextPageNum(){
    return this.evaluate(function() {
        return parseInt(document.querySelector('.ui-page .ui-page-cur').innerHTML, 10) + 1;
    });
}
// ?spm=a220m.1000858.0.0.rzB9N4&brand=3228590&s=60&q=%B6%AB%B0%A2%B0%A2%BD%BA&sort=s&style=g&from=.shop.pc_1_searchbutton&smAreaId=110100&type=pc#J_Filter

function crawlNextPage(){
    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('.ui-page').length > 0;
        });
    }, function then() {
        // this.capture("screen_capture.png");
        parseItem.call(this, document);
        if(hasNextPage.call(this) && nextPageNum.call(this) <= 5){
            casper.open(nextPageURL.call(this), crawlNextPage())
        }
    }, function timeout(){
        this.echo("Haha Timeout");
        this.capture("screen_capture.png");
    }, 10 * 1000);
}

function parseItem(document) {
    var crawled_items = this.evaluate(function(){
        var products = document.querySelectorAll("#J_ItemList .product");
        items = [];
        for(var i = 0; i < products.length; i++){
            var item = {}
            var product = products[i];
            item['name'] = product.querySelector(".productTitle a").title;
            item['url'] = product.querySelector(".productTitle a").href;    
            item['price'] = product.querySelector(".productPrice em").title;
            if(product.querySelectorAll(".productStatus").length > 0 ){
                item['month_sale_num'] = product.querySelector(".productStatus em").innerHTML;
            }else{
                item['month_sale_num'] = -1
            }
            items.push(item)
        }
        return items
    });
    this.echo(JSON.stringify(crawled_items));
}


casper.start(url, crawlNextPage);


casper.run();


