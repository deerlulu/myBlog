const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const qs = require('querystringify')
const { get, set } = require('./src/db/redis')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log('d.toGMTString() is ', d.toGMTString())
  return d.toGMTString()
}
// session 数据
// const SESSION_DATA = {}


// 用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if(req.method !== 'POST') {
      resolve({})
      return
    }
    if(req.headers['content-type'] !== 'application/json'){
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if(!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
  return promise
}

const serverHandle = (req, res) => {

  // console.log("req",req);
  // 设置返回格式为 JSON

  res.setHeader('Content-type', 'application/json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  //解析 query
  req.query = qs.parse(url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item) {
      return 
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  });
  // 解析 session
  // let needSetCookie = false
  // let userId = req.cookie.userid
  // if(userId){
  //   if(!SESSION_DATA[userId]){
  //     SESSION_DATA[userId] = {}
  //   }
  // }else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]


  // const userId = req.cookie.userid || `${Date.now()}_${Math.random()}`
  // req.session = SESSION_DATA[userId] || {}

  // 解析 session (使用 redis)
  let needSetCookie = false
  let userId = req.cookie.userid
  if(!userId){
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userId, {})
  }
  // 获取 session
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if(sessionData == null) {
      // 初始化redis中的session
      set(req.sessionId, {})
      req.session = {}
    }else {
      req.session = sessionData
    }
    console.log('req.session111', req.session)

    // 处理postData
    return getPostData(req)
  })
  .then(postData => {
    req.body = postData

    // 处理blog路由
    const blogResult = handleBlogRouter(req, res)
    if(blogResult) {
      blogResult.then(blogData => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
            JSON.stringify(blogData)
        )
      })
      return
    }
    // 处理user路由
    // const userData = handleUserRouter(req, res)
    // if(userData){
    //   res.end(
    //     JSON.stringify(userData)
    //   )
    //   return 
    // }
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if(needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
            JSON.stringify(userData)
        )
      })
      return 
    }
    // 未命中路由，返回404
    res.writeHead(404,{"Content-type": "text/plain"})
    res.write("404 Not hhhhhFound\n")
    res.end()
  })
}

module.exports = serverHandle
