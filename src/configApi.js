import fs from 'fs'

let readConfigFile = async () => {
    let rawdata = fs.readFileSync(__dirname + '/config.json', 'utf-8')  
    let config = JSON.parse(rawdata)
    return config
}

export default readConfigFile