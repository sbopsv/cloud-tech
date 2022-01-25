---
title: "Quota Center でクォータを管理"
metaTitle: "Alibaba Cloud の Quota Center でプロダクトのクォータを管理する"
metaDescription: "Alibaba Cloud の Quota Center でプロダクトのクォータを管理する"
date: "2020-12-10"
author: "sbc_yoshimura"
thumbnail: "/computing_images_26006613663231500/20210106184758.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## Alibaba Cloud の Quota Center でプロダクトのクォータを管理する

# はじめに

様々なプロダクトを利用していると、どのプロダクトをどれくらい利用しているのか把握が難しくなります。

例えば、ECSインスタンスを作ろうと思ったら、VPCかvSwitchかECS(CPU)かEIPの何かがクォータ上限に当たってしまってECSインスタンスを作成できなかった……、なんてこともあるかもしれません。

そこで今回は Alibaba Cloud の Quota Center をご紹介します。

# Alibaba Cloud 各プロダクトのクォータ上限申請

前述の通りAlibaba Cloud には各リージョンや、各プロダクトや、各リソース毎にクォータ上限が決められています。

例えばECSのクォータを調べるには、

ECSコンソール右端の「権限とクォータ」をクリック

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613663231500/20210106184758.png "img")    


表の合計クォータが上限数になります。

また、上限数を増やしたい場合には、サポートチケットから依頼をします。

こちらの依頼にサポートチケットが消費されるので、Basicプランでサポートチケットが切れている場合には困ってしまいます。(対応方法は後述します)

私の経験上では当日中には上限数が増やしてもらえます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613663231500/20201210191612.png "img")    


また、蛇足ですが、保証クォータという概念がありますが、全て0になってます。

> 保証クォータ内では高い成功率でリソースを作成できます。 保証クォータは無料で使用でき、増加はできません。 保証クォータは各月の初日に自動的に調整されます。 保証クォータは、前月のリソース使用量に基づいて増減します。

保証クォータの仕組みはユーザーに見えない形で以前から導入されていたようなのですが、そのうちユーザーにも見えるようになるのかもしれません。

他のプロダクトのクォータ管理を見てみましょう。

VPC、EIP、共有帯域幅、NAT Gateway、VPN Gateway についてはVPCコンソールでクォータを管理します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613663231500/20210106185036.png "img")    


また、こちらの場合にはサポートチケットを消費せずにクォータ上限の申請が可能です。

このように、プロダクトによってクォータ管理がバラバラなため、現在のクォータがどうなっているのか把握することも、申請方法が異なることも混乱する原因となっていると思います。

# Quota Center 

そこで出てきたのが Quota Center です。

[https://quotas.console.aliyun.com/products](https://quotas.console.aliyun.com/products)

いつから出てきたのか正確には分からないですが、おそらくApsara Conference 2020(9月)以降にリリースされたようです。

Quota Center では各プロダクトで制限しているクォータを一覧で確認することができます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613663231500/20210106185221.png "img")    


クォータ上限の申請も可能です。

先ほどECSコンソールからクォータ上限の申請にはサポートチケットを消費すると言いましたが、こちらからの申請ではサポートチケットを消費しません。こちらの方がお得ですね。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613663231500/20210106185432.png "img")    


使用率(%)や使用数の閾値を設定しておくと、SMSまたはメールアドレスに通知をしてくれます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613663231500/20210106185602.png "img")    


通知メールはこんな感じです。

AutoScalingを利用している方は設定をしておくとよいでしょう。 

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-computing/computing_images_26006613663231500/20210106185707.png "img")    


今回は以上です。


# 最後に

上記、Alibaba Cloud の Quota Center でプロダクトのクォータを管理する方法をご紹介しました。ご参考に頂ければ幸いです。    


<CommunityAuthor 
    author="吉村 真輝"
    self_introduction = "Alibaba Cloud プロフェッショナルエンジニア。中国ｘクラウドが得意。趣味は日本語ラップのDJ。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/yoshimura_pic.jpeg"
    githubUrl="https://github.com/masaki-coba"
/>


