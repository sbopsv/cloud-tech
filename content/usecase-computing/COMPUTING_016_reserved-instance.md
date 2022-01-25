---
title: " リザーブドインスタンスを使おう"
metaTitle: "Alibaba Cloud の RI（リザーブドインスタンス）を使おう❗️"
metaDescription: "Alibaba Cloud の RI（リザーブドインスタンス）を使おう❗️"
date: "2020-02-05"
author: "sbc_y_matsuda"
thumbnail: "/computing_images_26006613503496100/20200204195325.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

##  Alibaba Cloud の RI（リザーブドインスタンス）を使おう❗️

# はじめに

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204213441.png "img")    


今回は国際サイトで利用できる<b>待望の料金プラン</b>である、ECS の「<span style="color: #ff0000"><b>Reserved instance（RI）</b></span>」に関して紹介していきたいと思います😁  

本記事は Alibaba Cloud 国際サイトの内容をベースに説明しています。


<span style="color: #ff0000">※ 2020.02.05 「インスタンスサイズのみが異なる場合」を追記
</span>



# Reserved instance（RI） とは？

リザーブドインスタンスは、<b><span style="color: #ff0000">条件に一致するECSの従量課金モデルのインスタンスタイプ</span></b>に対して自動的に適用される事前購入型の割引利用権です。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204195325.png "img")    


あくまで最大の割引が適用された場合ですが、従量課金に対して以下の様な割引が適用される場合もあります。  
<span style="color: #ff0000">※リージョン、インスタンスタイプにより異なります。
</span>

東京リージョンの汎用的なインスタンスだと1年で40%、3年で60%くらいの割引になるインスタンスが多いイメージです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204184955.png "img")    


リザーブドインスタンスという言葉で誤解を招きやすいのですが「従量課金」「サブスクリプション」「プリエンプティブル」の3つの様に<b><span style="color: #ff0000">ECSインスタンスの購入時に選択する「価格モデル」ではありません。</span></b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204161644.png "img")    




# Reserved instance 購入時の主な設定項目

RI購入時の主な設定項目は以下の様になっています。   
見て頂いてわかる様に「リージョン」「インスタンスタイプ」「OSプラットフォーム」「期間」などを指定する形になります。   
これらの項目に関しては<span style="color: #ff0000">購入後には変更することが出来ない</span>内容になりますので購入時にはお気をつけください。  
<span style="color: #ff0000">※インスタンスタイプに関しては条件を満たした場合に「分割」「マージ」が可能です。</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200131184626.png "img")    



![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204181034.png "img")    



# Reserved instance の適用

次に購入したリザーブドインスタンス（ECS利用権）の適用手順をご説明します・・・というところなのですがリザーブドインスタンスには手動で適用する様なアクションはありません！ 

リザーブドインスタンスを購入後に<span style="color: #ff0000">条件に一致する稼働中のオンデマンドインスタンスに自動的に適用されます。</span>


また、その際には<span style="color: #ff0000">インスタンスの再起動などは必要ありません。</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204164734.png "img")    


リザーブドインスタンスの適用は自動なので、適用状態のインスタンスが停止した場合は、<b><span style="color: #ff0000">条件の一致する他のインスタンスへ自動的に適用された状態になります。</span></b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204184503.png "img")    



リザーブドインスタンスは自動的に適用されますが、条件に一致するインスタンスがない場合は未適用状態のリザーブドインスタンス（ECS利用権）が存在する場合もありえます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200205224348.png "img")    


この場合は<b><span style="color: #ff0000">「購入したけど使用しなかった」</span></b>状態です、未使用時間分の返金などはありません。  

リザーブドインスタンスは利用者にてインスタンスの利用戦略を考えた上でご利用ください。


# Reserved instance の適用時の課金の考え方

リザーブドインスタンスが適用された場合、対象のオンデマンドインスタンスの「インスタンス課金（vCPU,Memoryなど）」に対して適用されます。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204164444.png "img")    


ECSの課金は詳細に分割すると以下の様なパーツで構成されています。  
リザーブドインスタンスが適用されるのは以下の図の赤矢印の部分になりますので、ディスクやネットワークトラフィック、マーケットプレイスイメージの利用料などは通常通り課金されます。      

<b><span style="color: #ff0000">※ちなみにRIではなく、サブスクリプションの場合、ディスクに対しても割引が適用されます。</span></b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204164219.png "img")    

> https://www.alibabacloud.com/cloud-tech/doc-detail/40653.htm



以下の画面はリザーブドインスタンスが適用されたECSのビリングの画面です。  
`Cloud server configuration` がインスタンス課金の部分ですが`$0`なのが確認できます。  
一方、`System Disk Size`は20GBのシステムディスクの１時間当たりの料金`$0.002`が通常通り掛かっていることが確認できます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200204192136.png "img")    



# インスタンスサイズのみが異なる場合

リザーブドインスタンスはインスタンスサイズ（largeとか2xlargeとかの部分）を指定しているので、完全に一致しないと適用できないと思いがちですが、実際には以下のように<b><span style="color: #ff0000">同じインスタンスファミリーと世代であれば部分的に適用することが可能</span></b>なのもポイントです！  

<b><span style="color: #ff0000">※リソース予約（ゾーン指定）をしていない場合という条件が付きます。
</span></b>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200205233637.png "img")    


部分的に適用というのがどうなるかというと、以下の図になります。  
RIと同じインスタンスファミリーと世代であればRIが適用されて差分での課金に自動的に切り替わります。  

未適用状態の`ecs.g6.large`のRIを所有していた場合に、`ecs.g6.xlarge`のオンデマンドインスタンスがあるとします。  
その場合には、`ecs.g6.xlarge`のインスタンスに`ecs.g6.large`のRIが適用され、`ecs.g6.large`のオンデマンドインスタンス料金相当額（$0.120/hour）が`ecs.g6.xlarge`のインスタンス課金額（$0.240/hour）から控除されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200205230517.png "img")    


`ecs.g6.xlarge`は`ecs.g6.large`２個分相当のインスタンスなので１個分割引されたと考えるといいかもしれません。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613503496100/20200205232207.png "img")    


このようにリザーブドインスタンスは意外と柔軟性のある割引を提供してくれる機能になっています。



# 最後に

今回は Alibaba Cloud ECS の Reserved instance に関して簡単に考え方などを説明をさせていただきました。

Alibaba Cloud ECS の Reserved instance は昨年8月に正式にリリースされた機能です、これまでのサブスクリプションでは対応できなかった柔軟な対応ができるので利用シーンは増えていくのではないかと思います。

何とは言いませんが、リザーブドインスタンスのさらなる「節約プラン」への進化も期待して行きたいと思います。

今後は実際の購入方法やサブスクリプションとの比較、RIの分割やマージなどの細かい検証も公開して行きたいと思います。


<CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


