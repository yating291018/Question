const express = require('express')
      bodyParser = require('body-parser')
      multer = require('multer')
      app = express()
      fs = require('fs')
      cookieParser = require('cookie-parser')
var fileName
const storage = multer.diskStorage({
    destination:'www/uploads',
    filename:function(req,file,cb){
        // console.log(file)
        var name = req.cookies.username
        var fileType = file.originalname
        var arr = fileType.split('.')
        fileType = arr[arr.length-1]
        fileName = name + '.' + fileType
        cb(null,name + '.' + fileType)
    }
}),
  uploads = multer({storage})


app.use(express.static('www'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

//用户名验证
app.post('/username',(req,res) => {
    var name = req.body.username
    //定义一个send函数
    function send(code,message){
        res.status(200).json({code,message})
    }
    fs.exists(`user/${name}.json`, ex => {
        if(ex){
            send('fail','用户名已存在...')
        }else{
            send('success','恭喜,用户名可以使用...')
        }
    })
})



//用户注册
app.post('/register',(req,res) => {
      req.body.time = new Date()
      req.body.ip = req.ip
      var fileName = `user/${req.body.username}.json`
      fs.exists('user',ex => {
          if(ex){
             write()
          }
          else{
              fs.mkdir('user',err => {
                  if(err){
                      send('fail','抱歉,系统错误,注册失败...')
                  }else{
                      write()
                  }
              })
          }
      })


      function write(){
          fs.writeFile(fileName,JSON.stringify(req.body),err => {
              if(err){
                  send('fail','抱歉,系统错误,注册失败...')
              }else{
                  send('success','注册成功...')
              }
          })
      }

      function send(code,message){
          res.status(200).json({code,message})
      }
})
//登录
app.post('/login',(req,res) => {
    fs.exists(`user/${req.body.username}.json`,ex => {
        if(ex){
            // !!!!!!!!!!!!!!!!!!!!${}
            fs.readFile(`user/${req.body.username}.json`,(err,data) => {
                if(err){
                    send('fail','抱歉,系统错误,请稍后重试...')
                }else{
                    data = JSON.parse(data)
                    if(req.body.password == data.password){
                        //向服务器端发生cookie
                        // 此处应加密
                        res.cookie('header',data.header)
                        res.cookie('username',req.body.username)
                        send('success','登录成功...')
                    }else{
                        send('fail','密码错误,请确认后再次进行登录...')
                    }
                }
            })
        }else{
            send('fail','用户名不存在...')
        }
    })
    function send(code,message){
          res.status(200).json({code,message})
    }
})

//提交问题
var allQuestions = []
// fs.readFileSync   同步读取文件的方式,会造成阻塞,如果成功，则返回读取数据,如果失败，则不返回
// fs.existsSync   同步判断文件是否存在的方式,返回true或者false
if(fs.existsSync(`question/questions.json`)){
    var data = fs.readFileSync(`question/questions.json`)
    allQuestions = JSON.parse(data)
}




app.post('/ask',(req,res) => {
    //获取cookie里边的username
    // 通过cookie-parser模块进行解析的
    var name = req.cookies.username

    if(!name){
        send('fail','请先登录...')
    }
    //读取提交问题用户所对应的账户信息
    var header = fs.readFileSync(`user/${name}.json`)
    // 将header变成序列化为一个对象
    header = JSON.parse(header)
    // 将header里边的用户头像信息记录到req.body当中
    req.body.header = header.header
    // 过滤<>,防止xss攻击
    req.body.content = req.body.content.replace(/</g,'&lt;')
    req.body.content = req.body.content.replace(/>/g,'&gt;')
    req.body.username = name
    // !!!!!!!!!!!!!.. new Date()  date 是日期   data 是数据
    req.body.time = new Date()
    req.body.ip = req.ip
    allQuestions.unshift(req.body)
    var fileName = `question/questions.json`
    fs.exists(`question`,ex => {
         if(ex){
             write()
         }else{
             fs.mkdir(`question`,err =>{
                 if(err){
                    send('fail','抱歉,系统错误,提交失败...')
                 }else{
                     write()
                 }
             })
         }
    })

    function write(){
          fs.writeFile(fileName,JSON.stringify(allQuestions),err => {
              if(err){
                  send('fail','抱歉,系统错误,提交失败...')
              }else{
                  send('success','提交成功...')
              }
          })
      }

      function send(code,message){
          res.status(200).json({code,message})
      }

})

//用户头像
app.post('/header',uploads.single('header'),(req,res) => {
     var name = req.cookies.username
     //  console.log(fileName)
     fs.readFile(`user/${name}.json`,(err,data) => {
         if(err){
             send('fail','头像上传失败...')
         }else{
             data = JSON.parse(data)
             data.header = fileName
             fs.writeFile(`user/${name}.json`,JSON.stringify(data),err =>{
                 if(err){
                     send('fail','头像上传失败...')
                 }else{
                     res.cookie('header',data.header)
                     send('success','头像上传成功')
                 }
             })
         }
     })
     function send(code,message){
          res.status(200).json({code,message})
     }
})

//首页
app.get('/question',(req,res) => {
    res.status(200).send(allQuestions)
})

// 回答问题
app.post('/answer',(req,res) => {
    // 获取对应问题的下标值
    var index = req.cookies.index
    //提取出用户回答的对应的问题
    var data = allQuestions[index]

    var answer = data.answer || []

    //获取到回答问题的用户的用户名
    var name = req.cookies.username

    //获取用户头像信息   造成阻塞
    // var header = fs.readFileSync(`user/${name}.json`)
    //获取回答用户的头像信息
    // header = header.header
    var header = req.cookies.header
    // 用户回答问题的时间
    var time = new Date()

    //获取用户回答问题的内容
    var content = req.body.answer

    // 将用户回答问题的所有信息都封装在一起
    var answer_content = {
        username:name,
        time,
        content,
        header
    }
    // 将用户信息存放到数组当中
    answer.push(answer_content)
    // 将数组当中的内容存储到对应的问题对象当中
    data.answer = answer

    // var arr = [{name:1},{age:2}]
    // arr[0].age = 3
    // console.log(arr)
    // arr = [{name:1,answer:[]},{age:2}]
    fs.writeFile('question/questions.json',JSON.stringify(allQuestions),err => {
        if(err){
            send('fail','对不起,系统出错,请稍后再试...')
        }else{
            send('success','回答成功...')
        }
    })

    function send(code,message){
          res.status(200).json({code,message})
    }

})

app.get('/user',(req,res) => {
    fs.readFile(`user/${req.query.username}.json`,(err,data)=>{
        if(err){
            res.json({code:'fail',message:"对不起,系统错误"})
        }else{
            res.json({code:'success',message:'请求成功',data:JSON.parse(data)})
        }
    })
})


app.post('/password',(req,res) => {
    var username = req.cookies.username
    var password = req.body.password
    var oldPassword = req.body.oldPassword
    fs.readFile(`user/${username}.json`,(err,data) =>{
        if(err){
            res.json({code:"fail",message:"对不起,系统错误,请稍后重试"})
        }else{
            data = JSON.parse(data)
            if(data.password == oldPassword){
                data.password = password
                fs.writeFile(`user/${username}.json`,JSON.stringify(data),err=>{
                    if(err){
                        res.json({code:"fail",message:"对不起,系统错误,请稍后重试"})
                    }else{
                        res.json({code:"success",message:"修改成功"})
                    }
                })
            }else{
                res.json({code:"fail",message:"旧密码不正确..."})
            }
        }
    })
})

app.post('/resetpassword',(req,res) => {
    var username = req.body.username
    var password = req.body.password
    fs.readFile(`user/${username}.json`,(err,data) =>{
        if(err){
            res.json({code:"fail",message:"对不起,系统错误,请稍后重试"})
        }else{
            data = JSON.parse(data)
            data.password = password
            fs.writeFile(`user/${username}.json`,JSON.stringify(data),err=>{
                if(err){
                    res.json({code:"fail",message:"对不起,系统错误,请稍后重试"}).end()
                }else{
                    res.json({code:"success",message:"修改成功"}).end()
                }
            })
        }
    })
})


// 分页
app.get('/page',(req,res )=> {
      var page = req.query.page || 1
      var onePage = 5
      var pageTotal = Math.ceil(allQuestions.length / 5)
      var arr = allQuestions.slice((page-1)*5,page*5)
      res.json({code:"success",message:"成功",data:{question:arr,pageTotal}})
})

// 搜索
app.get('/search',(req,res) =>{
    var keyWord = req.query.keyword
    var reg = new RegExp(keyWord,"gi")
    fs.readdir('user',(err,data)=>{
        var keyArr = []
        data.forEach(function(arr,ind,array){
            var name = arr.split('.')
            if(name[0].indexOf(keyWord)!=-1){
                keyArr.push(name[0])
            }
        })
        res.json({code:"success",key:keyArr}).end()
    })
})

app.get('/otherInfo',(req,res) => {
    var username = req.query.username
    fs.readFile(`user/${username}.json`,(err,data) => {
        data=JSON.parse(data)
        if(err){
            res.json({code:"fail",message:"对不起,系统错误,请稍后重试"})
        }else{
            var otherInfo = {}
            otherInfo.header = data.header
            res.json({code:"success",data:otherInfo})
        }
    })
})


app.get('/allUser',(req,res) => {
    fs.readdir('user',(err,data)=>{
         if(err){
             res.json({code:"fail",message:"对不起,系统错误,请稍后再试"})
         }else{
             var userArr = []
             data.forEach(function(arr,ind,array){
                 var name = arr.split('.')[0]
                //  userArr.push(name[0])
                 var data = fs.readFileSync(`user/${name}.json`)
                 data = JSON.parse(data)
                 delete data.password
                 delete data.repassword
                 userArr.push(data)
             })
             res.json({code:"success",message:"请求成功...",userArr})
         }
    })
})


app.get('/otherQuestion',(req,res)=>{
    var username = req.query.username
    var otherArr = []
    allQuestions.forEach((arr,ind,array) => {
        if(arr.username == username){
             otherArr.push(array[ind])
        }
    })
    res.json({code:"success",message:"请求成功",data:otherArr}).end()
})




app.listen(3000,() => {
    console.log('node is ok!')
})



