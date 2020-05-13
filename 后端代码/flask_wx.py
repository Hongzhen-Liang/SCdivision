
# coding=utf8
import sys
from flask import Flask,render_template,request,json
import pymysql
import time




app = Flask(__name__)
@app.route('/')
def hello_world():
    return "It''s working"


@app.route('/index',methods=['POST'])
def index():
    upload = str(json.loads(request.values.get("wxid")))
    print(upload)
    return json.dumps(upload)



# 出库函数
@app.route('/send',methods=['POST'])
def send():
    upload = str(json.loads(request.values.get("upload")))
    upload_list = upload.split(',')
    if len(upload_list)!=3:
        return json.dumps('错误二维码')

    # print(upload_list)
    conn = pymysql.connect(host='127.0.0.1', user='scnu',password='scd',database='scd',charset='utf8')
    # 得到一个可以执行SQL语句的光标对象
    cursor = conn.cursor()
    # 定义要执行的SQL语句
    sql = "insert into depot(id,type,price,submission_date) values(%s,%s,%s,%s);"
    # 执行SQL语句
    id1,type1,price,submission_date = upload_list[0],upload_list[1],upload_list[2],time.strftime("%Y%m%d")  # 'AA3002059','C',203.5,time.strftime("%Y%m%d")
    try:
        res=cursor.execute(sql,[id1,type1,price,submission_date])
        # 涉及写操作要注意提交
        conn.commit()
    except pymysql.err.IntegrityError:
        res=2
    finally:
        # 关闭光标对象
        cursor.close()
        # 关闭数据库连接
        conn.close()
    if res==1:
        # print res
        res='数据提交成功'
        return json.dumps(res)
    else:
        if res==2:
            return json.dumps('数据重复')
        # print(res)
        res='数据提交失败'
        return json.dumps(res)
    return json.dumps(upload)

# 入库函数
@app.route('/delete',methods=['POST'])
def delete():
    upload = str(json.loads(request.values.get("upload")))
    upload_list = upload.split(',')
    print(upload_list)
    conn = pymysql.connect(host='127.0.0.1', user='scnu',password='scd',database='scd',charset='utf8')
    # 得到一个可以执行SQL语句的光标对象
    cursor = conn.cursor()
    # 先查询商品在不在库中
    id1= upload_list[0]
    sql = "select * from depot where id = %s"
    res=cursor.execute(sql,[id1])
    message = cursor.fetchall()
    if not message:
        return json.dumps('商品未入库')
    elif message[0][4]==0:
        return json.dumps('商品已出库')
    elif message[0][5]==0:
        return json.dumps('未允许出库')

    # 将status置为0表示出库
    # 定义要执行的SQL语句
    sql = "update depot set status=0 where id=%s;"
    try:
        res=cursor.execute(sql,[id1])
        message = cursor.fetchall()
        # 涉及写操作要注意提交
        conn.commit()
    finally:
        # 关闭光标对象
        cursor.close()
        # 关闭数据库连接
        conn.close()
    if res==1:
        return json.dumps('出库成功')
    else:
        return json.dumps(res)
    return json.dumps('商品未入库或已出库')

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True,port=80)
