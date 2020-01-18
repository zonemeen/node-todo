const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const fs = require('fs')
const p = require('path') 
const dbPath = p.join(home, '.todo') 

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
  write(list, path = dbPath) { 
    return new Promise((resole, reject) => {
      const string = JSON.stringify(list); 
      fs.writeFile(path, string+'\n', (error) => { //同样write也是异步的，外面怎么知道里面成功还是失败了呢，所以用promise封装一下
        if(error) return reject(error);
        resole()
      })
    })
  }
}
module.exports = db