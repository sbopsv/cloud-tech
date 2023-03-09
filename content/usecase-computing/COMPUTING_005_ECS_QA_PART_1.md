---
title: "ECSのよくあるQ&A Part1"
metaTitle: "サポートセンターFAQ ~ ECS編 その1 トラブルシュート~"
metaDescription: "サポートセンターFAQ ~ ECS編 その1 トラブルシュート~"
date: "2018-09-28"
author: "SBC engineer blog"
thumbnail: "/computing_images_10257846132678100000/000000000000000000.png"
---

## サポートセンターFAQ ~ ECS編 その1 トラブルシュート~


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_10257846132678100000/000000000000000000.png "img")

# はじめに

本記事では、サポートセンターに寄せられるECS関連のご質問の中から、よくあるものをご紹介いたします。       
今回はECSの簡単なトラブルシュートに関するFAQです 皆様のAlibaba Cloud ご利用の一助となれば幸いです。     

# Q : ECSの初期ユーザー名とパスワードがわかりません。

## Answer     
ECSインスタンス購入時にパスワードの設定で「後で」を選択した場合や設定したパスワードを失念した場合など、ECSコンソールよりECSインスタンスのデフォルトユーザのパスワードを変更できます。 また、スターターパッケージを購入時に「後で」を選択した場合、デフォルトユーザ名に対して、システム側で任意のパスワードを設定するためECSコンソールから同様にパスワード変更が必要です。 手順につきましては、参考ドキュメントをご参照いただき、ECSコンソールにて対象ECSインスタンスのパスワードリセット実施後、コンソールよりECSインスタンスの再起動をご実施ください。 ECSの再起動後、新たに設定したPWでECSインスタンスにログインが可能となります。      

【代表的なOS毎のデフォルトユーザ名】 Windows Server：Administrator Aliyun Linux：root Linux：root      


参考ドキュメント：[インスタンスのパスワードのリセット](https://www.alibabacloud.com/cloud-tech/doc-detail/25439.html)     
> https://www.alibabacloud.com/cloud-tech/doc-detail/25439.html

参考ドキュメント：[インスタンスの再起動](https://www.alibabacloud.com/cloud-tech/doc-detail/25440.html)     
> https://www.alibabacloud.com/cloud-tech/doc-detail/25440.html

# Q : ECSインスタンス作成後、SSH、RDP接続ができません。

## Answer     

セキュリティグループ設定が原因となっている可能性がございます。 セキュリティグループの受信設定でSSH : 22ポートないし、RDP : 3389ポートが許可されているかご確認ください。

参考ドキュメント：[セキュリティグループルールの権限付与](https://www.alibabacloud.com/cloud-tech/doc-detail/25471.html)       

# Q : VNCのPWを失念し、ECSにVNCでログインできません。

## Answer     

ログインしたいECSのVNCにて、「管理端末のパスワードの変更」を選択し、パスワードを再設定することができます。 パスワードの再設定に伴うECSの再起動はなく、変更後すぐにVNCパスワードが反映されます。

※この変更はVNCのパスワード変更で、ECSのパスワード変更ではございません。

参考ドキュメント：[Management Terminal (VNC) を使用した ECS インスタンスへの接続](https://www.alibabacloud.com/cloud-tech/doc-detail/25433.html)
> https://www.alibabacloud.com/cloud-tech/doc-detail/25433.html

# Q : スターターパッケージをクーポンで購入できません。

## Answer     

スターターパッケージのクーポンによる購入はできません。 スターターパッケージについての詳細は、参考ドキュメントをご参照ください。

参考ドキュメント：[スターターパッケージの利用条件](https://www.alibabacloud.com/cloud-tech/faq-detail/42380.htm)
> https://www.alibabacloud.com/cloud-tech/faq-detail/42380.htm
