---
title: "ArcserveによるOSSバックアップ"
metaTitle: "ArcserveBackupのクラウドストレージにOSSを使用してみた"
metaDescription: "ArcserveBackupのクラウドストレージにOSSを使用してみた"
date: "2019-11-28"
author: "SBC engineer blog"
thumbnail: "/Storage_images_26006613465461000/20191126152821.png"
---


## ArcserveBackupのクラウドストレージにOSSを使用してみた

本記事では、ArcserveによるBackup先をAlibaba Cloud OSSに設定する方法をご紹介します。

## Arcserveとは      

ご存知の方も多いと思いますが、簡単にArcserveとはどのようなソフトウェアなのか紹介します。      

> **Arcserve Backup : データ保護の大黒柱 頼れるバックアップ**      
バックアップ先を選ばず、小規模から大規模まで保護できるファイル単位のバックアップソリューション

      
[Arcserve Backup公式のカタログ](https://s28241.pcdn.co/wp-content/uploads/2019/11/asb-introduction.pdf)ではこのように紹介しています。      
Arcserveは30年の実績を持つバックアップソフトで、ファイル単位でバックアップを行い、セッション単位/メディア単位でのリストアが可能です。      
また、バックアップストレージにクラウドデバイスを選択することが可能です。      
今回は、Alibaba CloudのOSSをArcserve Backupのクラウドストレージとして使用する方法をご紹介していきます。

![20191126152821](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191126152821.png "20191126152821")


## Alibaba Cloudと接続      
まずは、**クラウドコネクション**を作成します。      
クラウドコネクションを作成することで、Alibaba Cloud上のリソースをクラウドストレージとして使用できるようになります。

Arcserve BackupのManagerを開きます。    
バックアップ、アーカイブ、リストア作業は、全てこのコンソールから行います。    

![20191113165334](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165334.png "20191113165334")



デバイスマネージャからクラウドコネクションを作成します   

![20191113165340](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165340.png "20191113165340")


![20191113165346](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165346.png "20191113165346")


![20191113165350](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165350.png "20191113165350")


表示されている記入項目を入力していきます。
Vendor URLは、デフォルトでAWS S3のものが入力されていますが、      
この部分を**OSSのエンドポイント**に変更します。      
また、Bucket Nameを先に入力するとBucket Regionが表示されないという問題が発生するため、      
**Bucket Regionを先に選択してから、Bucket Nameを入力**します。その後、Verifyを押すと以下のようなエラーメッセージが表示されますが、OKを押してエラーを消し、更にOKを押すと正常にクラウドコネクションが確立します。


![20191113165358](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165358.png "20191113165358")

![20191113165402](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165402.png "20191113165402")

![20191126151050](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191126151050.png "20191126151050")


次に、クラウドデバイスの作成を行います。      
クラウドコネクションで接続できるようになったOSS上にクラウドファイルを作成し、
そのファイルをクラウドストレージとして使用します。

![20191113165405](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165405.png "20191113165405")


![20191113165409](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165409.png "20191113165409")

作成するクラウドデバイスの情報を入力します。      
クラウドコネクションは先ほど作成したコネクションを選択し、クラウドフォルダは任意の名前で作成します。

![20191113165413](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165413.png "20191113165413")

左ペインで、クラウドデバイスが作成されていることが確認できます。      
ちなみに、左側の小さな絵に雲のマークが付いているものは、クラウド上デバイスであることを表しています。

![20191113165417](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165417.png "20191113165417")

Alibaba Cloudコンソールから対象OSSの中身を確認すると、確かに先ほど作成したクラウドファイルCF1の作成が確認できました。

![20191113165421](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165421.png "20191113165421")

これで、Alibaba CloudのOSSとの接続は完了です。
次の項目で実際にバックアップをとってみましょう。

## バックアップジョブを実行      
全項目で、OSSとのコネクションが確立したので実際にバックアップジョブを実行してみます。      
今回は、ローカルにあるファイルをクラウドストレージにバックアップします。
バックアップジョブは、Backup Managerコンソールから行います。
バックアップをとりたいファイルを左ペインから選択します。

![20191113165425](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165425.png "20191113165425")

次に、バックアップ先として先ほど作成したクラウドデバイスを選択し、ジョブを実行します。

![20191113165429](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165429.png "20191113165429")

今回、ログの情報については触れませんが、ジョブが失敗した場合にはアクティビティログから原因を特定することができます。      
今回のジョブは問題なく完了しました。

![20191113165433](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165433.png "20191113165433")

## リストアジョブを実行      
リストアジョブは、Restore Managerコンソールから行います。
前項目でOSS上に作成したバックアップファイルをリストアしてみましょう。      
セッション単位のリストア、メディア単位のリストアなど複数のリストア方法がありますが、今回はセッション単位のリストアを行います。      
ソースタブで、セッション単位のリストアを選択し、先ほどのバックアップジョブ実行時のセッションを選択します。

![20191113165436](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165436.png "20191113165436")

リストア先は、分かりやすいようにArcserve-Restoreという空のファイルを選択し、ジョブを実行します。

![20191113165441](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165441.png "20191113165441")

エクスプローラで確認すると、空だったArcserve-Restoreにバックアップしたファイルがリストアされていました。

![20191113165445](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-storage/Storage_images_26006613465461000/20191113165445.png "20191113165445")

これでリストアも完了です。OSSへの接続からバックアップ、リストアまで簡単に行うことができました。

## その他のバックアップ/リストア方法      

今回は、OSSへの接続から簡単なバックアップ、リストアをご紹介しました。      
他にも重複排除ディスクを使用したバックアップや、差分バックアップも可能です。      
適切なバックアップ方法を選択することで、バックアップ/リストアジョブの最適化が図れますが、操作方法は割愛します。      


クラウドコネクションの作成、クラウドディスクの作成以外は他のパブリッククラウドのプロダクトを使用する場合と同様に行うことができるので、      
Arcserve BackupはAlibaba Cloud OSSで使用可能ということがわかりました！      
ファイルバックアップ等でAlibaba Cloud OSSとArcserve Backupの組み合わせを是非ご検討ください。      

## 最後に      

OSSをArcserve Backupのクラウドストレージとして使用する方法についてご紹介させていただきました。      
Arcserveは様々な業界で使用されている実績あるバックアップソフトなので、活用できるのではないでしょうか。


