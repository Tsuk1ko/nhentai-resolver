# nhentai-resolver
基于 Node.js 实现的 nhentai 本子信息解析，为以后的本子自动下载项目铺垫一下  
尚处于测试阶段，还有很多需要改进的内容  

用 Koa 框架和`async`、`await`的方法重写了一遍……  
看看之前的代码是真的回调地狱，现在终于像那么回事了  

学到了很多新东西，还是很开心的

## 项目情况
已经成熟，应该不会再进行其他太大的改动了

下一步是自动下载，该功能将在另一个项目中实现

## 部署
```bash
git clone https://github.com/YKilin/nhentai-resolver.git
cd nhentai-resolver
cp config.js.example config.js
npm install
```

## 配置
编辑`config.js`

### 监听端口
你可以修改监听端口，默认`8888`

### 缓存解析结果
在配置中将`enable_cache`设置为`true`，并配置数据库信息

数据库需要手动建立，但是表不需要，程序会帮你建立

## 使用
```bash
npm start
```

这里提供一个我搭建好的 API 供各位测试  
https://api.lolicon.app/nhentai/

### 解析单个本子
例如需要解析 https://nhentai.net/g/229687/ 的本子  
那么访问`http://yourip:8888/?gid=229687`即可

### 解析一整页本子
例如需要解析 https://nhentai.net/language/chinese/ 的所有本子  
那么访问`http://yourip:8888/?url=https://nhentai.net/language/chinese/`即可  
当然，只会解析当前这页，URL 是哪一页就解析哪一页，~~后期可能会考虑加一个批量页数解析~~，批量操作将在今后的本子下载项目中实现

由于一页本子数量很多（最多的情况下有25本），因此会花费比较长的时间

## 返回
解析结果会以 JSON 形式返回，像这样
```json
{
	"code": 0,
	"msg": {
		"time": 60
	},
	"results": [{
		"gid": 233022,
		"tittle1": "[100yenMoFA (Mirino)] Suwa Nee-chan ni Kawaigarareru Hon Suwa Shota Bangaihen 11 (Touhou Project) [Chinese] [CE家族社] [Digital]",
		"tittle2": "[100円外務省 (みりの)] すわ姉ちゃんにかわいがられる本 すわショタ番外編11 (東方Project) [中国翻訳] [DL版]",
		"tags": {
			"Parodies": ["touhou project"],
			"Characters": ["suwako moriya"],
			"Tags": ["lolicon", "stockings", "sole female", "sole male", "shotacon", "multiwork series"],
			"Artists": ["mirino"],
			"Groups": ["yenmofa"],
			"Languages": ["translated", "chinese"],
			"Categories": ["doujinshi"]
		},
		"pages": 32,
		"iid": 1223998,
		"cover": "https://t.nhentai.net/galleries/1223998/cover.jpg",
		"cache": true
	}]
}
```
 
| 键        | 类型      | 值含义                                                                                   |
| --------- | --------- | ---------------------------------------------------------------------------------------- |
| code      | int       | `0`:成功；`10`:出现了部分错误；`11`:完全错误；`20`:参数不正确                            |
| msg       | object    | 消息对象，默认为空对象`{}`，你可以在里面存放自己想放的消息，例如本示例存放了解析耗时(ms) |
| results   | object    | 结果数组，在解析单个本子的情况下数组长度为1                                              |
| tittle1   | string    | 本子名字（罗马音）                                                                       |
| tittle2   | string    | 本子名字（原始语言）                                                                     |
| tags      | object    | 标签                                                                                     |
| pages     | int       | 本子页数                                                                                 |
| iid       | int       | 本子图片ID                                                                               |
| cover     | string    | 本子封面缩略图                                                                           |
| cache     | boolean   | 只有开启了缓存功能才会有此项，`true`表示命中了缓存                                       |

### 关于本子图片ID
本子图片ID用于为本项目的自动下载功能做准备，或者你也可以以你自己的方式去利用

以上面的解析结果举例，本子原图都会是类似这样的 URL 格式
```
https://i.nhentai.net/galleries/1223998/1.jpg
https://i.nhentai.net/galleries/1223998/2.jpg
https://i.nhentai.net/galleries/1223998/3.jpg
...
https://i.nhentai.net/galleries/1223998/32.jpg
```
其中`1223998`即为本子图片ID

注意：本子图片格式并不是只有`jpg`（虽然大部分都是），还有可能是`png`甚至`gif`（有些汉化组会放一些gif进来……），在下载时如果遇到404就需要进行额外判断了

## ~~TODO~~ DONE!
- [x] 重写，优化代码结构
- [x] 增加解析结果涵盖范围
- [x] 使用 Mysql 缓存解析记录（可选）
