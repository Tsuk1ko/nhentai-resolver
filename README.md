# nhentai-resolution
基于 Node.js 实现的 nhentai 本子信息解析，为以后的本子自动下载项目铺垫一下  
尚处于测试阶段，还有很多需要改进的内容  
（我知道我代码写的很烂啦~

## 需求
### cheerio
https://github.com/cheeriojs/cheerio
```bash
npm install cheerio
```

## 使用
```bash
node server.js
```
默认监听`8888`端口，需要修改的话请编辑`server.js`  

### 解析单个本子
例如需要解析`https://nhentai.net/g/229687/`的本子  
那么访问`http://yourip:8888/?gid=229687`即可

### 解析一整页本子
例如需要解析`https://nhentai.net/language/chinese/`的所有本子  
那么访问`http://yourip:8888/?url=https://nhentai.net/language/chinese/`即可  
当然，只会解析当前这页，URL 是哪一页就解析哪一页，后期可能会考虑加一个批量页数解析

## 返回
解析结果会以 JSON 形式返回，像这样
```json
{
    "error": 0,
    "msg": "成功",
    "results": [{
            "tittle1": "(C92) [circle six (Rokusyou Kokuu)] Nandemo to wa Itta kedo... (Fate/Grand Order) [Chinese] [酱油水月月]",
            "tittle2": "(C92) [circle six (緑青黒羽)] なんでもとはいったけど… (Fate/Grand Order) [中国翻訳]",
            "pages": 26,
            "imgID": "1208826"
        }
    ]
}
```
 
| 键      | 值含义                                            |
|---------|---------------------------------------------------|
| error   | 无错误为0                             |
| msg     | 信息                                              |
| results | 结果数组，在解析单个本子的情况下数组长度不会大于1 |
| tittle1 | 本子名字（罗马音）                                |
| tittle2 | 本子名字（原始语言）                              |
| pages   | 本子页数                                          |
| imgID   | 本子图片ID                                        |

### 关于本子图片ID
本子原图都会是类似这样的 URL 格式
```
https://i.nhentai.net/galleries/1208826/1.jpg
https://i.nhentai.net/galleries/1208826/2.jpg
https://i.nhentai.net/galleries/1208826/3.jpg
...
https://i.nhentai.net/galleries/1208826/26.jpg
```
其中`1208826`即为本子图片ID  

注意：本子图片格式并不是只有`jpg`，还有可能是`png`甚至`gif`（有些汉化组有时候会放一些搞笑的gif进来……），在下载时如果遇到404就需要进行额外判断了

## TODO
1. 解析结果表示可能会考虑做出一些改变
1. 加入 Mysql 数据库操作，缓存解析记录
