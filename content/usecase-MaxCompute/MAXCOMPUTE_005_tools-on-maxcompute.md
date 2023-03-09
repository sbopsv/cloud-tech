---
title: "TunnelとIntelliJ IDEAについて"
metaTitle: "MaxComputeを支えるツール・TunnelとIntelliJ IDEAについて"
metaDescription: "MaxComputeを支えるツール・TunnelとIntelliJ IDEAについて"
date: "2021-03-09"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613701983800/20210311210828.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## MaxComputeを支えるツール・TunnelとIntelliJ IDEAについて

本記事では、MaxComputeを支えるツール・TunnelおよびIntelliJ IDEAについてを説明します。

# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute
    

今回はAlibaba Cloud MaxComputeを支えるツール・TunnelおよびIntelliJ IDEAについてを紹介します。     

# Tunnelについて
TunnelはMaxCompute（odps）クライアントコマンドツールです。これを使用してコマンドベースで操作することができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311144718.png "img")

> https://www.alibabacloud.com/cloud-tech/doc-detail/27837.htm


## Tunnelのインストール・セットアップ
以下、ソースコードから、ツールをダウンロードし実行します。     
注意として、クライアント側はJava 8以降が必要です。     

> https://github.com/aliyun/aliyun-odps-console/releases

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311144200.png "img")

あとはterminalにて、bin/odpscmdを起動します。    
以下はwindowsの例ですが、Macでも同様に操作できます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311202419.png "img")

続いて、confフォルダのodps_config.iniファイルを編集しながらクライアント情報を設定します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311202905.png "img")

AK（access_id/access_key）、project_name、endpointは必須入力欄なので記載します。     
endpointはここから確認できます。日本リージョンなので、`http://service.ap-northeast-1.maxcompute.aliyun.com/api`を選択します。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311203845.png "img")

> https://www.alibabacloud.com/cloud-tech/ja/doc-detail/34951.htm

再度、bin/odpscmdを起動すると、MaxComputeのProjectに入り、操作することが出来ます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311204041.png "img")


Tunnelのコマンドはこちらhelpが詳しいですので、参考にいただければ幸いです。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/27833.htm


## Tunnelの具体的な使い方 
・[Tunnelを使ったCSVファイルのアップロード](https://www.alibabacloud.com/cloud-tech/doc-detail/147735.htm)       
・ユーザーの権限やロールの確認     
・プロジェクトの権限やセキュリティ確認     
・SQL操作     

などが挙げられます。そこは用途に応じて確認できれば幸いです。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/193815.htm



---

# IntelliJ IDEAについて
IntelliJ IDEAはJetBrains社製のJava系向けIDE（統合開発環境）です。Javaの開発環境としても人気があるツールです。     
ここにMaxCompute（odps）のプラグインがあり、 IntelliJ IDEAからMaxComputeを操作することができます。      

## IntelliJ IDEAのインストール・セットアップ
 IntelliJ IDEAの操作についてはネットにて色々出回ってるので、ここでは割愛します。      
もちろん、IntelliJ IDEA Community Edition(無料版) でも問題ございません。    


> https://www.alibabacloud.com/cloud-tech/doc-detail/50889.htm



## IntelliJ IDEAの具体的な使い方

IntelliJ IDEAでMaxCompute Studioを使った簡単なdemoとして、CSVファイルの特定列をJavaコードでカスタマイズしてみます。     
次のような出力がゴールとなります。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210940.png "img")

IntelliJ IDEA にて、「File」 > 「設定」 > 「プラグイン」 でMaxCompute Stdioをインストールします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311205510.png "img")

「File」>「New」>「Project」>「MaxCompute Studio」でMaxComputeプロジェクトを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311205702.png "img")

「File」 > 「New」 > 「Module」 > 「MaxCompute Java」 でMaxComputeモジュールを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311205810.png "img")

`src/main/java:Java`はJavaプログラム開発用のソースコードです。      
`examples`  はユニットテスト (UT) の例を含むサンプルコード。UTの開発やコンパイルの例を見ることができます。    
`warehouse` はローカルでの実行に必要なスキーマとデータ。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311205900.png "img")

AlibabaCloudは、gitプロジェクトのアドレスで事前定義されたエクストラクタのソースコードを以下のように提供しています。            
`https://github.com/aliyun/aliyun-odps-java-sdk/tree/master/odps-sdk-impl/odps-udf-example/src/main/java/com/aliyun/odps/udf/example/text`              
新しく作成したモジュールにすべてのJavaファイルを配置し、要件に基づいてTextExtractor.javaのロジックを更新します。          

> https://github.com/aliyun/aliyun-odps-java-sdk/tree/master/odps-sdk-impl/odps-udf-example/src/main/java/com/aliyun/odps/udf/example/text

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210006.png "img")

TextExtractor.javaファイルのtextLineToRecord関数は、データファイルのテキスト行からデータを取り出す方法を定義します。     
要件に基づいて関連する関数を更新します。このデモの場合、関数はデータのロード中にcustom_idをフォーマットします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210113.png "img")

コードの更新後、mvnコマンドを使用してターゲットパッケージを構築します。     
モジュールフォルダに移動し、mvn packageを実行します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210212.png "img")

今度はDataWorks DataStdioの Resource画面に遷移します。    
上記の手順でビルドされたパッケージ [CustomizedExtractor-1.0-SNAPSHOT.jar] をアップロードします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311212500.png "img")

Resource画面で、 [CustomizedExtractor-1.0-SNAPSHOT.jar] を適用するようにします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311212356.png "img")

準備ができたら、Create Tableモーダルにてテーブルを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210443.png "img")

ファイル形式をカスタムファイル形式として選択し、カスタマイズされたハンドラに基づいてリソースとクラスを設定します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210609.png "img")

Tableをコミットします。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210654.png "img")

結果、OSSにあったCSVファイルのデータを変換し表示するようになりました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613701983800/20210311210828.png "img")


---

# 最後に
MaxComputeを支えるツール・TunnelおよびIntelliJ IDEAについてを説明しました。TunnelおよびIntelliJ IDEAを使うことで、様々な開発環境として運用することができます。    
DataWorksらGUI操作だけでは物足りない場合、このツールを使うことで解決することもできますので、ご参考にいただければ幸いです。      


<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>




