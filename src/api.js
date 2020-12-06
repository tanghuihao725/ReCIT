const express = require('express')
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const { json } = require('body-parser')

const router = express.Router()
const ptyProcess = require('../server.js')
const logFilePath = 'log.txt'

/**
 * 通用方法
 */
// 获取时间戳
const dateString = (newDate) => {
  const date = typeof newDate === Date ? newDate : new Date(newDate) 
  return `TIME: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}


/**
 * 测试
 */
router.get('/test', (req, res) => {
  res.json({ msg: 'API works!' })
})
/**
 * 实例生成时初始化文件夹
 */
router.post('/init', (req, res) => {
  const { name, file1, file2 } = req.body
  const date = new Date()
  const time = date.getTime()
  child_process.exec(`cd results && mkdir ${time} && cd ${time}`, (err, stdout, stderr) => {
    fs.writeFileSync(`results/.runtime.txt`, time)
    fs.writeFileSync(`results/${time}/.data.txt`, JSON.stringify({ name, file1, file2, time }))
    res.json({
      success: true,
      msg: 'ok',
      stdout,
      err
    })
  })
})
/**
 * 获取运行时进度
 */
router.get('/runtime', (req, res) => {
  const runtimeId = fs.readFileSync(`results/.runtime.txt`).toString()
  const runtimeFilePath = `results/${runtimeId}/.runtime.txt`
  const existRuntimeFile = fs.existsSync(runtimeFilePath)
  const progressFile = fs.existsSync(`results/${runtimeId}/progress.txt`) && fs.readFileSync(`results/${runtimeId}/progress.txt`).toString()
  if(!existRuntimeFile){
    res.json({ success: false })
  } else {
    const runtimeFile = fs.readFileSync(runtimeFilePath).toString().split('\\n')
    res.json({ success: true, process: runtimeFile.filter(i => !!i), end: !!runtimeFile.find(i => i === '5 结束'), progress: parseInt(progressFile) })
  }
})

/**
 * 获取结果
 */
router.get('/result', (req, res) => {
  const runtimeId = req.query.id || fs.readFileSync(`results/.runtime.txt`).toString()
  const resultFilePath = `results/${runtimeId}/result.txt`
  const inputData = JSON.parse(fs.readFileSync(`results/${runtimeId}/.data.txt`).toString())
  const resultFile = fs.existsSync(resultFilePath) && fs.readFileSync(resultFilePath).toString().trim()
  const nameFile = fs.existsSync(`upload/${inputData.file2 || 'notexist'}`) && fs.readFileSync(`upload/${inputData.file2}`).toString().trim()
  

  let resultArr = []
  if(resultFile){
    resultArr = resultFile.split(',').map(index => ({ index }))
    // 处理名字而文件
    if(nameFile){
      const nameArr = nameFile.split('\r\n')
      resultArr = resultArr.map(log => Object.assign(log, { name: nameArr[log.index - 1] }))
    }
  }
  res.json({
    success: true,
    data: resultArr,
    time: runtimeId
  })
})

/**
 * 获取历史结果目录
 */
router.get('/history', (req,res) => {
  const list = []
  const dirs = fs.readdirSync('results').filter(name => !name.endsWith('txt'))
  dirs.forEach(id => {
    const data = fs.existsSync(`results/${id}/.data.txt`) && JSON.parse(fs.readFileSync(`results/${id}/.data.txt`).toString())
    const result = fs.existsSync(`results/${id}/result.txt`) && fs.readFileSync(`results/${id}/result.txt`).toString()
    list.push({ ...data, result })
  })
  res.json({ list })
})

/**
 * 获取输入文件列表
 */
router.get('/history-upload', (req,res) => {
  res.json({
    list: fs.readdirSync('upload')
  })
})

/**
 * 清楚所有缓存
 */
router.get('/clear-history', (req,res) => {
  child_process.exec('rm -rf results/*', (err, stdout, stderr) => {
    res.json({
      success: true
    })
  })
})

module.exports = router