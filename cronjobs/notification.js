const cron = require('node-cron')
const config = require("../config")()
const day = 1000 * 3600 * 24

module.exports = (client) =>{
    setTime(client)
    cron.schedule('* */1 * * *',async ()=>{
        setTime()
    },{timezone: "Asia/Taipei"}).start()
}

function calTime(endTime, title){
    let time = endTime - Date.now()
    let d = Math.floor(time/day)
    let h = Math.floor((time/day-d)*24)
    return `${title}：${Math.floor(d)}天${h}小時`
}

function setTime(client){
    for (let times of config.getConfig().time){
        client.guilds.fetch(times.guild).then(async (g)=>{
            let channel = g.channels.cache.get(times.id)
            await channel.setName(calTime(times.endTime,times.title))
        })
    }
}
