const env = process.env.NODE_ENV  //环境参数

let MYSQL_CONF
let REDIS_CONF

if(env === 'dev') {
  MYSQL_CONF = {
    host: 'bj-cynosdbmysql-grp-pnwqucew.sql.tencentcdb.com',
    user: 'root',
    password: 'wan91u...',
    port: '22074',
    database: 'myblog'
  }
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

if(env === 'production') {
  MYSQL_CONF = {
    host: 'bj-cynosdbmysql-grp-pnwqucew.sql.tencentcdb.com',
    user: 'root',
    password: 'wan91u...',
    port: '22074',
    database: 'myblog'
  }
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
