---
title: "CENでクラウドネットワークPart1"
metaTitle: "《前編》CENでつなげる↔クラウドネットワーク🕸"
metaDescription: "《前編》CENでつなげる↔クラウドネットワーク🕸"
date: "2019-08-15"
author: "sbc_y_matsuda"
thumbnail: "/Network_images_26006613395171600/20190809185318.png"
---

## 《前編》CENでつなげる↔クラウドネットワーク🕸

# はじめに

本記事は、Alibaba Cloud のエンタープライズ向けネットワークサービス Cloud Enterprise Network （CEN）をご紹介します。    

内容が長いので、今回はCENの基本を説明する前編になります。  

後編はコチラから

> http://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_015_cen-second-part

ドキュメントへのリンクはコチラ

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/59870.htm




    

<!-- more -->

# Cloud Enterprise Network （CEN） とは？


CENは<span style="color: #ff0000">VPCとVPCを低レイテンシの帯域確保型の専用接続でつなぐサービス</span>です。  
また、回線事業者の提供するCEN対応の専用接続サービスとVPCをつなぐことも可能です。  

CENインスタンス（コントローラー）により<span style="color: #ff0000">複数リージョン・複数VPCとの接続を可能とし、中国本土を含む世界中の複数リージョンとオンプレミス環境の閉域接続が可能です。</span>  
※日本サイトではドバイリージョンを除く

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190805195847.png "img")    


転送速度が重要視される場合にはあまり向いていませんが、<span style="color: #ff0000">インターネットの接続が不安定な地域との接続やセキュアなVPC間通信が必要な場合</span>にはオススメです。  

・・・と説明しても実際どんな事が出来るのか中々わかりにくいと思いますので、少しサービスの特徴を見ていきたいと思います。  
  

# CENの基本概念

CENには<span style="color: #ff0000"><b>「エリア」「帯域幅パッケージ」「CENインスタンス」</b></span>という基本概念があり、エリアには各リージョンが紐づけられています。  

リージョン同士がCENで接続するには、CENインスタンスに接続するエリアを設定し、エリアを設定するには帯域幅パッケージが必要になります。

・・・言葉ではなかなかわかりにくいので、それぞれの関係性をイメージ化してみました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190809185318.png "img")    
    

これでもちょっとわかりにくいかも知れませんね……
疑問点等ありましたらコメントなり頂ければ幸いです。


# CENのエリア


先にも述べましたがCENの<span style="color: #ff0000"><b>「エリア」</b></span>には各リージョンが紐づけられています。  
エリアとリージョンの対応に関しては下図をご覧ください。  
<span style="color: #0000cc">※Alibaba Cloudの他プロダクトでもそうですが香港リージョンは中国本土外の扱いなのでご注意ください。</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190808194406.png "img")    
    
<span style="color: #ff0000">※この図は公式のマップではありません。ピンの位置は大体の場所になります。</span>

<span style="color: #ff0000">CENではこのエリアとエリアをつなげることで、Alibaba Cloudのバックボーンネットワークを使ったクロスリージョン接続が出来る様になります。 </span>  
このエリア間接続（相互接続エリア）に後述する<b><span style="color: #ff0000">「帯域幅パッケージ」</span></b>が必要になります。
 

これは同じエリア内でも同様です、例えば北京と上海のクロスリージョン接続には<span style="color: #ff0000">「中国本土 ⇆ 中国本土」接続用の帯域幅パッケージが必要になります。  </span>  
<span style="color: #2196f3">※同一リージョン内のVPC間接続に関しては相互接続エリアの設定が不要です。</span>



設定可能な相互接続エリアは下図になります。⭕️が相互接続エリアを表します。  
⭕️の接続に「帯域幅パッケージ」が必要だとお考えください。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190807171937.png "img")    
    
  

# 帯域幅パッケージ

  
CENは相互接続エリアを設定するのに「帯域幅パッケージ」が必要と説明しました。  

CENは帯域確保型の専用ネットワークサービスなので必要な帯域幅を確保する必要があり、「帯域幅パッケージ」というのは<span style="color: #ff0000">1Mbps単位で購入可能な通信帯域です。 </span>   
※2019年8月時点で相互接続エリアごとに最小2Mbps、最大10000Mbpsまで購入可能（上限はエリア・リージョンにより異なる場合あり）

また、帯域幅パッケージは相互接続エリア毎に必要になりますので、「中国本土 ⇆ 中国本土」「中国本土 ⇆ アジア太平洋」で利用する場合は２つの帯域幅パッケージが必要です。  
※料金が相互接続エリア毎の値段設定になっているのでこの様な仕様になっています。  


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813185630.png "img")    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813102533.png "img")    


  
帯域幅パッケージを理解するには定期券をイメージするととわかりやすいかもしれません。    
1Mbpsが一枚の定期券で同じ区間の定期をいっぱい持ってるみたいなイメージですかね🤔    
現実では同じ人が何枚も同じ定期を持つことは無いですが、あくまでイメージということで😅  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190808205113.png "img")    
    

なお、最低2Mbpsと書きましたが以下の様なパターンはNGです。  
<span style="color: #ff0000">それぞれの帯域幅パッケージで2Mbpsが最低限必要です。
</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190808203603.png "img")    
    


ちなみにこの「帯域幅パッケージ」はAlibaba Cloudあるあるで、買った日から有効期間が区切られます。  
基準となる時刻が中国標準時（UTC+0800）なのもAlibaba Cloud あるあるなので一緒に覚えてください😅


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190808214324.png "img")    
    


さて、ここまで帯域幅パッケージの仕様を説明してきましたので、料金に関してもいくつかお見せしたいと思います。  

何故かプロダクトページに料金表がないのでコンソールに表示される価格から料金表を起こしてみました😅  
確認はしていますが、あくまで非公式なので正確な料金はサポート又は営業までご確認ください🙇‍♀️  


<span style="font-size: 110%">なお、同一リージョン内は相互接続エリアの設定が不要なので無料で接続が可能ですよ！
</span>



<span style="font-size: 125%">・「中国本土」エリアから各エリアに接続する際の価格（2019年8月時点の参考）
</span>

2019年8月時点で中国本土エリアに含まれるのは以下の7リージョンです。   
・青島 (中国北部 1)   
・北京 (中国北部 2)    
・張家口 (中国北部 3)    
・フフホト (中国北部 5)   
・杭州 (中国東部 1)   
・上海 (中国東部 2)   
・深セン (中国南部 1)   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190817175245.png "img")    
    


<span style="font-size: 125%">・「アジア太平洋」エリアから各エリアに接続する際の価格（2019年8月時点の参考）
</span>

2019年8月時点でアジア太平洋エリアに含まれるのは以下の6リージョンです。   
・東京 (日本)  
・香港   
・シンガポール   
・クアラルンプール (マレーシア)  
・ムンバイ (インド)  
・インドネシア（ジャカルタ）  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190817175341.png "img")    
    


上記の価格表（参考）をみて気づかれたと思いますが、実はCENは<span style="color: #ff0000">確保する帯域幅により段階的に1Mbps辺りの単価が下がる仕組みになっています。</span>  

また、上記は「月額費用」なのですが「年払い」で購入頂くと12ヶ月分の料金から15％引きになります。  
<span style="color: #ff0000">12ヶ月分の15%なので2ヶ月弱分の費用が割引になります</span>ので計画的にご利用頂ければと思います。


帯域幅パッケージはご覧の通りサブスクリプションタイプの料金設定なので、一度決めたら変更ができないと思われることが多いのですが、<span style="color: #ff0000">実は帯域幅の拡大縮小が可能です</span>。

<span style="font-size: 150%">専用線タイプのプロダクトでリアルタイムな帯域の変更が可能な点はCENのオススメポイントの一つですね！
</span>



# CENインスタンス

CENインスタンスはリージョンに依存しないグローバルな機能で、各リージョンやVPC、帯域幅パッケージの割り当てなどを管理するコントローラーの役割です。 

下図の様に複数のCENインスタンスを作成し必要な接続先を管理することが可能です。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813193837.png "img")    
    

個別のCENインスタンスは、<span style="color: #ff0000">「接続するVPCの指定」</span>と<span style="color: #ff0000">「使用する帯域幅パッケージの指定」</span>、<span style="color: #ff0000">「リージョン間の接続帯域幅の設定」</span>を行います。  

例として以下の様にネットワークを接続するにはCENインスタンスでどんな設定になるのか見てみたいと思います。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813213616.png "img")    
    

CENインスタンスに接続先・接続元のVPCをアタッチします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813201950.png "img")    
    

帯域幅パッケージを購入しCENインスタンスへバインドします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813205536.png "img")    
    

帯域幅パッケージで購入した帯域を上限に、リージョンの接続で以下の様に接続帯域を指定します。      
帯域幅パッケージのバインドの際に2つしかバインドしてないぞ、と思った方もいるかと思います。  

<span style="font-size: 150%">CENでは<span style="color: #ff0000">「リージョンの接続」でリージョン間の帯域幅を設定することで接続が可能になります。</span></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190814184636.png "img")    


実際の設定画面はコチラになります。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813210104.png "img")    

CENは今お見せした様な基本的な設定だけでリージョン間の専用接続が可能になります。  
今設定したことをイメージ化してみるとこの様な感じになります。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613395171600/20190813201504.png "img")    

 

CENの設定は意外と簡単で概念を理解していれば迷うこともないのではないでしょうか⁉️


# 最後に

今回は、まずCENの基本的な考え方や概念に関して説明させて頂きました。    
エリアや帯域幅パッケージの概念が理解頂けて入れば幸いです。  
帯域確保型のサービスとしては柔軟性が高く、コンソールからすぐに使えるのはCENのポイントではないでしょうか。   

ここまででも長かったのですが続きも結構なボリュームになっているんですよね。  
まだCENの良い所や構成などを説明出来ていないので、是非次回もご一読頂ければと思います。


後編はコチラからどうぞ。

> http://sbopsv.github.io/cloud-tech/usecase-network/NETWORK_015_cen-second-part

 <CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>



