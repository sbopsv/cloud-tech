---
title: "他社プロダクト比較"
metaTitle: "他社プロダクト比較をまとめています"
metaDescription: "他社プロダクト比較をまとめています"
date: "2021-03-01"
author: "Hironobu Ohara"
thumbnail: "/"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


## 他社プロダクト比較
これはAlibaba Cloud 中国サイト、国際サイト、AWS、GCP、Azureのプロダクトサービス比較表をまとめたものです。　　　

なお2021年6月3日時点での情報となります。

## コンピューティング（弹性计算）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![ecs.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e294f48c-1d2b-00e8-a490-e8e005e40e2b.png)|[云服务器 ECS](https://www.aliyun.com/product/ecs)|[Elastic Compute Service](https://www.alibabacloud.com/product/ecs)|クラウドサーバ|Amazon EC2|Azure Virtual Machines|Compute Engine|
|![ec_ebm.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/1675c25a-8fd9-79cd-a5bd-9c5ef16b49d2.png)|[弹性裸金属服务器（神龙）](https://www.aliyun.com/product/ebm)|[ECS Bare Metal Instance](https://www.alibabacloud.com/product/ebm)|Bare Metalクラウドサーバ|Amazon EC2 Bare Metal|Azure Virtual Machines|Compute Engine|
|![ecs_swas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/2d5beaef-b460-13e8-b4da-b1a0da61cb99.png)|[轻量应用服务器](https://www.aliyun.com/product/swas)|[Simple Application Server](https://www.alibabacloud.com/product/swas)|軽量アプリケーションサーバー|Amazon Lightsail|Azure App Service Environment||
|![ecs_fpga.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/cadde965-69c2-e695-27ee-a5c779983196.png)|[FPGA 云服务器](https://www.aliyun.com/product/ecs/fpga)|[FPGA Compute Service](https://www.alibabacloud.com/cloud-tech/doc-detail/108504.htm)|FPGAクラウドサーバ|Amazon EC2 FPGA|Azure Virtual Machines|Compute Engine|
|![ecs_gpu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d8c2ec85-0dc9-715b-c99c-f32a98e8436f.png)|[GPU 云服务器](https://www.aliyun.com/product/ecs/gpu)|[Elastic GPU Service](https://www.alibabacloud.com/product/gpu)|GPUクラウドサーバ|Amazon Elastic GPUs|Azure Virtual Machines|Compute Engine|
|![ec_ddh.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/240af6fd-dc54-2d99-9614-c4da575e99ce.png)|[专有宿主机DDH](https://www.aliyun.com/product/ddh)|[Dedicated Host](https://www.alibabacloud.com/product/ddh)|専有ホスト|Amazon EC2 Dedicated Hosts|Azure Dedicated Host|Sole Tenant Node (Beta)|
|![ec_scc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ee52aee9-91dd-627e-4f7f-b1c874c63dea.png)|[超级计算集群SCC](https://www.aliyun.com/product/scc)|[Super Computing Cluster](https://www.alibabacloud.com/product/scc)|スーパーコンピューティングクラスター（SCC）||||
|![ec_ehpc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6aa07ff4-aedc-4a8e-3596-94a1e087e98f.png)|[弹性高性能计算 E-HPC](https://www.aliyun.com/product/ehpc)|[E-HPC](https://www.alibabacloud.com/product/ehpc)|高性能コンピューティング（E-HPC）|High Performance Computing (HPC)|||
|![ec_containerservice.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/326d0342-a0af-0675-1fdf-53b344e2fc1d.png)|[容器服务 ACK](https://www.aliyun.com/product/kubernetes)|[Container Service for Kubernetes](https://www.alibabacloud.com/product/kubernetes)|コンテナサービスKubernetes版|Amazon Elastic Container Service for Kubernetes|Azure Kubernetes Service|Google Kubernetes Engine|
|![ec_batchcompute.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5c0fba81-42c7-b8eb-d542-e7e387494c23.png)|[批量计算](https://www.aliyun.com/product/batchcompute)|[Batch Compute](https://www.alibabacloud.com/product/batch-compute)|バッチ計算|AWS Batch|Azure Batch|Cloud Tasks|
|![ec_containerservice.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/326d0342-a0af-0675-1fdf-53b344e2fc1d.png)|[容器服务ACS](https://www.aliyun.com/product/containerservice)|[Container Service](https://www.alibabacloud.com/product/container-service)|コンテナサービス|Amazon ECS|Azure Container Service||
|![ec_containerservice.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/326d0342-a0af-0675-1fdf-53b344e2fc1d.png)| [Serverless容器服务 ASK](<https://www.aliyun.com/product/cs/ask>) | [Serverless Container Service](https://www.alibabacloud.com/product/kubernetes) |                                             |                                                 |                            |                           |
|![ec_eci.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/fc822ccc-4c67-a2ee-0a06-2293f4b5e6cf.png)|[弹性容器实例 ECI](https://www.aliyun.com/product/eci)|[Elastic Container Instance](https://www.alibabacloud.com/products/elastic-container-instance)|サーバレスコンテナサービス|AWS Fargate|Container Instance||
|![ec_mesh.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4f0e91b-be68-4ce3-bc46-8f78992c9ab6.png)|[服务网格ASM](<https://www.aliyun.com/product/servicemesh>)||||||
|![ec_fc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/347f648b-4fd5-6c86-71d6-90c9818c17b0.png)|[函数计算](https://www.aliyun.com/product/fc)|[Function Compute](https://www.alibabacloud.com/product/function-compute)|Function as a Service|AWS Lambda|Azure Functions|Cloud Functions|
|![ec_acr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/8ea961e8-dd98-55c9-61a6-a9af943e5b14.png)|[容器镜像服务ACR](https://www.aliyun.com/product/acr)|[Container Registry](https://www.alibabacloud.com/product/container-registry)|コンテナミラーリングサービス|Amazon Elastic Container Registry|Azure Container Registry|Google Container Registry|
|![ec_gws.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/33bfc5f9-9fe4-51bf-f6b4-4d2750330154.png)|[云桌面](<https://www.aliyun.com/product/gws>)||GPUワークステーション||||
|![ec_ess.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b558c065-cb57-bcae-244c-e3c1676b339a.png)|[弹性伸缩ESS](https://www.aliyun.com/product/ess)|[Auto Scaling](https://www.alibabacloud.com/product/auto-scaling)|Auto Scaling|Amazon EC2 Auto Scaling|Virtual Machine Scale Sets|Autoscaling|
|![ec_oos.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/90f19c97-c20c-6c73-6b53-87923224a797.png)|[运维编排 OOS](https://cn.aliyun.com/product/oos)|[Operation Orchestration Service](https://www.alibabacloud.com/product/oos)|O＆Mプラットフォームのオーケストレーション||||
|![ec_ros.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/89154411-c5c2-4388-0941-beb76e444d00.png)|[资源编排ROS](https://www.aliyun.com/product/ros)|[Resource Orchestration Service](https://www.alibabacloud.com/product/ros)|リソースの作成と管理サービス|AWS CloudFormation|Azure Resource Manager|Cloud Deployment Manager|
|![ec_webx.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7522dff4-2b37-f6b4-ac37-261a215750df.png)|[Web应用托管服务 (Web+) - WEBX](https://cn.aliyun.com/product/webx)|[Web App Service](https://www.alibabacloud.com/ja/products/webx)|Webアプリケーションホスティングサービス||||
|![ec_sae.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5ed9a182-3223-0611-7974-055f1d1d2d41.png)| [Serverless 应用引擎 ](https://cn.aliyun.com/product/sae)    |                                                              | サーバーレスアプリケーション                ||||
|![ec_fnf.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d7bdee3a-3df9-8f11-2a7d-99b59baa7403.png)| [Serverless 工作流 ](<https://www.aliyun.com/product/fnf>) | | Function as a Service型分散ワークフロー ||||

## ストレージ（存储服务）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![storage_oss.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/24d088ff-5abb-722f-4c54-62eb930ef643.png)|[对象存储 OSS](https://www.aliyun.com/product/oss)|[Object Storage Service](https://www.alibabacloud.com/product/oss)|オブジェクトストレージ|Amazon S3|Azure Blob|Cloud Storage|
|![storage_disk.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/63bdccfd-70f7-a6f2-8549-ca16875d2a35.png)|[云盘](https://www.aliyun.com/product/disk)|[Block Storage](https://www.alibabacloud.com/cloud-tech/doc-detail/63136.htm)|ブロックストレージ|Amazon EBS|Managed Disk|Persistent Disk|
|![db_ots.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d6d63735-e1bf-94be-7fb9-31d72b980c92.png)|[表格存储 TableStore](https://www.aliyun.com/product/ots)|[Table Store](https://www.alibabacloud.com/product/table-store)|TableStore(NoSQL)|Amazon DynamoDB|Azure Cosmos DB|Cloud Datastore/Cloud Bigtable/Cloud Firestore|
|![storage_oas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0febb51a-09aa-3c05-c365-28364bbbe8ab.png)|[归档存储](<https://oas.console.aliyun.com/console/>)||||||
|![storage_nas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3fd0d72c-591f-b73c-da79-392395fda17d.png)|[文件存储 NAS](https://www.aliyun.com/product/nas)|[Network Attached Storage](https://www.alibabacloud.com/product/nas)|ファイルストレージNAS|Amazon Elastic File System|Azure NetApp Files|Cloud Filestore|
|![storage_dbfs.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/00ec86b2-06e6-9b82-adfc-7c168b53f6ad.png)|[数据库文件存储 DBFS](https://www.aliyun.com/product/dbfs)||||||
|![storage_nas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3fd0d72c-591f-b73c-da79-392395fda17d.png)|[文件存储 CPFS](https://www.aliyun.com/product/nas_cpfs)|[CPFS](https://www.alibabacloud.com/cloud-tech/product/111536.htm)|クラウドパラレルファイルストレージ||||
|![storage_alidfs.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e0fac394-0f09-66f9-c142-5a34dcf31e53.png)|[文件存储 HDFS](https://www.aliyun.com/product/alidfs)||HDFSファイルストレージ||||
|![storage_mgw.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f5197745-2eba-a81a-4608-462b7763cd37.png)|[闪电立方](https://www.aliyun.com/product/mgw)|[Data Transport](https://www.alibabacloud.com/cloud-tech/product/data-transport)|オンラインとオフラインのデータ転送サービス（Lightning Cube）|AWS Snowball Edge|Azure Data Box (Preview)|Transfer Appliance (Beta)|
|![storage_cloudphoto.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/04f61ddf-2040-614e-94c3-6157ed1f8cd3.png)|[智能云相册](https://www.aliyun.com/product/cloudphoto)||クラウドフォトアルバム||||
|![storage_imm.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a91fb17f-23df-481f-d01b-094194c44c58.png)|[智能媒体管理](https://www.aliyun.com/product/imm)||インテリジェントメディア管理||||
|![storage_hbr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4ce6d6ac-1480-4516-d57e-bee01a08abef.png)|[混合云备份 HBR](https://www.aliyun.com/product/hbr)|[Hybird Backup Recovery](https://www.alibabacloud.com/ja/products/hybrid-backup-recovery)|ハイブリッドクラウドのバックアップサービス|||
|![storage_hdr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7d9ca1d8-8b4a-c599-862b-a4a2b96b2615.png)|[混合云容灾 HDR](https://www.aliyun.com/product/hdr)||ハイブリットクラウドの災害復旧サービス||||
|![storage_hcs_sgw.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/837fe115-b3ce-7ce4-4117-c2a396970c34.png)|[云存储网关](https://www.aliyun.com/product/hcs)|[Cloud Storage Gateway](https://www.alibabacloud.com/ja/products/cloud-storage-gateway)|クラウドストレージゲートウェイ| AWS Storage Gateway        |Azure Storsimple||
|![storage_hgw.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d80ea43e-8357-87c6-a330-00c474d69383.png)|[混合云存储阵列](https://www.aliyun.com/product/hgw)|[Hybrid Cloud Storage Array](https://www.alibabacloud.com/product/storage-array)|ハイブリッドクラウドストレージアレイ|  |||
|iconなし|[内容协作平台](https://www.aliyun.com/product/ccp)||コンテンツコラボレーションプラットフォーム||||

## CDN配信（CDN与边缘）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![cdn_cdn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7ec709f6-d4ed-4ee2-57ad-21475394f10c.png)|CDN|[Alibaba Cloud CDN](https://www.alibabacloud.com/product/cdn)|Content Delivery Network|Amazon CloudFront|Azure CDN|Cloud CDN|
|![cdn_scdn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b9611acf-1f96-066b-2fb5-ddbfd7218f87.png)|[安全加速 SCDN](https://cn.aliyun.com/product/scdn)||Secure Content Delivery Network||||
|![cdn_dcdn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/127bbb92-bacd-742b-14fe-0ce4c63b93ae.png)|[全站加速 DCDN](https://cn.aliyun.com/product/dcdn)|[Dynamic Route for CDN](https://www.alibabacloud.com/products/dcdn)|Dynamic Route for CDN||||
|![cdn_pcdn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/391a4757-ce23-e849-1e65-53b37e26f5a1.png)|[P2P内容分发网络](https://cn.aliyun.com/product/pcdn)|[PCDN](https://www.alibabacloud.com/product/pcdn)|P2P CDN||||
|![cdn_ens.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/23f770e2-99e1-6f37-6504-49ea5bc31ef8.png)|[边缘节点服务 ENS](https://cn.aliyun.com/product/ens)| [Edge Node Service](https://cn.aliyun.com/product/ens)|Edge Node Service||||

## データベース（数据库）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![db_cddc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/707d8daa-115c-64be-c1a4-71e6220fd6aa.png)|[云数据库专属集群 MyBase](<https://www.aliyun.com/product/apsaradb/cddc>)|[ApsaraDB Dedicated Cluster](https://www.alibabacloud.com/product/cddc)|||||
|![db_polardb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5fad2e87-577b-74d1-02b0-594dad022324.png)|[云数据库 POLARDB](https://www.aliyun.com/product/polardb)|[ApsaraDB for POLARDB](https://www.alibabacloud.com/products/apsaradb-for-polardb)|MySQL、Oracle、PostgreSQLの互換性があるクラウドデータベース|Aurora||Cloud Spanner|
|![db_rds_mysql.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ee3f8d53-5a8f-1336-d38b-2ea75b9cece3.png)|[云数据库 RDS MySQL 版](https://www.aliyun.com/product/rds/mysql)|[ApsaraDB RDS for MySQL](https://www.alibabacloud.com/product/apsaradb-for-rds-mysql)|MySQL|Amazon RDS for MySQL/Amazon Aurora|Azure Database for MySQL|Cloud SQL for MySQL|
|![db_rds_mariadb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d01d70e5-a567-dd94-8aa9-b53152ccebd0.png)|[云数据库 RDS MariaDB TX 版](https://www.aliyun.com/product/rds/mariadb)|[ApsaraDB for MariaDB TX](https://www.alibabacloud.com/products/apsaradb-for-rds-mariadb)|MariaDB|Amazon RDS for MariaDB|Azure Database for MariaDB||
|![db_rds_sqlserver.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a5082043-7a0d-9e39-8acc-bb5489ca609f.png)|[云数据库 RDS SQL Server 版](https://www.aliyun.com/product/rds/sqlserver)|[ApsaraDB RDS for SQL Server](https://www.alibabacloud.com/product/apsaradb-for-rds-sql-server)|SQLServer|Amazon RDS for SQL Server|SQL Database|Cloud SQL for SQL Server|
|![db_rds_postgresql.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/16dbb0b4-3592-1cab-7053-62ea050e5868.png)|[云数据库 RDS PostgreSQL 版](https://www.aliyun.com/product/rds/postgresql)|[ApsaraDB RDS for PostgreSQL](https://www.alibabacloud.com/product/apsaradb-for-rds-postgresql)|PostgreSQL|Amazon RDS for PostgreSQL/Amazon Aurora|Azure Database for PostgreSQL|Cloud SQL for PostgreSQL|
|![db_rds_ppas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/435c56c7-f657-8017-1725-427a40020ed4.png)|[云数据库 RDS PPAS 版](https://www.aliyun.com/product/rds/ppas)|[ApsaraDB RDS for PPAS](https://www.alibabacloud.com/product/apsaradb-for-rds-ppas)|Oracle|Amazon RDS for Oracle|||
|![db_drds.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/32cf5c51-c7d8-1a8c-709d-57d23fe35e9f.png)|[云原生分布式数据库PolarDB-X(原DRDS升级版)](https://www.aliyun.com/product/drds)|[Distributed Relational Database Service](https://www.alibabacloud.com/product/drds)|分散リレーショナルデータベースサービス|Aurora|Azure SQL Database Edge|Cloud Spanner|
|![db_redis.png.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/2e563755-e380-ab6f-0b2d-aa14f25d8206.png)|[云数据库 Redis 版](https://www.aliyun.com/product/kvstore)|[ApsaraDB for Redis](https://www.alibabacloud.com/product/apsaradb-for-redis)|Redis|Amazon ElastiCache|Azure Cache for Redis|Cloud Memorystore|Amazon ElastiCache|
|![db_mongodb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/abe5cec6-f2f3-5a25-e5b1-88de081eac2b.png)|[云数据库 MongoDB 版](https://www.aliyun.com/product/mongodb)|[ApsaraDB for MongoDB](https://www.alibabacloud.com/product/apsaradb-for-mongodb)|MongoDB|Amazon DocumentDB (with MongoDB compatibility)|Cosmos DB(MongoDB API)|Cloud Datastore|Amazon DocumentDB (with MongoDB compatibility)|
|![db_cassandra.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f58a7c1d-2288-d424-1f43-be8ec25873aa.png)|[云数据库 Cassandra版](https://www.aliyun.com/product/cds)|[ApsaraDB for Cassandra](https://www.alibabacloud.com/product/cassandra)|Cassandra||||
|![db_influxDB.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/264344a2-19d3-e103-7049-db2f2aede4ce.png)|[时序数据库 InfluxDB® 版](https://www.aliyun.com/product/hitsdb_influxdb_pre)|[Time Series Database for InfluxDB®](https://www.alibabacloud.com/product/hitsdb_influxdb)|InfluxDB||||
|![db_hitsdb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/58efce63-6f1b-80f7-dfa2-12e516b55f1c.png)|[TSDB 时序时空数据库](https://www.aliyun.com/product/hitsdb)|[Time Series Database](https://www.alibabacloud.com/product/hitsdb)|時系列データベース|Amazon Timestream|Azure Time Series Insights|Cloud BigTable|Amazon Timestream|
|iconなし|[云原生多模数据库 Lindorm](<https://www.aliyun.com/product/apsaradb/lindorm>)||||||
|![db_hbase.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/34ff423b-16a1-b7ff-1811-e9384fc4ea7c.png)|[云数据库 HBase 版](https://cn.aliyun.com/product/hbase)|[ApsaraDB for HBase](https://www.alibabacloud.com/product/hbase)|Apache Hbase|||Cloud Bigtable|
|![db_gdb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7056227b-37f8-ff53-6b89-adb5a997c38f.png)|[图数据库 GDB](https://www.aliyun.com/product/gdb)||グラフデータベース|Amazon Neptune|Azure Cosmos DB(API for Gremlin)||
|![db_memcache.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5edfaf91-1d17-9fa9-66fc-c2a46580b0f4.png)|[云数据库 Memcache 版](https://www.aliyun.com/product/ocs)|[ApsaraDB for Memcache](https://www.alibabacloud.com/product/apsaradb-for-memcache)|Memcache|Amazon ElastiCache|Azure Cache for Redis|Cloud Memorystore|Amazon ElastiCache|
|iconなし|[可信账本数据库 LedgerDB](<https://www.aliyun.com/product/ledgerdb>)||||||
|![db_adsdata.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/477f1008-58a9-21a8-dae5-fd7f5082fcb4.png)|[云原生数据仓库 AnalyticDB  MySQL版](https://www.aliyun.com/product/ads)|[AnalyticDB for MySQL](https://www.alibabacloud.com/products/analyticdb-for-mysql)|MySQLをベースにした分析データベース||||
|![db_gpdb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b62e810f-eb9c-c534-60c0-1faf8d220343.png)|[云原生数据仓库 AnalyticDB PostgreSQL版](https://www.aliyun.com/product/gpdb)|[AnalyticDB for PostgreSQL](https://www.alibabacloud.com/product/hybriddb-postgresql)|Greenplum Databaseをベースにした分析データベース|Amazon Redshift|Synapse Analytics|BigQuery|
|![db_petadata.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/502b167c-6374-afd5-d94b-37b3c82ccd10.png)|[HybridDB for MySQL](https://www.aliyun.com/product/petadata)||HybridDB for MySQL||||
|![db_datalakeanalytics.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/42f1cab2-8f10-3bfe-1864-c7a8bf677301.png)|[数据湖分析](https://www.aliyun.com/product/datalakeanalytics)|[Data Lake Analytics](https://www.alibabacloud.com/products/data-lake-analytics)|データレイクアナリティクス|Amazon Athena|Azure Data Lake Analytics|Google BigQuery|Amazon Athena|
|![db_dts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/43ba7eb4-d064-f441-c702-4f0c48f7f11f.png)|[数据传输服务 DTS](https://www.aliyun.com/product/dts)|[Data Transmission Service](https://www.alibabacloud.com/product/data-transmission-service)|データ転送サービス|AWS Database Migration Service| Azure Database Migration Service (Preview) ||AWS Database Migration Service|
|![db_dms.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/1ee2ca0e-3a0b-4fad-3581-f6156b45df35.png)|[数据管理 DMS](https://www.aliyun.com/product/dms)|[Data Management](https://www.alibabacloud.com/product/data-management-service)|データ管理サービス||||
|![db_dbs.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4542a618-488c-e1fe-99c2-4b9bd63991a7.png)|[数据库备份 DBS](https://www.aliyun.com/product/dbs)|[Database Backup](https://www.alibabacloud.com/product/database-backup)|データベースバックアップ|||
|![db_das.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b53015fe-d20e-a7c2-f0de-94839d04c0df.png)|[数据库自治服务 DAS](https://www.aliyun.com/product/hdm)|[Database Autonomy Service](https://www.alibabacloud.com/product/das)|||||
|![db_dbes.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/8b8c8af5-d03d-b94b-ec14-e9430eba90b5.png)|[数据库专家服务 - DBES](https://cn.aliyun.com/product/dbes)||データベースエキスパートによるコンサル・支援サービス||||
|![db_dg.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4302ddd7-34b8-d3ab-d504-a547fbb16579.png)|[数据库网关 DG](https://www.aliyun.com/product/dg)|[Database Gateway](https://www.alibabacloud.com/product/dg)|データベースのゲートウェイ||||
|![db_adam.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5eab2098-f367-f618-fc0b-1b0b259e7df2.png)|[数据库和应用迁移 ADAM](https://www.aliyun.com/product/adam)|[Advanced Database & Application Migration](https://www.alibabacloud.com/product/adam)|||||
|![db_oceanbase.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a22117a9-19c3-491d-3578-885ded6526ce.png)|[云数据库 OceanBase](https://www.aliyun.com/product/oceanbase)|[ApsaraDB for OceanBase](https://www.alibabacloud.com/products/oceanbase)|フィナンシャル向け分散リレーショナルデータベース||||
|![db_clickhouse.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/db0eeb73-cf5a-f499-1afd-9f312e797141.png)|[云数据库 ClickHouse ](https://www.aliyun.com/product/clickhouse)||ClickHouseをベースにしたオンライン分析データベース||||

## クラウド通信サービス（云通信）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![cc_dysms.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c1ef9ed6-412b-a3e8-6918-1f61ba519cd1.png)|[短信服务](https://www.aliyun.com/product/sms)|[Short Message Service](https://www.alibabacloud.com/product/short-message-service)|ショートメッセージサービス||||
|![cc_dyvms.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/dea03861-9e3e-308b-8ed2-105e31185f35.png)|[语音服务](https://www.aliyun.com/product/vms)||音声メッセージサービス||||
|iconなし|[智能联络中心](https://www.aliyun.com/product/aiccs)||AIによるスマートコンタクトセンター|Amazon Connect||Contact Center AI|
|![cc_dycdp.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0e6bc5fc-3d4f-21d2-81b0-910e6a13f563.png)|[流量服务](https://www.aliyun.com/product/cdps)||移動体通信データパッケージ||||
|![cc_dypns.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/05d8997e-33b2-ccfc-bae4-76310c8825d6.png)|[号码隐私保护](https://www.aliyun.com/product/pls)||モバイルプライバシー保護サービス|||||[号码认证服务](https://www.aliyun.com/product/dypns)||番号認証サービス||||
|![cc_dytns.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3790ca97-213d-7c0f-7c1c-d4964500ac22.png)|[号码百科](<https://www.aliyun.com/product/dytns>)||||||
|![cc_aliyuncvc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/34a1a3e9-e6fb-9c94-9aa9-7bf9b628c940.png)|[云视频会议 ](https://www.aliyun.com/product/aliyuncvc)||クラウド上ビデオ会議サービス||||
|![cc_snsu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f992f08b-02c2-ca56-68f9-7155cd8a8832.png)|[云通信网络加速](https://www.aliyun.com/product/snsu)||クラウド通信ネットワーク高速化サービス||||

## ネットワーク（网络）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![net_vpc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/54e43217-6e87-72b9-434b-f0e8f9e8eb3f.png)|[专有网络 VPC](https://www.aliyun.com/product/vpc)|[Virtual Private Cloud](https://www.alibabacloud.com/product/vpc)|専用ネットワークVPC|Amazon Virtual Private Cloud|Azure Virtual Network|Virtual Private Cloud|
|![net_pvtz.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c5e3dbd7-2f1c-7cc4-5c1d-3811c9d2cd18.png)|[云解析 PrivateZone](https://www.aliyun.com/product/pvtz)|[Alibaba Cloud PrivateZone](https://www.alibabacloud.com/products/private-zone)|VPCのDNSサービス|Amazon VPC PrivateLink|Azure Private Link|Private Access Options for Services|
|![net_slb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e5af052c-a31e-23f4-2b71-b3eae8098bde.png)|[负载均衡 SLB](https://www.aliyun.com/product/slb)|[Server Load Balancer](https://www.alibabacloud.com/product/server-load-balancer)|負荷分散ロードパランサ|Elastic Load Balancing|Azure Load Balancer|Cloud Load Balancing|
|![net_slb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/2cf68671-10d4-fffe-7868-ccd5dcd9ca18.png)|[NAT 网关](https://www.aliyun.com/product/nat)|[NAT Gateway](https://www.alibabacloud.com/product/nat)|NATゲートウェイ|Internet Gateway、NAT Instance、NAT Gateway|||
|![net_eip.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b5f237d8-00d1-7fed-0e28-670a3f3c2931.png)|[弹性公网 IP](https://www.aliyun.com/product/eip)|[Elastic IP](https://www.alibabacloud.com/product/eip)|パブリックIPリソース|Elastic IP Addresses|||
|![net_ipv6trans.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9565bc8d-7a34-33c7-116c-1f127f2b0b44.png)|[IPv6 转换服务](https://www.aliyun.com/product/ipv6)||IPv6変換サービス||||
|![net_ipv6gateway.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/53f55167-51e6-b24e-6b28-e9041173521a.png)|[IPv6 网关](https://cn.aliyun.com/product/ipv6gateway)||IPv6ゲートウェイ||||
|![net_alidnsgtm.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/67acd896-7295-9b56-386f-5c75dcaf59f3.png)|[全局流量管理](https://help.aliyun.com/product/85188.html)|[Global Traffic Manager](https://www.alibabacloud.com/cloud-tech/doc-detail/86630.htm)|Global Traffic Manager|Amazon Route 53|Azure Traffic Manager|Cloud DNS|
|![net_cbwp.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0ad85cc8-2f27-9477-194d-b655d5b3e3ab.png)|[共享带宽](https://www.aliyun.com/product/cbwp)|[Internet Shared Bandwidth](https://www.alibabacloud.com/cloud-tech/doc-detail/55784.htm)|帯域幅共有サービス||||
|![net_flowbag.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/37faa368-4ffe-0bcc-0ca2-0d1f5677dccd.png)|[共享流量包](https://www.aliyun.com/product/flowbag)|[Data Transfer Plan](https://www.alibabacloud.com/products/data-transfer-plan)|クラウド間のデータ転送|||Cloud Storage Transfer Service|
|![net_cbn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/825e705a-7508-60f0-89a6-66f03b50534a.png)|[云企业网](https://www.aliyun.com/product/cbn)|[Cloud Enterprise Network](https://www.alibabacloud.com/product/cen)|Cloud Enterprise Network|AWS Direct Connect|ExporessRoute|Cloud Interconnect|
|![net_ga.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/39ea8e28-f3ca-d4a6-5cd0-bc86f23ae600.png)|[全球加速](<https://www.aliyun.com/product/ga>)|[Global Accelerator](https://www.alibabacloud.com/product/ga)|||||
|![net_vpn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/fbe9ea89-e02b-d9f1-eec4-1934a98e6c84.png)|[VPN 网关](https://www.aliyun.com/product/vpn)|[VPN Gateway](https://www.alibabacloud.com/product/vpn-gateway)|VPNゲートウェイ|Amazon VPN|Azure VPN Gateway|Cloud VPN|
|![net_smartag.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7ad2c5bd-304a-ccc1-6bc0-a792f5500302.png)|[智能接入网关](https://www.aliyun.com/product/smartag)|[Smart Access Gateway](https://www.alibabacloud.com/products/smart-access-gateway)|オンプレミスからのデータ転送|AWS DataSync|||
|![net_expressconnect.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/1b9e1f18-0f77-d01b-b4e5-a2980a349ffc.png)|[高速通道](https://www.aliyun.com/product/expressconnect)|[Express Connect](https://www.alibabacloud.com/product/express-connect)|専用線接続|AWS Direct Connect|ExporessRoute|Cloud Interconnect|

## 基本的なセキュリティ（基础安全）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![security_yundun.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/146262f0-004b-b183-d437-624e734b7433.png)|[专有云安全（云盾）](https://cn.aliyun.com/product/apsara-stack_security)||オンプレミスによるセキュリティサービス||||
|![ddos-pro.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4999a0de-c9ff-5faa-4a45-d4002efb890e.png)|[DDoS防护](<https://www.aliyun.com/product/security/ddos>)|[Anti-DDoS](https://www.alibabacloud.com/product/ddos)|DDoS 対策 (DDoS Pro)|AWS Shield|Azure DDoS Protection|Cloud Armor|
|![security_ddosdip.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3505d44c-131a-958b-cf4d-39d310c167fe.png)|[DDoS高防（国际）](https://www.aliyun.com/product/ddos)|[Anti-DDoS Premium](https://www.alibabacloud.com/products/ddosdip)|DDoS 対策 (Premium)|AWS Shield Advanced|Azure DDoS Protection|Cloud Armor|
|![ddos-bgpDDoSfanghubao.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c6ee9728-16cd-01c9-9c82-d0399073082c.png)|[新BGP高防IP](https://cn.aliyun.com/product/ddos)|[Anti-DDoS pro](https://yundun.console.aliyun.com)|DDoS 対策 (DDoS BGP)||||
|![security_ddos.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5225c7c1-fb08-f185-6c80-b83489ae5bc2.png)|[DDoS基础防护服务](https://www.aliyun.com/product/ddos)|[Anti-DDoS Basic](https://www.alibabacloud.com/product/anti-ddos)|DDoS 対策 (DDoS Basic)|AWS Shield|Azure DDoS Protection|Cloud Armor|
|![security_cfw.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/72569f92-ca73-55b2-23f2-2f0d4bc6fc3b.png)|[Web应用防火墙](https://www.aliyun.com/product/waf)|[Web Application Firewall](https://www.alibabacloud.com/product/waf)|Webアプリケーションファイアウォール|AWS WAF|Azure Application Gateway|Cloud Armor|
|![security_cas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/2d821c12-def6-dfac-0a4f-4f8ae3be4689.png)|[SSL证书](<https://www.aliyun.com/product/security/markets/aliyun/product/cas>)|[SSL Certificates Service](https://www.alibabacloud.com/product/certificates)|SSL/TLS証明書管理サービス|AWS Certificate Manager|App Service Certificates|Google-managed SSL certificates|
|![security_sas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c0dd6d11-6124-f25f-20c0-2e61070f84f5.png)|[云安全中心（态势感知）](https://www.aliyun.com/product/sas)|[Security Center](https://www.alibabacloud.com/product/security-center)|クラウドセキュリティセンター|Amazon Inspector|Azure Security Center||
|![security_cfw.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/72569f92-ca73-55b2-23f2-2f0d4bc6fc3b.png)|[云防火墙](https://www.aliyun.com/product/cfw)|[Cloud Firewall](https://www.alibabacloud.com/products/cloud-firewall)|クラウドファイアウォール|AWS Firewall Manager|Azure Firewall Manager||
|![security_aegis.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e653ee3c-d6d4-5618-3580-18d97fbda734.png)|[云安全中心（安骑士）](https://www.aliyun.com/product/aegis)|[Security Center](https://www.alibabacloud.com/product/security-center)|ホストセキュリティソフトウェア|Gaurd Duty|Azure Security Center||
|![security_bastionhost.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/38ee695e-210e-84d3-66cc-b14dca8b21f6.png)|[堡垒机](https://www.aliyun.com/product/bastionhost)|[Bastionhost](https://www.alibabacloud.com/product/bastionhost)|セキュリティ監査管理プラットフォーム||||
|![security_avds.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e4bf0ef0-4ae5-216a-91f1-52b58a6dc75f.png)|[漏洞扫描](https://www.aliyun.com/product/wti)|[Cloud Security Scanner](https://www.alibabacloud.com/cloud-tech/doc-detail/65422.html)|脆弱性スキャンサービス||||
|![security_uem.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/94a40b98-4e6e-1234-e2a4-9be5af0217d2.png)|[终端访问控制系统](<https://www.aliyun.com/product/uem>)||||||
|![security_config.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/36a309c6-4381-8102-6968-1e9aab4ec269.png)|[配置审计](https://cn.aliyun.com/product/config)|[Cloud Config](https://www.alibabacloud.com/products/cloud-config)|リソース監視サービス|AWS App Mesh|Azure Service Fabric Mesh|Traffic Director|

## アイデンティティ管理（身份管理）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![security_ram.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/1ee51e9c-9cf0-66c2-c4ab-c9f146ccfad1.png)|[访问控制](https://www.aliyun.com/product/ram)|[Resource Access Management](https://www.alibabacloud.com/product/ram)|アカウント権限管理|AWS Identity and Access Management|Azure Active Directory|Cloud IAM|
|![security_idaas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f17bf47c-af26-16b2-a8ea-75b070dfb204.png)|[应用身份服务](https://cn.aliyun.com/product/idaas)||IDaaSサービス|AWS Control Tower、AWS Organizations、Amazon Cognito|Azure Policy、Subspricton+RBAC、(Visual Studio App Center)|Policy Intelligence、Resource Manager、Identity Platform|

## データセキュリティ（数据安全）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![security_dbaudit.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6fe0f72a-81ad-2786-ff21-9a3320b17af9.png)|[数据库审计](https://www.aliyun.com/product/dbaudit)||データベース監査サービス||||
|![security_hsm.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/35e19a03-833c-196b-f6bb-23a6e6042c66.png)|[加密服务](https://www.aliyun.com/product/hsm)||暗号化サービス|AWS Secrets Manager|Azure Key Vault|Clou Key Management Service|
|![security_sddp.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/590503f5-e611-7f9a-1241-03a8a231f1cf.png)|[敏感数据保护](https://cn.aliyun.com/product/sddp)|[Sensitive Data Discovery and Protection](https://www.alibabacloud.com/products/sddp)|機密データ保護サービス|Amazon Macie|Azure Information Protection|Cloud Data Loss Prevention|
|![security_kms.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/331f4265-6884-86fa-3471-2e4f54bace29.png)|[密钥管理服务](https://www.aliyun.com/product/kms)|[Key Management Service](https://www.alibabacloud.com/product/key-management-service)|キー管理|AWS Key Management Service|Azure Key Vault|Clou Key Management Service|

## ビジネスセキュリティ（业务安全）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![security_gameshield.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/60d715e1-ee21-3b17-a549-22d8079431ab.png)|[游戏盾](https://www.aliyun.com/product/GameShield)|[GameShield](https://www.alibabacloud.com/product/gameshield)|ゲームシールド||||
|![security_lvwang.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/165060d1-5c21-9ff8-7948-d6e9a787d359.png)|[内容安全](https://www.aliyun.com/product/lvwang)|[Content Moderation](https://www.alibabacloud.com/product/content-moderation)|コンテンツセキュリティ||||
|![security_yundun.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c3acf6d4-3942-58a6-3260-36fa914a0ded.png)|[数据风控](<https://yundun.console.aliyun.com/>)||||||
|![security_saf.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/70db5a7b-595e-756a-e346-444cfa3fb500.png)|[风险识别](https://www.aliyun.com/product/saf)|[Fraud Detection](https://yundun.console.aliyun.com)|リスク識別と特定サービス||||
|![security_cloudauth.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3dc06d6d-1470-3804-a9bb-91f5c545c922.png)|[金融级实人认证](https://www.aliyun.com/product/cloudauth)||人物識別・認証サービス||||
|![security_antibot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a6add533-90c8-6984-7705-5e30010b16e3.png)|[爬虫风险管理](https://www.aliyun.com/product/antibot)|[Anti-Bot Service](https://www.alibabacloud.com/product/antibot)|Webクローラーやbotから防御するサービス||||

## セキュリティサービス(安全服务)
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![security_yundun.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d7da924c-96e1-8573-727d-793c75ead412.png)|[先知](<https://yundun.console.aliyun.com/?p=xznext#/welcome>)||||||
|![security_sos.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/03ac3e04-7d1c-7877-4c06-bc2c9938351f.png)|[安全管家](https://www.aliyun.com/product/sos)|[Managed Security service](https://www.alibabacloud.com/product/mss)|セキュリティ管理・評価・リスク検知サービス||||
|![security_pt.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/63742b79-46c4-94e0-a337-0ffc4cd36e97.png)|[渗透测试](https://www.aliyun.com/product/pt)||侵入テスト||||
|![security_anquan.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/bae4aa31-d757-7250-fcd7-0a299f21dc4b.png)|[安全众测](https://www.aliyun.com/product/xianzhi)||セキュリティテスト|Inspector|Security Center|Cloud Security Command Center|
|![security_dengbao.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/979b90d4-a5e5-c61b-3169-fa1ba50cbcfa.png)|[等保咨询](https://www.aliyun.com/product/xianzhi/mlpse)||セキュリティコンサルティングサービス|Inspector|Security Center|Cloud Security Command Center|
|![security_yingji.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f01f8c1c-d8da-e899-917a-3422ee53eb2b.png)|[应急响应](https://www.aliyun.com/product/yundun_incident_response)||セキュリティ緊急対応サービス||||
|![security_peixun.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/2d5a58c1-bde6-90eb-1de2-2f97d9d1da7d.png)|[安全培训](https://www.aliyun.com/product/xianzhi_securitytrain)||セキュリティトレーニング||||
|![security_pinggu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/8e2e1680-cd3f-42dd-a738-27af7d449c41.png)|[安全评估](https://www.aliyun.com/product/xianzhi_online_car-hailing)||セキュリティ評価サービス||||
|![security_daima.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/04ef6e23-3408-858e-26b3-fb95c3ab1455.png)|[代码审计](https://www.aliyun.com/product/xianzhi_codeaudit)||ソースコード監査||||
|![security_jiagu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0b518cb3-ffba-c960-aec6-f344c3d9d1d1.png)|[安全加固](https://www.aliyun.com/product/xianzhi_securityconsolidate)||セキュリティ強化サービス||||
|![security_tonggao.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4be5c3f5-5e35-d155-eeee-c060abd62b2d.png)|[安全通告](https://www.aliyun.com/product/xianzhi_SecurityNotificationService)||セキュリティ監視通知サービス||||
|![security_hegui.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5d88f090-53b6-f01b-2714-54b85088d28c.png)|[PCI DSS合规咨询](https://www.aliyun.com/product/xianzhi_PCIDSS)||PCI DSSサービス||||


## ビッグデータ計算（大数据计算）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![bigdata_odps.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ba12e2fe-9d7d-283a-ec35-1029c04f7782.png)|[MaxCompute](https://www.aliyun.com/product/odps)|[MaxCompute](https://www.alibabacloud.com/product/maxcompute)|MaxCompute|Amazon Redshift|Azure SQL Data Warehouse|Google BigQuery|
|![bigdata_emapreduce.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/cb4082bb-23f6-fce9-60f9-543d078e23e7.png)|[E-MapReduce](https://www.aliyun.com/product/emapreduce)|[E-MapReduce](https://www.alibabacloud.com/products/emapreduce)|E-MapReduce、オープンソースプロダクトサービスのマネージドサービス、クラスタの展開|Amazon EMR|HD Insight/Azure Databricks|CloudDataproc|
|![bigdata_sc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/831998e0-45b7-4f19-7457-a0d641e6a12b.png)|[实时计算Fink版](https://data.aliyun.com/product/sc)|[Realtime Compute](https://www.alibabacloud.com/products/realtime-compute)|Realtime Compute（元はApache Flink）|Amazon Kinesis|Azure Event Hubs|Cloud Dataflow|
|![bigdata_hologram.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/89f11ea7-64a4-0ecf-74bb-e9ddd8991266.png)|[Hologres交互式分析](<https://www.aliyun.com/product/hologram>)|[Hologres Interactive Analytics](https://www.alibabacloud.com/product/hologres)||インタラクティブ分析||||

## データの可視化（数据可视化）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![bigdata_datav.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b9cff002-3f77-16ef-e3bd-2b21f73a3c6f.png)|[DataV数据可视化](https://data.aliyun.com/visual/datav)|[DataV](https://www.alibabacloud.com/product/datav)|DataV、データの可視化||||

## ビッグデータの検索と分析（大数据搜索与分析）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![bigdata_opensearch.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9136e702-5dd8-7819-0bff-aae528294732.png)|[开放搜索](https://www.aliyun.com/product/opensearch)||分散検索エンジンプラットフォーム|Amazon CloudSearch|Azure Search||
|![sls_rizhifuwu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3895390c-be62-6149-bfb3-d23b413f9319.png)|[日志服务](https://www.aliyun.com/product/sls)|[Log Service](https://www.alibabacloud.com/product/log-service)|各種ログの一元管理|Kinesis, SQS|Event Hubs, Stream Analytics|Cloud Dataflow, Cloud Pub/Sub|
|![bigdata_elasticsearch.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f0bb30f7-0540-3b7d-153b-86eecd445c42.png)|[Elasticsearch](https://data.aliyun.com/product/elasticsearch)|[Elasticsearch](https://www.alibabacloud.com/product/elasticsearch)|ElasticSearch|Amazon Elasticserach Service|Elasticsearch Service on Elastic Cloud|Elastic Cloud on GCP|
|![bigdata_graphanalytics.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/5f5c068e-6321-d52c-e2e1-92a56455d707.png)|[I+关系网络分析](https://data.aliyun.com/product/graphanalytics)||リレーショナルネットワーク分析||||
|![bigdata_porphet.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6aac4b92-18a0-0c0c-e6b5-70cbdbb86fc0.png)|[DataQuotient画像分析](https://data.aliyun.com/product/porana)||画像分析サービス||||
|![bigdata_prophet.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0469bee8-2f9b-979b-e1b8-298d1847cc32.png)|[公众趋势分析](https://data.aliyun.com/product/prophet)||トレンド分析サービス||||
|![bigdata_bi.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7a2e7cb3-395a-1b2f-07fe-c779fcc8d562.png)|[Quick BI](https://data.aliyun.com/product/bi)|[Quick BI](https://www.alibabacloud.com/product/quickbi)|BIツール|QuickSight|Power BI|Data Studio|

## データ開発（数据开发）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![bigdata_dideDataWorks.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f0a01f58-d09b-f563-c018-2442b6797bdb.png)|[DataWorks](https://data.aliyun.com/product/ide)|[DataWorks](https://www.alibabacloud.com/product/ide)|データの可視化|AWS Glue|Azure Data Factory|Cloud Data Fusion|
|![bigdata_dataphin.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/28fd588f-dcb2-c8f4-a1ca-22536a417c36.png)|[Dataphin](https://www.aliyun.com/product/dataphin)|[Dataphin](https://www.alibabacloud.com/product/dataphin)|データ構築と管理サービス|AWS Glue|Data Catalog|Data Catalog|
|![Quick Audience.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ac1f4756-a3ff-7334-053b-85f587e4cd7c.png)|[智能用户增长Quick Audience ](https://cn.aliyun.com/product/retailadvqa)||多次元インサイト分析||||
|![bigdata_datahub.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/09e0dd98-a467-fbb1-1a27-d65c6b73a673.png)|[数据总线DataHub](https://data.aliyun.com/product/datahub)||ストリーム処理|Kinesis, SQS|Event Hubs, Stream Analytics|Cloud Dataflow, Cloud Pub/Sub|
|![bigdata_cdp.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b4f72d63-80cc-9f88-b148-99eee0e6d29c.png)|[数据集成](https://www.aliyun.com/product/cdp)|[Data Integration](https://www.alibabacloud.com/product/data-integration)|データ統合・ETL|AWS Glue|Azure Data Factory|Cloud Data Fusion|
|![bigdata_spark.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/cff5eaab-eb40-6340-2073-eb68aabfed25.png)|[Databricks数据洞察](<https://www.aliyun.com/product/spark>)||||||
|![bigdata_dideDataWorks.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f0a01f58-d09b-f563-c018-2442b6797bdb.png)|[数加控制台概览](<https://data.aliyun.com/console>)||||||

## データのレコメンデーション（大数据应用）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![bigdata_eprofile.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/88695782-39cf-c877-c4e3-3a8355332a25.png)|[企业图谱](https://data.aliyun.com/product/eprofile)||コーポレートマップ||||
|![bigdata_airec.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/82f8ae65-58d1-2b6e-7174-9357529877ad.png)|[智能推荐](https://www.aliyun.com/product/airec)||レコメンデーション|Amazon Personalize|Personalizer|Recommendations AI|

## インテリジェントな音声対話（智能语音交互）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![ai_nls.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7aa6a697-8a67-e4eb-bfc6-6d565b99318a.png)|[智能语音交互](https://ai.aliyun.com/nls)|[Intelligent Speech Interaction](https://www.alibabacloud.com/products/nls)|音声対話プラットフォーム|Amazon Lex|LUIS (Language Understanding Intelligent Service)|Natural Language API|
|![ai_nlsfilebag.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3a706d20-3cc3-5cae-fee1-15476335af99.png)|[录音文件识别](https://ai.aliyun.com/nls/filetrans)|[Intelligent Speech Interaction](https://www.alibabacloud.com/products/nls)|録音ファイルの認識（Speech-to-Text）|Amazon Transcribe|Speech Services|Cloud Speech-to-Text|
|![ai_nlsasrbag.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9dcf3bdb-a8a6-5c72-9d76-0911e0049a34.png)|[实时语音转写](https://ai.aliyun.com/nls/trans)|[Intelligent Speech Interaction](https://www.alibabacloud.com/products/nls)|リアルタイム音声転写|Amazon Comprehend|Azure Speech Recognition API|DialogFlow Enterprise Edition (Beta)|
|![ai_nlsshortasrbag.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9e1cfcf0-1bb2-04ea-fc26-4ca62b80a098.png)|[一句话识别](https://ai.aliyun.com/nls/asr)|[Intelligent Speech Interaction](https://www.alibabacloud.com/products/nls)|一文認識（Text-to-Speech）|Amazon Polly|Speech Services|Cloud Text-to-Speech|
|![ai_nlsttsbag.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b24b91f0-f7ef-8ec6-13a8-ea3f8460cf08.png)|[语音合成](https://ai.aliyun.com/nls/tts)|[Intelligent Speech Interaction](https://www.alibabacloud.com/products/nls)|音声合成||||
|![ai_nls.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7aa6a697-8a67-e4eb-bfc6-6d565b99318a.png)|[语音合成声音定制](https://ai.aliyun.com/nls/customtts)|[Intelligent Speech Interaction](https://www.alibabacloud.com/products/nls)|音声データの合成およびカスタマイズ||||
|![ai_nlsasrcustommodel.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/22cfcc53-9811-0bda-2661-1e561cfa9b21.png)|[语音模型自学习工具](https://ai.aliyun.com/nls/lmlearning)|[Intelligent Speech Interaction](https://www.alibabacloud.com/products/nls)|音声モデル自己学習ツール||||

## 画像検索（图像搜索）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![ai_imagesearch.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/95f517b6-9a3a-fd32-241d-1c847ec07a5f.png)|[图像搜索](https://ai.aliyun.com/imagesearch)|[Image Search](https://www.alibabacloud.com/product/imagesearch)|画像検索|Amazon Rekognition| Emotion API |Vision API|
|![ai_rsimganalys.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a3b352ce-e276-c1e3-b8fc-948837700c1c.png)|[卫星及无人机遥感影像分析产品](https://cn.aliyun.com/product/rsimganalys)||衛星およびUAV画像分析||  ||

## 自然言語処理（自然语言处理）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![ai_nlpws.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/90002f6e-06d4-393d-6f5d-de28fcdcc8d7.png)|[多语言分词](https://ai.aliyun.com/nlp/ws)||テキスト上の多言語の単語・分詞の分割サービス|Amazon Comprehend|Language Understanding|Cloud Natural Language|
|![ai_nlppos.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f6a10537-220b-8341-f3f2-d8bd13c24c8e.png)|[词性标注](https://ai.aliyun.com/nlp/pos)||品詞タグ付けの一部||||
|![ai_nlpner.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e4a0c394-bd58-1560-6597-65dde8d64353.png)|[命名实体](https://ai.aliyun.com/nlp/ner)||名前付きエンティティ||||
|![ai_nlpsa.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4e76bead-f24f-efdc-b4f4-b6c8e56f46b9.png)|[情感分析](https://ai.aliyun.com/nlp/sa)||感情分析||||
|![ai_nlpke.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/45343708-7f46-bd15-8ec5-e1c418531ef6.png)|[中心词提取](https://ai.aliyun.com/nlp/ke)||中心語抽出||||
|![ai_nlptc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/016fe4cc-94be-16e9-bfed-edebdca79088.png)|[智能文本分类](https://ai.aliyun.com/nlp/tc)||インテリジェントテキスト分類||||
|![ai_nlpie.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/58970128-d04e-f1ec-5d2d-f67528e970e5.png)|[文本信息抽取](https://ai.aliyun.com/nlp/ie)||テキスト情報抽出||||
|![ai_nlpra.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7c582b88-815d-e4f4-19f1-a67e9bdc4317.png)|[商品评价解析](https://ai.aliyun.com/nlp/ra)||製品レビューの評価分析||||
|![ai_iqa.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/afcccb33-9056-a561-5228-0908525af804.png)|[智能语义理解](https://cn.aliyun.com/product/iqa)||インテリジェントな言語理解||||
|![ai_iqa_faq_pre.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4d39abc1-3dec-dbb7-9b8b-d868508bb5e7.png)|[文本相似度 ](https://cn.aliyun.com/product/iqa_faq_pre)||テキストの類似性検索サービス||||
|![iqa_mrc_pre.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/1388b64b-ffe7-d053-e5db-db2481e324fc.png)|[机器阅读理解](https://cn.aliyun.com/product/iqa_mrc_pre)||機械解読・検索サービス|Amazon Kendra|||
|![ai_nlpautoml.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6e2aab39-4f2b-7a68-a247-585dba507794.png)|[NLP 自学习平台](https://ai.aliyun.com/nlp/nlpautoml)||テキストモデル自己学習ツール||||

## 印刷テキスト認識（印刷文字识别）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[通用型卡证类](https://ai.aliyun.com/ocr/card)||IDカード、銀行カード、パスポートなどカード識別サービス||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[汽车相关识别](https://ai.aliyun.com/ocr/vehicle)||免許証・ナンバープレートなど自動車関連データの識別サービス||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[行业票据识别](https://ai.aliyun.com/ocr/invoice)||請求書・領収書の識別サービス||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[资产类识别](https://ai.aliyun.com/ocr/certification)||資産証明書など各証明書識別サービス||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[通用文字识别](https://ai.aliyun.com/ocr/general)||画像データのテキスト認識||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[行业文档类识别](https://ai.aliyun.com/ocr/document)||業界文書データのテキスト認識サービス||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[视频类文字识别](https://ai.aliyun.com/ocr/video)||ビデオデータ内の字幕および文字テキスト認識サービス||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[自定义模板识别](https://ai.aliyun.com/ocr/template)||ORCカスタムテンプレートを作成し認識するサービス||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[教育类识别](https://ai.aliyun.com/ocr/edu)||||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[仪器仪表识别](https://ai.aliyun.com/ocr/Instrument)||||||
|![Ai_ocr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6265b155-9ee6-2332-be71-468fe3db349b.png)|[混贴票据识别](https://ai.aliyun.com/ocr/mixinvoice)||||||
|![IVPD.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/852f56b9-1e66-9fe8-dc77-788bf877ddca.png)|[智能视觉生产](https://cn.aliyun.com/product/ivpd)||インテリジェントな画像処理・解析サービス||||

## 顔認識（人脸识别）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![Ai_face.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e2c88cd6-af78-7552-6cc5-0298c42f423b.png)|[人脸识别](https://ai.aliyun.com/face)||顔認識||||
|![tdsr.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/540c37c1-3395-f135-14f7-728d4c99219f.png)|[三维空间重建](https://cn.aliyun.com/product/tdsr)||写真から3D空間構築・VR表示サービス||||

## 機械翻訳（机器翻译）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![ai_alimt.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/89902817-1297-60f9-2298-d6eaffabee1f.png)|[机器翻译](https://ai.aliyun.com/alimt)|[Machine Translation](https://www.alibabacloud.com/products/machine-translation)|機械翻訳|Amazon Translate|Translator Text|Cloud Translation|
|![internationalization.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/af29b7e0-050f-b7f4-6f2a-dfb9179e9f4a.png)|[协同翻译工具平台](https://www.aliyun.com/product/ai/internationalization)||||||
|![alimt_automl_post.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c28c1d2d-db77-bb3c-b342-29c945d9f9c4.png)|[机器翻译自学习平台](https://cn.aliyun.com/product/alimt_automl_post)||機械翻訳の自己学習プラットフォーム|Amazon Translate Custom Terminology|Translator Text Custom Translator|Cloud AutoML Translation|

## ビジュアルコンピューティング（视觉计算）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![VCS.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b96f499e-926b-0691-3a10-10e7928e5758.png)|[视觉计算服务 VCS](https://cn.aliyun.com/product/vcs)||ビジュアル（ビデオ、監視カメラなど）のAI開発コンピューティングサービス||||

## 画像認識（图像识别）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![AI_iamgerecognition.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a136b6ed-b304-e6ef-2566-77aaa0463247.png)|[图像识别](https://ai.aliyun.com/image)||画像認識|      |||
|![tupiansheji.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/de49d0d0-520c-631c-5a9a-46da84003fed.png)|[图片与设计](<https://pic.console.aliyun.com/selection-list>)| ||||

## コンテンツセキュリティ（内容安全）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[图片鉴黄](https://ai.aliyun.com/lvwang/imgadult)||ポルノコンテンツ認識||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[图片涉政暴恐识别](https://ai.aliyun.com/lvwang/imgterrorism)||写真データからテロ画像や政治的問題画像識別サービス||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[图片Logo商标检测](https://ai.aliyun.com/lvwang/imglogo)||画像からロゴ検出サービス||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[图片垃圾广告识别](https://ai.aliyun.com/lvwang/imgad)||画像スパム認識||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[图片不良场景识别](https://ai.aliyun.com/lvwang/imglive)||薬物使用、ギャンブルなどの不適切なコンテンツ認識サービス||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[图片风险人物识别](https://ai.aliyun.com/lvwang/imgsface)||画像から人物特定リスク識別サービス||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[视频风险内容识别](https://ai.aliyun.com/lvwang/video)||ビデオリスクのコンテンツ認識||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[文本反垃圾识别](https://ai.aliyun.com/lvwang/text)||テキストリスクのコンテンツ認識||||
|![security_cts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a4016637-2525-3204-28be-44111d1b7881.png)|[语音垃圾识别](https://ai.aliyun.com/lvwang/audio)||音声データのリスク識別サービス||||

## 機械学習プラットフォーム（机器学习平台）
|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![ai_learn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/56b3c854-37e4-1b38-dee3-59182940ee62.png)|[机器学习平台 PAI](https://data.aliyun.com/product/learn)|[Machine Learning Platform For AI](https://www.alibabacloud.com/product/machine-learning)|機械学習プラットフォームPAI|Amazon SageMaker|Machine Learning|AI Platform|
|![ai_retailir.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a94268c4-deda-427b-bd7b-f6a8a6d3d66a.png)|[货架商品识别与管理](https://www.aliyun.com/product/retailir)||小売向け棚の製品の自動識別と管理サービス||||
|![holowatcher-01.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/aaae49ec-8727-84d5-2b6a-d18cbae0487d.png)|[全息空间](https://holowatcher.console.aliyun.com/welcome)||||||
|![ai_aicrowd.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/2f1367ad-5131-afb6-629f-a4238f8c6732.png)|[人工智能众包](https://cn.aliyun.com/product/aicrowd)||AIによるクラウドソーシング||||
|![mutimediaai.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/99d8cba8-b6d8-5243-57be-ddafd4772013.png)|[多媒体AI](https://cn.aliyun.com/product/multimediaai)||マルチメディアの機械学習プラットフォーム||||
|![cityvisual.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e5a17556-e181-b71a-c626-909c4e345000.png)|[城市视觉智能引擎](https://cn.aliyun.com/product/cityvisual)||都市レベルでビデオ・画像データの分析プラットフォーム||||

## 都市脳のオープンプラットフォームです（城市大脑开放平台）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![zhinengchuxing.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/042640c8-a325-4761-10a0-a773ea970247.png)| [智能出行引擎](<https://m.aliyun.com/markets/aliyun/citybraintraffic>) |            | ETシティと連動した交通運用情報モジュール・サービス |      |       |      |

## 視覚知能（视觉智能）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![shijue.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0cc19c50-314a-4732-322f-e1ea0314a97e.png) | [视觉智能开放平台](<https://vision.aliyun.com/>) |              |          |           |            |           |

## ドメイン名とウェブサイト（域名与网站）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![domain.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/01c7b651-0489-fdf3-69fa-86de6dc6ddb6.png) | [域名注册](https://wanwang.aliyun.com/)                      | [Domains](https://www.alibabacloud.com/domain)               | ドメイン登録サービス                         |                          |                           |            |
| ![domaintrade.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/401680f1-8abc-b95f-714d-a5da95792540.png) | [域名交易](https://mi.aliyun.com/)                           |                                                              | ドメイン名取引サービス                       |                          |                           |            |
| ![qiye_web.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a00fc293-cb79-101b-0c30-76d11cd62ec5.png) | [企业网站定制](https://ac.aliyun.com/application/webdesign/yunqi) |                                                              |                                              |                          |                           |            |
| ![enterprise_moban.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7bc5502b-bc8d-0326-c064-f365d4fbaafe.png) | [网站模板](https://ac.aliyun.com/application/webdesign/sumei) |                                                              |                                              |                          |                           |            |
| ![enterprise_jianzhan.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c579c2fd-afe4-62e9-ebd6-cd682dbf62d7.png) | [网站建设](https://www.aliyun.com/jianzhan)                  |                                                              | ウェブサイト構築サポートサービス             |                          |                           |            |
| ![enterprise_host.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6b88f046-572c-b9db-20cf-9c6cef6e445d.png) | [云虚拟主机](https://wanwang.aliyun.com/hosting)             | [Web Hosting](https://www.alibabacloud.com/product/hosting)  | クラウド仮想ホスト                           |                          | Azure shared App Services |            |
| ![enterprise_host.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6b88f046-572c-b9db-20cf-9c6cef6e445d.png) | [海外云虚拟主机](https://www.aliyun.com/chinaglobal/promotion/virtual2017) |                                                              | 国外Webホスティング設置サービス              |                          |                           |            |
| ![DNS.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f2608c16-3e7d-3a38-6aa0-6cb7298a8c58.png) | [云解析 DNS](https://wanwang.aliyun.com/domain/dns)          | [Alibaba Cloud DNS](https://www.alibabacloud.com/product/dns) | DNS                                          | Amazon Route 53          | Azure DNS                 | Cloud DNS  |
| ![enterprise_ews.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0b075828-c86d-dbd8-69ec-524a30a28c19.png) | [弹性Web托管](https://wanwang.aliyun.com/hosting/elastic)    |                                                              | 柔軟なWebホスティング                        | Amazon Elastic Beanstalk | Azure App Service         | App Engine |
|![enterprise_beian.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3ca0c378-bb78-24f0-140b-0dd4ef46af8a.png) | [备案](https://beian.aliyun.com/) |  | ドメイン登録(IPC)のためのICP代替申請サービス |  | |  |


## 商工財税（工商财税）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![enterprise-companyreg.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d87db064-c752-3b1d-595a-b04d84f6febb.png) | [公司/个体工商注册](<https://gs.aliyun.com/>)                |            |          |      |       |      |
| ![enterprise-companyreg.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d87db064-c752-3b1d-595a-b04d84f6febb.png) | [代理记账](<https://gs.aliyun.com/product/dz>)               |            |          |      |       |      |
| ![enterprise-companyreg.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d87db064-c752-3b1d-595a-b04d84f6febb.png) | [ICP经营性备案](<https://tm.aliyun.com/channel/product/icp>) |            |          |      |       |      |

## 知的財産サービス（知识产权服务）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![enterprice_trademark.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9abd00c7-ccdc-9b39-3c47-d5395ec89640.png) | [商标注册](https://tm.aliyun.com/)                           |            | 商標登録サービス                       |      |       |      |
| ![enterprice_trademark.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9abd00c7-ccdc-9b39-3c47-d5395ec89640.png) | [软件著作权登记](https://www.aliyun.com/acts/domain/copyright) |            |                                        |      |       |      |
| ![enterprice_trademark.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9abd00c7-ccdc-9b39-3c47-d5395ec89640.png) | [商标交易](https://www.aliyun.com/acts/domain/tmtransaction) |            | 商標登録されてるものを購入するサービス |      |       |      |

## 申請サービス（应用服务）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![enterprice-cloudap.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e119ecf7-afc0-de23-9e28-a1d16d911d3e.png) | [云AP](https://www.aliyun.com/product/cloudap)        |                                                              | クラウドAP           |                             |                |                        |
| ![apigateway.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/12b60b90-25ec-11f3-37ec-c6ae02d88e83.png) | [API 网关](https://www.aliyun.com/product/apigateway) | [API Gateway](https://www.alibabacloud.com/product/api-gateway) | API管理              | Amazon API Gateway          | API Management | Cloud Endpoints/Apigee |
| ![directmail.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/1d08e4ce-38a6-b106-f74b-0f93d5c9ae8c.png) | [邮件推送](https://www.aliyun.com/product/directmail) | [DirectMail](https://www.alibabacloud.com/product/directmail) | メール送受信サービス | Amazon Simple Email Service | (Office 365)   | (G Suite)              |
| ![cloudesl.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f4f87ae3-67d0-0d18-08a0-6182aabdebd3.png)| [云价签](https://www.aliyun.com/product/cloudesl)     |                                                              |               クラウド上の値札サービス       |                             |                |                        |

## インテリジェントデザインサービス（智能设计服务）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![enterprise_lu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/bb33583e-281d-5574-ecf9-e9a3933d05d5.png) | [鹿班](https://www.aliyun.com/product/luban) |            | 画像自動生成サービス |      |       |      |

## ビデオクラウド（视频云）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![RTC.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a837c559-d3f2-7b3d-4cca-2e96b0845c5f.png) | [音视频通信 RTC](https://www.aliyun.com/product/rtc)         |                                                              | オーディオとビデオ通信RTC                                    |                                                      |                                                     |          |
| ![live.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/783facd6-578e-edb6-2275-19db24ee4f3b.png) | [视频直播](https://www.aliyun.com/product/live)              | [ApsaraVideo Live](https://www.alibabacloud.com/product/apsaravideo-for-live) | ライブビデオ                                                 | AWS Elemental MediaLive                              | Azure Media Services - Live and On-demand Streaming | (Anvato) |
| ![vs.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f452512e-c779-7fc4-56ba-54e5a345368e.png) | [视频监控](https://www.aliyun.com/product/vs)                |                                                              | ビデオ監視サービス                                           |                                                      |                                                     |          |
| ![vod.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c74390f2-2145-a021-1ab2-3753eebdca5b.png) | [视频点播](https://www.aliyun.com/product/vod)               | [ApsaraVideo VOD](https://www.alibabacloud.com/products/apsaravideo-for-vod) | オンデマンドオーディオ/ビデオストリーミングサービス          | AWS Elemental MediaPackage                           | Azure Media Services                                |          |
| ![mts.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/54edbb1a-3108-5c9d-8706-995740d09aff.png) | [媒体处理](https://www.aliyun.com/product/mts)               | [ApsaraVideo for Media Processing](https://www.alibabacloud.com/product/mts) | メディア変換                                                 | Amazon Elastic Transcoder/AWS Elemental MediaConvert | Azure Media Services - Encoding                     | (Anvato) |
| ![mts-censor.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/cd93e61d-6432-1c1b-9163-32d1be053a90.png)| [视频审核](https://ai.aliyun.com/vi/censor)                  | [ApsaraVideo VOD](https://www.alibabacloud.com/products/apsaravideo-for-vod) | ビデオ検閲サービス。ポルノや政治など禁止事項の特定をメイン   |                                                      |                                                     |          |
| ![mts-dna.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/05975313-7985-5e2d-ea2d-ec80bccb3e6d.png) | [视频DNA](https://ai.aliyun.com/vi/dna)                      |                                                              | ビデオ監査サービス。映像データから重複排除をメイン           |                                                      |                                                     |          |
| ![mts-produce.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/13115726-9992-64f8-ea8a-60a3e0d92ff8.png) | [视频智能生产](https://ai.aliyun.com/vi/produce)             |                                                              | ビデオ制作サービス。映像を識別しリアルタイムでハイライトを生成 |                                                      |                                                     |          |
| ![mts-mtscover.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/841e69f4-1dd7-47f1-e3b2-6b293dee1d5e.png) | [智能封面](https://ai.aliyun.com/vi/cover)                   |                                                              | ビデオデータやコンテンツから最適なビデオカバー提供           |                                                      |                                                     |          |
| ![ivsion.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/50c2aacc-5462-cbf0-d81b-6dd59125ccfc.png) | [智能视觉](https://ai.aliyun.com/vi/ivision)                 |                                                              | ビデオインテリジェント。画像分類、画像検出、ビデオ分類、ビデオ認識、ライブ識別 |                                                      |                                                     |          |
| ![mts-multimod.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9d9c0ab2-61e3-4ffe-13ae-e2da9324c47a.png) | [多模态内容理解](https://help.aliyun.com/knowledge_list/119001.html) | [ApsaraVideo VOD](https://www.alibabacloud.com/products/apsaravideo-for-vod) | マルチモーダルコンテンツAIサービス                           | Amazon Kinesis Video Streams                         | Media Analytics                                     |          |

## プライベートクラウド（专有云）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![enterprise_yun.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/44764c7a-a689-5a1e-c0d5-0db348a5a7af.png) | [Apsara Stack](https://www.aliyun.com/product/apsara-stack) | [Apsara Stack](https://www.alibabacloud.com/product/apsara-stack) | オンプレミスによるAlibabaCloudサービス | AWS Outposts | Azure Stack | Cloud Platform Service |



## メッセージキューMQ（消息队列 MQ）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![mq.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/306fc0a1-22fe-fc42-8431-dd4c5113501d.png) | [消息队列 RocketMQ](https://www.aliyun.com/product/rocketmq) | [AlibabaMQ for Apache RocketMQ](https://www.alibabacloud.com/product/mq) | 分散メッセージミドルウェア                                  | Amazon MQ                                                    |                            |                                   |
| ![amqp.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/67ee377c-290d-0314-e477-12138621a4ce.png) | [消息队列 AMQP](https://www.aliyun.com/product/amqp)         |                                                              | RabbitMQによるメッセージキュー                              | Amazon Simple Queue Service                                  | Azure Queue Storage        |                                   |
| ![onsmatt.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6b04e3d6-97fe-abe6-64ee-0708d7fe279d.png) | [微消息队列 MQTT](https://www.alibabacloud.com/zh/products/mqtt) | [AliwareMQ for IoT](https://www.alibabacloud.com/zh/products/mqtt) | IoTおよびモバイルインターネット向けマイクロメッセージキュー |                                                              |                            |                                   |
| ![alikafka.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/116c844c-97ff-0373-034d-441609220375.png) | [消息队列 Kafka](https://www.aliyun.com/product/kafka)       | [AlibabaMQ for Apache Kafka](https://www.alibabacloud.com/product/kafka) | kafkaによるメッセージキュー                                 | Amazon Managed Streaming for Kafka                           | HDInsight                  |                                   |
| ![mns.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c4f0f2d3-8139-76d0-a07f-8203f1f98eb1.png) | [消息服务 MNS](https://www.aliyun.com/product/mns)           | [Message Service](https://www.alibabacloud.com/product/message-service) | 分散型メッセージキューサービス                              | SQS (Simple Queue Service), SNS (Simple Notification Service), MQ | Queue Storage, Service Bus | Google Pub/Sub, GAE の Task Queue |
| ![eventbridge.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d49df564-448c-7ea7-6e55-84476d6959d0.png)| [事件总线](https://www.aliyun.com/product/aliware/eventbridge) |                                                              |                                                             |                                                              |                            |                                   |

## 微服务

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![edas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/610e1e46-1ed5-8100-3bbd-b9372a27809e.png) | [企业级分布式应用服务 EDAS](https://www.aliyun.com/product/edas) | [Enterprise Distributed Application Service](https://www.alibabacloud.com/product/edas) | エンタープライズ分散アプリケーションサービスEDAS     | AWS App Mesh| Service Fabric |                                                      |
| ![acms.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7274d250-9227-4efe-0c4a-2098a0411d79.png) | [应用配置管理 ACM](https://www.aliyun.com/product/acm)       | [Application Configuration Management](https://www.alibabacloud.com/product/acm) | アプリケーション構成管理ACM                          | AWS Service Catalog                                          |                                                              | Private Catalog                                      |
| ![txc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/348459fa-4e0d-e2b4-0306-13b7285a1e40.png) | [全局事务服务 GTS](https://cn.aliyun.com/aliware/txc)        |                                                              | グローバルトランザクションサービス                   | Simple Workflow Service (SWF)| Azure Logic Apps | Cloud Composer |
| ![mse.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/9f1d5e46-5410-7102-3e23-019755812a2a.png) | [微服务引擎 MSE](https://cn.aliyun.com/product/mse)          |                                                              | Nacos連携可能なマイクロサービスエンジン              |                                                              |                                                              |                                                      |
| ![csb.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4a26d937-1913-6290-68e9-62f30c66bd58.png) | [云服务总线 CSB](https://cn.aliyun.com/product/csb)          |                                                              | クラウドサービス上のクロスプロトコル環境提供サービス | Simple Workflow Service (SWF) | Azure Logic Apps |Cloud Composer|



## インテリジェントカスタマーサービス（智能客服）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![ccc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3caab77a-16ce-5966-70cd-d18ae8f77329.png) | [云呼叫中心](https://www.aliyun.com/product/ccc)        |                                                              | クラウドコールセンター          |            |                                                              |              |
| ![Enterprise_beebot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/10c63464-9447-d018-407e-c7089d8b21cd.png) | [云小蜜](https://www.aliyun.com/product/beebot)         | [Intelligent Robot](https://www.alibabacloud.com/zh/product/bot) | NLPベースの会話ロボットサービス | Amazon Lex | Bot Service                                                  | (Dialogflow) |
| ![sca.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c53ec341-d12f-9086-a7e9-044a515edfd5.png) | [智能对话分析](https://www.aliyun.com/product/sca)      |                                                              | 知的対話分析                    |            |                                                              |              |
| ![outboundbot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/30218f11-e1d2-e7f5-c945-99c60298c0a2.png)| [智能外呼](https://www.aliyun.com/product/outboundbot)  |                                                              |                                 |            |                                                              |              |
| ![voicebot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/804e1fbd-6e3a-047c-c594-f0eb4e925210.png) | [智能语音导航](https://www.aliyun.com/product/voicebot) |                                                              |                                 |            |                                                              |              |
| ![ccs.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/82120a00-8a78-4549-a4a4-1b4f70ce6228.png) | [云客服](https://www.aliyun.com/product/ccs)            |                                                              | クラウドカスタマーサービス      |            | [Cognitive Service + BOT Framework] |              |

## ブロックチェーン（区块链）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![baas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ef53d5f0-9604-06a1-c180-b9e4b3bab3f1.png) | [区块链服务](https://www.aliyun.com/product/baas) | [Blockchain as a Service](https://www.alibabacloud.com/products/baas) | ブロックチェーンサービス | Managed Blockchain、Quantum Ledger Database | Blockchain Service、Blockchain Workbench |      |

## SaaSアクセラレータ（SaaS加速器）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![yida.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/61ebd31d-31c9-30c3-85c2-3f327395bf11.png) | [宜搭](https://www.aliyun.com/product/yida) |            | GUIベース開発サービス |      |       |      |

## モノのインターネットプラットフォーム（物联网平台）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![iot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6eee4782-ecac-bc24-8eb9-9d4ee05aa9d7.png) | [物联网设备接入](https://www.aliyun.com/product/iot-deviceconnect) | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoTデバイスへのアクセス                 |                      | Azure IoT Hub                         |      |
| ![iot-livinglink.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c135c62f-486e-817b-d8bb-4aba7e057d53.png) | [生活物联网平台](https://iot.aliyun.com/products/livinglink) | [IoT Platform](https://www.alibabacloud.com/product/iot) | Life Internet of Thingsプラットフォーム |                      |                                       |      |
| ![iot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/6eee4782-ecac-bc24-8eb9-9d4ee05aa9d7.png) | [物联网设备管理](https://www.aliyun.com/product/iot-devicemanagement) | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoTデバイス管理                         |                      | Azure IoT Hub                         |      |
| iconなし                                                     | [物联网资源包](https://m.aliyun.com/markets/aliyun/act/IoT/HD) |                                                          |                                         |                      |                                       |      |
| iconなし                                                     | [物联网数据分析](https://www.aliyun.com/product/iot-dataanalytics) | [IoT Platform](https://www.alibabacloud.com/product/iot) | モノのインターネットデータ分析          | AWS IoT Analytics    | Stream Analytics/Time Series Insights |      |
| iconなし                                                     | [物联网应用开发](https://iot.aliyun.com/products/iotstudio)  | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoT 開発Studio                          | AWS IoT Things Graph | IoT Central                           |      |

## 低電力WAN（网络服务）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![iot-linkwan.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3d286a9b-2276-ece9-c93b-bdd6d347d87a.png) | [物联网络管理平台](https://www.aliyun.com/product/linkwan)   |            | IoTネットワーク管理プラットフォーム |      |       |      |
| ![iot-dyiot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/b34761b6-0d68-470d-50ff-01e71ddb4a46.png) | [物联网无线连接服务](https://www.aliyun.com/product/olddyiot) |            | IoT無線通信接続サービス             |      |       |      |

## エッジサービス（边缘服务）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![IOT_iotedge.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0bb4a1cd-d96e-e085-f227-94f255534117.png)| [物联网边缘计算](https://www.aliyun.com/product/iotedge)     | [Link IoT Edge](https://www.alibabacloud.com/zh/product/linkiotedge) | IoTエッジコンピューティング          | AWS Greengrass | Azure IoT Edge | Cloud IoT Edge |
| iconなし                                                     | [视频边缘智能服务](https://www.aliyun.com/product/linkvisual) | [IoT Platform](https://www.alibabacloud.com/product/iot)     | ビデオエッジインテリジェンスサービス |                |                |                |

## 設備サービス（设备服务）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし | [AliOS Things](https://iot.aliyun.com/products/aliosthings) | [IoT Platform](https://www.alibabacloud.com/product/iot) | Alibaba Cloud用IoTオペレーティングシステム |      |       |      |

## IoTセキュリティ（物联安全）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし                                                     | [物联网固件安全检测](https://iot.aliyun.com/products/iotfss) | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoTファームウェアセキュリティサービス |                           |               |                |
|![IOT_iotidIoT.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/7706047f-a1f5-f3da-1bb8-bed5c56744fa.png) | [物联网设备身份认证](https://www.aliyun.com/product/iotid)   | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoTデバイスアイデンティティ認証       | AWS IoT Core              | Azure IoT Hub | Cloud IoT Core |
| iconなし                                                     | [物联网安全运营中心](https://www.aliyun.com/product/iot-devicedefender) | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoTセキュリティオペレーションセンター | AWS IoT Device Defender   | Azure IoT Hub |                |
| iconなし                                                     | [物联网可信执行环境](https://iot.aliyun.com/products/tee)    | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoT実行環境アプリケーション           | AWS IoT 1-Click           |               |                |
| iconなし                                                     | [物联网可信服务管理](https://iot.aliyun.com/products/tsm)    | [IoT Platform](https://www.alibabacloud.com/product/iot) | IoTサービス集約管理プラットフォーム   | AWS IoT Device Management | Azure IoT Hub | Cloud IoT Core |
| iconなし                                                     | [小眯眼远程视频监控](https://cn.aliyun.com/product/xmycamera) |                                                          | Xiaoyan Eyeスマートカメラ             |                           |               |                |

## 行业平台

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし | [生活物联网平台（飞燕平台）](https://www.aliyun.com/product/livinglink) |            |          |      |       |      |

## 関連クラウド製品（相关云产品）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![IOT_iovcc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ccf72adb-84f3-80d9-8209-81d1d311b57d.png) | [智联车管理云平台](https://www.aliyun.com/product/iovcc) |            | Zhilian自動車メーカー向けの自動車管理クラウドプラットフォーム |      |       |      |

## エコロジー（生态）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし | [物联网市场](https://linkmarket.aliyun.com)                  |            | IoTアプリケーション購入市場              |      |       |      |
| iconなし | [物联网测试认证服务](https://iot.aliyun.com/linkcertification?) |            |IoTテストおよび認証サービス                                          |      |       |      |
| iconなし | [ICA物联网标准联盟](https://www.ica-alliance.org/)           |            | IoTConnectivityAlliance、IoTアライアンス |      |       |      |

## バックアップ、移行、および災害復旧（备份、迁移与容灾）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![migrate Tool.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/64423f42-8d73-7b0a-cf1d-06b276815928.png) | [迁移工具](https://help.aliyun.com/document_detail/62394.html) |            | Qianyun移植ツール                    |      |       |      |
| iconなし                                                     | [应用发现服务 APDS](https://cn.aliyun.com/product/apds)      |            | アプリケーション資産情報発掘サービス |      |       |      |

## 開発者プラットフォーム（开发者平台）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![miniapp_dev.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e20d13e4-8c99-2d2d-2c36-9920df646c44.png) | [小程序云](https://www.aliyun.com/product/miniappdev)  |  小規模プログラムによるクラウドサービス                                                        |                      |                  |                                                              |                                                             |
| iconなし                                                     | [开发者中心](https://developer.aliyun.com/index)       |                                                          | デベロッパーセンター |                  |                                                              |                                                             |
| ![iot_wulianwangpingtai.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3d5e9123-23ab-8a67-7797-fda2e562751b.png) | [物联网开发者平台](https://www.aliyun.com/product/iot) | [IoT Platform]| IoTプラットフォーム  | AWS IoT Platform | Azure IoT Platform| Cloud IoT Core (Beta)|

## APIとツール（API与工具）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし                                                     | [Cloud Toolkit](https://cn.aliyun.com/product/cloudtoolkit)  |                                                              | クラウド開発ツールキット          | AWS CodeStar                        | DevOps                 |                           |
| ![openapiexplorer.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c85700fb-2d86-f3db-706e-3cb096b77b65.png) | [OpenAPI Explorer](https://www.aliyun.com/product/openapiexplorer) | [OpenAPI Explorer](https://www.alibabacloud.com/products/openapiexplorer) | OpenAPI Explorer                  |                                     |                        |                           |
| iconなし                                                     | [API 控制中心](https://developer.console.aliyun.com/)        |                                                              | APIコンソール                     |                                     |                        |                           |
|![open_api.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4ecdb935-9711-ca85-8a72-fc57feef86a9.png)                                                 | [OpenAPI](https://open.aliyun.com/apis)                      |                                                              |         APIプラットフォーム                          |                                     |                        |                           |
| iconなし                                                     | [API 错误中心](https://error-center.aliyun.com/)             |                                                              | APIエラーセンター                 |                                     |                        |                           |
| iconなし                                                     | [SDK 全集](https://developer.aliyun.com/sdk)                 |                                                              | Alibaba Cloud SDKプラットフォーム | AWS Cloud9                          | (Visual Studio Online) | (Cloud Shell Code editor) |
|![cloud_shell.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c385591a-aa71-2dad-eeab-44883376626d.png) | [云命令行](https://www.aliyun.com/product/cloudshell)        | [Cloud Shell](https://www.alibabacloud.com/products/cloud-shell) | Cloud Shell                       | AWS Systems Manager Session Manager | Cloud Shell            | Cloud Shell               |
| ![cloud_composer.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0c71e207-01c1-d4bf-e96e-4f1e34371bab.png) | [逻辑编排](https://www.aliyun.com/product/logiccomposer)     |                                                              | オーケストレーションサービス      | AWS Data Pipeline                   | Azure Data Factory     | Cloud Composer            |
| iconなし                                                     | [Dragonwell ](https://www.aliyun.com/product/dragonwell)     |                                                              | OpenJDKディストリビューション     |                                     |                        |                           |

## プロジェクトコラボレーション（云效 企业级一站式DevOps平台）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし                                                     | [项目协作](https://www.aliyun.com/product/yunxiao-project)  |            | クラウドエンタープライズコラボレーション |      |       |      |
| iconなし                                                     | [知识库](https://www.aliyun.com/product/yunxiao/thoughts)   |            |                                          |      |       |      |
|![yunxiao_codemanager.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/93942ab2-1dea-c246-b925-31db52733af0.png)| [代码管理](https://www.aliyun.com/product/yunxiao/codeup)   |            |                                          |      |       |      |
|![yunxiao_testmanager..png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/327cbdc2-ad2e-206e-e89b-b566952423fd.png)| [测试管理](https://www.aliyun.com/product/yunxiao/testhub)  |            |                                          |      |       |      |
| ![yunxiao_line.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d36049f7-b059-e78b-014c-6e7a29ad755c.png) | [流水线](https://www.aliyun.com/product/yunxiao/flow)       |            |                                          |      |       |      |
| ![yunxiao_storge.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/8a69a8e4-b0c2-8e09-f067-9328d1567890.png)| [制品仓库](https://www.aliyun.com/product/yunxiao/packages) |            |                                   Maven製品管理サービス       |      |       |      |

## モバイルクラウド（移动研发平台EMAS）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし                                                     | [移动研发平台 EMAS](https://cn.aliyun.com/product/emas)    |            | モバイルR&Dプラットフォーム                  | AWS Amplify                                                  | Mobile Apps                                                  | Firebase           |
|![EMAS_DevOps.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ccde79e3-5f86-6eaf-5b96-3c9637918862.png) | [移动Devops](https://cn.aliyun.com/product/emas)           |            | モバイルR&Dプラットフォーム                  | AWS Amplify                                                  | Mobile Apps                                                  | Firebase           |
|![EMAS_cps.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/12be16c0-b398-f268-194f-91b4d0369f94.png)| [移动推送](https://www.aliyun.com/product/cps)             |            | モバイルアプリの通知とメッセージングサービス | Amazon Simple Notification Service                           | Azure Service Bus                                            | Cloud Pub/Sub      |
|![EMAS_hotfix.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/e50c82b7-cece-da73-92bd-96d981efd009.png) | [移动热修复](https://www.aliyun.com/product/hotfix)        |            | モバイルサービスのhot-fixサービス            |                                                              | [HockeyApp（国际版）]) |                    |
|![EMAS_performance.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/10b97732-e29a-16e9-6eeb-75044cd447c4.png) | [性能分析](https://www.aliyun.com/product/emascrash/apm)   |            |                                              |                                                              |                                                              |                    |
|![EMAS_crash_analysis.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f11821d3-03d6-481e-8df5-76088fa9f56c.png)| [崩溃分析](https://www.aliyun.com/product/emascrash/crash) |            |                                              |                                                              |                                                              |                    |
|![EMAS_log.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/c03cbcf3-05c1-ffce-54fa-4dafdd449b0b.png) | [远程日志](https://www.aliyun.com/product/emascrash/tlog)  |            |                                              |                                                              |                                                              |                    |
|![enterprise_mqc_yidongceshi.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/0cda6b6e-6b61-cc9a-af7c-59493d39d110.png) | [移动测试](https://www.aliyun.com/product/mqc)             |            | モバイルテストサービス                       | AWS Device Farm                                              | (Visual Studio App Center)                                   | Firebase Test Lab  |
| ![enterprise_mas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/4100953e-5b6e-b2ec-fd43-8e8f7a6da803.png) | [移动数据分析](https://www.aliyun.com/product/man)         |            | モバイルアプリデータ統計サービス             | Amazon Mobile Analytics | HockeyApp（国际版）| Firebase Analytics |
|![enterprise_feedback.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/fd7b44b7-7f54-c766-741c-e86a90d63f25.png) | [移动用户反馈](https://www.aliyun.com/product/feedback)    |            | モバイルアプリからのフィードバックサービス   | CloudWatch| Application Insights（国际版） |                    |
|![httpdns.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/70b4b2b0-db04-142f-13e1-f1dd304ed112.png) | [HTTPDNS](https://www.aliyun.com/product/httpdns)          |            | モバイル開発者向けのドメイン名解決サービス   |                                                              |                                                              |                    |



## コードホスティング、倉庫（代码托管、仓库）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし                                                     | [Maven公共仓库](https://m.aliyun.com/markets/aliyun/ali-repo) |                                                              | Maven Public Warehouse       |                                   |                          |                           |
|![acr_rongqijingxiangfuwu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/8d76dec9-8956-c6da-915c-94c34ff6b5ab.png)| [容器镜像服务](https://www.aliyun.com/product/acr)           | [Container Registry](https://www.alibabacloud.com/product/container-registry) | コンテナミラーリングサービス | Amazon Elastic Container Registry | Azure Container Registry | Google Container Registry |
|![nodejs_Nodejsxingnengpingtai.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/82d9b888-85ed-9497-866f-c0b88dde936f.png) | [Node 模块仓库](https://www.aliyun.com/product/nodejs)       |                                                              |                              |                                   |                          |                           |

## 企業ITガバナンス（企业IT治理）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![ram_fangwenkongzhi.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/acf01db4-07e9-920e-672b-7cd536826c0d.png) | [访问控制](https://www.aliyun.com/product/ram)               | [Resource Access Management](https://www.alibabacloud.com/product/ram) | アカウント権限管理 | AWS Identity and Access Management | Azure Active Directory | Cloud IAM        |
|![actiontrail.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/20d79772-c816-a335-8a9b-e3bf733f0b1c.png) | [操作审计 - ActionTrail](https://cn.aliyun.com/product/actiontrail) | [ActionTrail](https://www.alibabacloud.com/product/actiontrail) | 運用監視サービス   | AWS CloudTrail                     | Azure Activity Log     | Cloud Audit Logs |
|![resoure manager.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/710ecd3f-5e56-d25b-e421-4e0cdf203246.png) | [资源管理](https://www.aliyun.com/product/entconsole)        | [Resource Manager](<https://resourcemanager.console.aliyun.com/>) |                    |                                    |                        |                  |

## 統合配送（集成交付）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし                                                     | [持续交付](https://www.aliyun.com/product/yunxiao-cd)      |            | 継続的配信サービス | AWS CodeDeploy   | Azure Pipelines | Cloud Build |
|![codepipeline_CodePipeline.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/933f4ac2-76a0-51d2-4499-448f2c3ba9aa.png)| [CodePipline](https://www.aliyun.com/product/codepipeline) |            | パイプライン       | AWS CodePipeline | Azure Pipelines | Cloud Build |

## テスト（测试）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![pts_xingnengceshiPTS.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/be6d5bcf-4057-d866-3735-9d5e4f212a0f.png)| [性能测试 PTS](https://www.aliyun.com/product/pts) |            | パフォーマンステストサービス | Amazon Lumberyard | Visual Studio Team Services|      |

## 開発と運用（开发与运维）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![arms_yewushishijiankongfuwu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/392545db-aae9-94aa-6c92-1eeb483067b2.png)| [应用实时监控服务](https://www.aliyun.com/product/arms)      | [Application Real-Time Monitoring Service](https://www.alibabacloud.com/product/arms) | アプリケーションリアルタイム監視サービス |                   |                             |                                |
|![cms_yunjiankong.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/65d97342-4b6f-a2eb-818b-eaf437414c28.png)| [云监控](https://www.aliyun.com/product/jiankong)            | [CloudMonitor](https://www.alibabacloud.com/product/cloud-monitor) | クラウドモニタリング                     | Amazon CloudWatch   | Azure Monitor                | Google Stackdriver             |
| ![advisor-zhinengguwen.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/d5307681-21fd-a4b2-6d16-2190341087e6.png) | [智能顾问](https://www.aliyun.com/product/advisor)           |                                                              |                                          | AWS Trusted Advisor | Azure Advisor                | Google Cloud Platform Security |
|![ahas_yingyonggaokeyong.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/aaf984c9-54e5-6a19-c902-536e379c6fa0.png)| [应用高可用服务 AHAS](https://www.aliyun.com/product/ahas)   | [Application High Availability Service](https://www.alibabacloud.com/zh/products/ahas) | Application High Availability Service    |                  |                           |                             |
|![code_daimatuoguan.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/419c6174-0883-08a3-12bf-37d095db0b58.png)| [代码托管](https://promotion.aliyun.com/ntms/act/code.html?spm=5176.192645.h2v3icoap.413.3b9a598fSEXwtF) |                                                              |Gitライブラリホスティングサービス                                          | AWS CodeCommit      | Azure Repos                  | Cloud Source Repositories      |
|![nodejs_Nodejsxingnengpingtai.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/82d9b888-85ed-9497-866f-c0b88dde936f.png)| [Node.js性能平台](https://www.aliyun.com/product/nodejs)     |                                                             | Node.jsパフォーマンスプラットフォーム    |                   |                            |                               |
|![xtrace_lianluzhuizong.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a0bf8899-fe91-e100-eff5-0d8e4e774b28.png) | [链路追踪](https://www.aliyun.com/product/xtrace)            | [Tracing Analysis](https://www.alibabacloud.com/products/tracing-analysis) | TracingAnalysis                          |                   |                           |                           |





## クラウド・ゲーム（云游戏）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![cloud_game.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/f1a07a74-0227-62ae-eb89-360baed0d328.png) | [云游戏平台](https://www.aliyun.com/product/industryengine/cloudgamingplatform) |            |          |      |       |      |

## 通用行业（通用行业）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| ![addrp_dizhibiaozhunhua.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/3b66d168-36f3-e85c-4db2-b6c56572268b.png) | [地址标准化](https://www.aliyun.com/product/addresspurification/addrp) |            |          |      |       |      |
|![IPaddress.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/18efee68-31f9-db08-9932-d3b8171c50a9.png)| [IP地理位置库](https://dns.console.aliyun.com/)              |            |          |      |       |      |

## 移動開発プラットフォーム（移动开发平台mPaaS）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![mpaas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ce567683-0e69-a4ee-1952-1cf8eb23f741.png)| [mPaas小程序](https://www.aliyun.com/product/mobilepaas/mpaas-miniprogram) |            |          |      |       |      |
|![mpaas_yidongfenxi.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/434d4d5a-aa5f-c818-28d2-24e49d8af7b6.png)| [移动分析](https://www.aliyun.com/product/mobilepaas/mobile-analysis) |            |          |      |       |      |
|![mpaas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ce567683-0e69-a4ee-1952-1cf8eb23f741.png)| [智能投放](https://www.aliyun.com/product/mobilepaas/mobile-contents-delivery) |            |          |      |       |      |
|![mpaas_yidongwangguan.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/209e93d4-bb26-6e0e-7258-255dc552f1fc.png)| [移动网关](https://www.aliyun.com/product/mobilepaas/mobile-gateway) |            |          |      |       |      |
|![MPAAS_shujutongbu.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/87e7e3fd-6eff-f4bc-31e1-7e18a8b260f4.png)| [数据同步](https://www.aliyun.com/product/mobilepaas/mobile-sync?) |            |          |      |       |      |
|![mpaas.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/ce567683-0e69-a4ee-1952-1cf8eb23f741.png)| [移动发布](https://www.aliyun.com/product/mobilepaas/mobile-deployment) |            |          |      |       |      |

## デジタル金融（数字金融）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
| iconなし | [金融分布式架构SOFastack](https://www.aliyun.com/product/sofa) |            |金融シナリオ向け分散マイクロサービス・アーキテクチャ          |      |       |      |
| iconなし | [云行情](https://www.aliyun.com/product/assettech)           |            |          |      |       |      |

## 企業事務協同（企业办公协同）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![enterprise_cdyuntouping.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/a784c076-645d-3289-8caf-245af4efd654.png)| [云投屏](<https://www.aliyun.com/product/cd>)          |                                                              |クラウドプロジェクションスクリーン                        |                 |              |           |
| iconなし                                                     | [Teambition企业协同](https://www.teambition.com/)      |                                                              |                        |                 |              |           |
|![alimailaliyouxiang.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/54c20816-2c1e-8a0b-d66f-ccb0d79940c2.png) | [企业邮箱](https://wanwang.aliyun.com/mail)            | [Alibaba Mail](https://www.alibabacloud.com/products/alibaba-mail) | ビジネスメールボックス | Amazon WorkMail | (Office 365) | (G Suite) |
|![dingding.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/29c53415-5a04-df4b-7d9d-333bf6615e0a.png)| [专属钉钉](https://www.aliyun.com/product/dingtalkpro) |                                                              |                        |                 |              |           |

## クラウド市場（云市场）

|icon|中国サイト|国際サイト|コメント|AWS|Azure|GCP|
|---|---|---|---|---|---|---|
|![cloudmarket.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/355017/2a68343e-fd04-2735-5b4e-ebd85f549072.png)| [云市场](https://market.aliyun.com/) | [Marketplace](https://marketplace.alibabacloud.com/) || [AWS Marketplace] | Azure Marketplace | Cloud Launcher |



<CommunityAuthor 
    author="Hironobu Ohara"
    self_introduction = "2019年にAlibaba Cloudを担当。Databaseや収集、分散処理、ETL、検索、分析、機械学習基盤の構築、運用等を経て、現在分散系をメインとしたビッグデータとデータベースを得意・専門とするデータエンジニア。 AlibabaCloud MVP。"
    imageUrl="https://avatars.githubusercontent.com/u/47152180?s=400&u=ed7d182ce541f6f0d83c54b7265136a375b24ad2&v=4"
    githubUrl="https://github.com/ohiro18"
/>


