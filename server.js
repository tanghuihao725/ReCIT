const express = require('express')
const path = require('path')
const api = require('./src/api')
const os = require('os')
const fs = require('fs')
const pty = require('node-pty')
const WebSocket = require('ws')


const app = express()
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'zsh'

console.log(os.platform())
// 解析post请求中的body
const bodyParser = require('body-parser')

// 解析urlencoded和raw/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 路由接口文件：端口之上使用routes 当访问users/*** 就能找到该路由文件
app.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  next();
});
/**
 * 接口：
 */
app.use('/api', api)



const port = '9898'

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// wss
const wss = new WebSocket.Server({ port: 9999 })
var ptyProcess

wss.on('connection', ws => {
    console.log('socket connection on')
    ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    })
    // 获取runtime信息
    const filename = fs.readFileSync('results/.runtime.txt').toString()
    const fileData = JSON.parse(fs.readFileSync(`results/${filename}/.data.txt`).toString())
    // ptyProcess.write(`clear\r`)
    // ptyProcess.write(`.\\src\\algo\\test.exe  "${filename}" "${fileData.name}" "${fileData.file1 || null}" "${fileData.file2 || null}"\r`)
    ptyProcess.write(`.\\src\\algo\\find_Genes_ByReCIT.exe  "${filename}" "${fileData.name||'未命名'}" "${fileData.file1 || 'leukemia.csv'}" "${fileData.file2 || null}"\r`)
    ws.on('message', res=>{
        console.log(res)
        ptyProcess.write(res)
    })
    ptyProcess.on('data', data => {
        process.stdout.write(data)
        ws.send(data)
    })
})

module.exports.ptyProcess = ptyProcess