---
title: "ECSのよくあるQ&A Part2"
metaTitle: "サポートセンターFAQ ~ ECS編 その2 制限事項 ~"
metaDescription: "サポートセンターFAQ ~ ECS編 その2 制限事項 ~"
date: "2018-10-12"
author: "SBC engineer blog"
thumbnail: "/computing_images_10257846132678100000/000000000000000000.png"
---

## サポートセンターFAQ ~ ECS編 その2 制限事項 ~

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_10257846132678100000/000000000000000000.png "img")

# はじめに

本記事では、サポートセンターに寄せられるECS関連のご質問の中から、よくあるものをご紹介いたします。       
今回はECSの制限に関するFAQです 皆様のAlibaba Cloud ご利用の一助となれば幸いです。     


# Q : 従量課金ECSインスタンスが作成できません。
## Answer     

ECS（従量課金）の1アカウントの保持数の上限を超えてECS（従量課金）を作成することはできません。 コンソールにて保持しているECS（従量課金）数を確認し、不要なECS（従量課金）を削除してください。 また、ECS（サブスクリプション）には1アカウント毎の保持数の上限がありませんので、ECS（サブスクリプション）のご利用もご検討いただけますと幸いです。      

※2018年9月時点では、1アカウントのECS（従量課金）の保持数上限は50vCPUまでとなっております。     

# Q : 従量課金ECSインスタンスの保持上限数を上げたいです。  
## Answer     
2018年9月時点では、1アカウントのECS（従量課金）の保持数上限は50vCPUまでとなっております。    
上限の引き上げが必要な場合がございましたら、チケットから起票してください。 チケットを受領後、審査させていただいた上で上限値を変更いたします。詳細は参考ドキュメントをご参照ください。    

参考ドキュメント：[制限事項](https://www.alibabacloud.com/cloud-tech/doc-detail/25412.htm)     
> https://www.alibabacloud.com/cloud-tech/doc-detail/25412.htm



# Q : コンソール上でECSのパブリックIPの帯域幅は変更できますか。 
## Answer     
パブリックIPをEIPに変更することで最大200Mbpsまで帯域幅の変更が可能になります。 ECSコンソールで対象のECSインスタンスの「詳細」から「パブリックIPからEIPに変換」を選択することで、 パブリックIPのIPアドレスを引き継いでEIPへ変更されます。 EIP作成後は、EIP単体としても保持時間、トラフィックにより課金が発生しますのでご注意ください。     
※2018年9月時点では、ECSにバインドされているEIPにつきましては、EIP単体としての保持料金は発生せず、トラフィックに対してのみ従量課金となります。
    
参考ドキュメント：[EIPの帯域幅を変更](https://www.alibabacloud.com/cloud-tech/doc-detail/59716.html)
> https://www.alibabacloud.com/cloud-tech/doc-detail/59716.html

# Q : 25番ポートを使用してECS上にメールサ―バーを構築できますか。
## Answer     
Alibaba Cloudで提供するIPアドレスからのメール送信品質を強化するため、25番ポートから直接メールを送信することはできません。また、ECS インスタンスには、汎用的なメールサーバー（MTA）を構築することはできません。 しかし、第三者の SMTP メール送信サービスを利用する場合で他のポート（465番、587番）で代替できない場合に限り 25 番ポートの解除申請が可能です。     

参考ドキュメント：[ECS で SMTP(25番ポート)を使用する際の注意事項](https://www.alibabacloud.com/cloud-tech/doc-detail/49123.html)
> https://www.alibabacloud.com/cloud-tech/doc-detail/49123.html

