exports.run = async(client, message, args, ecoClient, EmbedBuilder, pe) => {


    var result = randomInteger(1, 3)

    var ResultEmbed2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Random Number')
        .setDescription('The GIF is the result :eyes:')
        .addFields({name:"100% Random", value:"Our software generate an 100% random number which makes him provably fair."})
        .setThumbnail('https://thumbs.gfycat.com/EnchantedIdolizedJunebug-size_restricted.gif');
    


    if(args.length < 3 || parseInt(args[2]) > 3){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"Command syntax : +random <bet> <1/2/3>"})]});
    }

    if(!isInt(args[1])){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"The 'bet' argument needs to be a number."})]});
    }

    if(parseInt(args[1]) > await ecoClient.get("wallet")){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"You don't have enough money."})]});   
    }



    // Checking 

    if(parseInt(args[2]) == result){
        await ecoClient.add(parseInt(args[1]) * 2, "wallet")
        return message.reply({embeds:[ResultEmbed2.setDescription(`[:white_check_mark:] **Correct ! You won : ${parseInt(args[1]) * 2} :coin:'s**`)]})
    }else{
        await ecoClient.subtract(parseInt(args[1]), "wallet")
        return message.reply({embeds:[ResultEmbed2.setDescription(`[:x:] **You lost : ${parseInt(args[1])} :coin:'s**`)]})
    }
}


exports.name = "random";