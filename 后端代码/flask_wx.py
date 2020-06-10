MySql

在root权限下做

1.创建用户:create user scnu identified by 'scd';

2.创建数据库:create DATABASE scd;

清空表:truncate table;

3.create table depot(
id varchar(30) primary key not null,
type varchar(5),
price float,
submission_date DATE,
status int default 1,
agree_modify default 0,
lng_lat varchar(30) default "0,0"
);

(添加新的一列 alter table depot add column status int default 1;)

3.赋予权限给scnu用户
grant all privileges on scd.* to scnu@'localhost' identified by 'scd';
flush privileges;

4.手动开启agree_modify:
update depot set agree_modify=1;

+-----------+------+-------+-----------------+--------+--------------+-------------------+
| id        | type | price | submission_date | status | agree_modify | lng_lat           |
+-----------+------+-------+-----------------+--------+--------------+-------------------+
| AA3002020 | C    |   203 | 2020-05-25      |      1 |            0 | 118.7964732.05838 |
+-----------+------+-------+-----------------+--------+--------------+-------------------+



用户数据表

1.use scd

2.create table users(
    userId varchar(50) primary key not null,
    realName varchar(20),
    position varchar(10) default 'default'，
    addmited varchar(2) default '1'
);

!!!注意初始化的属性是latin1,无法输入中文,要改成utf8
show create table users;
alter table users  modify realName  varchar(20) character set utf8;

3.insert into users(userId,realName,position) values('oBtgM5Ji7828jqbyQYM3KhMRJOeE','胡翔','admin'); 
# 'oBtgM5O3YiWv5qT_QTJ__nAFXdhs','梁鸿振','admin'
insert into users(userId,realName,position) values('oBtgM5O3YiWv5qT_QTJ__nAFXdhs','梁鸿振','admin');



 