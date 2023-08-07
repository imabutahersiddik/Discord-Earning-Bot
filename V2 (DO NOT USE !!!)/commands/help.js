async function help(message, pe){
    
    var Embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Help Menu')
    .addFields(
        {
            name: '+earn',
            value: "Main command to earn, returns a cashlink."
        },
        {
            name: '+join',
            value: "Join discord servers to earn"
        },
        {
            name: '+cashout',
            value: "asks for a cashout (only paypal)"
        },
        {
            name: '+bal / +balance',
            value: "Shows your balance"
        },
        {
            name: '+advertise',
            value: "Advertise your discord server with the money your earnt (related to the +join command)"
        },
        {
            name: '+roulette',
            value: "Bet on a random color (red/black/green)"
        },
        {
            name: '+random',
            value: "Choose a random number between 1 & 4, if your number is the same as the computer you win the double of your bet"
        },
        {
            name: '+referral',
            value: "Gives " + pe.REF_REWARD + " :coin:'s to you & your referrer (usable 1 time)"
        },
        {
            name: '+help',
            value: "Shows the help menu"
        }
    )
    .setFooter({
        text: '100 :coin: = 0.01€'
    });

    return message.reply({
        embeds: [Embed]
    });   
}