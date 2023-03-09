---
title: "リージョン&ゾーン"
metaTitle: "Alibab Cloudのリージョン & ゾーンについて"
metaDescription: "Alibab Cloudのリージョン&ゾーンについてを説明します"
date: "2021-05-26"
author: "Hironobu Ohara"
thumbnail: "/images/2.1.PNG"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

# リージョン & ゾーン

Alibaba Cloudは、世界各地のデータセンターで運用されています。そのため、ユーザーはデフォルトで、全てのリージョンが利用可能です。
ただし、プロダクトサービスの中で、例えばHologresやPAIのように、リージョンを選べないようなサービスも存在しますので、注意してください。
また、ゾーンによっては扱うECSインスタンスファミリーが異なる場合もあります。

### Region（リージョン）
> 世界中のどこにあるかという地理的な位置を表す。リージョンによってはサービスがあったり、なかったりするので考慮が必要。

### Zone（ゾーン）
> リージョン内のさらに分散された拠点。１つのリージョン配下に複数のzoneがある場合、複数のデータセンターがあるため、プロダクトサービスによっては高可用性を持つことが可能。


Region（リージョン）とZone（ゾーン）の関係図を示すと、このような構成になります。
![RegionとZone](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/advisory/images/2.1.PNG "RegionとZone")


各リージョン、ゾーンの詳細については、以下を参照してください。
> https://www.alibabacloud.com/cloud-tech/doc-detail/40654.htm

|Region|国名|City|都市名|Region ID|Zone数|
|---|---|---|---|---|---|
|China (Qingdao)|中国|Qingdao|青島|cn-qingdao|2|
|China (Beijing)|中国|Beijing|北京|cn-beijing|10|
|China (Zhangjiakou)|中国|Zhangjiakou|張家口|cn-zhangjiakou|3|
|China (Hohhot)|中国|Hohhot|フフホト|cn-huhehaote|2|
|China (Ulanqab)|中国|Ulanqab|ウランチャブ|cn-wulanchabu|3|
|China (Hangzhou)|中国|Hangzhou|杭州|cn-hangzhou|8|
|China (Shanghai)|中国|Shanghai|上海|cn-shanghai|8|
|China (Shenzhen)|中国|Shenzhen|深圳|cn-shenzhen|6|
|China (Heyuan)|中国|Heyuan|河源|cn-heyuan|2|
|China (Guangzhou)|中国|Guangzhou|広州|cn-guangzhou|2|
|China (Chengdu)|中国|Chengdu|成都|cn-chengdu|2|
|China (Nanjing)|中国|Nanjing (in invitational preview)|南京|cn-nanjing|1|
|China (Hong Kong)|香港|Hong Kong|香港|cn-hongkong|3|
|Singapore (Singapore)|シンガポール|Singapore|シンガポール|ap-southeast-1|3|
|Australia (Sydney)|オーストラリア|Sydney|シドニー|ap-southeast-2|2|
|Malaysia (Kuala Lumpur)|マレーシア|Kuala Lumpur|クアラルンプール|ap-southeast-3|2|
|Indonesia (Jakarta)|インドネシア|Jakarta|ジャカルタ|ap-southeast-5|2|
|India (Mumbai)|インド|Mumbai|ムンバイ|ap-south-1|2|
|Japan (Tokyo)|日本|Tokyo|東京|ap-northeast-1|2|
|US (Silicon Valley)|米国|Silicon Valley|シリコンバレー|us-west-1|2|
|US (Virginia)|米国|Virginia|バージニア|us-east-1|2|
|Germany (Frankfurt)|ドイツ|Frankfurt|フランクフルト|eu-central-1|2|
|UK (London)|イギリス|London|ロンドン|eu-west-1|2|
|UAE (Dubai)|UAE|Dubai|ドバイ|me-east-1|1|


# エンドポイント

エンドポイントは、様々なプロダクトサービスごとに、プロジェクトおよびプロジェクト内のデータへアクセスするためのURLです。
エンドポイントは、プロジェクト名とプロジェクトが存在するリージョンに関連付けられています。

例えば、OSSのエンドポイントは以下の通りです。
> https://www.alibabacloud.com/cloud-tech/doc-detail/31837.htm

|Region|Region ID|IPv6|Public endpoint|Internal endpoint1|
|---|---|---|---|---|
|China (Hangzhou)|oss-cn-hangzhou|Supported|oss-cn-hangzhou.aliyuncs.com|oss-cn-hangzhou-internal.aliyuncs.com|
|China (Shanghai)|oss-cn-shanghai|Supported|oss-cn-shanghai.aliyuncs.com|oss-cn-shanghai-internal.aliyuncs.com|
|China (Qingdao)|oss-cn-qingdao|Not supported|oss-cn-qingdao.aliyuncs.com|oss-cn-qingdao-internal.aliyuncs.com|
|China (Beijing)|oss-cn-beijing|Supported|oss-cn-beijing.aliyuncs.com|oss-cn-beijing-internal.aliyuncs.com|
|China (Zhangjiakou)|oss-cn-zhangjiakou|Not supported|oss-cn-zhangjiakou.aliyuncs.com|oss-cn-zhangjiakou-internal.aliyuncs.com|
|China (Hohhot)|oss-cn-huhehaote|Supported|oss-cn-huhehaote.aliyuncs.com|oss-cn-huhehaote-internal.aliyuncs.com|
|China (Ulanqab)|oss-cn-wulanchabu|Not supported|oss-cn-wulanchabu.aliyuncs.com|oss-cn-wulanchabu-internal.aliyuncs.com|
|China (Shenzhen)|oss-cn-shenzhen|Supported|oss-cn-shenzhen.aliyuncs.com|oss-cn-shenzhen-internal.aliyuncs.com|
|China (Heyuan)|oss-cn-heyuan|Not supported|oss-cn-heyuan.aliyuncs.com|oss-cn-heyuan-internal.aliyuncs.com|
|China (Guangzhou)|oss-cn-guangzhou|Not supported|oss-cn-guangzhou.aliyuncs.com|oss-cn-guangzhou-internal.aliyuncs.com|
|China (Chengdu)|oss-cn-chengdu|Not supported|oss-cn-chengdu.aliyuncs.com|oss-cn-chengdu-internal.aliyuncs.com|
|China (Hong Kong)|oss-cn-hongkong|Supported|oss-cn-hongkong.aliyuncs.com|oss-cn-hongkong-internal.aliyuncs.com|
|US (Silicon Valley)|oss-us-west-1|Not supported|oss-us-west-1.aliyuncs.com|oss-us-west-1-internal.aliyuncs.com|
|US (Virginia)|oss-us-east-1|Not supported|oss-us-east-1.aliyuncs.com|oss-us-east-1-internal.aliyuncs.com|
|Singapore|oss-ap-southeast-1|Not supported|oss-ap-southeast-1.aliyuncs.com|oss-ap-southeast-1-internal.aliyuncs.com|
|Australia (Sydney)|oss-ap-southeast-2|Not supported|oss-ap-southeast-2.aliyuncs.com|oss-ap-southeast-2-internal.aliyuncs.com|
|Malaysia (Kuala Lumpur)|oss-ap-southeast-3|Not supported|oss-ap-southeast-3.aliyuncs.com|oss-ap-southeast-3-internal.aliyuncs.com|
|Indonesia (Jakarta)|oss-ap-southeast-5|Not supported|oss-ap-southeast-5.aliyuncs.com|oss-ap-southeast-5-internal.aliyuncs.com|
|Japan (Tokyo)|oss-ap-northeast-1|Not supported|oss-ap-northeast-1.aliyuncs.com|oss-ap-northeast-1-internal.aliyuncs.com|
|India (Mumbai)|oss-ap-south-1|Not supported|oss-ap-south-1.aliyuncs.com|oss-ap-south-1-internal.aliyuncs.com|
|Germany (Frankfurt)|oss-eu-central-1|Not supported|oss-eu-central-1.aliyuncs.com|oss-eu-central-1-internal.aliyuncs.com|
|UK (London)|oss-eu-west-1|Not supported|oss-eu-west-1.aliyuncs.com|oss-eu-west-1-internal.aliyuncs.com|
|UAE (Dubai)|oss-me-east-1|Not supported|oss-me-east-1.aliyuncs.com|oss-me-east-1-internal.aliyuncs.com|


LogServiceのエンドポイント
> https://www.alibabacloud.com/cloud-tech/doc-detail/29008.html

|Region|Endpoint|
|---|---|
|China (Hangzhou)|cn-hangzhou.log.aliyuncs.com|
|China (Shanghai)|cn-shanghai.log.aliyuncs.com|
|China (Qingdao)|cn-qingdao.log.aliyuncs.com|
|China (Beijing)|cn-beijing.log.aliyuncs.com|
|China (Zhangjiakou-Beijing Winter Olympics)|cn-zhangjiakou.log.aliyuncs.com|
|China (Hohhot)|cn-huhehaote.log.aliyuncs.com|
|China (Ulanqab)|cn-wulanchabu.log.aliyuncs.com|
|China (Shenzhen)|cn-shenzhen.log.aliyuncs.com|
|China (Heyuan)|cn-heyuan.log.aliyuncs.com|
|China (Guangzhou)|cn-guangzhou.log.aliyuncs.com|
|China (Chengdu)|cn-chengdu.log.aliyuncs.com|
|China (Hong Kong)|cn-hongkong.log.aliyuncs.com|
|Japan (Tokyo)|ap-northeast-1.log.aliyuncs.com|
|Singapore (Singapore)|ap-southeast-1.log.aliyuncs.com|
|Australia (Sydney)|ap-southeast-2.log.aliyuncs.com|
|Malaysia (Kuala Lumpur)|ap-southeast-3.log.aliyuncs.com|
|Indonesia (Jakarta)|ap-southeast-5.log.aliyuncs.com|
|UAE (Dubai)|me-east-1.log.aliyuncs.com|
|US (Silicon Valley)|us-west-1.log.aliyuncs.com|
|Germany (Frankfurt)|eu-central-1.log.aliyuncs.com|
|US (Virginia)|us-east-1.log.aliyuncs.com|
|India (Mumbai)|ap-south-1.log.aliyuncs.com|
|UK (London)|eu-west-1.log.aliyuncs.com|
|Russia (Moscow)|rus-west-1.log.aliyuncs.com|


その他、RDSやPolarDB、Hologresなどの一部プロダクトサービスはコンソール上にてエンドポイントが表示されますので、
こちらも参考にしてみてください。





<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>



