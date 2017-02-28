# encoding=utf-8

import sqlalchemy
import re
import datetime
from db import session as db_session
import sys
import json
import os


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
    record.price = int(float(item['price'].strip()) * 100)
    record.total_sale_num = int(item['total_sale_num'].strip())
    # record.name = int(item['rate_num'].strip())
    record.url = item['url']
    record.sku_id = get_sku_id(item['url'])
    record.date_i = int(datetime.date.today().strftime("%Y%m%d"))
    return record


# crawl items from store page
path = os.path.dirname(os.path.abspath(__file__))
js_path = path + "/../spiders/csp/item.js"
cmd = "casperjs --ssl-protocol=any --ignore-ssl-errors=true %s --store-url='%s'" % (js_path, sys.argv[1])
print("cmd: %s" % cmd)
items = []
for line in commands.getstatusoutput(cmd)[1].strip().split("\n"):
    if line != "":
        for item in json.loads(line):
            items.append(item)

# store items to mysql
for item in items:
    db_item = new_item(item)
    # if db_item:
    #     update_db_item(db_item)
    if not session.query(Item).filter_by(sku_id=db_item.sku_id).first():
        db_item.data_status = 1
        session.add(db_item)

db_session.commit()













