---
title: "SLB 実はスケールするんです"
metaTitle: "知っていました ? Server Load Balancer 実はスケールするんです"
metaDescription: "知っていました ? Server Load Balancer 実はスケールするんです"
date: "2019-04-22"
author: "sbc_y_matsuda"
thumbnail: "/computing_images_17680117127050800000/20190419145733.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 知っていました ? Server Load Balancer 実はスケールするんです

# はじめに

本日はAlibaba Cloud のロードバランサーサービスであるServer Load Balancer（SLB）に関する、ある誤解を解いていきたいと思います。

Alibaba Cloudのロードバランサーはインスタンスタイプのスペックを指定して購入するので<span style="color: #ff0000"><b>スペックが固定だと思っていませんか？</b> </span>   

実は・・・タイトルにもある様に<span style="color: #ff0000"><b>SLBは自動スケーリングが出来るのです</b></span>❗️
・・・お恥ずかしながら私も最初勘違いしていました😖

今回の記事ではSLBの料金計算を中心に順を追ってSLBの仕様を説明していきたいと思います。


⚠️本記事に記載の価格や仕様は執筆時点の情報となりますことご了承ください。


<!-- more -->

#  SLBの作成時に選択する項目について

SLBの作成時に選択する大きな項目としては以下を選択することになります。  

* リージョン  
* ゾーン（AZ）  
* インスタンスタイプ（ネットワークタイプ）  
* パフォーマンスタイプとスペック   

Alibaba CloudのSLBは以下の２つの選択により仕様がそれぞれ大きく変わってきます。    
* 「インターネット」「イントラネット」を選択するインスタンスタイプ  
* 「パフォーマンス共有型」「パフォーマンス専有型」を選択するパフォーマンスタイプ  

ここで「パフォーマンスタイプ」なんてあったっけ？  と思われる方もいらっしゃると思います。    
実際の画面では下図の赤枠の部分で一緒に表示されており判りにくいのですが、実はここで選択する項目によってパフォーマンスタイプが変わります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419125727.png "img")    


なおインスタンスタイプ（ネットワークタイプ）は下図の赤枠部分で選択します。    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419132400.png "img")    


#  インスタンスタイプとパフォーマンスタイプ

インスタンスタイプとパフォーマンスタイプの選択方法は先に説明した通りです。    
それぞれを選択した場合の関係を表にすると以下のようになります。    
見て頂くと分かると思いますが「パフォーマンス共有型」以外を選択した場合は全て「パフォーマンス専有型」になりインスタンスのスペック（保証する性能）が定義される形になります。    

ℹ️それぞれのスペック選択時の性能は後述いたします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419131718.png "img")     


# パフォーマンスタイプの違いとは?

結局パフォーマンスタイプの違いって何なのか？という部分に関しては、以下のドキュメントにも記載のあるように「パフォーマンス共有型」はリソースを共有している<span style="color: #ff0000">ベストエフォートのサービス</span>です。   
それに対して「パフォーマンス専有型」は選択したスペックの性能を保証する<span style="color: #ff0000">性能保証型のサービス</span>です。    


> パフォーマンス専有型インスタンスは、保証されたパフォーマンスメトリックを提供します。  
> 対照的に、共有パフォーマンス型インスタンスはパフォーマンス保証を提供しません。   
> Server Load Balancer リソースは、パフォーマンス共有型・インスタンス間で共有されます。

<a href="https://www.alibabacloud.com/cloud-tech/ja/doc-detail/85939.htm">パフォーマンス専有型インスタンスに関するよくある質問
</a>より引用

# SLB最大の誤解ポイント

さて、ここまで説明してきた様にパフォーマンス専有型は「スペック」を指定して「性能保証」をするサービスです。    
こうやって聞くとSLBはスペックと金額が固定のサービスであると思ってしまいますよね？     

さらにSLBの作成画面ではスペックを上げると下図の様に時間当たりの単価が表示されるので尚更です。    
私も普通に最初固定だと思いました。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419140450.png "img")    


<span style="font-size: 300%">違うんです</span>    

<span style="font-size: 300%">スペックも金額も</span>    


<span style="font-size: 300%">スケールするんです</span>     


以下のドキュメントにこの様に記載されています。    

> 指定料金は、実際の使用量に基づいて請求されます。   
> つまり、指定したスペックにかかわらず、実際に使用されたスペック（パフォーマンス）に従ってスペック料金が請求されます。    
> スーパー I（slb.s3.large）スペック（Max Connection 1,000,000、CPS 500,000、QPS 50,000）を選択し、最初の 1 時間のインスタンスの実際の使用量は次のとおりです。      
> 最大接続 90,000、CPS 9,000、QPS 8,000。     
>     
> この時間のインスタンスのサービスインデックスは、Super I（slb.s3.large） スペックの上限に達していません、slb.s3.small と slb.s3.medium の間にあります。    
> したがって、スペック料金は slb.s3.medium（整数に切り上げる原則）に従って請求されます。    

  　
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419145733.png "img")    


> パフォーマンス専有型インスタンスは自動スケーリング（課金）が可能です。   
> 購入時にお客様が選択したスペックはスケーリングの上限です。    
> たとえば、slb.s3.medium を選択すると、インスタンスが最大でslb.s3.medium のスペックに到達できることを意味します。    


<a href="https://www.alibabacloud.com/cloud-tech/ja/doc-detail/85939.htm">パフォーマンス専有型インスタンスに関するよくある質問
</a>より引用
　    
　  



<span style="font-size: 400%">・・・マジか!?😳
</span>

　  

と言うのが正直な気持ちです。入社してから最大の驚きでした🤣       

つまり下図の「スペック」で指定しているのは<b><span style="color: #ff0000">SLBの性能上限の指定</span></b>で、「費用」は<b><span style="color: #ff0000">時間当たりの最大単価</span></b>と言うことです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419140450.png "img")     


<span style="font-size: 200%">・・・orz
</span>


<span style="font-size: 150%">¥0.900 ~ ¥71.100 って表示してよ！  
</span>

と思ったのは私だけでは無いはず
  


# SLBのスペック

さて、実はスケールすることが判ったSLBちゃんですが、SLBの保証する性能とは何を指しているのか見てみましょう。  

パフォーマンス専有型の主要なメトリックは以下の３つです。    

# 最大接続数  : Max Connection  
　SLB インスタンスへの最大接続数。   
　最大接続数がスペックの限界に達すると、新しい接続はドロップされます。   
  
# 接続数/秒 : Connection Per Second（CPS）  
　1秒あたりに新しい接続が確立される件数。   
　CPS がスペックの限界に達すると、新しい接続が切断されます。    

# クエリ/秒 : Query Per Second（QPS）  
　1秒間に処理できるHTTP / HTTPS要求の数。これはレイヤー 7 リスナーに固有のものです。   
　QPS がスペックの限界に達すると、新しい接続が切断されます。    

SLBでは上記３つの項目に対して、それぞれのスペックで上限値と価格のテーブルが定義されていますのでそちらを見てみましょう。   

スペック３、スペック４あたりでもなかなかの規模のサイトに対応できるのでは無いでしょうか？     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419153035.png "img")     


<b><span style="color: #ff0000">スペック７、スペック８に関しては通常ご利用になれません。  
サポートチームまでお問い合わせください。</span></b>

# SLBのスペック判定

スケールする際にどのスペックの料金が適用されるかは時間毎の実際の使用量（実際のピーク値）に基づいて決定されます。    
なお、それぞれのスペックの値は上限値なので値を超えた場合は、次のスペックの料金が適用されることになります。     

わかりやすく先程の料金表に各段階での範囲を記入してみました。  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190421233114.png "img")    


また、スペックの判定は３つのメトリクスそれぞれに対して判定されその中の一番高いものが適用されます。  
  
例えば以下の様な使用量だった場合

> 最大接続数 : 90,000  
> CPS : 4,000  
> QPS : 11,000  

最大接続数は、スペック2の上限50,000とスペック3の上限100,000の間にあります。    
スペック3 の適用範囲 `50,001 ≦ 90,000  ≦ 100,000` に該当します。  
したがって、<span style="color: #00cc00">この1時間の最大接続数はスペック3</span>です。  

CPSは、スペック1の上限3,000とスペック2の上限5,000の間にあります。  
スペック2 の適用範囲 `3,001 ≦ 4,000  ≦ 5,000` に該当します。  
したがって、<span style="color: #00cc00">この1時間のCPSはスペック2</span>です。

QPSは、スペック3の上限10,000とスペック4の上限20,000の間にあります。 
スペック4 の適用範囲 `10,001 ≦ 11,000  ≦ 20,000` に該当します。   
したがって、<span style="color: #00cc00">この1時間のQPSはスペック4</span>です。

これら3つのメトリクスを比較すると、<span style="color: #ff0000">QPSのスペックが最も高いため、この時間内の料金はスペック4の価格で請求されます</span>。

この判定が毎時間行われて実際のスペック料金が決まります。

> 最大接続数 : スペック3  
> CPS : スペック2  
> QPS : スペック4　⬅️　<span style="color: #ff0000">一番高いこの費用が採用</span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190421234444.png "img")    


なお、<b><span style="color: #ff0000">スペック料金は累積ではありません。</span></b>  
スペック４と判定された時の料金は「¥27.6/時間」になります。  

`¥6.9 + ¥13.8 + ¥27.6 = ¥48.3/時間` <span style="color: #0000cc">にはなりませんのでご安心ください。</span>



# SLBの料金計算の考え方

スペック毎の料金判定は前述の通りです。     
では、実際にSLBの料金として請求される金額はどうなっているかと言うと、以下の表の様になっています。    

下記のインスタンス基本料金とトラフィック料金は東京リージョンの費用を表示しています。     
実際の料金や各リージョンの費用は[こちら](https://www.alibabacloud.com/ja/product/server-load-balancer)をご確認ください。    
なお、各リージョンの「slb.s1.small」の料金がインスタンス基本料金に相当しますのでお手数ですが読み替えて頂ければ幸いです。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419165458.png "img")      


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190421233114.png "img")      




さて、お気づきでしょうか？  
インターネット向けのSLBですが「パフォーマンス専有型」を買った場合以下の計算になります。  

> SLBの料金　＝　インスタンス基本料　＋　トラフィック料金　＋　スペック料金

　  
例えばスペック6(Super I )を買ったとしてもアクセスが極小の状態ならスペック1(Small I)が適用されるため以下の様な金額が請求されます。    

> ¥0.9　＝　¥0.9　＋　¥0　＋　 ¥0

　  
つまり<span style="color: #ff0000">東京リージョンのSLBの最低利用価格は「¥0.9/時間」</span>で<span style="color: #ff0000">利用状況に応じてスケールしている</span>のです。  
仮に東京リージョンにて最低価格で１ヶ月運用した場合は<span style="color: #ff0000">月700円程度</span>でご利用頂けることになります。  
SLBの優秀さが判るのではないでしょうか？  

また、イントラネットタイプは基本料金とトラフィック料金が無料でスペック料金のみ掛かる仕様になっていますので、VPC内でのロードバランスに上手くお使い頂ければと思います。  

<span style="color: #ff0000">専用線でつなげて使うプライベートなシステムだとタダでロードバランサーが使える構成も組めちゃうかもしれませんよ！？</span>


# 実際に一番大きいSLBを買ってみると・・・？

イロイロと書いてきましたが、本当にそんな計算なの？って気になりますよね？

なので・・・試してみました！
こちらが購入したスペック6(Super I )のSLBです。  
IDを覚えておいてください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419180740.png "img")    


作成したSLBを稼働させたまま適当に時間を置いておいて料金詳細を確認します。  
何故かSLBの請求が２つに分かれていますが・・・  
まぁ、ご愛嬌ということで・・・😅

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419181134.png "img")    


こちらはインスタンス基本料金とトラフィック料金の方の料金詳細ページでした。  
想定どおり東京リージョンの最低価格「¥0.9/時間」で課金が続いています。  
トラフィックはほぼアクセスがないので¥0ですね。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419180820.png "img")    


こちらが目的のスペック料金の料金詳細です。  
さぁ、どうでしょうか・・・  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_17680117127050800000/20190419180853.png "img")    


こちらも想定どおりスペックが「slb.s1.small」なので「¥0/時間」で計算されました!  


<span style="font-size: 500%">🎉</span>

# 最後に

今回の検証で、実際にSLBの作成時に指定する「スペック」は<b><span style="color: #ff0000">上限値の指定であり実際にはスケール可能なサービス</span></b>であることがおわかり頂けたのではないでしょうか🤗

SLBの使い方としてはデフォルトで提供する性能の上限までスケールしたいのであれば一番高いスペックを選ぶが正解ですね。

何処までもスケールすることは出来ないですが（それは何処のクラウドも同じかな？）<b><span style="color: #ff0000">性能上限がちゃんと判り、予算に合わせた上限を定義できる</span></b>ことはユーザーに優しい仕様なのではないかなと思います。

是非、SLBを正確に理解して上手くご利用頂ければと思います。

<CommunityAuthor 
    author="松田 悦洋"
    self_introduction = "インフラからアプリまでのシステム基盤のアーキテクトを経てクラウドのアーキテクトへ、AWS、Azure、Cloudflare などのサービスやオープンソース関連も嗜みます。2019年1月にソフトバンクへ入社、2020年より Alibaba Cloud MVP。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/matsuda_pic.png"
    githubUrl="https://github.com/yoshihiro-matsuda-sb"
/>


