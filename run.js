const fs = require('fs')


const file = fs.readFileSync('upload/name_prostate.csv').toString()

let result = file.replace(/'|"/g, '')

fs.writeFileSync('upload/name_prostate.csv', result)