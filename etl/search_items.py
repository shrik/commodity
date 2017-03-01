# encoding=utf-8

import sqlalchemy
import re
import datetime
import json
import os
from db import session as db_session
import sys
import util
from item_schema import Item
import commands

def get_sku_id(url):
    # https://detail.tmall.com/item.htm?id=17181752153&rn=27d5879a35af4a813e5d09b3ac64f224
    # match = re.search(re.compile(r"(webdownload\.asp\?uname=bitstyle11&did=.+\d+)", re.MULTILINE), response.body.decode('gbk','ignore') )
    match = re.search(r"\d+", re.search(r"id=(\d+)",url).group())
    sku_id = match.group()
    return sku_id

def new_item(item):
    record = Item()
    record.name = item['name']
    record.price = util.extract_float(item['price']) * 100
    record.total_sale_num = util.extract_num(item['month_sale_num'])
    record.rate_num = util.extract_num(item['rate_num'].strip())
    record.url = item['url']
    record.sku_id = get_sku_id(item['url'])
    record.date_i = int(datetime.date.today().strftime("%Y%m%d"))
    return record


path = os.path.dirname(os.path.abspath(__file__))
js_dir = path + "/../spiders/csp"
cmd = "casperjs --ssl-protocol=any --ignore-ssl-errors=true %s/search.js --dir-path='%s' --search-url='%s'" % (js_dir, js_dir, sys.argv[1])
print("cmd: %s" % cmd)
items = []
for line in util.casper_result(commands.getstatusoutput(cmd)[1]):
    for item in json.loads(line):
        items.append(item)


def update_item(db_item, item):
    db_item.price = util.extract_float(item['price']) * 100
    db_item.total_sale_num = util.extract_num(item['month_sale_num'])
    db_item.rate_num = util.extract_num(item['rate_num'].strip())
    db_item.date_i = int(datetime.date.today().strftime("%Y%m%d"))
    return db_item


for item in items:
    sku_id = get_sku_id(item['url'])
    db_item = db_session.query(Item).filter_by(sku_id=sku_id).first()
    if db_item:
        update_item(db_item, item)
    else:
        db_item = new_item(item)
        db_item.data_status = 1
        db_session.add(db_item, item)

db_session.commit()













