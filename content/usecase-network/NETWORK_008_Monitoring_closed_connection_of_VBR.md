---
title: "VBRの閉域接続を監視・通知する"
metaTitle: "VBRの閉域接続をCloud Monitorで監視・通知する"
metaDescription: "VBRの閉域接続をCloud Monitorで監視・通知する"
date: "2020-10-06"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613634958700/20201006112158.png"
---

## VBRの閉域接続をCloud Monitorで監視・通知する


## 構成概要 

今回は東京リージョンのVPCからCENを使ってVBR （Virtual Boader Router：仮想ボーダールーター）と接続させます。VBRより先はNetwork Service Providerが提供する閉域接続サービスを使って閉域網に接続します。

例ではソフトバンクが提供している「<a href="https://www.softbank.jp/biz/nw/nwp/cloud_access/direct_access_for_alibaba/" target="_blank" >ダイレクトアクセス for Alibaba Cloud</a>」を使って閉域網サービスである「SmartVPN」に接続し、拠点オフィスまでの通信を実現しています。

VBRから閉域網まではMain/Backupの冗長構成です。ヘルスチェックパケットはCENか
らVBRを通ってPEルータまで送信し、Cloud Monitorを使ってVBRの監視とアラート通知をさせます。Cloud Monitorは無料で利用することができます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20201006112158.png "img")



Cloud Monitorで監視できるVBRの状態は以下の項目です。  
 ・Healthy Check Latency（ヘルスチェックパケットのレイテンシー）  
 ・Healthy Check Loss Rate（ヘルスチェックパケットのロス）  
 ・Internet In Rate（流入帯域幅）  
 ・Internet Out Rate（流出帯域幅）  

 今回はヘルスチェックの状態を監視したいのでまずはCENヘルスチェックの設定を行い、その次にCloud Monitorで状態を監視します。

   

## CENヘルスチェックの設定

CEN > ヘルスチェック > Japan (Tokyo) を選択 > ヘルスチェックの追加

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20201006112434.png "img")

①インスタンス：VBRが繋がっているCENインスタンスを選択  
②仮想ボーダールータ(VBR)：監視したいVBRインスタンスを選択  
③ソースIP：自動アサイン推奨（手動の場合はCENにアタッチしているVPC内で使われていないIPを指定）  
④ターゲットIP：PEルータのIPを指定（1系、2系でそれぞれ指定）  
⑤プローブ間隔：ヘルスチェックパケットを送信する間隔（デフォルトは2秒）  
⑥プローブパケット：1度に送信するヘルスチェックパケットの数（デフォルトは8個）  

OKをクリックしてヘルスチェックを追加します。
※Main/Backup構成の場合はヘルスチェックの設定がそれぞれで必要です。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20201006112050.png "img")

   

## Cloud Monitorの設定 

まずは通知用でアラーム送信先を設定します。

CloudMonitor > アラームサービス > アラーム送信先の設定  
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20200916162926.png "img")
①任意の名前を入力  
②アラートを受信したいメールアドレスを入力  
③認証コードの送信をクリック   
④上記メールアドレスに届いた認証コードを入力し、保存をクリック  

※Ding ロボットを使うとAlibabaが無料で公開しているチャットツール、
DingTalkにアラートを送信できます。（任意）

CloudMonitor > アラームサービス > 送信先グループを作成
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20200916163418.png "img")
①任意のグループ名を入力  
②送信先の選択で受信したい連絡先を左のリストから右に移し、確定

次に監視項目を設定します。

CloudMonitor > Dashboard > イベントモニタリング > アラームルール > システムイベント > イベントアラーム作成

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20201001162327.png "img")
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20201001162344.png "img")
①プロダクト：CEN-Routerを指定   
②リソース：インスタントリストを指定  
③インスタントリスト：対象のCENインスタンスを指定  
④VBRインスタンスリスト：ヘルスチェックを設定したVBRインスタンスを指定（今回はMain/Backupの２つにチェック）  
⑤アラームルール名：任意の名前  
⑥ルールの説明：今回は仕切り率（ヘルスチェックパケットのロス）を使用、1分サイクルでヘルスチェックの状態を確認、連続3回、ロス値が100%であればヘルスチェックを失敗と見なし通知を行うよう設定  
⑦サイレントチャネルの時刻：状態が復旧しない場合にアラートを再通知させる頻度（デフォルトは24時間）  
⑧有効期間：アラート通知させる時間帯（デフォルトは0:00-23:59）  
⑨アラームタイプ：送信先グループを選択  

OKをクリックしてアラームルールを追加します。
これでCloud MonitorによるVBRの閉域接続の監視・通知設定は完了です。

   

## 通知メールの確認

参考までにヘルスチェックが切れた際の通知メールの例を載せます。
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613634958700/20201001162403.png "img")
①イベント名+CENインスタンスID+VBRインスタンスID  
②VBRの監視ルールのリンク  

   

## おわりに

Cloud Monitorを使えば簡単にVBR閉域接続の監視、メール通知が可能です。  
無料で使えるので試してみてはいかがでしょうか。

