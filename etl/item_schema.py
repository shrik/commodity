# encoding=utf-8

import sqlalchemy
import re
import datetime
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
from sqlalchemy import Column, Integer, String, DateTime, Text, text

# TODO 促销价格等需要更复杂的逻辑
# TODO 选择套餐类型等
class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    url = Column(String(255))
    data_status = Column(Integer) #default 0: crawled from list, 1: crawled from detail page
    create_time = Column(DateTime, server_default=text('NOW()'))
    update_time = Column(DateTime, server_default=text('NOW()'))
    price = Column(Integer)
    total_sale_num = Column(Integer)
    rate_num = Column(Integer)
    sku_id = Column(String(255))
    store_name = Column(String(255))
    month_sale_num = Column(Integer)
    accumulate_rate_num = Column(Integer)
    promotion_price = Column(Integer)
    date_i = Column(Integer)
    stock = Column(Integer)
    item_attr = Column(Text(65536))
    
    def __repr__(self):
        return "<User(name='%s', id='%s', sku_id='%s', store_name='%s')>" % (self.name, self.id, self.sku_id, self.store_name)


