# commodity

select name,url,price*0.01 as '价格',total_sale_num as '总销量',rate_num as '评价数',store_name as '店铺名称',month_sale_num as '月销量',accumulate_rate_num as '累计评价数',promotion_price*0.01 as '促销价',stock as '库存' from items;