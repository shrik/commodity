# -*- coding: utf-8 -*-
import scrapy


class TmallShopSpider(scrapy.Spider):
    name = "tmall_shop"
    allowed_domains = ["tmall.com"]

    def parse(self, response):
        pass


    def start_requests(self):
        url = "https://deejdyf.yao.95095.com/category.htm"
        return [scrapy.Request(url,callback=self.parse)]

