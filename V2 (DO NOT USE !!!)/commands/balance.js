exports.run = async(client, message, args, ecoClient, EmbedBuilder, pe) => {
    var Embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Balance')
    .addFields({
        name: 'Your balance : ',
        value: await ecoClient.get("balance") + " :coin: !"
    })
    .setFooter({
        text: '100 :coin: = 0.01€'
    });
    
    return message.reply({
        embeds: [Embed]
    });
    
}

exports.name = "balance";
