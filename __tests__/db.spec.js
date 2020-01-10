const db = require('../db.js')
const fs = require('fs')
jest.mock('fs')

describe('db', ()=>{
  afterEach(() => { //每调用一个it，都会调用fs.clearMocks()
    fs.clearMocks()
  })
  it('can read', async ()=>{
    const data = [{title: 'hi', done: true}] //{title: 'hi', done: true}
    fs.setReadFileMock('/xxx', null, JSON.stringify(data)) //在fs.readFile上面做手脚
    const list = await db.read('/xxx') //调用的是fs.readFile
    expect(list).toStrictEqual(data)
  })
  it('can write', async () => {
    let fakeFile
    fs.setWriteFileMock('/yyy', (path, data, callback) => {
      fakeFile = data
      callback(null)
    })
    const list = [{title: '欧阳娜娜', done: true}, {title: '迪丽热巴', done: true}]
    await db.write(list, '/yyy')
    expect(fakeFile).toBe(JSON.stringify(list)+'\n')
  })
})
