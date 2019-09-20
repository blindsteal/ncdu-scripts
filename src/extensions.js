const { flattenDeep, orderBy, map } = require('lodash')

const tree = require('../data/home_m.json')
const list = flattenDeep(tree)

const printTopBy = mapFile => (files, sort = 'size') => {
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
    const top = orderBy(infoList, [sort], ['desc']).slice(0, 9)
    
    const sum = infoList.reduce((a, { size }) => a + size, 0)
    const avg = sum / infoList.length

    console.log(`files: ${files.length}`)
    console.log(`top by ${sort}`, top)
    console.log(`top total size: ${top.reduce((total, { size }) => total + size, 0)}`)

    console.log(`list total size: ${sum}`)
    console.log(`avg size: ${avg}`)
}

const mapExtension = ({ name }) => name && name.includes('.') 
    ? name.slice(name.lastIndexOf('.')).toLowerCase()
    : 'directory'

const printTopByExtension = printTopBy(mapExtension)

const mapDate = ({ mtime }) => {
    const date = (new Date(mtime * 1000))
    return isNaN(date) ? 'invalid' : `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const printTopByDate = printTopBy(mapDate)

const isYear = year => ({ mtime }) => {
    const date = new Date(mtime * 1000)
    if(isNaN(date)) return false
    return year.getFullYear() === date.getFullYear()
}

const isMonth = month => ({ mtime }) => {
    const date = new Date(mtime * 1000)
    if(isNaN(date)) return false
    return month.getFullYear() === date.getFullYear()
        && month.getMonth() === date.getMonth()
}

const isDay = day => ({ mtime }) => {
    const date = new Date(mtime * 1000)
    if(isNaN(date)) return false
    return day.getFullYear() === date.getFullYear()
        && day.getMonth() === date.getMonth()
        && day.getDate() === date.getDate()
}

const filteredList = list.filter(isMonth(new Date(2019, 7, 1)))

printTopByDate(filteredList, 'key')
