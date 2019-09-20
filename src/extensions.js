const { flattenDeep, orderBy, map } = require('lodash')

const tree = require('../data/home_m.json')
const list = flattenDeep(tree)

const info = list.reduce((result, { name, dsize }) => {
    const ext = name && name.includes('.') 
        ? name.slice(name.lastIndexOf('.')).toLowerCase()
        : 'directory'
    if(result[ext]) {
        if(Number.isInteger(dsize)) result[ext].size += dsize
        result[ext].count++
    } else {
        result[ext] = { count: 1, size: dsize }
    }
    return result
}, {})
const infoList = map(info, ({ count, size }, ext) => ({ext, count, size: (size / 1024) / 1024 / 1024 })).filter(({ size }) => !!size)
const top = orderBy(infoList, 'size', 'desc').slice(0, 9)

console.log(`files: ${list.length}`)
console.log(`top extensions`, top)
console.log(`top extensions total: ${top.reduce((total, { size }) => total + size, 0)}`)
