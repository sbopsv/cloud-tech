---
title: "Oracle 移行ツールADAMの紹介"
metaTitle: "Alibaba Cloud Oracle 移行ツールADAM（データベース診断）"
metaDescription: "Alibaba Cloud Oracle 移行ツールADAM（データベース診断）"
date: "2020-02-21"
author: "SBC engineer blog"
thumbnail: "/Migration_images_26006613516723300/20200218104848.png"
---

## Alibaba Cloud Oracle 移行ツールADAM（データベース診断）

本記事では、Alibaba Cloud Oracle 移行ツールAdvanced Database & Application Migration（ADAM、データベース診断）、およびADAMでデータベース移行診断作業についてをご紹介をします。      

# はじめに

Advanced Database & Application Migration(ADAM) というのはアリババクラウドが開発したオンプレミスからデータベースとアプリケーションをクラウドへのマイグレーションサービスです。     

長年のOracleデータベースとアプリケーションのストラクチャー解析、システム改造、移行経験を参考して開発したクラウド化ソリューションで、エンタープライズ向けのデータ・アプリケーション遷移・運用サービスを提供しています。      

# ADAM機能紹介

ADAMには大きく４つの機能が構成されています：

* １、データベース移行診断    
* ２、アプリケーション移行診断    
* ３、データベース移行    
* ４、アプリケーション移行    

まずはデータベースの移行評価を試してみました、本編は機能１[データベース移行診断の機能を検証]の検証になります。    


# ADAM動作確認

# 検証環境用意


検証環境情報：

Oracleサーバー：11gR2(Linux 64bit)

デフォルトのHRスキーマに少し更新を入れて、検証で使います。

```
SQL> select table_name from user_tables;

TABLE_NAME
--------------------------------------------------------------------------------
COUNTRIES
JOB_HISTORY
EMPLOYEES
JOBS
DEPARTMENTS
LOCATIONS
REGIONS

7 rows selected.

SQL> desc EMPLOYEES;
 Name                                      Null?    Type
 ----------------------------------------- -------- ----------------------------
 EMPLOYEE_ID                               NOT NULL NUMBER(6)
 FIRST_NAME                                         VARCHAR2(20)
 LAST_NAME                                 NOT NULL VARCHAR2(25)
 EMAIL                                     NOT NULL VARCHAR2(25)
 PHONE_NUMBER                                       VARCHAR2(20)
 HIRE_DATE                                 NOT NULL DATE
 JOB_ID                                    NOT NULL VARCHAR2(10)
 SALARY                                             NUMBER(8,2)
 COMMISSION_PCT                                     NUMBER(2,2)
 MANAGER_ID                                         NUMBER(6)
 DEPARTMENT_ID                                      NUMBER(4)
 ID_PHOTO                                           BLOB　
```

従業員を管理するテーブルEMPLOYEESには ID_PHOTOという顔写真欄を追加しました、属性はBLOBで、ほかのデータベースと互換性を持ってないので、どんな分析結果が出るか確認してみます。

中には一部の従業員のID用顔写真をサーバにアップロード済みです。

顔写真を更新するプロシージャを新規追加して更新します：
```
DROP PROCEDURE IF EXISTS img_insert
create or replace procedure img_insert(tg_id NUMBER,tg_filename VARCHAR2) as
l_bfile bfile;
l_blob blob;
begin
update EMPLOYEES set ID_PHOTO=empty_blob() where EMPLOYEE_ID=tg_id return ID_PHOTO into l_blob;
l_bfile :=bfilename('IMAGES', tg_filename);
dbms_lob.open(l_bfile, dbms_lob.file_readonly);
dbms_lob.loadfromfile(l_blob, l_bfile, dbms_lob.getlength(l_bfile));
commit;
dbms_lob.close(l_bfile);
end;
/



exec img_insert(100,'100.jpg');
exec img_insert(101,'110.jpg');
```
確認してみると、

社員番号100のStevenと社員番号101のNeenaには顔写真が付いています。
```
SQL> select employee_id,first_name from employees where id_photo is not NULL;

EMPLOYEE_ID FIRST_NAME
----------- ------------------------------------------------------------
	100 Steven
	101 Neena
```

これで検証用のデータベースを準備できました。



# データベース情報収集


ADAM Agentを使ってデータベースのメタデータを収集する準備をします。

必要なツール：ADAM Agent(rainmeter)

ツールをコンソールからダウンロード可能ですが、ダウンロードするにはチケット経由で申請する必要があります。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200217163915.png "img")


まず、Oracleの設定をいくつか確認する必要があります：

アーカイブログモード：
```
SQL> SELECT LOG_MODE FROM V$DATABASE;

LOG_MODE
------------------------------------
ARCHIVELOG
```


サプリメントルログ有効化：

```
SQL> select supplemental_log_data_min from v$database;

SUPPLEMENTAL_LOG_DATA_MI
------------------------
NO

SQL>  alter database add supplemental log data;

Database altered.

SQL> select supplemental_log_data_min from v$database;

SUPPLEMENTAL_LOG_DATA_MI
------------------------
YES
```

データ採取用ユーザの作成＆権限付与：

```

SQL> create user eoa_user identified by "eoaPASSW0RD" default tablespace users;

User created.

SQL> grant connect,resource,select_catalog_role,select any dictionary to eoa_user;

Grant succeeded.

SQL> grant execute on DBMS_LOGMNR to eoa_user;

Grant succeeded.

SQL> grant execute on dbms_metadata to eoa_user;

Grant succeeded.

SQL> grant select any transaction to eoa_user;

Grant succeeded.

SQL> grant select any dictionary to eoa_user;

Grant succeeded.

SQL> grant select any transaction to eoa_user;

Grant succeeded.

SQL> grant analyze any to eoa_user;

Grant succeeded.
```

ADAM Agentはインストール不要で、ツールファイル解凍すれば、実行可能です。

Oracleのバージョンによって、いつくかスクリプトが用意されています。

今回は Oracle 11gのため、collect_11g.shのほうを実行します：
```
[adam@iZxxxxx2zfpZ rainmeter]$ sh collect_11g.sh -u eoa_user -p eoaPASSW0RD -h localhost -P 1521 -d orcl
[2020-02-14 17:03:59] Welcome to the ADAM database collector(v2.21)!
[2020-02-14 17:04:00] Account permission verification succeeded.
[2020-02-14 17:04:04] Start collecting at 2020-02-14 17:04:04
[2020-02-14 17:04:35] Successful database collection.
[2020-02-14 17:04:35] Database collection takes a total of 0 minutes.
[2020-02-14 17:04:35] Data verification succeeded!
[2020-02-14 17:04:35] *****************************************************************************
[2020-02-14 17:04:35] *                            Collect Successfully!
[2020-02-14 17:04:35] *
[2020-02-14 17:04:35] * Complete the file packaging, the package result path is:
[2020-02-14 17:04:35] *     /home/adam/ADAM/rainmeter/out/data.zip
[2020-02-14 17:04:35] * Next Step: go to [https://adam.console.aliyun.com/] to analyze the data!
[2020-02-14 17:04:35] *****************************************************************************
```

実行が成功したら、フォルダー配下にoutというフォルダーができ上がり、中にdata.zipという収集結果ファイルがありました。

このファイルを解凍して見ると、中身はいくつかのcsvファイル、それぞれはデータベースの各オブジェクトらしいです。
```
-rwxr-xr-x  1 user  staff      301 Feb 14 15:02 eoa_tmp_database.csv
-rwxr-xr-x  1 user  staff     1199 Feb 14 15:02 eoa_tmp_database_parameters.csv
-rwxr-xr-x  1 user  staff      223 Feb 14 15:02 eoa_tmp_instance.csv
-rwxr-xr-x  1 user  staff      260 Feb 14 15:02 eoa_tmp_log_info.csv
-rwxr-xr-x  1 user  staff       98 Feb 14 15:02 eoa_tmp_objects.csv
-rwxr-xr-x  1 user  staff      631 Feb 14 15:02 eoa_tmp_osstat.csv
-rwxr-xr-x  1 user  staff   150376 Feb 14 15:02 eoa_tmp_qps.csv
-rwxr-xr-x  1 user  staff    21239 Feb 14 15:02 eoa_tmp_sequences.csv
-rwxr-xr-x  1 user  staff      142 Feb 14 15:02 eoa_tmp_services.csv
-rwxr-xr-x  1 user  staff      124 Feb 14 15:02 eoa_tmp_session_hist.csv
-rwxr-xr-x  1 user  staff  2637181 Feb 14 15:02 eoa_tmp_synonyms.csv
-rwxr-xr-x  1 user  staff     2810 Feb 14 15:02 eoa_tmp_system_metric.csv
-rwxr-xr-x  1 user  staff  2754686 Feb 14 15:02 eoa_tmp_tab_priv.csv
-rwxr-xr-x  1 user  staff   131376 Feb 14 15:02 eoa_tmp_tps.csv
-rwxr-xr-x  1 user  staff   288769 Feb 14 15:02 eoa_tmp_types.csv
-rwxr-xr-x  1 user  staff      412 Feb 14 15:02 eoa_tmp_versions.csv
-rwxr-xr-x  1 user  staff    54441 Feb 14 15:02 eoa_tmp_vparameter.csv
```

こちらのファイル（Zipファイルのまま）をADAM コンソールで分析します。

# データベース分析

ADAMコンソールにログインすれば、Portrait Managementというメニューがあります、
データベースの情報をポートレートとして作成し分析するという理解で良いでしょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200217164140.png "img")

新規ポートレートを作成し、情報入力をします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200217164414.png "img")


Agentから収集結果ファイルをアップロードし、分析開始します。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200217164522.png "img")


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200217164628.png "img")


分析が終わりますと、データベースのポートレートができて、いろんなグラフ情報が表示されます。

データベース全体情報
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200218104848.png "img")

オブジェクト構成情報、

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200218104820.png "img")


AlibabaCloudが提供しているデータベースサービスとの互換性情報

オブジェクトの互換性情報
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200218105111.png "img")

互換性がもっとも高いデータベースサービスが[POLARDB](https://www.alibabacloud.com/ja/product/polardb)であることがわかります。

SQLの互換性情報
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200218105315.png "img")


ポートレート作成完了後、移行先がPOLARDB for Oracleである想定のプロジェクトを立ち上げて、マイグレーションアセスメントをします。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200218143219.png "img")

詳細な情報はPDFレポートとしてダウンロードできます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200218143519.png "img")

また、マイグレーションプランはマイグレーション実行するときに必要なファイルです。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200220145742.png "img")


まず、気になる全体的な互換性の分析結果を見てみます：

POLARDB for  Oracleとの互換性は96%です：
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200220101342.png "img")


詳細を確認すると、完全な互換性を持つオブジェクトは０、ADAMで修正可能なオブジェクトはほとんどで、完全に互換できないプロシージャが一つあります、これは従業員の顔写真を更新するプロシージャですね、想定内です。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/migration/Migration_images_26006613516723300/20200220101504.png "img")


ではオブジェクトの修正案がどうなるか、確認します：

ADAMコンソールのマイグレーションプロジェクトで互換性分析の詳細から各オブジェクトのDDL定義と移行先DDL案があります。

例えば、テーブル：DEPARTMENTSのDDL修正案は下記のようになります。
Oracle定義：
```
CREATE TABLE "HRCOPY"."DEPARTMENTS"(
    "DEPARTMENT_ID" NUMBER(4, 0),
    "DEPARTMENT_NAME" VARCHAR2(30) CONSTRAINT "DEPT_NAME_NN" NOT NULL ENABLE,
    "MANAGER_ID" NUMBER(6, 0),
    "LOCATION_ID" NUMBER(4, 0)
);
ALTER TABLE "HRCOPY"."DEPARTMENTS" ADD CONSTRAINT "DEPT_ID_PK" PRIMARY KEY("DEPARTMENT_ID") ENABLE;
```
POLARDB for ORACLEへ移行する際の修正案：
```
CREATE TABLE HRCOPY.DEPARTMENTS(
    -- @DEPARTMENT_ID
    DEPARTMENT_ID NUMBER(4, 0),
    -- @DEPARTMENT_NAME
    DEPARTMENT_NAME VARCHAR2(30) CONSTRAINT DEPT_NAME_NN NOT NULL,
    -- @MANAGER_ID
    MANAGER_ID NUMBER(6, 0),
    -- @LOCATION_ID
    LOCATION_ID NUMBER(4, 0),
    CONSTRAINT DEPT_ID_PK_CONSTRAINT PRIMARY KEY(DEPARTMENT_ID)
)
WITH OIDS; 
```

そして、互換できないもの、プロシージャ：IMG_INSERT

ローカルのイメージファイルをBLOBタイプで定義しているため、POLARDBは扱いできない、ファイルをOSSに保存してを外部表として管理する必要があります。


# 最後に
以上、ADAMによる診断での確認結果としては、このようなプロセスで問題個所を含め明確に判明することができます。Oracle Databaseからのマイグレーションの際は参考に頂ければ幸いです。     







