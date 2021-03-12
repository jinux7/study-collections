const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser');
const app = new Koa()
const conf = require('./conf')
app.use(bodyParser())
const router = new Router()
app.use(static(__dirname + '/public/'))
// const axios = require('axios')

const wechat = require('co-wechat')
// 这里对公众号的get授权和post发送信息做统一的处理
router.all('/weixin/api', wechat(conf).middleware(
    async message => {
        if(message.Content === '工作学习') {
            return [
              {
                title: '工作学习',
                description: '工作学习的点滴记录',
                picurl: 'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=e9a3c572a08b87d65042ac193f334f05/bd315c6034a85edfd70e896048540923dc5475f6.jpg',
                url: 'https://jinux7.github.io/'
              }
            ];
        }else if(message.Content === 'jssdk测试') {
          return [
            {
              title: '测试页面',
              description: 'jssdk测试页面',
              picurl: 'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=e9a3c572a08b87d65042ac193f334f05/bd315c6034a85edfd70e896048540923dc5475f6.jpg',
              url: 'http://jinux.top/weixin/wxAuthorize'
            }
          ];
        }else {
            return {
                content: `欢迎关注艾米苏,由于没有认证交费，菜单功能无法开通，现已交互形式进行菜单导航\n 1.回复“工作学习”\n 2.回复“jssdk测试”\n 3.回复“休闲游戏”`,
                type: 'text'
            };
        }
    }
))

const WechatAPI = require('co-wechat-api')
const api = new WechatAPI(
    conf.appid,
    conf.appsecret
)
router.get('/weixin/getFollowers', async ctx => {
    let res = await api.getFollowers()
    res = await api.batchGetUsers(res.data.openid, 'zh_CN')
    ctx.body = res
})

const OAuth = require('co-wechat-oauth')
const oauth = new OAuth(conf.appid, conf.appsecret)

/**
 * 首先用微信访问这个接口，这个接口会重定向到微信的鉴权页面，并且附带着鉴权成功后微信再次重定向的路径等参数
 */
router.get('/weixin/wxAuthorize', async (ctx, next) => {
    const state = ctx.query.id
    let redirectUrl = 'http://jinux.top/weixin/wxCallback'
    console.log('ctx...' + redirectUrl)
    // redirectUrl = redirectUrl.replace('wxAuthorize', 'wxCallback')
    const scope = 'snsapi_userinfo'
    const url = oauth.getAuthorizeURL(redirectUrl, state, scope)
    console.log('url' + url)
    ctx.redirect(url)
})
/**
 * 微信鉴权成功后重定向的接口，页面访问这个接口后，这个接口再次重定向到前端准备好h5页面，并且会附带着openid
 * h5页面可以使用此openid来获取浏览此h5页面的微信用户信息
 */
router.get('/weixin/wxCallback', async ctx => {
    const code = ctx.query.code
    console.log('wxCallback code', code)
    const token = await oauth.getAccessToken(code)
    const accessToken = token.data.access_token
    const openid = token.data.openid
    console.log('accessToken', accessToken)
    console.log('openid', openid)
    ctx.redirect('/weixin/page.html?openid=' + openid)
})
/**
 * 获取用户信息
 */
router.get('/weixin/getUser', async ctx => {
    const openid = ctx.query.openid
    console.log('openid', openid);
    const userInfo = await oauth.getUser(openid)
    console.log('userInfo:', userInfo)
    ctx.body = userInfo
})

/**
 * 获取JSConfig,h5页面利用JSConfig初始化成功后可以使用微信提供的jssdk
 */
router.get('/weixin/getJsConfig',async ctx => {
    console.log('getJSSDK...',ctx.query)
    const res = await api.getJsConfig(ctx.query)
    ctx.body = res
})

app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());
app.listen(8888);