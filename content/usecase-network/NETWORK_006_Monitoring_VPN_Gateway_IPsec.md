---
title: "VPN GatewayのIPSecを監視"
metaTitle: "VPN GatewayのIPsec接続をCloud Monitorで監視・通知する"
metaDescription: "VPN GatewayのIPsec接続をCloud Monitorで監視・通知する"
date: "2020-09-16"
author: "SBC engineer blog"
thumbnail: "/Network_images_26006613628628000/20200916165522.png"
---

## VPN GatewayのIPsec接続をCloud Monitorで監視・通知する

本記事はクラウド側でIPsec接続の監視をしたい、さらには通知をメールでできるようにする方法を記載します。    


## 構成概要 

今回はVPN Gatewayと拠点ルータをIPsecで接続し、Cloud Monitorで監視と通知を実現します。  
Cloud MonitorはAlibaba Cloud上で無料で利用できます。    


![基本構成](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628628000/20200916165522.png "基本構成")


Cloud Monitorで監視できるVPN Gatewayの状態は以下の項目です。  
 ・ipsec_health_check_failed（ヘルスチェック失敗）  
 ・ipsec_phase1_nego_failed（フェーズ１失敗）  
 ・ipsec_phase2_nego_failed（フェーズ２失敗）  
 ・ipsec_health_check_success（ヘルスチェック成功）  
 ・ipsec_phase1_nego_success（フェーズ１成功）  
 ・ipsec_phase2_nego_success（フェーズ２成功）  



## Cloud Monitorの設定 

まずは通知用でアラーム送信先を設定します。

CloudMonitor > アラームサービス > アラーム送信先の設定  

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628628000/20200916162926.png "img")

①任意の名前を入力  
②アラートを受信したいメールアドレスを入力  
③認証コードの送信をクリック   
④上記メールアドレスに届いた認証コードを入力し、保存をクリック  

※Ding ロボットを使うとAlibabaが無料で公開しているチャットツール、
DingTalkにアラートを送信できます。（任意）

CloudMonitor > アラームサービス > 送信先グループを作成   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628628000/20200916163418.png "img")

①任意のグループ名を入力  
②送信先の選択で受信したい連絡先を左のリストから右に移し、確定

次に監視項目を設定します。

CloudMonitor > Dashboard > イベントモニタリング > アラームルール > システムイベント > イベントアラーム作成    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628628000/20200916163640.png "img")

①任意のアラームルール名称を入力  
②製品タイプはVPNゲートウェイを選択  
③アラートを受信したいイベント名を選択   
④アラートを受信したい連絡先グループを選択し、確定  

これでCloud MonitorによるIPsec接続の監視・通知設定は完了です。

## 通知メールの確認

参考までにヘルスチェックが切れた際の通知メールの例を載せます。   
![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-network/Network_images_26006613628628000/20200916164537.png "img")

①イベント名  
②IPsec接続ID

## おわりに

Cloud Monitorを使えば簡単にVPN GatewayのIPsec接続監視、メール通知が可能です。  
無料で使えるので試してみてはいかがでしょうか。



