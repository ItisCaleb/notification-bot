const Discord = require('discord.js')
const config = require("../config")()
const axios = require("axios")
module.exports = (command,args,msg) => {
    switch (command){
        case "#faction":
            faction(msg)
            break
        case "#stopf":
            stopFaction(msg)
            break
    }
}

function stopFaction(msg){
    delete config.getConfig().factionChannel[msg.channel.id]
    msg.reply('已移除追蹤').then(()=>{
        config.writeConfig()
    })
}

function faction(msg){
    axios.get('https://api.ourfloatingcastle.com/api/factions/overview')
        .then(res=>{
            console.log(`${new Date().toLocaleString('zh-tw')} fetch success`)
            const emb = setEmb(res.data.factions)
            msg.channel.send(emb).then((res)=>{
                config.getConfig().factionChannel[msg.channel.id] = res.id
                config.writeConfig()
            }).catch(err=>console.log(err))
        })
}

function setEmb(factions){
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
