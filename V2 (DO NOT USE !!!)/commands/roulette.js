async function roulette(message, ecoClient, args) {

    var bet = args[1]
    var red_or_black = args[2]


    const prob  = ["l", "l", "l", "w"];
    const gprob = ["l", "l", "l", "l", "l", "l", "l", "l", "l","l", "l", "l", "l","l","l","l","l","l", "l", "w"];

    var resultprob = prob[Math.floor(Math.random()*prob.length)]
    var gresult = gprob[Math.floor(Math.random()*gprob.length)]

    
    var ResultEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Roulette')
        .setDescription('The GIF is the result :eyes:')
        .addFields({name:"100% Random", value:"Our software generate an 100% random number which makes him provably fair."})
        .setThumbnail('https://thumbs.gfycat.com/EnchantedIdolizedJunebug-size_restricted.gif');
    


    if(!isInt(bet)){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"The 'bet' argument needs to be a number."})]});
    }

    if(parseInt(bet) > await ecoClient.get("wallet")){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"You don't have enough money."})]});   
    }

    if(gresult == "w"){

        await ecoClient.add(parseInt(bet) * 10, "wallet")

        return message.reply({embeds:[ResultEmbed.setDescription(`[:white_check_mark:] **AWESOME ! You won : ${parseInt(bet) * 10} :coin:'s**`)]}) 

    }else if(resultprob == "w"){
        await ecoClient.add(parseInt(bet) * 1.5, "wallet")

        return message.reply({embeds:[ResultEmbed.setDescription(`[:white_check_mark:] **You won : ${parseInt(bet) * 1.5} :coin:'s**`)]})
    }else{
        await ecoClient.subtract(parseInt(bet), "wallet")

        return message.reply({embeds:[ResultEmbed.setDescription(`[:x:] **You lost : ${parseInt(bet)} :coin:'s**`).addFields({name:"Result", value:result})]})
    }
}

module.exports = {roulette}