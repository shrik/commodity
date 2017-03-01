# encoding=utf-8

import sqlalchemy
import re
import datetime
import util
import urllib
from item_schema import Item
from db import session as db_session
import os
from ipdb import set_trace



items_to_crawl = db_session.query(Item).filter_by(data_status=1).all()

import commands
import json
# {"accumulate_rate_num":"14176","month_sale_num":"94","shop_name":"东阿阿胶大药房旗舰店"}
path = os.path.dirname(os.path.abspath(__file__))
js_dir = path + "/../spiders/csp"

def crawl_item(item):
    cmd = "casperjs --engine=slimerjs --ssl-protocol=any --ignore-ssl-errors=true %s/item.js --item-url='%s'" % (js_dir, item.url)
    print("cmd: %s" % cmd)
    result = util.casper_result(commands.getstatusoutput(cmd)[1])[0]
    js = json.loads(result)
    item.month_sale_num = util.extract_num(js['month_sale_num'])
    item.store_name = js['shop_name']
    item.accumulate_rate_num = util.extract_num(js['accumulate_rate_num'])
    item.stock = util.extract_num(js['stock'])
    item.item_attr = urllib.unquote(js['item_attr']).encode('latin-1').decode("utf8")
    item.promotion_price = util.extract_float(js['promotion_price']) * 100
    # set_trace()
    item.data_status = 2
    return item

import time

for item in items_to_crawl:
    updated_item = crawl_item(item)
    # time.sleep(3)
    # session.update(updated_item)
    db_session.commit()




