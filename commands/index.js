const floating_castle = require("./floating_castle")
module.exports = (msg) => {
    let [commands,...args] = msg.content.split(" ")
    let channel = msg.channel
    switch (commands){
        case "#faction":
        case "#stopf":
            floating_castle(commands,args,msg)
            break
        case "#reload":
            require("../config")()
            break
        case "24":
            channel.send("25")
            break
    }
}
