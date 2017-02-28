# encoding=utf-8

import sqlalchemy
import re
import datetime



items_to_crawl = session.query(Item).filter_by(data_status=1).all()

import commands
import json
# {"accumulate_rate_num":"14176","month_sale_num":"94","shop_name":"东阿阿胶大药房旗舰店"}
def crawl_item(item):
    cmd = "casperjs --engine=slimerjs --ssl-protocol=any --ignore-ssl-errors=true /Users/yuchaoma/workspace/lab/commodity/commodity/spiders/csp/item.js --item-url='%s'" % item.url
    print("cmd: %s" % cmd)
    for res in commands.getstatusoutput(cmd)[1].strip().split("\n"):
        if res.startswith("Browser Spider:"):
            result = res.replace("Browser Spider:", "")
    print(result)
    js = json.loads(result)
    item.month_sale_num = js['month_sale_num']
    item.store_name = js['shop_name']
    item.accumulate_rate_num = js['accumulate_rate_num']
    item.stock = js['stock']
    item.item_attr = js['item_attr']
    item.promotion_price = js['promotion_price']
    #"stock": stock, "item_attr": item_attr, "promotion_price"
    item.data_status = 2
    return item

import time

for item in items_to_crawl:
    updated_item = crawl_item(item)
    # time.sleep(3)
    # session.update(updated_item)
    session.commit()




