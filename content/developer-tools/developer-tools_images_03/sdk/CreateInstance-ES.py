#!/usr/bin/env python
#coding=utf-8

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
client = AcsClient('<accessKeyId>', '<accessSecret>', 'ap-northeast-1')

request = CommonRequest()
request.set_accept_format('json')
request.set_method('POST')
request.set_protocol_type('https') # https | http
request.set_domain('elasticsearch.ap-northeast-1.aliyuncs.com')
request.set_version('2017-06-13')

request.add_header('Content-Type', 'application/json')
request.set_uri_pattern('/openapi/instances')
body = '''{
    "paymentType": "postpaid",
    "nodeAmount": "2",
    "instanceCategory": "x-pack",
    "esAdminPassword": "es_password1",
    "esVersion": "6.7",
    "nodeSpec": {
        "spec": "elasticsearch.sn1ne.large",
        "disk": "20",
        "diskType": "cloud_ssd"
    },
    "networkConfig": {
        "type": "vpc",
        "vpcId": "vpc-6we6gahp387ucs4cyi1mg",
        "vsArea": "ap-northeast-1a",
        "vswitchId": "vsw-6we2znwytf5fylhpe3z95"
    }
}'''
request.set_content(body.encode('utf-8'))

response = client.do_action_with_exception(request)

# python2:  print(response) 
print(str(response, encoding = 'utf-8'))