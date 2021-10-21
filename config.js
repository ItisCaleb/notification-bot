const fs = require('fs');
module.exports = () => {
    if(!fs.existsSync("config.json")){
        fs.writeFileSync("config.json",JSON.stringify({
            time:[],
            factionChannel:{},
            token:""
        },null,4))
    }
    function readConfig(){
        try{
            return JSON.parse(fs.readFileSync("config.json",'utf-8'));
        }catch (err){
            console.log(err)
        }
    }
    function writeConfig(config){
        fs.writeFileSync("config.json",JSON.stringify(config,null,4));
    }
    return {
        readConfig,writeConfig
    }

}
