# nhentai-resolution
基于 Node.js 实现的 nhentai 本子信息解析，为以后的本子自动下载项目铺垫一下  
尚处于测试阶段，还有很多需要改进的内容  

用 Koa 框架和`async`、`await`的方法重写了一遍……  
看看之前的代码是真的回调地狱，现在终于像那么回事了  

学到了很多新东西，还是很开心的

## 部署
```bash
git clone https://github.com/YKilin/nhentai-resolution.git
cd nhentai-resolution
npm install
```

## 使用
```bash
npm start
```
默认监听`8888`端口，需要修改的话请编辑`app.js`

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
	"code": 0,
	"time": 1103,
	"results": [{
		"gid": "232979",
		"tittle1": "(C78) [Yume no Kyoukai (Suzuneko.)] Kougetsu Shimai - Ni no Tsuki (Touhou Project) [Chinese] [冴月麟个人汉化]",
		"tittle2": "(C78) [夢の境界 (Suzu猫。)] 紅月姉妹 弐の月 (東方Project) [中国翻訳]",
		"pages": 16,
		"iid": "1223811"
	}]
}
```
 
| 键        | 值含义                                              |
| --------- | --------------------------------------------------- |
| code      | 0:成功,10:出现了部分错误,11:完全错误,20:参数不正确  |
| time      | 解析耗时                            |
| results   | 结果数组，在解析单个本子的情况下数组长度为1         |
| tittle1   | 本子名字（罗马音）                                  |
| tittle2   | 本子名字（原始语言）                                |
| pages     | 本子页数                                            |
| iid       | 本子图片ID                                          |

### 关于本子图片ID
本子原图都会是类似这样的 URL 格式
```
https://i.nhentai.net/galleries/1223811/1.jpg
https://i.nhentai.net/galleries/1223811/2.jpg
https://i.nhentai.net/galleries/1223811/3.jpg
...
https://i.nhentai.net/galleries/1223811/26.jpg
```
其中`1223811`即为本子图片ID  

注意：本子图片格式并不是只有`jpg`，还有可能是`png`甚至`gif`（有些汉化组会放一些gif进来……），在下载时如果遇到404就需要进行额外判断了

## TODO
- [x] 重写，优化代码结构
- [x] 优化解析结果表示
- [ ] 加入 Mysql 数据库操作，缓存解析记录（可选）
- [ ] 自动下载模块
- [ ] 下载完成后访问回调 URL
