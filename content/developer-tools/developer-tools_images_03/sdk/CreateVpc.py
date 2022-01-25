#!/usr/bin/env python
#coding=utf-8

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkvpc.request.v20160428.CreateVpcRequest import CreateVpcRequest

client = AcsClient('<accessKeyId>', '<accessSecret>', 'ap-northeast-1')

request = CreateVpcRequest()
request.set_accept_format('json')

request.set_CidrBlock("172.16.0.0/12")
request.set_VpcName("sdk_vpc")
request.set_Description("from openAPI sdk")

response = client.do_action_with_exception(request)
# python2:  print(response) 
print(str(response, encoding='utf-8'))
