---
title: "桜前線シミュレーション"
metaTitle: "Alibab Cloud DataV初心者向けに、３D Widgetより簡単な桜前線シミュレーションの実現方法を紹介します。"
metaDescription: "Alibab Cloud DataV初心者向けに、３D Widgetより簡単な桜前線シミュレーションの実現方法を紹介します。"
date: "2021-06-01"
author: "Hironobu Ohara"
thumbnail: "https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/image.png"
---



# 目的
  データ可視化の魅了の一つは、分かりづらい生データを生き生きで表現させて、誰でもすぐ分かるようにすることです。でも、データの表現力を豊かにするため、いつもプロのデザインナーに頼まないと行けないことで、普通のエンジニアにとってなかなか難しです。DataVの使命の一つは、まさにエンジニア達はこんな悩みから救えたいです。DataVを使えば、プロなデザインナーを頼らず、誰でも綺麗なDashboardを作れます。

  ![11.11](https://img.alicdn.com/tfs/TB1ji7ccLDH8KJjy1XcXXcpdXXa-767-426.gif)

 今回はアリババ が11 月 11 日に行われた「独身の日」セールの際の使われたライブダッシュボードをベスに、簡単に日本の桜前線をシミュレーションすることを挑戦します。

 実現したい効果は：
 * 日本地図上で、桜はいつどこで咲いてるか可視化したい
 * 日付ごとに桜前提の推移状況を動的に表現したい

![イメージ](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/image.png)

上記実現するために、DataV上必要なwidgetは下記だけ：
 * [タイムライン](https://www.alibabacloud.com/cloud-tech/doc-detail/92269.htm)
 * [3D地図](https://www.alibabacloud.com/cloud-tech/doc-detail/95529.htm)

> 要注意：3D地図 Widget はDataVの`エンタプライズ版`しか使えないです。

本ガイドの全体的な流れは下記の通りです。

| セクション         | Topic                       | 説明                                     |
| ------------------ |:--------------------------- |:---------------------------------------- |
| 前提知識           | DataV 基本紹介              | DataV 基本機能の紹介                     |
| -                  | Callback IDの紹介           | DataV Callback IDの説明               |
| -                  | SpringBootの基本知識        | SpringBootを使ってAPIサーバ構築の方法を紹介 |
| 準備作業           |  データの準備             | 必要な桜データと地図データの準備方法を紹介     |
| -                  | APIサーバの構築                | APIサーバの構築方法を紹介             |
| 設定開始            | DataVの設定                 | DataV各Widget設定方法の紹介      |
| -                 | 効果を検証                  | 実現したシミュレーション効果を検証       |



# 前提知識
本ガイドを理解するために、下記の前提知識が必要になります。

## 1.DataVの基本紹介

DataV は、豊富なグラフパターンや地図と融合した視覚化機能などを兼ね備えた、高機能なデータ可視化ツールです。

DataV重要な特徴は下記の通り：

* 豊富なテンプレート
管理センター、地域別分析、リアルタイムモニタリング、運用画面などのさまざまなテンプレートが用意されており、簡単にカスタマイズすることができます。プロのデザイナーが作成したように高品質な画面が表示されます。
![template](https://img.alicdn.com/tfs/TB1nPstfiqAXuNjy1XdXXaYcVXa-978-516.png)

* 各種ウィジェット
基本的なグラフのほかに、DataV は、2D および 3D マップに基づいた経路図、ヒートマップ、散布図などの地理的な情報とデータを組み合わせたグラフを作成する機能を備えています。ECharts や AntV-G2 などのサードパーティ製グラフライブラリも、DataV とスムーズに統合できます。
![widget](https://img.alicdn.com/tfs/TB1sVQvfiqAXuNjy1XdXXaYcVXa-1554-918.png)

* 使いやすいインターフェイス
グラフィックインターフェイスと設定ウィジェットを使用して、簡単なドラッグアンドドロップ操作でダッシュボードを作成できます。
![interface](https://img.alicdn.com/tfs/TB14BIwfiqAXuNjy1XdXXaYcVXa-980-398.png)

今回は11.11のテンプレートをベースに桜前線を実現する予定です。
![11.11](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p0-new.png)

## 2.Callback IDの紹介

ウィジェットにコールバック ID を関連付けることで、相互に作用する機能があります。コールバック ID を使用することで、あるウィジェットをクリックすると、該当するコールバック ID を持つウィジェットのデータが適宜変更することができます。

![callback](http://static-aliyun-doc.oss-cn-hangzhou.aliyuncs.com/assets/img/16584/15583432478533_ja-JP.png)

プログラミング言語の言い方にすると、 `Callback ID = グローバル変数`

詳しい紹介ドキュメントは[こちらのリンク](https://www.alibabacloud.com/cloud-tech/doc-detail/53842.htm)へご参照ください。

> 今回はタイムライン上にコールバック IDを有効にすることで、日付変更度に日付のValueを３D地図へ渡し、３D地図からその日の桜前線情報を取得するように設定します。


## 3.SpringBootの基本知識

サンプルを JavaのSpringBootフレームワークを使ってAPIサーバを構築するので、環境構築方法と使い方について簡単に紹介します。
![springboot](https://saikeblog.com/wp-content/uploads/2019/02/DU7GUGCV4AAf90X_0.jpg-large.png)

 APIサーバを実現したい要件は：

* HTTP サーバ作成
* 事前に作った５日間のJSONデータをrootフォルダの下に置く
* 日付のパラメータを受けて、この日のJsonデータを返す

SpringBootを使う場合は、複雑なサーバ設定なしで 簡単ににAPIサーバを立ち上げすることが可能です。もちろん、NodeJSのExpressフレームワークを使って、同じことが簡単にできます。どちらにするかはお好み次第です。

下記リンクから簡単なデモプロジェクトを作れます。細かい説明はここで省略します。
 https://start.spring.io/

今回のソースコードはこれだけです。

```java
 @RestController
 public class HelloController {
     private static final Logger logger = LoggerFactory.getLogger(HelloController.class);

     ObjectMapper mapper = new ObjectMapper();

     @RequestMapping("/hello")
     public JsonNode Hello(@RequestParam(value="date",defaultValue = "0325") String date) throws IOException {
         String filepath = "/root/"+date+".json";
         JsonNode root = mapper.readTree(new File(filepath));
         return root;
     }

 }
```

# 準備作業

## 1.データの準備

３D地図 Widget をできる限り綺麗に表現するため、今回は下記データを用意する必要があります。

* Opening時Scene Managerの設定
  Scene Manager を使用すると、カメラを回転およびズームすることで、地球のさまざまな部分を表示できます。
  説明ドキュメント：https://www.alibabacloud.com/cloud-tech/doc-detail/95865.htm

  今回こちら用意したデータは下記です：
  https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/init.json
```json
[
  {
    "id": "全国",
    "name": "nationwide",
    "position": {
      "fov": 25.4083,
      "lat": 38.2392,
      "lng": 136.62,
      "distance": 440.36
    },
    "duration": 3000,
    "delay": 3000
  }
]
```

* 日本地図データ（GeoJson）
  3D地図を日本の地図を表現するために、GeoJSONデータが必要です。インターネット上から無料のデータをダウンロードすることが可能です。https://github.com/niiyz/JapanCityGeoJson

  今回こちら用意したデータは下記です。
  https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/japanmap.json

* Roadマップ（GeoJson）
  今回は稲妻効果を加えたいので、稲妻の軌跡データ（実際は地図のGeoJSONデータ）を手動で作ります。
  http://geojson.io/

  ![road](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/s1-geo.png)

  上記ツールで https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/road.json データを作成しました。

* 全国公園の地理座標→日付ごとの桜の開花データ編集
　一番大事なデータです。全国公園の地理座標はインターネット上から取得しました。この座標を元に、Excelで何日でどこの公園は桜をどの程度で咲いてるかを、数値で表現します。
  ![excel](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/s2.png)

  EXCELファイルはこちらから[ダウンロード](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/%E3%81%95%E3%81%8F%E3%82%89.xlsx)可能です。

　最後はEXCELのデータをJSONフォマットに変換します。[オンライン変換ツール](https://www.bejson.com/json/col2json/)はこちらのものを利用しました。

  最後は日付毎に桜開花のJSONデータを作成しました。
  https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0325.json
  https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0331.json
  https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0410.json
  https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0420.json
  https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0430.json　


## 2.APIサーバの構築

今回のAPIサーバはデモから簡単に修正するだけです。Intellij　IDEAを使って、MavenプロジェクトをCompileして最後はPackageするだけです。

![deploy](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/deploy.png)

> 要注意： 使うポートは一応[8081]にしますので、クラウド上ディプロイの場合は、セキュリティグループにポートの開放を忘れないようにしてください。

プロジェクトをPackageした後のDeploy手順をここで共有します。

```shell

# ログイン
ssh root@47.91.20.94

#javaインストール
yum install java-1.8.0-openjdk

wget https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/springboot-helloworld-1.0-SNAPSHOT.jar　　　
wget https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0325.json
wget https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0331.json
wget https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0410.json
wget https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0420.json
wget https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/0430.json

chmod 755 *
# サーバをバックエンド側で動けるようにするため、下記コマンドを利用
nohup java -jar springboot-helloworld-1.0-SNAPSHOT.jar >log.out &

# backendプロセスを確認
jobs

```

ブラウザから http://47.91.20.94:8081/hello?date=0325　をアクセスしてみて、Jsonデータを表示したら成功。

![test](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/s4.png)


# 設定開始

Widget毎の設定方法を紹介します。

まず、最初に11.11のダッシュボードをベースに新しいプロジェクトをつくってください。
プロジェクト作成終わったら、３D地図とタイトル以外のWidgetを削除しても構いません。

ここからは設定手順です：

* 1 . タイムライン追加
  データ：https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/timeline.json
![p1](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p1-add-timeline.png)
* 2 . タイムラインデータ設定
![p2](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p2.png)
* 3 . タイムラインCallback ID有効化
![p3](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p3-interactive.png)
* 4 . タイムライン表示設定
![p4](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p4.png)
* 5 . Earth Layer設定
![p5](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p5.png)]
![p6](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p6-sat.png)
* 6 . 3D地図全体初期設定（日本を地図の中心にする）
![p7](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p7-overview.png)
* 7 . Scene Manager設定
  データ：https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/init.json
![p8](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p8.png)
* 8 . Flying Route Layer設定(効果を綺麗にするだけ、Skipしても構いません)
   データ：https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/flying.json
![p9](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p9.png)
* 9 . Area Choropleth Layer(日本地図)設定
　　データ：https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/japanmap.json
![p10](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p11.png)
* 10 . Trajectory Layer (Lighting効果)設定
　　データ：https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/road.json
![p11](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p10.png)
* 11 . Scatter Layer（桜前線）設定
　　データ：http://47.91.20.94:8081/hello?date=:value
![p12](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p12.png)

上記設定全部終わりましたら、一回右上の「プレビュー」ボタンで効果をチェックしてください。問題なかったら、プロジェクトの公開設定をオンにします。
![open](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/p13-open.png)


# まとめ
以上となります。実際の録画GIFは下記を参照いただければ幸いです。

![effect](https://sb-datav-sample.oss-ap-northeast-1.aliyuncs.com/sakura/image/finalimage.gif)

