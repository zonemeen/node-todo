const fs = jest.genMockFromModule('fs') //假的fs
const _fs = jest.requireActual('fs') //真的fs

Object.assign(fs, _fs) //将右边所有key复制到左边的对象，几乎一样

let readMocks = {}

fs.setReadFileMock = (path, error, data) => {
  readMocks[path] = [error, data] //只要你读这个path，就给你返回[error, data]这两个回调的参数
}

//但只覆盖readFile
fs.readFile = (path, options, callback) => {
  if(callback === undefined){callback = options} //fs.readFile('xxx', fn)
  if(path in readMocks){ //如果你这个路径是被mock过的，就不去调用真实的readFile
    callback(...readMocks[path]) //即(mocks[path][0], mocks[payh][1])
  }else{
    _fs.readFile(path, options, callback)
  }
}

let writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
  writeMocks[path] = fn
}

fs.writeFile = (path, data, options, callback) => {
  if(path in writeMocks){ //如果你的path在这个mocks里面，就不能真正去写文件，直接去调用这个函数
    writeMocks[path](path, data, options, callback) //把用户传的东西都原封不动的传给你, writeMocks[path] = fn
  }else{
    _fs.writeFile(path, data, options, callback)
  }
}

fs.clearMocks = () => {
  readMocks = {}
  writeMocks = {}
}
module.exports = fs
