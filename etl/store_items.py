# encoding=utf-8

import sqlalchemy
import re
import datetime
from db import session as db_session
import sys
import json
import os
import commands
import util
from item_schema import Item


# session.query(User).order_by(User.id)

def get_sku_id(url):
    # https://detail.tmall.com/item.htm?id=17181752153&rn=27d5879a35af4a813e5d09b3ac64f224
    # match = re.search(re.compile(r"(webdownload\.asp\?uname=bitstyle11&did=.+\d+)", re.MULTILINE), response.body.decode('gbk','ignore') )
    match = re.search(r"\d+", re.search(r"id=(\d+)",url).group())
    sku_id = match.group()
    return sku_id




def new_item(item):
    record = Item()
    record.name = item['name']
    record.price = int(util.extract_float(item['price']) * 100)
    record.total_sale_num = util.extract_num(item['total_sale_num'])
    record.rate_num = util.extract_num(item['rate_num'])
    record.url = item['url']
    record.sku_id = get_sku_id(item['url'])
    record.date_i = int(datetime.date.today().strftime("%Y%m%d"))
    return record


def update_item(db_item,item):
    db_item.name = item['name']
    db_item.price = int(util.extract_float(item['price']) * 100)
    db_item.total_sale_num = util.extract_num(item['total_sale_num'])
    db_item.rate_num = util.extract_num(item['rate_num'])
    db_item.url = item['url']
    db_item.sku_id = get_sku_id(item['url'])
    db_item.date_i = int(datetime.date.today().strftime("%Y%m%d"))
    return db_item


# crawl items from store page
path = os.path.dirname(os.path.abspath(__file__))
js_dir = path + "/../spiders/csp"
cmd = "casperjs --ssl-protocol=any --ignore-ssl-errors=true %s/store.js --store-url='%s' --dir-path='%s'" % (js_dir, sys.argv[1], js_dir)
print("cmd: %s" % cmd)
lines = util.casper_result(commands.getstatusoutput(cmd)[1])
items = []
for line in lines:
    for item in json.loads(line):
        items.append(item)

# store items to mysql
for item in items:
    sku_id = get_sku_id(item['url'])
    db_item = db_session.query(Item).filter_by(sku_id=sku_id).first()
    if db_item:
        update_item(db_item,item)
    else:
        db_item = new_item(item)
        db_item.data_status = 1
        db_session.add(db_item)

db_session.commit()













