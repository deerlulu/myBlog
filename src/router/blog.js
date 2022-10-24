const { 
  getList, 
  getDetail, 
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
  const method = req.method
  const id =  req.query.id
  console.log(req.method);
  console.log(req.path);
  // 获取博客列表
  if(method === 'GET' && req.path === '/api/blog/list') {
    const author =  req.query.author || ''
    const keyword =  req.query.keyword || ''
    // const listData = getList(author, keyword)
    // return new SuccessModel(listData)
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }
  // 获取博客详情
  if(method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }
  // 新建一篇博客
  if(method === 'POST' && req.path === '/api/blog/new') {
    const author = 'zhangsan'
    req.body.author = author
    const result = newBlog(req.body)
    return result.then(data =>{
      return new SuccessModel(data)
    })
  }
  // 更新博客
  if(method === 'POST' && req.path === '/api/blog/update') {
    const result = updateBlog(id, req.body)
    return result.then(val => {
      if(val) {
        return new SuccessModel(val)
      }else {
        return new ErrorModel('更新博客失败')
      }
    })
  }
  // 删除博客
  if(method === 'POST' && req.path === '/api/blog/del') {
    const author = 'lisi'
    const result = delBlog(id, author)
    return result.then(val => {
      console.log("shanchu", val)
      if(val) {
        return new SuccessModel(val)
      }else{
        return new ErrorModel('删除博客失败')
      }
    })
  }
}

module.exports = handleBlogRouter