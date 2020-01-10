const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const fs = require('fs')
const p = require('path') //node.js提供一个方法：用来拼路径
const dbPath = p.join(home, '.todo') //中间不用加/或者\（windows和mac的区别，windows是\），因为加上面一句会自动加

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (error, data)=>{  //readFile是异步操作，里面是不能return的，用promise
        if(error) return reject(error)
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (error2) {
          list = []
        }
        resolve(list)
      })
    })
  },
  write(list, path = dbPath) { //将字符串传过来，不传的话就默认等于dbpath，这样的write就是灵活的可以写在任意文件
    return new Promise((resole, reject) => {
      const string = JSON.stringify(list); //文件只能写入字符串
      fs.writeFile(path, string+'\n', (error) => { //同样write也是异步的，外面怎么知道里面成功还是失败了呢，所以用promise封装一下
        if(error) return reject(error);
        resole()
      })
    })
  }
}
module.exports = db