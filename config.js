const fs = require('fs');
let config
module.exports = () => {
    if(!fs.existsSync("config.json")){
        fs.writeFileSync("config.json",JSON.stringify({
            time:[],
            factionChannel:{},
            token:""
        },null,4))
    }
    config = readConfig()
    return {writeConfig,getConfig}
}
function readConfig(){
    try{
        return JSON.parse(fs.readFileSync("config.json",'utf-8'));
    }catch (err){
        console.log(err)
    }
}

function writeConfig(){
    fs.writeFileSync("config.json",JSON.stringify(config,null,4));
}

function getConfig(){
    return config
}
