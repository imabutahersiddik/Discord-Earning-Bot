exports.run = async(client, message, args, ecoClient, EmbedBuilder, pe) => {
    if(args.length < 3){
        return message.reply("[+] Command syntax :\n\n+cashout <amount> <paypal-email>")
    }

    if(parseInt(args[1]) < pe.MIN_CASHOUT){
        return message.reply("[+] The minimum cashout is : " + pe.MIN_CASHOUT + " :coin:'s")
    }
    if(parseInt(args[1]) > await ecoClient.get("balance")){
        return message.reply("[+] You don't have enough money, command syntax : +cashout amount paypal-email")
    }else{

        client.users.fetch(pe.ADMIN_ID, false).then((user) => {
            user.send(`The user : **${message.author.id}** has redeemed : ${args[1]} :coin:'s**`);
        });

        ecoClient.subtract(parseInt(args[1]), "balance")
        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Cashout')
                .addFields({
                    name: 'You successfuly asked for a cashout !',
                    value: "Amount : **" + args[1] + "**"
                })
                .setFooter({
                    text: '100 :coin: = 0.01€'
                })
            ]
        });   
    }
}


exports.name = "cashout";