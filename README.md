## renren-ui
- renren-ui基于vue、element-ui构建开发，实现 【[renren-security](https://gitee.com/renrenio/renren-security)】 后台管理前端功能，提供一套更优的前端解决方案
- 前后端分离，通过token进行数据交互，可独立部署
- 动态菜单，通过菜单管理统一管理访问路由
- 演示地址：[http://demo.open.renren.io/renren-security](http://demo.open.renren.io/renren-security) (账号密码：admin/admin)

<br> 

![输入图片说明](public/1.png)

## 安装

您需要提前在本地安装[Node.js](https://nodejs.org/en/)，版本号为：[12.x、14.x]，再使用[Git](https://git-scm.com/)克隆项目或者直接下载项目后，然后通过`终端命令行`执行以下命令。

```bash
# 切换到项目根目录

# 安装插件
npm install

# 启动项目
npm run serve
```

> 如网络不稳定，安装时出错或进度过慢！请移步 [cnpm](https://npmmirror.com/) 淘宝镜像进行安装。

启动完成后，会自动打开浏览器访问 [http://localhost:8001](http://localhost:8001)，如您看到下面的页面代表`前端项目`运行成功！因为前后端分离项目，需保证`前端项目`和`后台项目`分别独立正常运行。

请留意下面的页面，其中`验证码`未能正常显示，控制台有`API请求`报错信息！这时需检查`后台项目`是否正常运行。


## 技术栈

提前了解和学习这些知识会对使用本项目有很大的帮助。

* [Node.js](https://nodejs.org/)
* [ES6](http://es6.ruanyifeng.com/)
* [Vue-cli](https://github.com/vuejs/vue-cli)
* [Vue](https://cn.vuejs.org/)
* [Vue-router](https://router.vuejs.org/zh/)
* [Vuex](https://vuex.vuejs.org/zh/)
* [Vue-i18n](https://github.com/kazupon/vue-i18n)
* [Axios](https://github.com/axios/axios)
* [Element](https://element.eleme.cn/#/zh-CN)
* [JS-cookie](https://github.com/js-cookie/js-cookie)


## 目录结构

```
├── src                        
│  ├── assets                 // 静态资源
│  ├── components             // 公共组件
│  ├── element-ui             // element样式
│  ├── i18n                   // 国际化
│  ├── icons                  // 图标
│  ├── mixins                 // 混入
│  ├── router                 // 路由
│  ├── store                  // 状态管理
│  ├── utils                  // 工具类
│  ├── views                  // 业务相关
│  ├── App.vue
│  ├── main.js                // 入口
├── ...
├── package-lock.json
├── package.json
└── vue.config.js             // vue-cli脚手架配置
```

<br>

## 常见问题

如何修改API请求地址？
* 修改`.env.dev/.prod/.sit/.uat`文件中`APIURL`变量值。
<br>

**如何交流、反馈、参与贡献？**
- 开发文档：https://www.renren.io/guide/security
- 官方社区：https://www.renren.io/community
- Gitee仓库：https://gitee.com/renrenio/renren-ui
- [人人开源](https://www.renren.io)：https://www.renren.io
- 官方QQ群：群1：324780204（已满）、群2：145799952（已满）、群3：189969622
- 如需关注项目最新动态，请Watch、Star项目，同时也是对项目最好的支持
- 技术讨论、二次开发等咨询、问题和建议，请移步到官方社区，我会在第一时间进行解答和回复！
- 微信扫码并关注【人人开源】，获得项目最新动态及更新提醒<br>

  <br>
  <br>

![捐赠](http://cdn.renren.io/donate.jpg "捐赠")
<br>
<br>


```bash
# 项目打包 切换到sit分支
npm run build:prod
# 或者
yarn build:prod
```
## 分支说明

**罗格乐企分支说明**
- master: 罗格乐企平台主分支。
  - sit分支分布测试环境后，若功能正常则合并到此分支。
  - 新企业接入，从此分支创建对于应分支。eg：华为乐企税务，则Create from选master，创建huwei、huwei-dev两个分支。
- sit: 罗格乐企sit测试分支。此分支用于打包发布到公司到演示环境
- dev: 罗格乐企开发分支。
- rpa: rpa功能分支。
- feat-xxx: xxx功能分支。
  - 当要开发一个新的功能时，从master上创建一个新功能分支，分支名称以feat-开头 + 中文描述。如“蓝票开具多方共同开具功能”，则创建"feat-蓝票开具多方共同开具"。【分支名可以有中文字符，以中文对此分支加以描述。】功能分支开发完成后，视情况合并到各个分支。如罗格乐企、怀化佳慧需此功能则使用cherry-pick命令，pick到各自dev。

**第三方接入分支说明**
- cssjy: 长沙设计院生产环境。
- cssjy-dev: 长沙设计院开发环境。针对长沙设计院需要添加功能，修复bug等在此分支操作，若bug在罗格乐企也有，则需手动同步至罗格。
- jiahui: 怀化佳慧生产环境。
- jiahui-dev: 怀化佳慧开发环境。 针对佳慧需要添加功能，修复bug等在此分支操作，若bug在罗格乐企也有，则需手动同步至罗格。