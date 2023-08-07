exports.run = async(client, message, args, ecoClient, EmbedBuilder, pe) => {
    
    if(args.length < 3){
        return message.reply("[+] Command syntax :\n\n+give <amount> <user_id>")
    }

    ecoClient = new eco.guildUser(args[1], pe.SERVER_ID);

    ecoClient.add(parseInt(args[2]), "wallet")
    return message.reply("[+] Gived : " + args[2] + " to " + args[1])

}

exports.name = "give";