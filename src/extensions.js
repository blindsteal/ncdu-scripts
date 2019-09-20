const { flattenDeep, orderBy, map } = require('lodash')

const tree = require('../data/home_m.json')
const list = flattenDeep(tree)

const printTopBy = mapFile => files => {
    const info = files.reduce((result, file) => {
        const key = mapFile(file)
        if(result[key]) {
            if(Number.isInteger(file.dsize)) result[key].size += file.dsize
            result[key].count++
        } else {
            result[key] = { count: 1, size: file.dsize }
        }
        return result
    }, {})
    const infoList = map(info, ({ count, size }, key) => ({key, count, size: size / (1024 * 1024 * 1024) })).filter(({ size }) => !!size)
    const top = orderBy(infoList, 'size', 'desc').slice(0, 9)
    
    console.log(`files: ${files.length}`)
    console.log(`top`, top)
    console.log(`top total size: ${top.reduce((total, { size }) => total + size, 0)}`)
}

const mapExtension = ({ name }) => name && name.includes('.') 
    ? name.slice(name.lastIndexOf('.')).toLowerCase()
    : 'directory'

const printTopByExtension = printTopBy(mapExtension)

const mapDate = ({ mtime }) => {
    const date = (new Date(mtime * 1000))
    return isNaN(date) ? 'invalid' : `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`
}

const printTopByDate = printTopBy(mapDate)

console.log(`by file extension`)
printTopByExtension(list)
console.log(`by date`)
printTopByDate(list)
