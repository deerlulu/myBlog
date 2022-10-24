const redis = require('redis')
const { REDIS_CONF } = require('../conf/db.js')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

// 连接数据库，启动之后立刻执行
!(async function () {
    await redisClient.connect()
        .then(() => console.log('redis connect success!'))
        .catch(console.error)
})()

// set
async function set(key, val) {
    let objVal
    if (typeof val === 'object') {
        objVal = JSON.stringify(val)
    } else {
        objVal = val
    }
    await redisClient.set(key, objVal)
}

// get
async function get(key) {
    try {
        let val = await redisClient.get(key)

        if (val == null) return val

        try {
            val = JSON.parse(val) // 尝试转换为 JS 对象
        } catch (err) { }

        return val
    } catch (err) {
        throw err
    }
}

module.exports = { set, get }