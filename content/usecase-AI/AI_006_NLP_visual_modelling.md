---
title: "NLPのビジュアルモデリング機能"
metaTitle: "機械学習：ニューラルネットワークのビジュアルモデリング機能を使ってみた"
metaDescription: "機械学習：ニューラルネットワークのビジュアルモデリング機能を使ってみた"
date: "2020-03-16"
author: "sbc_hong"
thumbnail: "/AI_images_26006613533691300/20200311203710.png"
---

import CommunityAuthor from '../../src/CommunityAuthor.js';

## 機械学習：ニューラルネットワークのビジュアルモデリング機能を使ってみた


本記事では、AlibabaCloudが提供する機械学習PAI-DSWの『FastNeuralNetwork』機能について、ご紹介します。

複雑なディープラーニングネットワークは通常、数十行または数百行のコードで構成され、ネットワークの各層は以下に示すように多くのパラメーターで構成されます。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200311154952.png "参照")

レイヤーの数が増えると、コードを使用して深層学習ネットワークを構築することが難しくなり、維持および調整が困難になります。 FastNeuralNetwork機能は、ディープラーニング構成コードをワンクリックでネットワークアーキテクチャグラフに変換し、視覚的な編集を実現できます。これにより、以下に示すように、モデルの解釈性と保守性が大幅に向上します。

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200312134027.gif "参照")


これから、モデルを構築しながら、FastNeuralNetwork機能の使い方をご紹介します。

## 機械学習PAI-DSW：FastNeuralNetwork機能紹介

FastNeuralNetwork機能の使い方（KerasCodeとKerasGraph）

### １、プロジェクト作成
DSWを開いて、まずプロジェクトを作成します。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200312150307.png "参照")

現時点では、KerasCodeカーネルとKerasGraphカーネルのみがFastNeuralNetwork機能を実装しています。     
* KerasCode：ディープラーニングネットワークコードを記述してから、コードをグラフに変換できる。   
* KerasGraph：キャンバスから直接深層学習ネットワークを構築し、グラフをコードに変換できる。    

### ２、コードでモデルを構築
KerasCodeを開いて、以下のコードを書き込みます。    

```
import keras
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.initializers import VarianceScaling, Zeros
from keras.layers.core import Dense, Dropout, Activation  
from keras.optimizers import SGD  
from keras.datasets import mnist  
import numpy 
import matplotlib.pyplot as plt

'''

#### 2-1、モデルを選ぶ

'''
model = Sequential()
'''

#### 2-2、ニューラルネットワークの構築
'''

model.add(Dense(bias_initializer=Zeros(), batch_input_shape=(None, 784), dtype='float32', use_bias=True, units=500, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))

model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=500, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))

model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=10, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='softmax', trainable=True))
```

上のコードにはSequentialモデルが組み込まれており、モデルオブジェクトはmodelです。下のMagicCommandと入力すると、コードをグラフに変換できます。

```
%show_model model
```

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200311180032.png "参照")

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200311180215.png "参照")


#### 2-3、モデル学習させる
モデルが完了したら、トレニーングコードを補完して、早速学習させてみます。

結果は以下となります。

```
import keras
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.initializers import VarianceScaling, Zeros
from keras.layers.core import Dense, Dropout, Activation  
from keras.optimizers import SGD  
from keras.datasets import mnist  
import numpy 
import matplotlib.pyplot as plt

'''
    １、モデルを選ぶ
'''
model = Sequential()
'''
   ２、ニューラルネットワークの構築
'''

model.add(Dense(bias_initializer=Zeros(), batch_input_shape=(None, 784), dtype='float32', use_bias=True, units=500, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))

model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=500, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))

model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=10, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='softmax', trainable=True))

'''
   ３、コンパイル
'''
sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True) # 优化函数，设定学习率（lr）等参数  
model.compile(loss='categorical_crossentropy', optimizer=sgd) # 使用交叉熵作为loss函数

'''
   ４、Training
　
'''
(X_train, y_train), (X_test, y_test) = mnist.load_data() # 使用Keras自带的mnist工具读取数据（第一次需要联网）
# 由于mist的输入数据维度是(num, 28, 28)，这里需要把后面的维度直接拼起来变成784维  
X_train = X_train.reshape(X_train.shape[0], X_train.shape[1] * X_train.shape[2]) 
X_test = X_test .reshape(X_test.shape[0], X_test.shape[1] * X_test.shape[2])  
Y_train = (numpy.arange(10) == y_train[:, None]).astype(int) 
Y_test = (numpy.arange(10) == y_test[:, None]).astype(int)
```


```
print(X_train.shape)
print(Y_train.shape)

>
(60000, 784)
(60000, 10)
```

```
%show_model model

>
<IPython.display.DswJSON object>
```

```
model.fit(X_train,Y_train,batch_size=512,epochs=500,shuffle=True,verbose=1,validation_split=0.3)
model.evaluate(X_test, Y_test, batch_size=200, verbose=0)
Train on 42000 samples, validate on 18000 samples
Epoch 1/500
42000/42000 [==============================] - 2s 36us/step - loss: 0.9255 - val_loss: 0.4140
Epoch 2/500
42000/42000 [==============================] - 0s 8us/step - loss: 0.6073 - val_loss: 0.3966
Epoch 3/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.5772 - val_loss: 0.3560
Epoch 4/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.5465 - val_loss: 0.3309
Epoch 5/500
省略
Epoch 499/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.1288 - val_loss: 0.1019
Epoch 500/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.1292 - val_loss: 0.1037

>
0.08958022410748527
```

```
#   ５、アウトプット
print("test set")
scores = model.evaluate(X_test,Y_test,batch_size=200,verbose=0)
print("")
print("The test loss is %f" % scores)
result = model.predict(X_test,batch_size=200,verbose=0)
 
result_max = numpy.argmax(result, axis = 1)
test_max = numpy.argmax(Y_test, axis = 1)
 
result_bool = numpy.equal(result_max, test_max)
true_num = numpy.sum(result_bool)
print("")
print("")
print("The accuracy of the model is %f" % (true_num/len(result_bool)))

>
test set
The test loss is 0.089580
The accuracy of the model is 0.971800
```

#### 2-4、ニューラルネットワーク編集

FNN機能は、KerasのCellをキャンバスにドラッグして編集する機能を実装しております。キャンバスは、Cellリストフィルード、キャンバス編集フィルード、およびパラメーター構成フィルードに分かれています。    

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200311202307.png "参照")

同じ機能を持つセルは自動的にグループに配置されます：

https://img.alicdn.com/tfs/TB1FldUQhnaK1RjSZFtXXbC2VXa-351-338.png

キャンバスのコンポーネントは、コードで自動的にマッピングされます：

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200311202932.png "参照")

キャンバスでCellまたは関係を選択してバックスペースキーを押すと、キャンバスまたは関係を削除できます。    
今回は入力層と中間層のUnitsを500から784に変更してみます。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200311203710.png "参照")

編集が終わったら、左上の「To Code」ボタンを押すと、以下のウィンドウをポップアップします。これにより、キャンバスの変更によってコードにどのような変更が生じるかがわかります。     

![img](https://raw.githubusercontent.com/sbopsv/cloud-tech/master/content/usecase-AI/AI_images_26006613533691300/20200311204515.png "参照")

[OK]をクリックして、元のコードファイルに新しいモデル構築コードを生成します。    

新しく生成したコードは以下となります。    

```
import keras
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.initializers import VarianceScaling, Zeros

model = Sequential()
model.add(Dense(bias_initializer=Zeros(), batch_input_shape=(None, 784), dtype='float32', use_bias=True, units=784, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))
model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=784, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))
model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=10, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='softmax', trainable=True))
```

#### 2-5、新しく生成したモデルを学習させてみます。
結果は以下となります。

```
import keras
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.initializers import VarianceScaling, Zeros
from keras.layers.core import Dense, Dropout, Activation  
from keras.optimizers import SGD  
from keras.datasets import mnist  
import numpy 
import matplotlib.pyplot as plt

'''
    １、モデルを選ぶ
'''
model = Sequential()
'''
   ２、ニューラルネットワークの構築
'''

model.add(Dense(bias_initializer=Zeros(), batch_input_shape=(None, 784), dtype='float32', use_bias=True, units=784, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))
model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=784, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='tanh', trainable=True))
model.add(Dropout(rate=0.4, trainable=True))
model.add(Dense(bias_initializer=Zeros(), use_bias=True, units=10, trainable=True, kernel_initializer=VarianceScaling(mode='fan_avg', seed=None, scale=1.0, distribution='uniform'), activation='linear'))
model.add(Activation(activation='softmax', trainable=True))


'''
   ３、コンパイル
'''
sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True) 
model.compile(loss='categorical_crossentropy', optimizer=sgd)  

'''
   ４、Training
　
'''
(X_train, y_train), (X_test, y_test) = mnist.load_data() 
X_train = X_train.reshape(X_train.shape[0], X_train.shape[1] * X_train.shape[2]) 
X_test = X_test .reshape(X_test.shape[0], X_test.shape[1] * X_test.shape[2])  
Y_train = (numpy.arange(10) == y_train[:, None]).astype(int) 
Y_test = (numpy.arange(10) == y_test[:, None]).astype(int)
```

```
print(X_train.shape)
print(Y_train.shape)

>
(60000, 784)
(60000, 10)
```

```
%show_model model

>
<IPython.display.DswJSON object>
```

```
model.fit(X_train,Y_train,batch_size=512,epochs=500,shuffle=True,verbose=1,validation_split=0.3)
model.evaluate(X_test, Y_test, batch_size=200, verbose=0)
Train on 42000 samples, validate on 18000 samples
Epoch 1/500
42000/42000 [==============================] - 2s 36us/step - loss: 0.8335 - val_loss: 0.3906
Epoch 2/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.5516 - val_loss: 0.3624
Epoch 3/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.5094 - val_loss: 0.3193
Epoch 4/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.4857 - val_loss: 0.3106
Epoch 5/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.4670 - val_loss: 0.3025
Epoch 6/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.4418 - val_loss: 0.2995
Epoch 7/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.4245 - val_loss: 0.2762
Epoch 8/500

省略

Epoch 498/500
42000/42000 [==============================] - 0s 10us/step - loss: 0.0944 - val_loss: 0.0896
Epoch 499/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.0943 - val_loss: 0.0898
Epoch 500/500
42000/42000 [==============================] - 0s 9us/step - loss: 0.0956 - val_loss: 0.0889

>
0.08254869665252045
```

```
'''
    ５、アウトプット
'''
print("test set")
scores = model.evaluate(X_test,Y_test,batch_size=200,verbose=0)
print("")
print("The test loss is %f" % scores)
result = model.predict(X_test,batch_size=200,verbose=0)
 
result_max = numpy.argmax(result, axis = 1)
test_max = numpy.argmax(Y_test, axis = 1)
 
result_bool = numpy.equal(result_max, test_max)
true_num = numpy.sum(result_bool)
print("")
print("")
print("The accuracy of the model is %f" % (true_num/len(result_bool)))

>
test set
The test loss is 0.082549
The accuracy of the model is 0.975000
```

## 最後に
シンプルなモデルの構築、グラフ化、直感的な編集を通じて、FastNeuralNetwork機能を紹介しました。コードをワンクリックでグラフに変換し、視覚的な編集ができることにより、モデルの解釈性と保守性が大幅に向上しました。    


 <CommunityAuthor 
    author="洪亜龍"
    self_introduction = "2018年からPythonやJavaScriptをはじめとするAIやサービス基盤中心のバックエンド開発を担当。Alibaba Cloud、Google Cloudが得意。"
    imageUrl="https://raw.githubusercontent.com/sbopsv/cloud-tech/master/src/components/images/hon.png"
    githubUrl="https://github.com/alonhung"
/>



