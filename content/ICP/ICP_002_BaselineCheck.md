---
title: "中国サイバーセキュリティ対策 Part1"
metaTitle: "Security Center の Baseline Check を利用した中国サイバーセキュリティ法のサイバーセキュリティ等級保護2.0対策"
metaDescription: "Security Center の Baseline Check を利用した中国サイバーセキュリティ法のサイバーセキュリティ等級保護2.0対策"
date: "2019-11-08"
author: "sbc_yoshimura"
thumbnail: "/ICP_images_26006613462854600/20191108122409.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Security Center の Baseline Check を利用した中国サイバーセキュリティ法のサイバーセキュリティ等級保護2.0対策

# はじめに

中国でビジネスを行っている方にとって、中国サイバーセキュリティ法は情報が少なく困っている方が多いと思います。     
今日はそのような方にとって役立ちそうなプロダクトをご紹介します。      
なお、Security Center は日本サイトではローンチされていないため、試してみるには International サイトになります。    


# Security Center の Baseline Check とは
Alibaba Cloud の Security Center は ECS、SLBなどのAlibaba Cloudプロダクト、または Alibaba Cloud 外部のサーバを管理し、セキュリティコンプライアンスを高めることが出来るのプロダクトです。     
Security Center を利用すると脆弱性やOSレイヤーのセキュリティ設定など細かく管理することができます。     
その Security Center の Enterprise エディション(有償)機能には、Baseline Check というセキュリティに関するチェック項目を一括で管理するためのポリシー設定があります。     

[Security Center Baseline Check Overview](https://www.alibabacloud.com/cloud-tech/doc-detail/68386.htm)

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108121649.png "img")    


---


# サイバーセキュリティ法のサイバーセキュリティ等級保護2.0 とは

Alibaba Cloud も取得しているセキュリティ認証で[こちらのロゴ](https://www.alibabacloud.com/trust-center/djcp)をご存知でしょうか。   

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122054.png "img")    

        


こちらの認証は中国独自のセキュリティ認証でMLPS(The Multi-Level Protection Scheme)と呼ばれるものです。    
2007年に始まったMLPSは、情報システムの重要性に応じてセキュリティレベルを５段階に分類し、いずれかの認証を取得させるものです。（数字が大きいほど重要性が高いシステム）    

例えば、Alibaba Cloud だとMLPSレベル3、AliPayのような金融サービスだとMLPSレベル４といった具合です。   
これまでは一部のIT事業者などが取得する認証でしたが、2018年6月に「サイバーセキュリティ等級保護条例（案）」（意見募集稿）が出たことで、**中国国内でビジネスを行う全ての事業者に適用が求められることになっています。**      
  
旧来のMLPSからの発展になるので、 MLPS2.0 もしくは サイバーセキュリティ等級保護2.0 と呼ばれています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122409.png "img")    

        


**まだ確定はしていないですが、このサイバーセキュリティ等級保護2.0 は 2019年12月 施行予定になります。**


---

# Security Center における対策例
Security Center の Baseline Check に話を戻します。     
Baseline Check は自分でセキュリティチェックのポリシー設定することが可能ですが、最初から Alibaba Cloud が用意しているポリシーテンプレートがあります。     
この中でサイバーセキュリティ等級保護レベルに応じたチェック項目が用意されているので、システムのセキュリティチェックがとても簡単になります。    

左メニュー Baseline Chack  → Manage Policies をクリック    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122534.png "img")    

        


+Create Policy をクリック    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122602.png "img")    

        


各OS毎にサイバーセキュリティ等級保護2.0のレベル2もしくはレベル3のセキュリティコンプライアンスのポリシーが用意されています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122642.png "img")    

        


あとはこのポリシーを作って、セキュリティチェックを実施。    
もしリスクがあれば解決方法まで提案してくれます。    

**例）セキュリティリスク一覧** 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122735.png "img")    

        


**例）特定のセキュリティリスクの解決方法**

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122824.png "img")    



---

# チェック結果を表示させる
せっかくポリシーを作成して実行しても、デフォルトでは実行結果が表示されません。    
表示させるためには、Manage Policiesから、[Medium] のポリシーも表示させるように変更します。    
これで サイバーセキュリティ等級保護2.0のBaseline Checkの実行結果が表示されます。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/ICP/ICP_images_26006613462854600/20191108122927.png "img")    


---


# チェック項目

**検証チェック項目**      
2つのポリシーで検証をしてみました。   
        
```
- CentOS Linux 7 Baseline for China classified protection of cybersecurity-Level II
- CentOS Linux 7 Baseline for China classified protection of cybersecurity-Level III
```

※レベル1のポリシーはなかったです。    

おそらくほとんどの日系企業はレベル１かレベル２の等級になると思います。    
そのため、レベル２のBaseline Checkをやっておけば十分ではないかと思います。    
参考までに以下にそれぞれのチェック項目を書いておきます。    


**CentOS Linux 7 Baseline for China classified protection of cybersecurity-Level II** 

|項番 | チェック項目   |     種類 |  OS初期設定 |  
|:-----------------|:-----------------|:------------------|:------------------|
|1| Ensure that each user has a unique user ID, does not use simple passwords, and changes the password periodically. | Identity authentication | Failed |
|2| Configure and enable measures of handling failed logons, including terminating the session, restricting the number of failed logons, and automatically terminating the session upon session timeout. | Identity authentication | Failed |
|3| Assign an account and permissions for each user. | Access control | Failed |
|4| Rename or delete the default account, and modify the default password of this account. | Access control | Failed |
|5| ${hc.checklist.userpwd.del_expire_user.linux.item} | Access control | Failed |
|6| ${hc.checklist.acl.user_min_pri.linux.item} | Access control | Failed |
|7| Enable Security Audit to audit important user activities and events of all users. | Security audit | Failed |
|8| Make sure that an auditing log records the event date, time, user, event type, event status, and other related information. | Security audit | Failed |
|9| Make sure only necessary components and applications are installed. | Intrusion Prevention | Failed |
|10|${hc.checklist.defense.limit_terminal.centos7.item} | Intrusion Prevention | Failed |
|11| Save and back up auditing logs periodically in case of unexpected data deletion, modification, or overwriting. | Security audit | Passed |
|12| Disable unnecessary system services, default sharing, and vulnerable ports. | Intrusion Prevention | Passed |
|13| Make sure that vulnerabilities can be detected and fixed. | Intrusion Prevention | Passed |
|14| Install software to protect the system from malicious code, and update the software version and the malicious code library. | Evil Code Prevention | Passed |
|15| Prevent authentication information eavesdropping during remote management of servers. | Identity authentication | Passed |




**CentOS Linux 7 Baseline for China classified protection of cybersecurity-Level III** 

|項番 | チェック項目  |     種類 |  OS初期設定 |
|:-----------------|:-----------------|:------------------|:------------------|
|1| Ensure that each user has a unique user ID, does not use simple passwords, and changes the password periodically. | Identity authentication | Failed |
|2| Configure and enable measures of handling failed logons, including terminating the session, restricting the number of failed logons, and automatically terminating the session upon session timeout. | Identity authentication |Failed |
|3| Assign an account and permissions for each user. | Access control |Failed |
|4| Rename or delete the default account, and modify the default password of this account. | Access control |Failed |
|5| ${hc.checklist.userpwd.del_expire_user.linux.item} | Access control |Failed |
|6| ${hc.checklist.acl.user_min_pri.linux.item} | Access control |Failed |
|7| ${hc.checklist.acl.policy_defs.linux.item} | Access control |Failed |
|8| Make sure that an auditing log records the event date, time, user, event type, event status, and other related information. | Security audit |Failed |
|9| Enable Security Audit to audit important user activities and events of all users. | Security audit |Failed |
|10| Make sure only necessary components and applications are installed. | Intrusion Prevention |Failed |
|11| ${hc.checklist.defense.limit_terminal.centos7.item} | Intrusion Prevention |Failed |
|12| Save and back up auditing logs periodically in case of unexpected data deletion, modification, or overwriting. | Security audit | Passed |
|13| Disable unnecessary system services, default sharing, and vulnerable ports. | Intrusion Prevention | Passed |
|14| Make sure that vulnerabilities can be detected and fixed. | Intrusion Prevention | Passed |
|15| Install software to protect the system from malicious code, and update the software version and the malicious code library. | Evil Code Prevention | Passed |
|16| Prevent authentication information eavesdropping during remote management of servers. | Identity authentication | Passed |
|17| Ensure that the audit process is not interrupted unexpectedly. | Security audit | Passed |
|18| Access permissions determine a user's or a process' ability to access a specific file or database table. | Access control | Passed |
|19| Ensure that intrusions into your servers can be detected and alerts are triggered by high-risk intrusions. | Intrusion Prevention | Passed |



一部メッセージが表示されていない項目ありますね。    

# 最後に

以上のように、対応すべきセキュリティ項目を毎日チェックしてくれて解決方法まで提示してくれる Alibaba Cloud Security Center は、サイバーセキュリティ法対策として非常に有効なプロダクトになっています。    
細かい部分を見ていくと Security Center 自体はまだまだ開発途中のプロダクトという印象ですが、これからがとても楽しみです。    

 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>



