---
title: "FCで日中間のOSSファイル転送"
metaTitle: "FunctionComputeを利用して日本と中国リージョン間でOSSファイル転送を実現"
metaDescription: "FunctionComputeを利用して日本と中国リージョン間でOSSファイル転送を実現"
date: "2020-03-18"
author: "SBC engineer blog"
thumbnail: "/Storage_images_26006613533484900/20200311160651.png"
---


## FunctionComputeを利用して日本と中国リージョン間でOSSファイル転送を実現

本記事では、FunctionComputeを利用して日本と中国リージョン間でOSSファイル転送をする方法をご紹介します。    

## 前書き

現在世界中にグロバール化が進んでいる一方、クラウドサービスを利用も拡大し、グローバルリージョンをまたがるファイル同期のニーズが高まっています。コスト抑えてリージョンをまたがるファイル転送とファイル同期は課題となっています。    

実現方法が色々ありますが、今回では、OSSとFunction Computeを利用して迅速にファイルを同期しますソリューションを一つ実践してみます。     

## シナリオ

構成図は下記のように設定します。    

![20200311160651](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311160651.png "20200311160651")

* アプリサーバが同じリージョンにあるOSSへファイルの処理・アップロードをします    
* アップロードはVPC内のイントラネットを経由します     
* ファイルアップロードと同時にFunction Computeから関数の呼び出しをトリガーします    
* 呼び出された関数でファイルをリモートリージョンのOSSへ同期します    

## Function Compute によりファイル同期検証

今回は中国北京リージョンを転送元、東京を転送先として実行します。    

１、[OSSコンソール](https://home.console.aliyun.com)にログインし、北京リージョンで転送元の OSS バケット作成    

OSS bucket名：src-bucket-test    
他設定：デフォルト   

![20200311171141](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311171141.png "20200311171141")


２、東京リージョンで転送先の OSS バケット作成

OSS bucket名：dst-bucket-test   
他設定：デフォルト   

![20200311171208](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311171208.png "20200311171208")



３、Function Computeのコンソールで、転送元の北京リージョンで関数を作成：    

![20200311154740](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311154740.png "20200311154740")

![20200311154859](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311154859.png "20200311154859")



Python3のコードのサンプルとして、下記のように関数を作成：    

```
# -*- coding: utf-8 -*-
import json
import oss2


def handler(event, context):
    evt = json.loads(event)
    logger.info("Handling event: %s", evt)
    creds = context.credentials

    # Required by OSS sdk
    auth = oss2.StsAuth(
        creds.access_key_id,
        creds.access_key_secret,
        creds.security_token)

    evt = evt['events'][0]
    
    bucket_name = evt['oss']['bucket']['name']
    endpoint = 'oss-' + evt['region'] + '.aliyuncs.com'
    bucket = oss2.Bucket(auth, endpoint, bucket_name)

    object_name = evt['oss']['object']['key']

    remote_stream = bucket.get_object(object_name)
    if not remote_stream:
        raise RuntimeError('failed to get oss object. bucket: %s. object: %s' % (bucket_name, object_name))
        return 
    print ('get object from oss success: {}'.format(object_name))

    target_bucket_name = 'dst-jp-bucket'
    target_endpoint = 'oss-ap-northeast-1.aliyuncs.com'
    target_bucket = oss2.Bucket(auth, target_endpoint, target_bucket_name)
    target_bucket.put_object(object_name, remote_stream)

    return 'success'

```
４、関数呼び出し用のトリガーも作成します。まずは「OSSトリガー」を選択：   

![20200310163615](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200310163615.png "20200310163615")



トリガーの詳細を設定します：   

![20200311171310](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311171310.png "20200311171310")

RAMロール作成が必要な場合は、ロールを作成して付与します：    

![20200310163859](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200310163859.png "20200310163859")


OSSへのアクセス権限も付与しておきます：    

![20200310164026](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200310164026.png "20200310164026")


北京リージョンのOSSにファイルをアップロードします    

![20200311155730](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311155730.png "20200311155730")


東京リージョンのOSSにも同じファイルが確認できます：    

![20200311155909](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200311155909.png "20200311155909")


LogServiceと連携している場合は、呼び出し成功のログも確認できます：

![20200310171231](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613533484900/20200310171231.png "20200310171231")

これで、FunctionComputeを利用してリージョン間のファイル同期ができます。    


## 最後に
この検証結果を踏まえ、AlibabaCloudの他のプロダクトと組み合わせて、いろんなソリューションを考案できます。    

例えば、
* 開発サーバ不要、Function computeのコードのみで運用できるため、コストを抑制できます   
* ネットワーク費用削減、CENのような高価なダイレクトアクセスを利用せずに異なるリージョン間のデータ転送を実現     
* ファイル同期します際のみ関数呼び出し、効率的にリソースを利用    

この利点を生かした様々なソリューションを構築することが出来ます。    
