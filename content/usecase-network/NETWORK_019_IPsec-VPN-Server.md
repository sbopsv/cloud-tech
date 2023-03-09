---
title: "IPsec-VPN Serverを試す"
metaTitle: "リモートアクセス用「IPsec-VPN Server」がリリースされたので、早速試してみた。"
metaDescription: "リモートアクセス用「IPsec-VPN Server」がリリースされたので、早速試してみた。"
date: "2021-09-27"
author: "sbc_saito"
thumbnail: "/Network_images_13574176438016100000/20210927132925.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## リモートアクセス用「IPsec-VPN Server」がリリースされたので、早速試してみた。


# はじめに

本記事では、Alibaba Cloudの新ネットワークプロダクトとしてリモートアクセス用の「IPsec-VPN Server」がローンチしたので、従来のVPN Gatewayとの違いも整理しつつ、検証してみた結果をご紹介します。    


# リモートアクセス用のIPsec-VPN

従来のVPN Gatewayが内包するIPsec-VPNは      
主にルータなどのネットワーク機器とAlibaba CloudのVPN Gatewayをサイト間VPN接続するための機能でした。     
一方で今回は、iOS等に標準搭載されているリモートアクセス用のクライアントとAlibaba CloudのVPN Gatewayを<b>ポイント対サイトVPN接続</b>するためのプロダクトとなります。      
イメージ的にはVPN GatewayのSSL-VPNに近いですね。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927132925.png "img")    


# メリット  
OS標準搭載のVPNクライアントが利用できるため、別途VPNクライアントソフトの導入が不要です。    
ここがVPN Gateway SSL-VPNとの大きな違いとなります。    
特に中国国内ではモバイルOS用OpenVPNクライアントソフト等の入手が困難であり、標準搭載のVPNクライアントが活用できる方式のため貴重かもしれません。  
また、アプリストア用のID用意が不要だったり、MDM等によるプロファイル配布も他のVPNソリューションと比較するとケアが少なくて済む分  
運用面でも嬉しいポイントですね。   

# IPsec-VPN Serverの作成
まずは購入です。   
VPN Gatewayインスタンスの作成から始めましょう。   
                
> リージョン：上海  
```
ピーク帯域：10Mbps  
IPsec-VPN：Disable  
SSL-VPN：Enable
SSL接続数：5接続  
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927153417.png "img")    

                
重要なのはIPsec-VPNはDisableでいいですが、SSL-VPNはEnableにしないといけないところです。   
もちろんリモートアクセス用のIPsec-VPN Server機能は技術的にはSSL-VPNではなくIPsecによる暗号化を行っていますが     
課金モデルとしてはSSL-VPNと同じの接続数単位となるため、このような仕様となってます。    
ややこしいですが重要なポイントです。    

                
VPN Gatewayが作成完了したら、IPsec-VPN Serverの作成です。    
左サイドから「IPsec-VPN Server」→「Create IPsec-VPN Server」ボタンをクリック     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927155842.png "img")    


> Name：任意のインスタンス名  
``` 
VPN Gateway：先ほど作成したVPN Gatewayを選択  
Local Network：  Alibaba Cloud側のローカルCIDRを入力 複数入力可能です  
Client Subnet：IPsec-VPN Serverのクライアントサブネットになります。vSwitchでラップ可能なCIDRブロックを指定します  
Pre-Shared Key：任意のパスフレーズを入力   
Effective Immediately：Yes
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927153414.png "img")    



ちなみにVPN GatewayでSSL-VPNをEnableにしていないと、VPN Gatewayの選択時にエラーが表示され進めることが出来ません。    
この場合SSL-VPNを有効にするためのインスタンスUpgradeしましょう。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927153421.png "img")    



これで作成完了です。


# iPhoneで接続テスト  

今回はiPhone13を購入したので、早速これを使ってテストしてみたいと思います。     
iOS 15.0の最新の環境です。     

設定 > VPN > 「VPN構成を追加...」をタップで遷移します。    
下記の通りに設定していきましょう。VPN GatewayのIPはAlibaba Cloudコンソールで確認しておきましょう。    
シークレットは事前に定義済みのPre-Shared Keyを入力してあげます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927161940.jpg "img")    


VPN設定が完了したら、VPNの一覧画面から作成したVPN設定をタップし    
接続のトグルをタップしてオンにします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927162952.jpg "img")    


VPN接続が出来たようですので、iPhoneからAlibaba Cloud上のWindows ECSにRDPしてみます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_13574176438016100000/20210927163008.png "img")    

何ら問題なく簡単に接続できました！

# 最後に

VPN Gateway SSL-VPNの場合はAlibaba CloudからOpenVPNプロファイルをダウンロードして端末に配布>インストールしないといけなかったり、別途クライアントソフトが必要だったり少し手間が発生しますが 、今回新たにローンチした「IPsec-VPN Server」を利用すれば非常に簡単にOS標準機能だけで接続できることを確認しました！
  
残念ながらフルトンネル接続には対応していないようなので、IPsecトンネルの先にインターネットブレークアウトさせたいような場合はプロキシサーバなどと組み合わせることになりそうです。  

東京リージョンでも既に展開しているプロダクトなので皆さんも是非お試しくださいね！


<CommunityAuthor 
    author="斎藤 貴広"
    self_introduction = "2020年からAlibaba Cloudのソリューション開発や技術支援に従事。ネットワークや基盤などのインフラ回りがメイン領域で、最近はゼロトラストセキュリティやWeb系もかじり中。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/saito.png"
    githubUrl=""
/>

