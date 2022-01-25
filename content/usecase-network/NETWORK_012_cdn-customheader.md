---
title: "CDNヘッダーキャッシング"
metaTitle: "【Albaba Cloud CDN】カスタムヘッダーを利用したキャッシングをやってみる"
metaDescription: "【Albaba Cloud CDN】カスタムヘッダーを利用したキャッシングをやってみる"
date: "2020-02-21"
author: "sbc_fukuda"
thumbnail: "/Network_images_26006613507013700/20200221010953.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## CDNカスタムヘッダーを利用したキャッシングをやってみる

# はじめに
本記事では、Albaba Cloud CDNについてをご紹介します。    

CDNというとどういうイメージがありますでしょうか？     
配信早そうとか、世界中に沢山あるとか、または設定が意外とめんどくさそう・・・、などいろいろあるかと思います。

おさらいも兼ねてAlbaba Cloud CDNの概要と、表題の活用例についてご紹介させていただきます。

<b>※本記事は Alibaba Cloud 国際サイトの内容をベースに説明しています。</b>


# Albaba Cloud CDNの概要
Albaba Cloud CDNは、一般的なCDN（Content Delivery Network）と同様、     
<b><span style="color: #1464b3">コンテンツ配信の高速化やサーバ側の負担軽減などの用途で利用されるプロダクト</span></b>です。     

構成されるCDNノード（エッジノード）は、静的コンテンツのキャッシュ機能を有し、     
地理的にエンドユーザに近い場所からコンテンツを配信する事ができる為、効率的にアクセスパフォーマンスを向上させる事が可能です。     

また、発行されるCNAMEレコードをDNSにマッピング先として登録する事により、     
サービスドメインに送信されたリスエストがすべてCDNへリダイレクトされる為、リバースプロキシとして機能します。     
※動的コンテンツもアクセラレーション可能な[DCDN](https://www.alibabacloud.com/ja/product/dcdn)は別の機会に。
     
     
#　CDNノード数
Alibaba Cloudには、世界中に**<span style="color: #ff0000">2,800以上</span>**のノードがあります（2020年2月時点）     
その中でもなんと**<span style="color: #1464b3">2,300以上のノードが中国本土に配備され、34の州の地域をカバー</span>**しています。     
多数のノードが第1層の都市と一部の州都に配備され、中国（香港）、中国（マカオ）、中国（台湾）など、     
中国本土以外では70の国と地域に500以上のノードが展開されています。

＜中国本土のCDNノード分布＞
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200217171906.png "img")      


＜中国本土以外のCDNノード分布＞
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200217171931.png "img")      



<b>中国を始めとして、多数のノードが主要なエリアをカバーしているのがおわかりになると思います。</b>

<span style="color: #1464b3">※中国本土のCDNを利用する場合は、対象ドメインのICP登録が必要となります。</span>     
  ICPについてはこちらをご参照ください。


> https://www.alibabacloud.com/cloud-tech/doc-detail/125586.html
> https://www.sbcloud.co.jp/entry/column/icp-kiso/
> https://www.sbcloud.co.jp/entry/column/icp-shinsei/


     
# アーキテクチャ・パフォーマンス
Alibaba Cloud CDNは、LVS（Layer-4）やnginxベースで開されたTengine（Layer-7）、キャッシュを実現するSwiftで構成され、     
パフォーマンスとしては、合計130 Tbit / sの帯域幅となっており、
各ノードは、10 Gbit / sの光学NIC、40 TBから1.5 PBのストレージ、     
および40 Gbit / sから200 Gbit / sの動作帯域幅をサポートしています。

＜アーキテクチャイメージ＞
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200217173910.png "img")      


     
※参考（CDN比較）
> https://www.dailyhostnews.com/cdn-comparison-aws-google-cloud-azure-ibm-alibaba-cloud



     
# Alibaba Cloudプロダクト連携
様々なエリアで利用できるCDNですが、配信基盤として下記のようなAlibaba Cloudプロダクトと連携や構成ができるようになっています。


> ・[ECS](https://www.alibabacloud.com/ja/product/ecs)     
> ・[SLB](https://www.alibabacloud.com/ja/product/server-load-balancer)     
> ・[OSS](https://www.alibabacloud.com/ja/product/oss)     
> ・[FunctionCompute](https://www.alibabacloud.com/ja/products/function-compute)     
> ・[ApsaraVideoLive](https://www.alibabacloud.com/ja/product/apsaravideo-for-live)     
> ・[ApsaraVideoVOD](https://www.alibabacloud.com/ja/products/apsaravideo-for-vod)     
> ・[WAF](https://www.alibabacloud.com/ja/product/waf)などのセキュリティプロダクト     
> ・[CloudMonitor](https://www.alibabacloud.com/ja/product/cloud-monitor)     
> など

※OSSとの連携は下記記事を参照ください。
> https://www.sbcloud.co.jp/entry/2018/04/04/cdn_url_auth/
> https://www.sbcloud.co.jp/entry/2018/10/09/oss-website/



     
中国の利用ケースとしては、[Tmall](https://www.tmall.com/)や[taobao](https://world.taobao.com/)などアリババのサービス基盤で使われており、     
ECショッピングフェスティバルの<b>独身の日（双11／ダブルイレブン）</b>でももちろん効果を発揮しています。



> https://www.alibabacloud.com/cloud-tech/doc-detail/27107.htm



> https://www.sbcloud.co.jp/entry/2019/07/29/devsumiW11/


     

# キャッシングテスト
それではECSをオリジンサーバとして利用した簡単なキャッシュ配信テストを行ってみます。

     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200221010953.png "img")      
 

今回はオリジンサーバに構築したバーチャルホストドメインのコンテンツ（画像ファイル）に対して簡単なキャッシングテストを行います。     
DNSループを回避する為、上記イメージでは例として、サービスドメイン（FQDN）：www.fukuda.cf、     
バーチャルホストドメイン：test.fukuda.cfを、[Alibaba Cloud DNS](https://www.alibabacloud.com/ja/product/dns?spm=a3c0i.13057611.1397139.dnavproductdomain3.5b9410f51GWs4p)でマッピングしています。     
※DNSや仮想サーバは、Alibaba Cloud以外でも構成可能です。

注意点としては、一部ケースを除き<font color="Red">Alibaba Cloud CDNのIP rangeは公開されていません</font>（2020年2月時点）ので、     
オリジン側のセキュリティポリシー（セキュリティグループやFW等）に特定のセグメントでhttp/https許可設定ができません。     
その為、ひとつの手法としてCDNの<b><span style="color: #1464b3">カスタムヘッダー付与を利用した接続制限</span></b>の方法をポイントとしてご紹介したいと思います。

     
# 前提条件 
・ドメイン取得およびDNS登録済     
・対象ドメインのSSL証明書の発行、アップロード済     
　※本テストでは、Let's Encryptで発行したワイルドカードドメインを利用しています     
・オリジンサーバが構築済でセキュリティグループやFW等で80や443ポートがany開放されている     
・オリジンサーバにapacheなどでWebサーバ（バーチャルホスト設定）が構築済     
・Cache-Control 等でキャッシュ無効化されていない     
 
     


# CDN設定
Alibaba Cloud CDN設定に入ります。

## ドメイン設定
管理コンソールのサービス一覧より、Alibaba Cloud CDNを選択します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192725.png "img")      

「ドメイン名」→「ドメイン名の追加」をクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192742.png "img")      

     
ドメインの基本設定では、WebサーバのIPを指定する事もできますが、今回はバーチャルホストをオリジンを指定します。     
今回テストとして下記のようにしました。

入力後、次へをクリックします。

>ドメイン：www.fukuda.cf     
ビジネスタイプ：イメージと小さなファイル     
オリジンサイト情報：オリジンサイト（test.fukuda.cf）     
ポート：ポート 443     
加速リージョン：中国本土以外 (ICP 登録不要)     

<b>※加速リージョンが「中国本土」や「グローバル」の場合、ICP登録が必要になります。</b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192758.png "img")      



### 〜Tips〜
---
ユーザがアクセスするサービスドメインとオリジンサイトドメイン（バーチャルホスト）を同じにする事はできません。

（下記ページ引用）
> オリジンサーバーのドメイン名は、高速化されたドメイン名と同じにすることはできません。     
> そうしないと、DNS解決ループが発生し、要求を元のサーバーに正しく転送できません。     
> たとえば、高速化されたドメイン名をcdn.yourdomain.comに設定した場合、オリジンドメイン名をimg.yourdomain.comに設定できます。

> https://www.alibabacloud.com/cloud-tech/doc-detail/122181.htm

---

     

ドメインを作成すると、専用のCNAMEが発行されるのでメモやコピーしておきます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192821.png "img")      


メモした値をDNSにCNAMEレコードとして追加し、サービスドメイン（www.fukuda.cf）をマッピングします。     
※Zone Apex (Naked Domain)は不可なので注意
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192836.png "img")      


名前解決が可能になると、ドメイン名のCNAME左アイコンが、  → ✔に変わります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192852.png "img")      


     
### Back-to-Origin 設定
次はオリジン設定です。     
ドメインをクリックすると下記のような詳細画面になりますので、左メニューより「Back-to-Origin 設定」を選択します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192908.png "img")      

Back-to-Origin 設定タブより、Back-to-Origin 設定ホストの「変更」をクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192922.png "img")      

Back-to-Origin ホスト設定画面にて、Back-to-Origin ホストをON、     
ドメインタイプを「オリジンサイト」を選択（画面のように最初に設定したオリジンサイトドメインが表示されます）し、OKをクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192943.png "img")      

オリジン情報が登録された事が確認できます。     
※その他の設定は今回はカスタマイズしない為デフォルトのまま
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204192958.png "img")      
     
     


### 〜Tips〜
---
Back-to-Origin 設定は、オリジンサーバ上にバーチャルホストを複数ホストしていて、明示的にバーチャルホストを指定したい時に有効です。     
※defaultホストへの接続で良い場合は設定不要です。詳細は下記参照ください。     
> https://www.alibabacloud.com/cloud-tech/doc-detail/27131.htm

SNI認証についてはこちら     
> https://www.alibabacloud.com/cloud-tech/doc-detail/111152.htm

---


### HTTPS設定
続けてHTTPS設定です。     
CDNとオリジン間の通信をセキュアにする為にはSSL証明書を適用する必要があります。

メニューより「HTTPS設定」を選択し、HTTPS証明書の「変更」をクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204193015.png "img")      


HTTPS設定画面が開きますので、下記のように選択後、OKをクリックします。
> HTTPSセキュア：ON     
> 証明書のタイプ：Alibaba Cloud証明書     
> 証明署名：アップロードした証明書名     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204193046.png "img")      

※本テストではLet's Encrypt（DV）の無料証明書を使用していますが、     
<b><span style="color: #1464b3">安全性や信頼性、認証レベルを十分に考慮し、適切なSSL証明書を選択してください</span>。</b>


SSL証明書が登録されたことが確認できます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204193059.png "img")      

<b>必要に応じてHTSTなども設定しましょう。</b>     
     
インターネットに接続できる環境から、curlなどでドメインに対してSSL接続できる事を確認します。


```
$ curl https://www.fukuda.cf -v
* Trying 47.89.66.150...
* TCP_NODELAY set
* Connected to www.fukuda.cf (47.89.66.150) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
* CAfile: /etc/ssl/cert.pem
CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use h2
* Server certificate:
* subject: CN=*.fukuda.cf
* start date: Dec 20 07:48:10 2019 GMT
* expire date: Mar 19 07:48:10 2020 GMT
* subjectAltName: host "www.fukuda.cf" matched cert's "*.fukuda.cf"
* issuer: C=US; O=Let's Encrypt; CN=Let's Encrypt Authority X3
* SSL certificate verify ok.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x7fb311800000)
> GET / HTTP/2
> Host: www.fukuda.cf
> User-Agent: curl/7.64.1
> Accept: */*
>
* Connection state changed (MAX_CONCURRENT_STREAMS == 128)!
< HTTP/2 200
< server: Tengine
< content-type: text/html; charset=UTF-8
< content-length: 11
< date: Fri, 24 Jan 2020 11:08:37 GMT
< last-modified: Fri, 20 Dec 2019 07:21:23 GMT
< etag: "b-59a1d866da82f"
< accept-ranges: bytes
< ali-swift-global-savetime: 1579864117
< via: cache31.l2hk71[594,200-0,M], cache11.l2hk71[595,0], cache8.jp2[0,200-0,H], cache9.jp2[1,0]
< age: 2164
< x-cache: HIT TCP_MEM_HIT dirn:1:343747674
< x-swift-savetime: Fri, 24 Jan 2020 11:08:37 GMT
< x-swift-cachetime: 3600
< timing-allow-origin: *
< eagleid: 2f59420915798662819114706e
<
index.html
* Connection #0 to host www.fukuda.cf left intact
* Closing connection 0
*
```

     

### カスタムヘッダー設定
次にCDNへカスタムヘッダー付与の設定をします。     
<b><span style="color: #ff0000">任意のヘッダをオリジンに渡すことで、サーバ上でヘッダーを識別し、     
指定した文字列が入ってない場合はアクセスを制限する</span></b>、といった運用が可能です。
     
     
今回は「<b>X-From-Cdn</b>」ヘッダーを使ってみます。

登録ドメインのBack-to-Origin設定より、「カスタムの Back-to-Origin HTTP ヘッダー」を選択し、「追加」をクリックします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204193118.png "img")      

パラメータより「X-From-Cdn」を入力し、任意の値を入力し、「OK」をクリックします。     
今回はCDNのドメイン名を入力してみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200220203732.png "img")      

追加された事を確認します（ステータスが設定中→成功へ遷移すればOKです）
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204193303.png "img")      
     

### 〜Tips〜
---
他にも「X-Host」や「sslparam」など複数パラメータを選択・追加できます。
---


## オリジンサーバ側設定
オリジンサーバのconfに、ヘッダーを制御する環境変数設定をします。     
下記はapache2.4の例としてSetEnvIfを利用していますが、エンジンにより設定フォーマットはご確認お願いします。


```
<DirectoryMatch / >
SetEnvIf X-From-Cdn "ヘッダーの値（CDNドメイン名）" AllowCDN　　⇐環境変数でヘッダーの定義（ヘッダーの種類により、適宜変更してください）
Order deny,allow
Deny from all
Allow from env=AllowCDN　　⇐定義した変数を許可
</DirectoryMatch>
```

     
あわせてヘッダーがログ出力されるように設定変更します。

設定例

```
LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\" \"%{X-From-Cdn}i\"" combined
```
     
###いざオリジン取得&キャッシュ確認
それではサービスドメインに接続し、CDN経由でオリジンに配置した画像ファイルを取りにいってみます。     
ちなみに配置した画像は、
<details><summary>Alibabaマスコットの<span style="color: #cc00cc">ETブレイン</span>（約350KB）です。</summary>![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200220002302.png "img")      </details>

curlコマンドやブラウザの開発ツールなどで確認してみましょう。

＜curl実行例＞

```
$ curl -I https://www.fukuda.cf/et0.png
HTTP/2 200
server: Tengine
content-type: image/png
content-length: 354730
strict-transport-security: max-age=5184000
date: Thu, 30 Jan 2020 06:09:08 GMT
last-modified: Fri, 30 Nov 2018 11:42:19 GMT
etag: "569aa-57be04aa87cc0"
accept-ranges: bytes
ali-swift-global-savetime: 1580364548
via: cache4.l2hk71[210,200-0,M], cache11.l2hk71[211,0], cache8.jp2[536,200-0,M], cache7.jp2[538,0]
x-cache: MISS TCP_MISS dirn:-2:-2
x-swift-savetime: Thu, 30 Jan 2020 06:09:08 GMT
x-swift-cachetime: 3600
timing-allow-origin: *
eagleid: 2f59420715803645481256762e
```
上記curlでの取得結果では、初回なのでx-cacheは「<b>MISS TCP_MISS</b>」となり、CDNはオリジンにファイルを取得しにいきます。     
     
オリジンサーバのアクセスログを確認すると、<span style="color: #ff0000">指定したヘッダー文字列（末尾の値）が付与されており、正常にGETされている</span>事がわかります。

     
```
***.***.***.*** - - [**/***/****:**:**:** +0900] "GET /et0.png HTTP/1.1" 200 354730 "-" "curl/7.64.1" "www.fukuda.cf.w.cdngslb.com""
```
     

2回目以降のリクエストは、CDNにキャッシュされたコンテンツが配信される為、     
x-cacheは「<b>HIT TCP_MEM_HIT</b>」に変化し、オリジンサーバ側ログには何も吐かれません。

ブラウザでも、正常に表示（取得）される事が確認できました。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204193333.png "img")      

     

では、逆に直接オリジンサーバへアクセスするとどうなるでしょうか。     
バーチャルホストドメイン（test.fukuda.cf）へ直接接続してみます。


```
$ curl -I https://test.fukuda.cf/et0.png
HTTP/1.1 403 Forbidden
Date: Thu, 30 Jan 2020 07:09:25 GMT
Server: Apache/2.4.6 (CentOS) OpenSSL/1.0.2k-fips PHP/5.4.16
Content-Type: text/html; charset=iso-8859-1
```

403が返り、こちらはヘッダーが渡されていません。
     
```
***.***.***.*** - - [**/***/****:**:**:** +0900] "HEAD /et0.png HTTP/1.1" 403 - "-" "curl/7.64.1" "-"
```
     
つまり、<b><span style="color: #ff0000">CDN経由のアクセスでない場合、指定したヘッダーが無い為正常値を返さない</span>事がわかります。</b>
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200204193351.png "img")      

     

## レスポンスタイム
ついでなので、キャッシュ有無で実際のレスポンスタイムを比較してみましょう。     
こちらもcurlで確認していきます。

<b>キャッシュ無し（初回アクセス時）</b>

```
$ curl -I https://www.fukuda.cf/et0.png -s -o /dev/null -w "%{time_starttransfer}\n"
1.078376
```

<b>キャッシュ有り</b>

```
$ curl -I https://www.fukuda.cf/et0.png -s -o /dev/null -w "%{time_starttransfer}\n"
0.059646
```

＜比較結果＞
> キャッシュ無し＝　<b><span style="color: #1464b3">約1秒</span></b>     
> キャッシュ有り＝　<b><span style="color: #1464b3">約0.05秒</span></b>

キャッシュ効果により配信パフォーマンスに大きな差がでている事がわかります。
     
※上記はあくまで参考値なので、取得サイズ等によりレスポンスは変動する可能性あります。

基本的なテストは以上ですが、<b><span style="color: #ff0000">ヘッダーによるアクセス制限や、レスポンスの高速化がされている</span></b>事がおわかりになったかと思います。
　
     
     

次に、SLBを経由した構成で試してみたいと思います。
## SLB有の場合
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200221011049.png "img")      

SLBにもSSL証明書をオフロードし、443→80へフォワーディングする構成です。     
この場合、CNAMEのマッピング先をSLBが持つグローバルIPに指定します。     

このままでもキャッシングは可能ですが、試しにSLBのリスナー設定で、SLB-IDヘッダーを追加する設定をして制限条件を増やしてみます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200221011719.png "img")      

また別項でご紹介したように、オリジンサーバへヘッダー条件やログ出力設定を追加します。

つまり、「X-From-Cdn」と「SLB-ID」がヘッダー付与されていないリクエストは、表示不可（403エラー）となるという条件です。     
<b>※あくまで複数条件を用いた実証テストです。必須ではない為、本番運用においてはポリシーに応じてご検討ください。</b>

上記設定後アクセスしてみると、同様にコンテンツはキャッシングされますが、     
この場合、未キャッシュ時のオリジンのログには、CDNドメインと併せてSLBID（末尾の値）が渡されている事がわかります。
     
```
***.***.***.*** - - [**/***/****:**:**:** +0900] "GET /et0.png HTTP/1.1" 200 354730 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36" "www.fukuda.cf.w.cdngslb.com" "lb-0iwbq90r0gej1ialtoq1y"
```
     
このように、SLBをフロントラインに持ったHA構成や複数条件のケースでも有用ですので、要件に応じて適用していただければと思います。

     
## キャッシュのリフレッシュについて
キャッシュのリフレッシュ（パージ）は、     
「更新＆プリロード」→「キャッシュのリフレッシュ」より、URLやディレクトリ単位で実行可能です。     
キャッシュテストやコンテンツの更新時などにご利用いただければと思います。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613507013700/20200219154746.png "img")      

### 〜Tips〜

---
他にもログ管理やモニタリングなど運用に必要な機能を備えています。     
全てをご紹介しきれませんので詳しくは公式ドキュメントをご参照ください。
> https://www.alibabacloud.com/cloud-tech/product/27099.htm

---

     
# 最後に

グローバルからのアクセスを想定した時に、サーバからの配信品質がポイントになると思いますが、     
CDNを利用する事により、そのストレスを軽減する構成が可能となります。     
ご紹介したヘッダー設定は一例ですので、要件により値をカスタマイズしたり、     
他の機能(URL認証やブラックリスト/ホワイトリスト等)も併用する事により、     
ある程度柔軟なアクセス制限ができるのではないかと思います。     
また、SLB以外にもWAF等のセキュリティプロダクトとも多段でフロー構成する事も可能ですので、     
セキュリティやパフォーマンス、そしてマネージドサービスによる運用メリットを活用した     
コンテンツ配信環境を実現したいケースにもとても有効です。     
ぜひ重要なコンポーネントとなるAlibaba Cloud CDNをお試しいただけますと幸いです      

 

  <CommunityAuthor 
    author="tfukuda"
    self_introduction = "2019年よりAlibaba Cloudに携わる。これまでのクラウド基盤の導入経験を活かし、Alibaba Cloudを活用した様々なソリューションをお客様へ提案するプリセールスエンジニアとして奔走中。MARVEL映画大好き。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/tfukuda.png"
    githubUrl=""
/>


