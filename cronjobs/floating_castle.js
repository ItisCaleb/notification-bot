const axios = require("axios")
const cron = require('node-cron')
const config = require("../config")()

module.exports = (client) =>{
    getFaction(client)
    cron.schedule('*/2 * * * *',async ()=>{
        await getFaction(client)
    },{timezone: "Asia/Taipei"}).start()
}

async function getFaction(client){
    if(config.getConfig().factionChannel.length===0) return
    const res = await axios.get('https://api.ourfloatingcastle.com/api/factions/overview')
    let factions = res.data.factions
    let emb = factionEmb(factions)
    for (let key in config.getConfig().factionChannel){
        client.channels.fetch(key).then((cha)=>{
            cha.messages.fetch(config.getConfig().factionChannel[key])
                .then(m=>{
                    m.edit(emb)
                    console.log(`${new Date().toLocaleString()} edit success`)
                }).catch((err)=>{
                    console.log(err)
                    //delete config.getConfig().factionChannel[key]
                    //config.writeConfig()
                })
        })
    }

}

function factionEmb(factions){
    const emb = new Discord.MessageEmbed()
        .setTitle('陣營情況')
        .setColor('#5b9940')
        .setTimestamp()
    for (let i=0;i<factions.length;i++){
        emb.addField(`${factions[i].name} 樓層:${factions[i].floor}/100`,
            `血量: ${factions[i].hp}/${factions[i].fullHp}
                           人口: ${factions[i].population}`)
    }
    return emb
}
