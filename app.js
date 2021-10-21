const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios')
const cron = require('node-cron')
const conf = require("./config")();
const day = 1000 * 3600 * 24


let config = conf.readConfig()
let factions


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


function calTime(endTime, title){
    let time = endTime - Date.now()
    let d = Math.floor(time/day)
    let h = Math.floor((time/day-d)*24)
    return `${title}：${Math.floor(d)}天${h}小時`
}

function getFaction(){
    axios.get('https://api.ourfloatingcastle.com/api/factions/overview')
        .then((res)=>{
            factions = res.data.factions
            console.log(`${new Date().toLocaleString('zh-tw')} fetch success`)
            let emb = setEmb(factions)
            for (let key in config.factionChannel){
                client.channels.fetch(key).then((cha)=>{
                    cha.messages.fetch(config.factionChannel[key])
                        .then(m=>{
                            m.edit(emb)
                        }).catch(()=>{
                            delete config.factionChannel[key]
                            conf.writeConfig(config)
                        })
                })
            }
        })
}

let fac = cron.schedule('*/2 * * * *',()=>{
    getFaction()
},{timezone: "Asia/Taipei"})

function initTime(){
    for (let times of config.time){
        client.guilds.fetch(times.guild).then(async (g)=>{
            let channel = g.channels.cache.get(times.id)
            await channel.setName(calTime(times.endTime,times.title))
        })
    }
}




function init(){
    getFaction()
    fac.start();
    initTime()
    cron.schedule('* */1 * * *',async ()=>{
        initTime()
    },{timezone: "Asia/Taipei"}).start()
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    init()

});



client.on('message', msg => {
    if (msg.content.startsWith('#faction')) {
        const emb = setEmb(factions)
        msg.channel.send(emb).then((res)=>{
            config.factionChannel[msg.channel.id] = res.id
            conf.writeConfig(config)
        })
    }else if(msg.content.startsWith('#stopf')){
        delete config.factionChannel[msg.channel.id]
        msg.reply('已移除追蹤').then(()=>{
            conf.writeConfig(config)
        })
    }
    if(msg.content=="24"){
        msg.channel.send("25")
    }
});

client.login(config.token).then(()=>{
    console.log('Login')
});
