---
title: "FCでジョブスケジューラを設定"
metaTitle: "FunctionComputeでHologresのジョブスケジューラを設定する方法"
metaDescription: "FunctionComputeでHologresのジョブスケジューラを設定する方法"
date: "2021-07-16"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/Hologres_images_26006613787435000/20210716213110.png"
---

## FunctionComputeでHologresのジョブスケジューラを設定する方法

本記事では、[Hologres](https://www.alibabacloud.com/product/hologres) を使ってFunctionComputeによるジョブスケジューラを設定する方法をご紹介します。        

# Hologresとは

> <span style="color: #ff0000"><i>Hologres はリアルタイムのインタラクティブ分析サービスです。高い同時実行性と低いレイテンシーでTB、PBクラスのデータの移動や分析を短時間で処理できます。PostgreSQL11と互換性があり、データを多次元で分析し、ビジネスインサイトを素早くキャッチすることができます。</i></span>

少し前になりますが、Hologresについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-hologres


# Hologresのジョブスケジューラについて   
Hologresのスケジュールジョブに関する公式ソリューションは、主にDataWorksをベースとしています。HoloStdio、というHologresをDataWorksでハンドリングする機能がありますが、国際サイトでは、HologresとDataWorks（HoloStdio）がまだリリースされていないため、他の方法で導入する必要があります。     
Hologresは、分散コンピューティングノードに最適化された大規模なストレージと優れたクエリ機能を、低コスト、高性能、高可用性で提供するよう設計されています。リアルタイムのデータウェアハウスソリューションとリアルタイムのインタラクティブなクエリサービスを提供します。　　　  
つまり、Hologresに関連するスクリプトやSQL文を定期的に実行するためのトリガーを構築することが今回のポイントとなります。　　　　　

# 前提条件
- Alibaba Cloudのアカウントを持っている       
- HologresとFunction Computeを有効化している      
- Hologresのインスタンスを所持している     

---

# FunctionCompute によるソリューション（Java版）
[Alibaba Cloud Function Compute](https://www.alibabacloud.com/cloud-tech/doc-detail/52895.htm)は、フルマネージドなイベントドリブンコンピューティングサービスです。サーバレスとして運用ですが、 [time trigger](https://www.alibabacloud.com/cloud-tech/doc-detail/68172.htm) を設定することで、指定した時間に自動的に関数を起動することができます。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/68172.htm


以下の手順では、Java関数に基づいて、10分ごとにHologresパーティションテーブルにデータを挿入するスケジュールジョブを構築します。    

# STEP1: Hologresにてテーブルを準備

Hologresで`order_schedule_partition`という名前のテーブルを、`order_time`というカラムをパーティションキーとして作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716211047.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716211059.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716211108.png "img")


# STEP2: FunctionComputeでサンプルコードを準備
FunctionComputeは多くの[プログラミング言語](https://www.alibabacloud.com/cloud-tech/doc-detail/74712.htm) をサポートしています。ここでは「Java」を例として構築します。   
Javaで構築する場合、「fc-java-core」パッケージを使って、「FunctionCompute」が提供する定義済みのハンドラを実装する必要があります。
より詳しい情報は[FunctionComputeによる開発ガイドライン](https://www.alibabacloud.com/cloud-tech/doc-detail/113518.htm) を参照してください。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/113518.htm


FC (Function Compute)ランタイムパッケージの他に、HologresデータベースにSQLステートメントを送信するためには、[Hologres connector](https://www.alibabacloud.com/cloud-tech/doc-detail/162684.htm)が必要です。     
HologresはPostgreSQL 11に対応しているので、一般的な[PostgreSQL JDBCドライバ](https://mvnrepository.com/artifact/org.postgresql/postgresql) がサポートされていますが、[Hologres専用に開発されたDriver](https://mvnrepository.com/artifact/com.alibaba.hologres/postgresql-holo)を利用することもできます。     

> https://mvnrepository.com/artifact/com.alibaba.hologres/postgresql-holo



新しいMavenプロジェクトを作成し、`pom.xml`のdependencyセクションを以下のように更新してください。

```xml
......
    <dependencies>
        <dependency>
            <groupId>com.aliyun.fc.runtime</groupId>
            <artifactId>fc-java-core</artifactId>
            <version>1.4.0</version>
        </dependency>

        <dependency>
            <groupId>com.aliyun.fc.runtime</groupId>
            <artifactId>fc-java-common</artifactId>
            <version>2.2.2</version>
        </dependency>

        <dependency>
            <groupId>com.alibaba.hologres</groupId>
            <artifactId>postgresql-holo</artifactId>
            <version>42.2.18.4</version>
        </dependency>
    </dependencies>
......
```

ターゲットパッケージをビルドするには、[maven-assembly-plugin](http://maven.apache.org/plugins/maven-assembly-plugin/)も必要です。     
以下は設定例です。詳しくは[Java runtime environment](https://www.alibabacloud.com/cloud-tech/doc-detail/113519.htm#title-d1e-mv5-9t3)をご参照ください。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/113519.htm#title-d1e-mv5-9t3


```xml
......
    <build>
        <plugins>
            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <appendAssemblyId>false</appendAssemblyId> <!-- this is used for not append id to the jar name -->
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id> <!-- this is used for inheritance merges -->
                        <phase>package</phase> <!-- bind to the packaging phase -->
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
......
```

上記設定で問題なければ、上記ScriptからHologresデータベースに接続されると、必要に応じて2つのオペレーションが実行されます。

- [Create new partition table](https://www.alibabacloud.com/cloud-tech/doc-detail/181641.htm)
- [Insert random data](https://www.alibabacloud.com/cloud-tech/doc-detail/130409.htm)

> https://www.alibabacloud.com/cloud-tech/doc-detail/181641.htm

> https://www.alibabacloud.com/cloud-tech/doc-detail/130409.htm


関連する操作を行うために、プロジェクト内に新しいJavaクラスを作成します。    

```java
public class App implements StreamRequestHandler {
    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
        try {
            // Connection URL, please update based on your own settings
            String url = "jdbc:postgresql://{ENDPOINT}:{PORT}/{DBNAME}?user={ACCESS_ID}&password={ACCESS_KEY}";
            Connection conn = DriverManager.getConnection(url);
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmm");
            String orderTime = df.format(new Date());
            String table_sql = "create table public.order_schedule_partition_" + orderTime + " partition of public.order_schedule_partition for values in('" + orderTime + "')";
            
            // Operation 1: Create partition table
            Statement st = conn.createStatement();
            int update_row = st.executeUpdate(table_sql);
            context.getLogger().info("Create partition table done! " + update_row);
            
            // Operation 2: Insert random data
            String data_sql = "insert into order_schedule_partition_" + orderTime + " (order_time, order_id, book_id, book_name, price) VALUES" +
                    "(?, ?, ?, ?, ?)";
            PreparedStatement pst = conn.prepareStatement(data_sql);
            Random random = new Random();
            for (int i = 0; i < 10; ++i) {
                int j = 1;
                pst.setString(j++, orderTime);
                pst.setString(j++, UUID.randomUUID().toString());
                pst.setInt(j++, random.nextInt(100));
                pst.setString(j++, UUID.randomUUID().toString());
                pst.setInt(j++, random.nextInt(50));
                int related_row = pst.executeUpdate();
                context.getLogger().info("Insert target row! times: " + i);
            }
            /*conn.commit();*/ // Auto Commit by default
            st.close();
            pst.close();
            conn.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
```

プロジェクトのルートで `mvn clean package` コマンドを実行すると、targetフォルダにビルドされたJARパッケージができます。     

```
D:\Development\java\workspace\fc-hologres-schedule>mvn clean package
[INFO] Scanning for projects...
......
[INFO]
[INFO] ------------------< org.example:fc-hologres-schedule >------------------
[INFO] Building fc-hologres-schedule 1.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
......
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  7.587 s
[INFO] Finished at: 2021-07-13T14:39:46+08:00
[INFO] ------------------------------------------------------------------------
```

# STEP3: FunctionComputeにて、処理内容を設定
Alibaba CloudでFunctionComputeサービスが有効になっていることを確認してください。     
初めてFunction Computeにアクセスする場合は、以下のポップアップウィンドウでクラウドリソースの認証を行ってください。     


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212106.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212116.png "img")

FunctionComputeにてイベント処理したい内容としてFunctionを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212713.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212722.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212730.png "img")


上記で作成したJARパッケージを用いて関数を作成しますが、その際、`Function Handler`の設定に注意する必要があります。      
> Handlerは「example.HelloFC::handleRequest」という形で定義されます。Handler "example.HelloFC::handleRequest "は、exampleパッケージのHelloFC.javaに "handlerRequest "というメソッドがあることを意味します。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212739.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212802.png "img")

`invoke` ボタンをクリックすると、上記作成したScriptを手動でテストすることができます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212943.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716212952.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213001.png "img")



# STEP4: time triggerの作成

FunctionCompute の Time Trigger を使えば、定期的にターゲットスクリプトを実行することができます。     
Time Trigger は、`interval minutes` や `cron expression` に基づいて作成することができます。タイマー設定の詳細については、[time expressions](https://www.alibabacloud.com/cloud-tech/doc-detail/171746.htm#title-hgn-o1r-qih)を参照してください。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/74676.htm

> https://www.alibabacloud.com/cloud-tech/doc-detail/171746.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213042.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213051.png "img")


Time Trigger の作成が成功すると、タイマー設定に基づいてスクリプトが実行されます。    
この例では、cron式の `0 0/10 * * ?` が10分ごとにスクリプトを呼び出します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213110.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213120.png "img")

スケジュールが使用できなくなった場合、タイムトリガーを無効にすることができます。    
そうすれば、スクリプトが自動的に呼び出されることはありません。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213132.png "img")


---

# FunctionCompute によるソリューション（Python 版）

上記は FunctionCompute を Java版 として構築しました。今度はPythonを使って、同じ目的を達成するための構築方法を紹介します。    


# STEP1: Hologresにてテーブルを準備

Hologresで`order_schedule_partition`という名前のテーブルを、`order_time`というカラムをパーティションキーとして作成します。      
上記Java版で既に作成済なら、それを使いまわすこともできます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716211047.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716211059.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716211108.png "img")


# STEP2: FunctionComputeでサンプルコードを準備

[Psycopg](https://www.psycopg.org/)は、Pythonプログラミング言語用のPostgreSQLデータベースアダプターです。HologresはPostgreSQL 11に対応しているので、[Psycopgを使ってHologresに接続する](https://www.alibabacloud.com/cloud-tech/doc-detail/208129.htm) ことができます。

> https://www.alibabacloud.com/cloud-tech/doc-detail/208129.htm

> https://www.psycopg.org/


以下サンプルコードを作成し、`index.py`として保存します。

```py
import psycopg2
import uuid
import time
import random


def handler(event, context):
    # Connect to the database, please update based on your own settings
    connection = psycopg2.connect(host=<ENDPOINT>, port=<PORT>, dbname=<DBNAME>, user=<ACCESS_ID>, password=<ACCESS_KEY>)
    order_time = time.strftime('%Y%m%d%H%M', time.localtime(time.time()))
    cur = connection.cursor()

    # Operation 1: Create partition table
    cur.execute(
        "create table public.order_schedule_partition_{0} partition of public.order_schedule_partition for values in('{0}');".format(
            order_time))
    connection.commit() # commit manually

    # Operation 2: Insert random data
    for i in range(5):
        cur.execute("""INSERT INTO order_schedule_partition_{0} (order_time, order_id, book_id, book_name, price) VALUES
                    ('{0}', '{1}', {2}, '{3}', {4});""".format(order_time, uuid.uuid1(), random.randint(1, 100), uuid.uuid1(),
                                                         random.randint(1, 100)))
    connection.commit() # commit manually
    cur.close()
    connection.close()
    return 'Success'
```

# STEP3: FunctionComputeにて、処理内容を設定

上記URLリンクでも紹介していますが、 `psycopg2`は FunctionCompute のPython3 実行環境の組み込みモジュールの１つではないです。そのため、[カスタムモジュールを使用しながら、カスタムモジュールとコードをパッケージ化して FunctionCompute へアップロード](https://www.alibabacloud.com/cloud-tech/doc-detail/56316.htm#title-lx3-61k-tj6) する必要があります。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/56316.htm#title-lx3-61k-tj6


これには2つの対処方法があります。    
>   `PIP`らパッケージマネージャーを使って依存関係を管理     
>   `fun install` コマンドを使って、依存関係をインストール   

今回はECS上のサーバー（CentOS）で [Funcraft](https://www.alibabacloud.com/cloud-tech/doc-detail/140283.html) によって、`psycopg2`を含む実行環境を構成する方法を説明します。     

> https://www.alibabacloud.com/cloud-tech/doc-detail/140283.html


最新のFuncraftパッケージを [release page](https://github.com/alibaba/funcraft/releases) から入手して、ECSサーバーにダウンロードします。

```
curl -o fun-linux.zip https://funcruft-release.oss-accelerate.aliyuncs.com/fun/fun-v3.6.23-linux.zip
```

[Funcraft](https://www.alibabacloud.com/cloud-tech/doc-detail/161136.htm)をインストールし、バージョン情報を確認します。    

> https://www.alibabacloud.com/cloud-tech/doc-detail/161136.htm


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213926.png "img")

「Hologres」という名前のディレクトリを作成し、`fun install init`  コマンドを実行して FunctionCompute のためのFunctionルートディレクトリを初期化します。これにより、`Funfile` という新しいファイルが生成されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213940.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716213950.png "img")


以下のように `Funfile` の構成を更新し、カスタムモジュール`psycopg2`を設定します。

```
RUNTIME python3
RUN fun-install pip install psycopg2
```

ルートディレクトリに `template.yml` という名前のファイルを作成し、対象となるサービスや機能の情報を定義します。    
詳しくは[template.yml introduction](https://github.com/alibaba/funcraft/blob/master/docs/specs/2018-04-03.md)をご覧ください。    


> https://github.com/alibaba/funcraft/blob/master/docs/specs/2018-04-03.md


以下の内容は、現在のFunctionが  `bob_demo` というサービスの下に `hologres_schedule_py` という名前でデプロイされることを示しています。


```yml
ROSTemplateFormatVersion: '2015-09-01'
Transform: 'Aliyun::Serverless-2018-04-03'
Resources:
  bob_demo:  
    Type: 'Aliyun::Serverless::Service' 
    hologres_schedule_py:    
      Type: 'Aliyun::Serverless::Function'   
      Properties:     
        Handler: index.handler     
        Runtime: python3     
        CodeUri: './'
```

`.env` という名前のファイルを新たに作成し、Alibaba Cloudのアカウント情報を[config Funcraft](https://www.alibabacloud.com/cloud-tech/doc-detail/146702.htm#section-3gc-t34-08o)に追加します。

> https://www.alibabacloud.com/cloud-tech/doc-detail/146702.htm#section-3gc-t34-08o

```
ACCOUNT_ID=xxxxxxxx
REGION=ap-northeast-1
ACCESS_KEY_ID=xxxxxxxxxxxx
ACCESS_KEY_SECRET=xxxxxxxxxx
FC_ENDPOINT=https://{accountid}.{region}.fc.aliyuncs.com
TIMEOUT=10
RETRIES=3
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214009.png "img")

function のルートディレクトリで `fun install` コマンドを実行して、依存関係をインストールします。     
docker serviceがインストールされます。インストール後、これが正常に動作していることを確認してください。    
なお、インストールにはマルチステージビルドを使用しているため、dockerのバージョンは17.05以降である必要があります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214020.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214028.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214036.png "img")


FunCraftを使って、`fun deploy -y`というコマンドで function をデプロイします。    
途中で「Both project and logstore are required for enabling instance metrics. ( インスタンスメトリクスを有効にするには、プロジェクトとログストアの両方が必要です) 」 というエラーメッセージが表示された場合は、サービスの設定で「Request-level Metrics」と「Instance Metrics」を無効にする必要があります。      

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214054.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214103.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214115.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214125.png "img")


あとは手動でコンソールのFunctionを起動し、関連するログや結果を確認します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214151.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214204.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214213.png "img")


# STEP4: time triggerの作成

上記、Java版でも説明していますが、 Time Triggerを作成して、スケジュールジョブの設定を行います。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214226.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214236.png "img")


The script will be run every 10 minutes based on the created time trigger. It could be disable as well.

この Script は、作成されたタイムトリガーに基づいて10分ごとに実行されます。無効にすることもできます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214249.png "img")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-Hologres/Hologres_images_26006613787435000/20210716214258.png "img")


---

# 最後に

ここまで、FunctionComputeでJavaもしくはPythonを使ってHologresのジョブスケジューラを設定する方法を紹介しました。      
PostgreSQL 11と高い互換性があるHologresと、FunctionComputeを使えば、DataWorks無しでもジョブスケジューラなどを色々構築、運用することができます。   



