import http.client
import json
import re
import os

addr = '127.0.0.1'
port = ':4040'

target = addr + port

conn = http.client.HTTPConnection(target)


body = json.dumps({
    "username":"admin",
    "password":"123456"
})

conn.request('POST','/api/login_in',body=body)
response = conn.getresponse()

if (response.status!=200):
    print("连接后端失败！")
    exit()

s = response.read(amt=None).decode()
resp = json.loads(s)
print(resp)
header={
    "Authorization": "Bearer " + resp["data"]["token"]
}

# header = {}


while (True):
    api = input('选择API:')

    f = open('api_list.json','r',encoding='UTF-8')
    list = json.load(f)
    f.close()

    request = {}
    for i in list:
        if (api==i['url']):
            request = i
    if (request=={}):
        print("不存在此API")
        continue
    
    print(request)

    conn2 = http.client.HTTPConnection(target)
    if request['method']=='POST':
        conn2.request(request['method'],request['url'],json.dumps(request['body']),header)
    else:
        conn2.request(request['method'],request['url'],None,header)
    response2 = conn2.getresponse()
    resp = response2.read().decode()
    print(resp)
    print('--------------------------------------------------')