---
title: "日本から中国のWEBサイトを閲覧する"
metaTitle: "Nginx(Forward Proxy)とGAの組み合わせで日本から中国のWEBサイトを閲覧する"
metaDescription: "Nginx(Forward Proxy)とGAの組み合わせで日本から中国のWEBサイトを閲覧する"
date: "2020-09-15"
author: "sbc_yoshimura"
thumbnail: "/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915112921.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';


# はじめに

本記事では、Nginx でHTTPSを通せるForward Proxyを構築して、Global Accelerator（GA）でクライアントからForward Proxyへのアクセスを高速化する、ということをやってみます。


# 構成図と全体の流れ

目的は中国国内Webサイトを日本からスムーズに閲覧することです。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915112921.png "img")    


Nginx + Global Accelerator 構成図

苦慮したのは、どのようにForward ProxyでクライアントIPアドレスのみアクセス許可をするかでした。

最初にいくつか検討しました。

-   ECSのセキュリティグループだけで出来ないか
-   Alibaba Cloud 製オープンソースのカーネルモジュール TOA を使って、ECSのOSでアクセス制限出来ないか

など。

しかし、結果的には GA の Reserve Client IP address を有効化して、Nginx の設定でアクセス制限を掛けることで実現できました。

# １．Nginx と Alibaba Cloud の関係

Alibaba Cloud は中国国内のWEBサイトの多くで利用されています。

そして、Alibaba Cloud プロダクトの多くに Nginx が使われていることをご存知でしょうか。

例えば、SLB や Log Service は Nginx と公表されていますし、おそらく GA も Nginx が使われているのでは？と思います。

正確にはこれらは素のNginxではなく、Alibaba グループが Nginx をフォークした Tengine (Taobao-Engine の略)というオープンソースソフトウェアになっています。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915114241.png "img")    


ACT81002 Alibaba Cloud Technical Operations - SLB より

[tengine.taobao.org](http://tengine.taobao.org/)

そして、今回 Forward Proxy に Nginx を選んだのも Alibaba に関係があります。

Alibaba のエンジニアが Nginx で HTTPS 対応の Forward Proxy モジュールを開発しており、これを使うことにしました。

[github.com](https://github.com/chobits/ngx_http_proxy_connect_module)

# ２．Nginx で Foward Proxy 構築

まずは環境を整えて、Nginxのインストールを行います。

Nginxはモジュールを利用するためソースからビルドします。

OS : CentOS 7.8

Nginx : 1.14

```
yum update
yum -y install gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel git

wget http://nginx.org/download/nginx-1.14.0.tar.gz

tar -xzf nginx-1.14.0.tar.gz

git clone https://github.com/chobits/ngx_http_proxy_connect_module.git

cd nginx-1.14.0
patch -p1 < ../ngx_http_proxy_connect_module/patch/proxy_connect_rewrite_1014.patch

groupadd www
useradd -g www www

./configure --user=www --group=www --prefix=/usr/local/nginx --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-threads --add-module=../ngx_http_proxy_connect_module

make

make install

/usr/local/nginx/sbin/nginx -V
nginx version: nginx/1.14.0
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-39) (GCC)
built with OpenSSL 1.0.2k-fips  26 Jan 2017
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/usr/local/nginx --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-threads --add-module=/tmp/ngx_http_proxy_connect_module
```

以上でNginxのインストールは完了です。

続いて、Nginx の設定ファイルの作業をしていきます。

```
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx

vi /etc/init.d/nginx
```

```
#!/bin/sh











. /etc/rc.d/init.d/functions

. /etc/sysconfig/network

[ "$NETWORKING" = "no" ] && exit 0
nginx="/usr/local/nginx/sbin/nginx"
prog=$(basename $nginx)
NGINX_CONF_FILE="/usr/local/nginx/conf/nginx.conf"
[ -f /etc/sysconfig/nginx ] && . /etc/sysconfig/nginx
lockfile=/var/lock/subsys/nginx
make_dirs() {
   
   user=`$nginx -V 2>&1 | grep "configure arguments:" | sed 's/[^*]*--user=\([^ ]*\).*/\1/g' -`
   if [ -z "`grep $user /etc/passwd`" ]; then
       useradd -M -s /bin/nologin $user
   fi
   options=`$nginx -V 2>&1 | grep 'configure arguments:'`
   for opt in $options; do
       if [ `echo $opt | grep '.*-temp-path'` ]; then
           value=`echo $opt | cut -d "=" -f 2`
           if [ ! -d "$value" ]; then
               
               mkdir -p $value && chown -R $user $value
           fi
       fi
   done
}
start() {
    [ -x $nginx ] || exit 5
    [ -f $NGINX_CONF_FILE ] || exit 6
    make_dirs
    echo -n $"Starting $prog: "
    daemon $nginx -c $NGINX_CONF_FILE
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}
stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -QUIT
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}
restart() {
    configtest || return $?
    stop
    sleep 1
    start
}
reload() {
    configtest || return $?
    echo -n $"Reloading $prog: "
    killproc $nginx -HUP
    RETVAL=$?
    echo
}
force_reload() {
    restart
}
configtest() {
  $nginx -t -c $NGINX_CONF_FILE
}
rh_status() {
    status $prog
}
rh_status_q() {
    rh_status >/dev/null 2>&1
}
case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart|configtest)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
            ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}"
        exit 2
esac
```

```
chmod a+x /etc/init.d/nginx

chkconfig --add /etc/init.d/nginx

chkconfig nginx on
```

```


vi /usr/local/nginx/conf/nginx.conf
```

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {

     server {
         listen                         3128;
         allow            xxx.xxx.xxx.xxx; 
         deny            all;


         
         resolver                       100.100.2.136 100.100.2.138; 

         
         proxy_connect;
         proxy_connect_allow            443;
         proxy_connect_connect_timeout  5s;
         proxy_connect_read_timeout     5s;
         proxy_connect_send_timeout     5s;

         
         location / {
             proxy_pass http://$host;
             proxy_set_header Host $host;

         }
     }
}
```

以上がNginxの設定でした。

それでは準備ができたのでNginxを起動します。

```

systemctl start nginx

systemctl status nginx
```

# ３．GAの設定とReserve client IP addresses機能の有効化

Nginx のFoward Proxy はこのままでも使うことが出来ますが、日本と中国間のインターネット通信は不安定です。

そのため、クライアントとNginxの間を国際専用線サービス GA (Global Accelerator)で高速化していきます。

* インスタンス購入
* 基本帯域幅プラン購入
* クロスボーダー高速化帯域幅プラン購入

については割愛しますので、GAを初めて利用する方はこちらを参照してください。

[www.alibabacloud.com](https://www.alibabacloud.com/cloud-tech/ja/doc-detail/153189.htm)

それではGAの設定をご紹介していきます。

インスタンスの設定画面から、**「アクセラレーションエリアの追加」**をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115220.png "img")    



今回は日本から中国のFoward Proxyにアクセスするため、アクセラレーションエリアは**「アジア太平洋」**を選択、リージョンは**「日本(東京)」**を選択。

帯域は必要な分だけ割り当ててください。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115304.png "img")    


しばらくすると、 高速化IPアドレスが作成されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115331.png "img")    



 次にリスナーを作成します。

リスナータブから**「リスナーの追加」**をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115408.png "img")    



-   リスナー名 : 好きなものを
-   プロトコル : TCP
-   ポート番号 : 3128 (Nginxで設定したポート)
-   クライアントのアフィニティ: ソースIPアドレス

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115453.png "img")    


-    エンドポイントグループ名 : お好きなものを
-   リージョン : 中国(上海)   (ECSのリージョン)
-   バックエンドサービス : Alibaba Cloud
-   クライアントIPの予約 : 有効化　※これがReserve client IP addresses
-   エンドポイント (バックエンドサービスタイプ) : Alibaba Cloud のパブリックIPアドレス
-   エンドポイント (バックエンドサービス)  : ECSのパブリックIPアドレス

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115533.png "img")    


 GAの設定は以上です。

最後に、GAのエンドポイントグループIPと、クライアントのIPアドレスをECSのセキュリティグループに追加しましょう。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115614.png "img")    


![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115643.png "img")    


以上で設定が完了です。

こちらの絵が完成しました。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/WebApplication-tutorial/WebApplication-tutorial_images_26006613628167800/20200915115718.png "img")    


PCやスマホでプロキシの設定で、GAの高速化IPアドレスとポート3128を指定して、以下のサイトにアクセスしてみてください。

ECSのパブリックIPが表示されたら成功です。

[https://www.ugtop.com/spill.shtml](https://www.ugtop.com/spill.shtml)

また、Nginxのアクセスログには、GAのエンドポイントグループIPではなく、クライアントIPアドレスが記録されてるはずです。

```

==> logs/access.log <==
xxx.xxx.xxx.xxx - - [12/Sep/2020:10:49:12 +0800] "CONNECT p24-caldav.icloud.com:443 HTTP/1.1" 200 12181 "-" "Mac+OS+X/10.15.6 (19G2021) CalendarAgent/930.5.1"

==> logs/error.log <==
2020/09/12 10:49:13 [error] 24427
```

以上です。


# 最後に
本記事ではNginx でHTTPSを通せるForward Proxyを構築して、Global Accelerator（GA）でクライアントからForward Proxyへのアクセスを高速化する方法をご紹介いたしました。ご参考に頂ければ幸いです。

 <CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>





