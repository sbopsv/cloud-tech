---
title: "TableStoreから連携する方法"
metaTitle: "TableStoreからMaxComputeへ連携する方法"
metaDescription: "TableStoreからMaxComputeへ連携する方法"
date: "2021-03-23"
author: "Hironobu Ohara/大原 陽宣"
thumbnail: "/MaxCompute_images_26006613699524000/20210312012000.png"
---


import CommunityAuthor from '../../src/CommunityAuthor.js';

## TableStoreからMaxComputeへ連携する方法

本記事では、TableStoreからMaxComputeへ連携する方法について説明します。

# 前書き

> <span style="color: #ff0000"><i>MaxCompute (旧プロダクト名 ODPS) は、大規模データウェアハウジングのためのフルマネージドかつマルチテナント形式のデータ処理プラットフォームです。さまざまなデータインポートソリューションと分散計算モデルにより、大規模データの効率的な照会、運用コストの削減、データセキュリティを実現します。</i></span>

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699521900/20210104133726.png "img")

少し前になりますが、MaxComputeについての資料をSlideShareへアップロードしていますので、こちらも参考になればと思います。 

> https://www.slideshare.net/sbopsv/alibaba-cloud-maxcompute


    
今回はAlibaba Cloud TableStore からMaxComputeへデータを連携します（フルデータ同期、増分データ同期、列/行モード）。構成図で、こんな感じです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312012000.png "img")


---
---

# 共通作業（MaxCompute全体で共通事項）

## RAM ユーザー作成＆権限付与
もしMaxComputeを操作するユーザがRAMユーザーの場合は以下を実施してください。    

RAMより対象のユーザーを選定します。ユーザーが無い場合は新規作成します。 このときにAccessKey IDとAccessKey Secretをメモとして残してください。AccessKey IDとAccessKey SecretはDataWorks DataIntegrationの処理に必要となります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210305025953.png "img")

対象のユーザーには権限ロールとしてAliyunDataWorksFullAccessをアタッチします。 これはDataWorksを操作するためのFull権限です。    
DataWorks側にてユーザーごとに読み取り専用や一部プロジェクト・テーブルなどのきめ細かい権限付与ができますが、ここでは割愛します。       

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210305025809.png "img")


## Workspace作成

MaxComputeを操作するためにはワークスペースおよびプロジェクトが必要なので新たに作成します。DataWorksコンソールから 「Create Project」を選択し、起動します。    
Modeは「Basic Mode（基本モード）」「と「Standard Mode（標準モード）」の２種類があります。ここは「Basic Mode（基本モード）」として選定します。   
  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210304212211.png "img")

続けて、MaxCompute を選定します。料金は初めて操作するなら Pay-As-You-Go（使った分だけ課金） が良いと思います。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210304220348.png "img")

MaxComputeに関する必要な情報を設定し、Workspaceを作成します。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210304220459.png "img")

##  同期タスクをサブミットする方法（基本モード（basic mode））
作業の途中で 同期タスクをサブミットする旨のアクションが発生しますが、こちらの手順を参考にいただければ幸いです。　　　　   

DataWorks DataStdioで、操作が終わったら [Commit to Production Environment] をクリックし開発環境から本番環境へ直接コミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311222112.png "img")


##  同期タスクをサブミットする方法（標準モード（standard mode））

DataWorks DataStdioの右側にあるProperitiesをクリックします。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311221338.png "img")

プロパティRerunを設定して、[Use Root Node]ボタンをクリックします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311221142.png "img")

開発環境にサブミットします。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311221120.png "img")

あとは開発環境から本番環境にデプロイします。    

## Maxcomputeのデータをクエリする方法
DataWorks DataStdioのAd-Hoc Query画面に入って、[ODPS SQL]のノードを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311222431.png "img")

SQLクエリ文を作成したら、上書き保存してから、Run SQLボタンを押します。   
その後、SQLクエリの実行コストらお金が出ますが、ここも考慮のうえ、Run、で実行します。   
実行結果としてレコード数が無事表示されます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311222939.png "img")


---
---

# （事前準備）TableStore の準備
TableStoreのインスタンスを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312012317.png "img")

TableStoreのテーブルを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312012353.png "img")

Python SDKでTableStoreにデータを作成します。    

```python
from tablestore import *
import time
MachineIpList = ["7552_10.10.10.2", "7552_10.10.10.2", "8d9c_10.10.10.3", "8d9c_10.10.10.3", "e5a3_10.10.10.1"]
MetricsList = [{"cpu": "1", "net_in": "10.0"}, {"cpu": "2", "net_in": "11.0"}, {"cpu": "3", "net_in": "12.0"},{"cpu": "4", "net_in": "13.0"}, {"cpu": "5", "net_in": "14.0"}]

def batch_write_row(client):
    # batch put 10 rows and update 10 rows on exist table, delete 10 rows on a not-exist table.
    put_row_items = []
    all_primary_key = []
    for i in range(0, 5):
        now = int(time.time_ns())
        primary_key = [('MachineIp', MachineIpList[i]), ('Timestamp', now)]
        attribute_columns = [('Metrics', str(MetricsList[i]))]
        row = Row(primary_key, attribute_columns)
        condition = Condition(RowExistenceExpectation.IGNORE)
        item = PutRowItem(row, condition)
        put_row_items.append(item)
        all_primary_key.append((now, MachineIpList[i]))
        time.sleep(1)
                                                                                                       
    request = BatchWriteRowRequest()
    request.add(TableInBatchWriteRowItem(table_name, put_row_items))
    result = client.batch_write_row(request)
    print('Result status: %s' % (result.is_all_succeed()))
    print('check table\'s put results:')
    succ, fail = result.get_put()
    for item in succ:
        print('Put succeed, consume %s write cu.' % item.consumed.write)
    for item in fail:
        print('Put failed, error code: %s, error message: %s' % (item.error_code, item.error_message))
    return all_primary_key
                                                                                                            
if __name__ == '__main__':
    OTS_ENDPOINT = 'https://dw02.ap-northeast-1.ots.aliyuncs.com'
    OTS_ID = 'LTA**************RKwQ' #実際のIDを入力
    OTS_SECRET = 'eB6K54**********fVU' #実際のSecretを入力
    OTS_INSTANCE = 'dw01'
    table_name = 'Monitor'
    client = OTSClient(OTS_ENDPOINT, OTS_ID, OTS_SECRET, OTS_INSTANCE)
    time.sleep(3)  # wait for table ready
    primary_key_list = batch_write_row(client)
    print('push data')

```

上記Python SDKで作成したデータを確認します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312013627.png "img")



今度はDataWorks側での作業に移ります。   
TableStore をDataWorks DataIntegrationデータソースに追加します。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311230553.png "img")

データソース追加をクリックして、TableStore を選択します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312013814.png "img")

データソースとしてTableStore の情報を入力し、接続テストを実行します。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312013920.png "img")

接続テストで問題なければ、Completeボタンをクリックすることで、TableStore のデータソースが追加されます。   
これでTableStore 側の設定は完了です。次はMaxCompute Tableの準備を進めます。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312013953.png "img")


# （事前準備）MaxCompute Tableの準備

DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311231235.png "img")

Workspace Tables画面に入って、テーブルを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014108.png "img")

DDL Statementボタンをクリックして、OTS Tableに対応するDDL Statementを入力します。    

```
CREATE TABLE IF NOT EXISTS ots_to_odps (
    `MachineIp` string  COMMENT '',
    `ots_timestamp` BIGINT COMMENT '',
    `Metrics` string COMMENT  ''
);
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014119.png "img")


Display Nameを入力し、テーブルをコミットします。その後はテーブルが作成されてることが確認できます。    
※標準モードプロジェクトの場合は本番環境にもコミットする必要があります。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014228.png "img")


この準備が終わり次第、データを移行してみます。データ移行にはGUIモードとスクリプトモードの２つのパターンがあります。まずはGUIモードで移行します。    
スクリプトモードはtemplateな扱いができるため、後日この作業の自動化したい場合、活用できればと思います。   

# TableStore - MaxCompute の同期(フルデータ、スクリプトモード）

## STEP1: workflow作成
DataWorks DataIntegrationから、新規オフライン同期タスクをクリックし、DataStdio画面へ遷移します。     
DataStdio画面にて、「Create Node」らダイアログが表示されますが、ここではクローズします。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210311231235.png "img")

DataStdio画面にてWorkflowを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014502.png "img")

## STEP2: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014526.png "img")

ソースをOTS、ターゲットをODPSに選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014605.png "img")

ターゲット・MaxComputeテーブルを選定します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014615.png "img")

Switch to Code Editorボタンをクリックし、スクリプトモードにスイッチします。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014705.png "img")

スクリプトが表示されますが、スクリプトを編集します。    
```
{
    "type": "job",
    "steps": [
        {
            "stepType": "ots",
            "parameter": {
                "datasource": "ots_first",
                "column": [
                    {
                        "name": "MachineIp"
                    },
                    {
                        "name": "Timestamp"
                    },
                    {
                        "name": "Metrics"
                    }
                ],
                "range": {
                    "split": [
                        {
                            "type": "INF_MIN"
                        },
                        {
                            "type": "STRING",
                            "value": "7552_10.10.10.2"
                        },
                        {
                            "type": "STRING",
                            "value": "8d9c_10.10.10.3"
                        },
                        {
                            "type": "STRING",
                            "value": "e5a3_10.10.10.1"
                        },
                        {
                            "type": "INF_MAX"
                        }
                    ],
                    "end": [
                        {
                            "type": "INF_MAX"
                        },
                        {
                            "type": "INF_MAX"
                        }
                    ],
                    "begin": [
                        {
                            "type": "INF_MIN"
                        },
                        {
                            "type": "INF_MIN"
                        }
                    ]
                },
                "table": "Monitor"
            },
            "name": "Reader",
            "category": "reader"
        },
       {
            "stepType": "odps",
            "parameter": {
                "partition": "",
                "truncate": true,
                "datasource": "odps_first",
                "column": [
                    "*"
                ],
                "emptyAsNull": false,
                "table": "ots_to_odps"
            },
            "name": "Writer",
            "category": "writer"
        }
    ],
    "version": "2.0",
    "order": {
        "hops": [
            {
                "from": "Reader",
                "to": "Writer"
            }
        ]
    },
    "setting": {
        "errorLimit": {
            "record": ""
        },
        "speed": {
            "concurrent": 2,
            "throttle": false
        }
    }
}
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014723.png "img")

## STEP3: DI 同期タスクを実行

タスクを実行します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014856.png "img")

タスクが成功すると、Logが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014927.png "img")

あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly01_dev.ots_to_odps;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312014938.png "img")

これにより、TableStore - MaxCompute の同期(フルデータ、スクリプトモード）が確認できました。     


# TableStoreに増分データを用意
今度はTableStoreで増分データ分だけ同期する方法を試します。準備としてTableStore側で増分データを用意します。    
まずはTableStoreのStream機能を有効にします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015153.png "img")

Python SDKでTableStoreにデータを追加で書き込みします。    

```python
from tablestore import *
import time
MachineIpList = ["7552_10.10.10.2", "7552_10.10.10.2", "8d9c_10.10.10.3", "8d9c_10.10.10.3", "e5a3_10.10.10.1"]
MetricsList = [{"cpu": "1", "net_in": "10.0"}, {"cpu": "2", "net_in": "11.0"}, {"cpu": "3", "net_in": "12.0"},{"cpu": "4", "net_in": "13.0"}, {"cpu": "5", "net_in": "14.0"}]

def batch_write_row(client):
    # batch put 10 rows and update 10 rows on exist table, delete 10 rows on a not-exist table.
    put_row_items = []
    all_primary_key = []
    for i in range(0, 5):
        now = int(time.time_ns())
        primary_key = [('MachineIp', MachineIpList[i]), ('Timestamp', now)]
        attribute_columns = [('Metrics', str(MetricsList[i]))]
        row = Row(primary_key, attribute_columns)
        condition = Condition(RowExistenceExpectation.IGNORE)
        item = PutRowItem(row, condition)
        put_row_items.append(item)
        all_primary_key.append((now, MachineIpList[i]))
        time.sleep(1)
                                                                                                       
    request = BatchWriteRowRequest()
    request.add(TableInBatchWriteRowItem(table_name, put_row_items))
    result = client.batch_write_row(request)
    print('Result status: %s' % (result.is_all_succeed()))
    print('check table\'s put results:')
    succ, fail = result.get_put()
    for item in succ:
        print('Put succeed, consume %s write cu.' % item.consumed.write)
    for item in fail:
        print('Put failed, error code: %s, error message: %s' % (item.error_code, item.error_message))
    return all_primary_key
                                                                                                            
if __name__ == '__main__':
    OTS_ENDPOINT = 'https://dw02.ap-northeast-1.ots.aliyuncs.com'
    OTS_ID = 'LTA**************RKwQ' #実際のIDを入力
    OTS_SECRET = 'eB6K54**********fVU' #実際のSecretを入力
    OTS_INSTANCE = 'dw01'
    table_name = 'Monitor'
    client = OTSClient(OTS_ENDPOINT, OTS_ID, OTS_SECRET, OTS_INSTANCE)
    time.sleep(3)  # wait for table ready
    primary_key_list = batch_write_row(client)
    print('push data')

```

上記Python SDKで作成したデータを確認します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015348.png "img")

この時点で、先ほどMaxComputeに格納したデータには含まれていないデータがあることがわかります。これを使って、増分データの同期を試してみます。     

# TableStoreをMaxCompute Tableへ同期(増分データ、GUIモード、列モード）

## STEP1: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015458.png "img")

ソースを<b>OTS Stream</b>、テーブルを選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015547.png "img")

ターゲットをODPS、テーブル作成ボタンをクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015715.png "img")

テーブル名とカラムのタイプを編集して、MaxComputeテーブルを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015733.png "img")

## STEP2: DI 同期タスクを実行

タスクを実行します。    
引数Argumentsがありますが、適当なstartTimeとendTime、bizdateを入力します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015806.png "img")


タスクが成功すると、Logが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015920.png "img")


あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly01_dev.monitor_add_one where ds=‘20200913’;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015950.png "img")

これにより、TableStoreをMaxCompute Tableへ同期(増分データ、GUIモード、列モード）が確認できました。     


# TableStoreをMaxCompute Tableへ同期(増分データ、スクリプトモード、列モード)

## STEP1: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015458.png "img")

ソースを<b>OTS Stream</b>、テーブルを選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015547.png "img")

ターゲットをODPS、テーブル作成ボタンをクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015715.png "img")

テーブル名とカラムのタイプを編集して、MaxComputeテーブルを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015733.png "img")


## STEP2: スクリプトモードにスイッチ
Switch to Code Editorボタンをクリックし、スクリプトモードにスイッチします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020150.png "img")

するとスクリプトが表示されます。これは先述、GUIモードで選択した設定が自動でスクリプトに反映されます。     
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020201.png "img")

## STEP3: DI 同期タスクを実行

タスクを実行します。    
引数Argumentsがありますが、適当なstartTimeとendTime、bizdateを入力します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020230.png "img")

タスクが成功すると、Logが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020241.png "img")


あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly01_dev.monitor_add_one where ds=‘20200913’;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015950.png "img")

これにより、TableStoreをMaxCompute Tableへ同期(増分データ、スクリプトモード、列モード) が確認できました。     


# TableStoreをMaxCompute Tableへ同期(増分データ、スクリプトモード、行モード)
最後に、行モードで増分データの同期を試します。    


## STEP1: DI 同期タスクを作成
同期タスクを作成します。  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015458.png "img")

ソースを<b>OTS Stream</b>、テーブルを選択します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015547.png "img")

ターゲットをODPS、テーブル作成ボタンをクリックします。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015715.png "img")

テーブル名とカラムのタイプを編集して、MaxComputeテーブルを作成します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312015733.png "img")


## STEP2: スクリプトモードにスイッチ
Switch to Code Editorボタンをクリックし、スクリプトモードにスイッチします。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020450.png "img")

スクリプトが表示されますが、スクリプトを編集します。    
modeとcolumnを編集します。     
```
 "parameter": {
                "mode": "single_version_and_update_only",
                "statusTable": "TableStoreStreamReaderStatusTable",
                "maxRetries": 30,
                "isExportSequenceInfo": false,
                "datasource": "ots_first",
                "column": [
                    {
                        "name": "MachineIp"
                    },
                    {
                        "name": "Timestamp"
                    },
                    {
                        "name": "Metrics"
                    }
                ],
                "startTimeString": "${startTime}",
                "table": "Monitor",
                "endTimeString": "${endTime}"
            }
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020606.png "img")


## STEP3: DI 同期タスクを実行

タスクを実行します。    
引数Argumentsがありますが、適当なstartTimeとendTime、bizdateを入力します。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020622.png "img")


タスクが成功すると、Logが表示されます。    
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020657.png "img")


あとはAd-Hoc クエリで確認します（手順は上記の共通手順にて記載しています）    
```
select * from nelly01_dev.ots_to_odps;
```
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-MaxCompute/MaxCompute_images_26006613699524000/20210312020720.png "img")

これにより、TableStoreをMaxCompute Tableへ同期(増分データ、スクリプトモード、行モード) が確認できました。     

---


# 最後に
本記事では、TableStoreからMaxComputeへ連携する方法を簡単に説明しました。     
TableStoreでデータ量が肥大化した場合は、この方法でMaxComputeへデータ移植、コスト削減およびDWHとしての運用ができれば幸いです。   

<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


