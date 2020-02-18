## 前端Mock数据

#### 一、时常面临的尴尬

​        前端开发依赖于后端接口数据，但是后台人员不足或者无法立即到位，前端迟迟不能开工，或者前端小哥哥、小姐姐自己参照ui设计图，完成对应的静态页面（没有数据交互），待后台人员到位，再进行二次开发，协助完成接口对接。

#### 二、mock数据

##### 1、什么是mock数据？

前后端同时开发的时候，后端接口数据没有出来，前端可以mock假数据，模拟开发；

##### 2、mock数据的优势

###### A 团队可以并行工作

有了Mock，前后端人员只需要定义好接口文档就可以开始并行工作，互不影响，只在最后的联调阶段往来密切；后端与后端之间如果有接口耦合，也同样能被Mock解决；测试过程中如果遇到依赖接口没有准备好，同样可以借助Mock；不会出现一个团队等待另一个团队的情况。这样的话，开发自测阶段就可以及早开展，从而发现缺陷的时机也提前了，有利于整个产品质量以及进度的保证。

###### B 开启TDD模式，即测试驱动开发

单元测试是TDD实现的基石，而TDD经常会碰到协同模块尚未开发完成的情况，但是有了mock，这些一切都不是问题。当接口定义好后，测试人员就可以创建一个Mock，把接口添加到自动化测试环境，提前创建测试。
可以模拟那些无法访问的资源
比如说，你需要调用一个“墙”外的资源来方便自己调试，就可以自己Mock一个。

###### C 隔离系统

假如我们需要调用一个post请求，为了获得某个响应，来看当前系统是否能正确处理返回的“响应”，但是这个post请求会造成数据库中数据的污染，那么就可以充分利用Mock，构造一个虚拟的post请求，我们给他指定返回就好了

###### D 可以用来演示

假如我们需要创建一个演示程序，并且做了简单的UI，那么在完全没有开发后端服务的情况下，也可以进行演示。说到演示了，假如你已经做好了一个系统，并且需要给客户进行演示，但是里面有些真实数据并不想让用户看到，那么同样，你可以用Mock接口把这些敏感信息接口全部替换。

###### E 测试覆盖度

假如有一个接口，有100个不同类型的返回，我们需要测试它在不同返回下，系统是否能够正常响应，但是有些返回在正常情况下基本不会发生，难道你要千方百计地给系统做各种手脚让他返回以便测试吗？比如，我们需要测试在当接口发生500错误的时候，app是否崩溃，别告诉我你一定要给服务端代码做些手脚让他返回500 。。。而使用mock，这一切就都好办了，想要什么返回就模拟什么返回，妈妈再也不用担心我的测试覆盖度了

##### 3、最理想的模式

\-  前后端在需求分解之后，一起定义好接口api，包含：请求url（项目前缀+具体的接口名称）、请求方式、请求参数、数据响应；

\-  前端研发人员根据接口约定，模拟请求返回对应的数据，完成对应的交互；

\- 后台人员根据接口约定，完成对应的api，并完成对应的自测；

\- 待后台人员交付接口api后，前端人员直接修改接口项目前缀，切换到对应的环境，即可进入项目提测。

#### 三、mock数据的基础语法

#### [Mock.js](http://mockjs.com/examples.html)

不需要修改既有代码，就可以拦截 Ajax 请求，返回模拟的响应数据

#### [![捕获](C:\Users\聪波小样儿\Desktop\捕获.PNG)](http://mockjs.com/examples.html)

#### 1、语法规范：

###### 数据模板定义规范：（Data Template Definition，简称DTD）

数据模板中的每个属性由 3 部分构成：**属性名、生成规则、属性值**：

```js
// 属性名   name
// 生成规则 rule
// 属性值   value
'name|rule': value
```

**注意：**

- *属性名* 和 *生成规则* 之间用竖线 `|` 分隔。

- *生成规则* 是可选的。

- 生成规则

  有 7 种格式：

  1. `'name|min-max': value`      //随机取min-max之间的值
  2. `'name|count': value`
  3. `'name|min-max.dmin-dmax': value`      //随机取值，有小数点
  4. `'name|min-max.dcount': value`      //随机取出，有确定几位小数点
  5. `'name|count.dmin-dmax': value`
  6. `'name|count.dcount': value`
  7. `'name|+step': value`      //自增的值

- **生成规则 的 含义 需要依赖 属性值的类型 才能确定。**

- *属性值* 中可以含有 `@占位符`。

- *属性值* 还指定了最终值的初始值和类型。

**生成规则和示例：**

##### 1. 属性值是字符串 **String**

1. `'name|min-max': string`

   通过重复 `string` 生成一个字符串，重复次数大于等于 `min`，小于等于 `max`。

2. `'name|count': string`

   通过重复 `string` 生成一个字符串，重复次数等于 `count`。

##### 2. 属性值是数字 **Number**

1. `'name|+1': number`

   属性值自动加 1，初始值为 `number`。

2. `'name|min-max': number`

   生成一个大于等于 `min`、小于等于 `max` 的整数，属性值 `number` 只是用来确定类型。

3. `'name|min-max.dmin-dmax': number`

   生成一个浮点数，整数部分大于等于 `min`、小于等于 `max`，小数部分保留 `dmin` 到 `dmax` 位。

```js
Mock.mock({
    'number1|1-100.1-10': 1,
    'number2|123.1-10': 1,
    'number3|123.3': 1,
    'number4|123.10': 1.123
})
// =>
{
    "number1": 91.9158375,
    "number2": 123.315478278,
    "number3": 123.745,
    "number4": 123.1232246324
}
```

##### 3. 属性值是布尔型 **Boolean**

1. `'name|1': boolean`

   随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率同样是 1/2。

2. `'name|min-max': value`

   随机生成一个布尔值，值为 `value` 的概率是 `min / (min + max)`，值为 `!value` 的概率是 `max / (min + max)`。

##### 4. 属性值是对象 **Object**

1. `'name|count': object`

   从属性值 `object` 中随机选取 `count` 个属性。

2. `'name|min-max': object`

   从属性值 `object` 中随机选取 `min` 到 `max` 个属性。

##### 5. 属性值是数组 **Array**

1. `'name|1': array`

   从属性值 `array` 中随机选取 1 个元素，作为最终值。

2. `'name|+1': array`

   从属性值 `array` 中顺序选取 1 个元素，作为最终值。

3. `'name|min-max': array`

   通过重复属性值 `array` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`。

4. `'name|count': array`

   通过重复属性值 `array` 生成一个新数组，重复次数为 `count`。

##### 6. 属性值是函数 **Function**

1. `'name': function`

   执行函数 `function`，取其返回值作为最终的属性值，函数的上下文为属性 `'name'` 所在的对象。

##### 7. 属性值是正则表达式 **RegExp**

1. `'name': regexp`

   根据正则表达式 `regexp` 反向生成可以匹配它的字符串。用于生成自定义格式的字符串。

```js
Mock.mock({
    'regexp1': /[a-z][A-Z][0-9]/,
    'regexp2': /\w\W\s\S\d\D/,
    'regexp3': /\d{5,10}/
})
// =>
{
    "regexp1": "pJ7",
    "regexp2": "F)\fp1G",
    "regexp3": "561659409"
}
```

###### 数据占位符定义规范（Data Placeholder Definition，简称DPD）

*占位符* 只是在属性值字符串中占个位置，并不出现在最终的属性值中。

*占位符* 的格式为：

```
@占位符
@占位符(参数 [, 参数])
```

**注意：**

1. 用 `@` 来标识其后的字符串是 *占位符*。
2. *占位符* 引用的是 `Mock.Random` 中的方法。
3. 通过 `Mock.Random.extend()` 来扩展自定义占位符。
4. *占位符* 也可以引用 *数据模板* 中的属性。
5. *占位符* 会优先引用 *数据模板* 中的属性。
6. *占位符* 支持 *相对路径* 和 *绝对路径*。

```js
Mock.mock({
    name: {
        first: '@FIRST',
        middle: '@FIRST',
        last: '@LAST',
        full: '@first @middle @last'
    }
})
// =>
{
    "name": {
        "first": "Betty",
        "middle": "Nancy",
        "last": "Lewis",
        "full": "Betty Nancy Lewis"
    }
}
```

#### 2、Mock.mock( )  

#### 根据数据模板生成模拟数据。

#### Mock.mock( template )

根据数据模板生成模拟数据。

#### Mock.mock( url, template )

记录数据模板。当拦截到匹配 `url` 的 Ajax 请求时，将根据数据模板 `template` 生成模拟数据，并作为响应数据返回。

#### Mock.mock( url, function( options ) )

记录用于生成响应数据的函数。当拦截到匹配 `url` 的 Ajax 请求时，函数 `function(options)` 将被执行，并把执行结果作为响应数据返回。

#### Mock.mock( url, type, template )

记录数据模板。当拦截到匹配 `url` 和 `type` 的 Ajax 请求时，将根据数据模板 `template` 生成模拟数据，并作为响应数据返回。

#### Mock.mock( url, type, function( options ) )

记录用于生成响应数据的函数。当拦截到匹配 `url` 和 `type` 的 Ajax 请求时，函数 `function(options)` 将被执行，并把执行结果作为响应数据返回。

#### url

可选。

表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 `/\/domain\/list\.json/`、`'/domian/list.json'`。

#### type

可选。

表示需要拦截的 Ajax 请求类型。例如 `GET`、`POST`、`PUT`、`DELETE` 等。

#### template

可选。

表示数据模板，可以是对象或字符串。例如 `{ 'data|1-10':[{}] }`、`'@EMAIL'`。

#### function(options)

可选。

表示用于生成响应数据的函数。

#### options

指向本次请求的 Ajax 选项集，含有 `url`、`type` 和 `body` 三个属性，参见 [XMLHttpRequest 规范](https://xhr.spec.whatwg.org/)。

> 从 1.0 开始，Mock.js 通过覆盖和模拟原生 XMLHttpRequest 的行为来拦截 Ajax 请求，不再依赖于第三方 Ajax 工具库（例如 jQuery、Zepto 等）。

#### 3、Mock.setup( settings ) 

#### 配置拦截 Ajax 请求时的行为。支持的配置项有：`timeout`。

#### settings

必选。

配置项集合。

#### timeout

可选。

指定被拦截的 Ajax 请求的响应时间，单位是毫秒。值可以是正整数，例如 `400`，表示 400 毫秒 后才会返回响应内容；也可以是横杠 `'-'` 风格的字符串，例如 `'200-600'`，表示响应时间介于 200 和 600 毫秒之间。默认值是`'10-100'`。

```js
Mock.setup({
    timeout: 400
})
Mock.setup({
    timeout: '200-600'
})
```

> 目前，接口 `Mock.setup( settings )` 仅用于配置 Ajax 请求，将来可能用于配置 Mock 的其他行为。

#### 4、Mock.Random  

#### 一个工具类，用于生成各种随机数据。

**Mock.Random 的方法在数据模板中称为『占位符』，书写格式为 @占位符(参数 [, 参数]) 。**

```js
var Random = Mock.Random
Random.email()  // => "n.clark@miller.io"

Mock.mock('@email')  // => "y.lee@lewis.org"

Mock.mock( { email: '@email' } )  // => { email: "v.lewis@hall.gov" }
```

**注意**

#### 方法

Mock.Random 提供的完整方法（占位符）如下：

| Type          | Method                                                       |
| ------------- | ------------------------------------------------------------ |
| Basic         | boolean, natural, integer, float, character, string, range, date, time, datetime, now |
| Image         | image, dataImage                                             |
| Color         | color                                                        |
| Text          | paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle |
| Name          | first, last, name, cfirst, clast, cname                      |
| Web           | url, domain, email, ip, tld                                  |
| Address       | area, region                                                 |
| Helper        | capitalize, upper, lower, pick, shuffle                      |
| Miscellaneous | guid, id                                                     |

```js
// Basic
// 1、boolean
Random.boolean()
Mock.mock('@boolean')
Mock.mock('@boolean()')

Random.boolean(1, 9, true) // 结果为true的概率为 min/(min + max)
Mock.mock('@boolean(1, 9, true)')

// 2、natural
Random.natural() //默认返回一个大于等于0的正整数
Random.natural( min ) //指示随机自然数的最小值。默认值为 0。
Random.natural( min, max ) //指示随机自然数的最小值、最大值。

// 3、integer
Random.integer() // 返回一个随机的整数。
Random.integer( min ) // 指示随机整数的最小值。
Random.integer( min, max ) // 指示随机整数的最小值、最大值。

// 4、float
// min:整数部分的最小值  max:整数部分的最大值
// dmin:小数部分位数的最小值，默认值为 0  dmax:小数部分位数的最大值，默认值为 17
Random.float() // 返回一个随机的浮点数
Random.float( min ) // 
Random.float( min, max )
Random.float( min, max, dmin )
Random.float( min, max, dmin, dmax )

// 5、Random.character( pool )
Random.character() // 没填字符池时，返回一个随机字符
Random.character( 'lower/upper/number/symbol' ) // 多个字符池时用“/”分隔

pool 字符串。表示字符池，填写时将从中选择一个字符返回。
{
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    number: "0123456789",
    symbol: "!@#$%^&*()[]"
}

// 6、Random.string( pool, min, max ) pool表示字符池，同上
// min:随机字符串的最小长度  max:随机字符串的最大长度
Random.string()
Random.string( length )
Random.string( pool, length )
Random.string( min, max )
Random.string( pool, min, max )

// 7、Random.range( start, stop, step )  返回一个整型数组。
//start:数组中整数的起始值(包含) stop:数组中整数的结束值(不包含) step:数组中整数之间的步长。默认为1。
Random.range(1, 10, 3) // [1,4,7]

//8、date
Random.date( format )  //format 需要的时间格式
Mock.mock('@date("yyyy-MM-dd")')  // "2006-10-18"
Mock.mock('@date("yyyy yy y MM M dd d")') // "2010 10 10 11 11 28 28"

// 9、time
Random.time()  // "02:57:26"
Random.time('A HH:mm:ss') //"AM 07:08:25"
Random.time('a HH:mm:ss') //"am 00:30:14"
Random.time('HH:mm:ss') //"06:20:13"
Random.time('H:m:s') //"5:53:17"

// 10、datetime
Random.datetime('yyyy-MM-dd A HH:mm:ss') // "2010-02-01 PM 19:52:01"
Random.datetime('yy-MM-dd a HH:mm:ss') //"98-11-02 am 09:39:25"
Random.datetime('y-MM-dd HH:mm:ss') //"07-02-01 00:50:23"
Random.datetime('y-M-d H:m:s') //"03-1-1 4:55:48"

// 11、now
Random.now( unit, format )
Random.now() // "2020-02-10 22:31:42"
Random.now('year') // "2020-01-01 00:00:00"
Random.now('month') // "2020-02-01 00:00:00"
Random.now('week') // "2020-02-09 00:00:00"
Random.now('day') // "2020-02-10 00:00:00"
Random.now('hour') // "2020-02-10 22:00:00"
Random.now('minute')  //"2020-02-10 22:31:00"
Random.now('second') //"2020-02-10 22:31:42"

Random.now('yyyy-MM-dd HH:mm:ss SS') // "2020-02-10 22:31:42 757"
Random.now('day', 'yyyy-MM-dd HH:mm:ss SS') // "2020-02-10 22:38:14 000"
```

```js
// Image图片
//1、Random.image( size?, background?, foreground?, format?, text? )生成一个随机的图片地址。
size
可选。
指示图片的宽高，格式为 '宽x高'。默认从下面的数组中随机读取一个：

[
    '300x250', '250x250', '240x400', '336x280', 
    '180x150', '720x300', '468x60', '234x60', 
    '88x31', '120x90', '120x60', '120x240', 
    '125x125', '728x90', '160x600', '120x600', 
    '300x600'
]
background
可选。
指示图片的背景色。默认值为 '#000000'。

foreground
可选。
指示图片的前景色（文字）。默认值为 '#FFFFFF'。

format
可选。
指示图片的格式。默认值为 'png'，可选值包括：'png'、'gif'、'jpg'。

text
可选。
指示图片上的文字。默认值为参数 size。
Random.image('200x100', '#02adea', 'Hello')
// => "http://dummyimage.com/200x100/02adea&text=Hello"

//2、Random.dataImage( size?, text? )
// 生成一段随机的 Base64 图片编码。
```

```js
// color
Random.color()  // => "#3538B2"
Random.hex()  // => "#3538B2"
Random.rgb()  //=>"rgb(242, 198, 121)"
Random.rgba() // => "rgba(242, 198, 121, 0.13)"
Random.hsl()  // => "hsl(345, 82, 71)"

// text
Random.paragraph( min?, max? )  // 随机生成一段文本
Random.cparagraph( min?, max? )  // 随机生成一段中文文本
Random.sentence( min?, max? )  //随机生成一个句子，第一个单词的首字母大写。
Random.csentence( min?, max? )  //随机生成一段中文文本
Random.word( min?, max? )  //随机生成一个单词。
Random.cword( pool?, min?, max? )  //随机生成一个汉字。
Random.title( min?, max? )  // 随机生成一句标题，其中每个单词的首字母大写。
Random.ctitle( min?, max? )  // 随机生成一句中文标题。

// name
Random.first() //随机生成一个常见的英文名。
Random.last() //随机生成一个常见的英文姓。
Random.name( middle? )  //随机生成一个常见的英文姓名。middle可选，布尔值，指示是否生成中间名。
Random.cfirst() //随机生成一个常见的中文姓。
Random.clast() // 随机生成一个常见的中文名。
Random.cname()  // 随机生成一个常见的中文姓名。
```

```js
// web
Random.url( protocol?, host? )  
// 随机生成一个 URL。protocol:指定 URL 协议。例如 http。host指定 URL 域名和端口号。如nuysoft.com。
Random.protocol() 
// 随机生成一个 URL 协议。返回以下值之一：'http'、'ftp'、'gopher'、'mailto'、'mid'、'cid'、'news'、'nntp'、'prospero'、'telnet'、'rlogin'、'tn3270'、'wais'。
Random.domain() // 随机生成一个域名。
Random.tld() // 随机生成一个顶级域名（Top Level Domain）。
Random.email( domain? ) //随机生成一个邮件地址。
Random.ip() // 随机生成一个 IP 地址。
```

```js
// address
Random.region()  // 随机生成一个（中国）大区。
Random.province() // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
Random.city( prefix? )
/*
Random.city()
Random.city( prefix )
随机生成一个（中国）市。
prefix
可选。
布尔值。指示是否生成所属的省。
Random.city()
// => "唐山市"
Random.city(true)
// => "福建省 漳州市"
*/
            
Random.county( prefix? )
/*
Random.county()
Random.county( prefix )
随机生成一个（中国）县。
prefix
可选。
布尔值。指示是否生成所属的省、市。
Random.county()
// => "上杭县"
Random.county(true)
// => "甘肃省 白银市 会宁县"
*/
            
Random.zip()
//随机生成一个邮政编码（六位数字）。
Random.zip()
// => "908812"
```

```js
// helper
Random.capitalize( word )  // 把字符串的第一个字母转换为大写。
Random.upper( str ) // 把字符串转换为大写。
Random.lower( str ) //把字符串转换为小写。
Random.pick( arr ) // 从数组中随机选取一个元素，并返回。
Random.shuffle( arr ) // 打乱数组中元素的顺序，并返回。

// Miscellaneous 混杂的
Random.guid()  // 随机生成一个 GUID。
Random.id()  // 随机生成一个 18 位身份证。
Random.increment( step? ) // 生成一个全局的自增整数。
```



#### 扩展

Mock.Random 中的方法与数据模板的 `@占位符` 一一对应，在需要时还可以为 Mock.Random 扩展方法，然后在数据模板中通过 `@扩展方法` 引用。例如：

```js
Random.extend({
    constellation: function(date) {
        var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
        return this.pick(constellations)
    }
})
Random.constellation()
// => "水瓶座"
Mock.mock('@CONSTELLATION')
// => "天蝎座"
Mock.mock({
    constellation: '@CONSTELLATION'
})
// => { constellation: "射手座" }
```

#### 5、Mock.valid( template, data)  

#### 校验真实数据 `data` 是否与数据模板 `template` 匹配。

#### template

必选。

表示数据模板，可以是对象或字符串。例如 `{ 'list|1-10':[{}] }`、`'@EMAIL'`。

#### data

必选。

表示真实数据。

```js
var template = {
    name: 'value1'
}
var data = {
    name: 'value2'
}
Mock.valid(template, data)
// =>
[
    {
        "path": [
            "data",
            "name"
        ],
        "type": "value",
        "actual": "value2",
        "expected": "value1",
        "action": "equal to",
        "message": "[VALUE] Expect ROOT.name'value is equal to value1, but is value2"
    }
]
```

#### 6、Mock.toJSONSchema( template  )  

#### 把 Mock.js 风格的数据模板 `template` 转换成 [JSON Schema](http://json-schema.org/)。

#### template

必选。

表示数据模板，可以是对象或字符串。例如 `{ 'list|1-10':[{}] }`、`'@EMAIL'`。

```js
var template = {
    'key|1-10': '★'
}
Mock.toJSONSchema(template)
// =>
{
    "name": undefined,
    "path": [
        "ROOT"
    ],
    "type": "object",
    "template": {
        "key|1-10": "★"
    },
    "rule": {},
    "properties": [{
        "name": "key",
        "path": [
            "ROOT",
            "key"
        ],
        "type": "string",
        "template": "★",
        "rule": {
            "parameters": ["key|1-10", "key", null, "1-10", null],
            "range": ["1-10", "1", "10"],
            "min": 1,
            "max": 10,
            "count": 3,
            "decimal": undefined,
            "dmin": undefined,
            "dmax": undefined,
            "dcount": undefined
        }
    }]
}
var template = {
    'list|1-10': [{}]
}
Mock.toJSONSchema(template)
// =>
{
    "name": undefined,
    "path": ["ROOT"],
    "type": "object",
    "template": {
        "list|1-10": [{}]
    },
    "rule": {},
    "properties": [{
        "name": "list",
        "path": ["ROOT", "list"],
        "type": "array",
        "template": [{}],
        "rule": {
            "parameters": ["list|1-10", "list", null, "1-10", null],
            "range": ["1-10", "1", "10"],
            "min": 1,
            "max": 10,
            "count": 6,
            "decimal": undefined,
            "dmin": undefined,
            "dmax": undefined,
            "dcount": undefined
        },
        "items": [{
            "name": 0,
            "path": ["data", "list", 0],
            "type": "object",
            "template": {},
            "rule": {},
            "properties": []
        }]
    }]
}
```

#### 四、在项目中使用mock.js

```vue
// category.vue文件
<template>
    <div>
        <div class="add">
            <input type="number" v-model="obj.id">
            <input type="text" v-model="obj.name">
            <input type="text" v-model="obj.content">
            <button @click="addList">添加</button>
            <button @click="updateList">修改</button>
        </div>
        <br>
        <br>
        <ul>
            <li v-for="(item,index) in list" :key="index" >
                {{item.id}}:{{item.name}}:{{item.content}}------<button @click="deleteList(item.id)">删除</button>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            list: [],
            obj: {
                //将添加的数据存到obj对象中
                id: 0,
                name: "",
                content: ""
            }
        };
    },
    mounted() {
        // 获取id、名字、内容的列表
        this.getData();
    },
    methods: {
        // 查询列表数据
        getData() {
            axios.get("/list").then(res => {
                // console.log(res);
                this.list = res.data.data;
            });
        },

        // 删除列表数据
        deleteList(id) {
            axios
                .post("/list", {
                    params: {
                        id: id
                    }
                })
                .then(res => {
                    this.list = res.data.data;
                });
        },

        // 增加列表数据
        addList() {
            // console.log("****"+this.obj);
            axios
                .post("/listAdd", {
                    params: {
                        obj: this.obj
                    }
                })
                .then(res => {
                    // console.log("请求成功"+res.data.data);
                    this.list = res.data.data;
                });
        },

        // 修改列表数据
        updateList() {
            var that = this;
            // console.log(this.obj)
            axios
                .post("/listUpdate", {
                    params: {
                        obj: this.obj
                    }
                })
                .then(function (res) {
                    // console.log("请求的数据"+res.data.data);
                    that.list = res.data.data;
                });
        }
    }
}
</script>

<style lang="less" scoped >
  * {
        padding: 0;
        margin: 0;
    }

    li {
        list-style: none;
        padding: 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }
</style>
```

```js
// category.js文件
import Mock from 'mockjs'
// 模拟数据列表
var arr = [];
for (let i = 0; i < 10; i++) {
    let newArticleObject = Mock.mock({
        name: '@cname',
        content: '@title(1, 3)',
        id: i
    })
    arr.push(newArticleObject); //将模拟的数据放到数组中
}

// 数据的 获取 和 删除 操作
let list = function (options) {
    let rtype = options.type.toLowerCase(); //获取请求的类型并转换为小写
    console.log('请求类型===>',rtype);
    switch (rtype) {
        case 'get':
            break;
        case 'post':
            let id = parseInt(JSON.parse(options.body).params.id); // 获取请求的id，将options.body转换为JSON对象
            arr = arr.filter(function (val) {
                return val.id != id; // 过滤掉前台传过来的id对应的相应数据，并重新返回
            });
            break;
        default:
            break;
    }
    return {
        data: arr
    }
}
Mock.mock('/list', /get|post/i, list);

// 数据的添加操作
let listAdd = function (options) {
    //  console.log("传过来的数据===>",JSON.parse(options.body).params.obj);
    let obj = JSON.parse(options.body).params.obj;
    // console.log("数据获取"+ obj);
    arr = arr.concat(obj); // 将前台返回来的数据，拼接到数组中。
    return {
        data: arr
    }
}
Mock.mock('/listAdd', 'post', listAdd);

// 数据的修改操作
let listUpdate = function (options) {
    let obj = JSON.parse(options.body).params.obj;
    // console.log(JSON.parse(options.body).params);
    // let id = parseInt(JSON.parse(options.body).params.obj.id);
    arr = arr.map(val => { // 将需要替换的数据替换掉
        // console.log(val)
        return val.id == obj.id ? obj : val;
    });
    return {
        data: arr
    }
}
Mock.mock('/listUpdate', 'post', listUpdate);
```

```js
// main.js文件，引入category.js文件
import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import router from './router/index'
import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
  require('./category.js') 
}

axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

```

效果图：

![1](C:\Users\聪波小样儿\Desktop\1.PNG)

