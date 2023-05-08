process.on('uncaughtException', function (exception) {
   // handle or ignore error
  });


const express = require('express');
const { Discord, Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const linkvertise = require("linkvertise")
const path = require("path");
const databaseLib = require("./modules/database.js")
const config = require("./config.json");
const { JsonDB, Config } = require('node-json-db');
var request = require('request');
const PasteeAPI = require("pastee-api")
let Pastee = new PasteeAPI('aUW2TwPyXvnMOUgD7CwsyPaW6d1JMJPWLQkJKtNjh');
const eco = require('discord-simple-economy');









const apiURL = "http://45.92.109.213/"
const serverID = 1086708395173752892
const joinreward = config["joinreward"];
const minimumCashout = config["minimumCashout"]
const redeemChannel = config["redeemChannel"]
const fournisseurs = config["fournisseurs"]
const token = config["token"]
const ad_minimum = config["ad_minimum"]
const admin = config["AdminID"]
const ad_price = config["ad_price"]
const referral_reward = config["referral_reward"]
const lvID = parseInt(config["linkvertiseID"])



const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});


const app = express()






var db = new JsonDB(new Config("codes", true, false, '/'));
var Adsdb = new JsonDB(new Config("ads", true, false, '/'));
var IsJoineddb = new JsonDB(new Config("IsJoineddb", true, false, '/'));
var referrals = new JsonDB(new Config("referrals", true, false, '/'));





var ErrorEmbed = new EmbedBuilder()
    .setColor(0xFC0352)
    .setTitle(':x: Error :x:')
    .setThumbnail('https://media1.giphy.com/media/mq5y2jHRCAqMo/giphy.gif');





(async () => {
    await eco.selectDriver("sqlite");
})();







function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}





function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}





function RandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}




function RandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}


async function guess_the_number(message, ecoClient, args) {

    var ResultEmbed2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Random Number')
        .setDescription('The GIF is the result :eyes:')
        .addFields({name:"100% Random", value:"Our software generate an 100% random number which makes him provably fair."})
        .setThumbnail('https://thumbs.gfycat.com/EnchantedIdolizedJunebug-size_restricted.gif');
    

    var result = randomInteger(1, 4)
    if(args.length < 3){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"Command syntax : +random <bet> <1/2/3/4>"})]});
    }

    if(!isInt(args[1])){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"The 'bet' argument needs to be a number."})]});
    }

    if(parseInt(args[2]) > 3){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"Command syntax : +random <bet> <1/2/3/4>"})]});
    }



    if(parseInt(args[1]) > await ecoClient.get("wallet")){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"You don't have enough money."})]});   
    }


    if(parseInt(args[2]) == result){
        await ecoClient.add(parseInt(args[1]) * 2, "wallet")

        return message.reply({embeds:[ResultEmbed2.setDescription(`[:white_check_mark:] **Correct ! You won : ${parseInt(args[1]) * 2} :coin:'s**`)]})
    }else{
        await ecoClient.subtract(parseInt(args[1]), "wallet")
        return message.reply({embeds:[ResultEmbed2.setDescription(`[:x:] **You lost : ${parseInt(args[1])} :coin:'s**`)]})
    }
}

async function roulette(message, ecoClient, args) {

    const prob  = ["l", "l", "l", "w"];
    const gprob = ["l", "l", "l", "l", "l", "l", "l", "l", "l","l", "l", "l", "l","l","l","l","l","l", "l", "w"];
    var ResultEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Roulette')
        .setDescription('The GIF is the result :eyes:')
        .addFields({name:"100% Random", value:"Our software generate an 100% random number which makes him provably fair."})
        .setThumbnail('https://thumbs.gfycat.com/EnchantedIdolizedJunebug-size_restricted.gif');
    
    var bet = args[1]
    var red_or_black = args[2]
    var result = randomInteger(0, 21)


    if(red_or_black == "red"|| red_or_black == "black" || red_or_black == "green"){
    }else{
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"Command syntax : +roulette <bet> <red/black/green>"})]});
    }

    if(!isInt(bet)){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"The 'bet' argument needs to be a number."})]});
    }

    if(parseInt(bet) > await ecoClient.get("wallet")){
        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"You don't have enough money."})]});   
    }

    var resultprob = prob[Math.floor(Math.random()*prob.length)]
    var gresult = gprob[Math.floor(Math.random()*gprob.length)]

    if(gresult == "w"){
        var result = "green"
    }else if(resultprob == "w"){
        var result = red_or_black
    }else{
        if(red_or_black == "black"){
            result = "red"
        }else if(red_or_black == "red"){
            result = "black"
        }
    }

    if(result == red_or_black && result == "green"){
        await ecoClient.add(parseInt(bet) * 10, "wallet")

        return message.reply({embeds:[ResultEmbed.setDescription(`[:white_check_mark:] **AWESOME ! You won : ${parseInt(bet) * 10} :coin:'s**`)]}) 
    }
    if(result == red_or_black){
        await ecoClient.add(parseInt(bet) * 1.5, "wallet")

        return message.reply({embeds:[ResultEmbed.setDescription(`[:white_check_mark:] **You won : ${parseInt(bet) * 1.5} :coin:'s**`)]})
    }else{
        await ecoClient.subtract(parseInt(bet), "wallet")

        return message.reply({embeds:[ResultEmbed.setDescription(`[:x:] **You lost : ${parseInt(bet)} :coin:'s**`).addFields({name:"Result", value:result})]})
    }
}




async function refer(message, ecoClient, args){
    try{
        var isReferred = await referrals.getData("/")
        console.log(isReferred)
        if(JSON.stringify(isReferred).includes(message.author.id.toString()) || isReferred[message.author.id.toString()] != undefined){

            return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"You already used this command."})]});
        
        }

    }catch(error){
        console.log(error)
    }
    if (Date.now() - message.author.createdAt / 1000 / 60 / 60 / 24 < 5) {
        return message.channel.send(`Your account needs to be older than five days to use this command.\n\nAccount age : ${Date.now() - message.author.createdAt / 1000 / 60 / 60 / 24} days`)
    }else{

        referrals.push("/"+message.author.id, args[1])
        await ecoClient.add(referral_reward, "balance")

        var ecoClient = new eco.guildUser(args[1], serverID);
        await ecoClient.add(referral_reward, "balance")

        return message.reply("[+] You & your referrer won "+ referral_reward + " :coin:'s")
    }
}



async function checkInServer(message, args, ecoClient){
    try{
        let guild = client.guilds.cache.get(args[1]), USER_ID = message.author.id;

        try{
            var isInDb = await Adsdb.getData("/" + args[1])
        }catch{

            return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"[+] The server id ( " + args[1] + " ) is not in our ads database"})]});

        }

        guild.members.fetch(USER_ID) 
         .then(async (data) => {
            if(data){

                try{

                    var didJoined = await IsJoineddb.getData("/" + args[1] + ":" + message.author.id)

                }catch{}


                if(didJoined){
                    return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"You already joined this server"})]});
                }else{

                    await IsJoineddb.push("/" + args[1] + ":" + message.author.id, "joined");
                    

                    try{

                        ecoClient.add(parseInt(joinreward), "wallet")

                    }catch{

                        ecoClient.add(joinreward, "wallet")

                    }

                    return message.reply("[+] Success ! You won : " +joinreward + " :coin:'s !")
                }


            }else{

                return message.reply("[+] You didn't joined the server !")

            }
         })

    }catch(e){

        return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"The bot is not in the server.\n"  +e})]});

    }
}


async function returnLink(ecoClient, message) {

    var ads = await Adsdb.getData("/")
    var adsMsg = "----------\n---ADS---\n----------\n"

    if(ads == {} || ads  == undefined || ads == ""){
        return message.reply("[+] No ads available")
    }

    for (var key in ads) {
        adsMsg = adsMsg + "\n" + ads[key].split(";;;")[0]
    }

    adsMsg = adsMsg + "\n\nOnce a server joined, type : +joined <server_id>"
    message.author.send(adsMsg)

    return message.reply("[+] I have sent you the links in dm's")

}

async function deleteAd(adId){

    console.log("Ad Deleted : " + adId)
    await Adsdb.delete("/" + adId);

}

async function createAd(ecoClient, message, invest, invite, serverID){
    if(parseInt(invest) < ad_minimum){
        return message.reply("The minimum for an ad is : " + ad_minimum + " :coin:")
    }

    if(parseInt(invest) > await ecoClient.get("balance")){
        return message.reply("You don't have enough balance.")
    }
    var adId = RandomString(10)
    console.log("Ad Created : " + serverID)
    await Adsdb.push("/" + serverID, invite + ";;;" + invest/ad_price);
    ecoClient.subtract(parseInt(invest), "balance")
    message.reply("[+] Your ad ( ID : " + serverID + " ) has been created.")
    message.author.send("[!] Add the bot to the server : https://discord.com/oauth2/authorize?client_id=1094730986392137788&scope=bot&permissions=8")
    setTimeout(deleteAd, 86400000*invest/ad_price, adId);
}


app.get('/createCode', async (req, res) => {
    if (req.query.password == config["AdminPassword"]) {
        var userID = req.query.id
        var code = await databaseLib.createCode(RandomString, db, userID, RandomFloat(7, 100))
        res.send(code)
    } else {
        res.send("Password Invalid / Error ")
    }
})


app.get('/redeem', (req, res) => {
    try {

        databaseLib.checkCode(db, req.query.code, req.query.id).then(async function(result) {
            if (result == true) {
                var value = RandomFloat(1, 50)
                var ecoClient = new eco.guildUser(req.query.messageauthor, serverID);
                await ecoClient.add(value, "balance");
                res.send("The code is valid, your account will be credited.")
                var Embed2 = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Redeem')
                    .setDescription('User : <@' + req.query.messageauthor + "> redeemed : **" + value + "** :coin:'s !")
                    .setFooter({
                        text: '100 :coin: = 0.01€'
                    });
                const channel = client.channels.cache.find(channel => channel.id === redeemChannel)
                channel.send({
                    embeds: [Embed2]
                })


            } else {
                res.send("Invalid code")
            }

        })
    } catch (e) {
        res.send("Error")
    }

})




app.listen(80, () => {
    console.log('Api listening')
})

client.on(Events.MessageCreate, async (message) => {
    if(message.author.bot) return;
    const args = message.content.trim().split(/ +/g);
    var ecoClient = new eco.guildUser(message.author.id, serverID);
    ErrorEmbed.data.fields = [];



    if (message.content == "+bal" || message.content == "+balance") {
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

    }else if (message.content == "+earn") {
        var url = apiURL + "createCode?password=H4x0r123556044kold**$$$$&id=" + message.author.id
        
        request(url, function(error, response, body) {

            var endpoint = apiURL + "redeem?code=" + body + "&id=" + message.author.id + "&messageauthor=" + message.author.id
            Pastee.paste({
                "contents": endpoint,
                "name": "Code",
                "expire": 100
            }).then(res => {
                if(randomInteger(1, 5) == 3){
                    var link = linkvertise(res["link"], lvID)
                    message.reply("[+] The link has been sent to your DM's")
                    return message.author.send("[+] Click on this link to get your reward : " + link)
                }else{

                    request(fournisseurs[Math.floor(Math.random() * fournisseurs.length)] + res["link"], function(error, response, body) {
                        if (body.includes("URL is invalid.") || body.includes("error")) {
                            return message.reply({embeds: [ErrorEmbed.addFields({name:"An error occured", value:"The api is not configurated"})]});
                        } else {
                            message.reply("[+] The link has been sent to your DM's")
                            return message.author.send("[+] Click on this link to get your reward : " + JSON.parse(body)["shortenedUrl"])
                        }
                    });
                }

            }).catch(err => {});
        });

    }else if(message.content.startsWith("+cashout")){
        if(args.length < 3){
            return message.reply("[+] Command syntax :\n\n+cashout <amount> <paypal-email>")
        }
        if(parseInt(args[1]) < minimumCashout){
            return message.reply("[+] The minimum cashout is : " + minimumCashout + " :coin:'s")
        }
        if(parseInt(args[1]) > await ecoClient.get("balance")){
            return message.reply("[+] You don't have enough money, command syntax : +cashout amount paypal-email")
        }else{
            client.users.fetch(admin, false).then((user) => {
             user.send("The user : **" + message.author.id + "** has redeemed : " + args[1] + ":coin:'s\n\nPaypal email : **" + args[2] + "**");
            });
            var Embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Cashout')
            .addFields({
                name: 'You successfuly asked for a cashout !',
                value: "Amount : **" + args[1] + "**"
            })
            .setFooter({
                text: '100 :coin: = 0.01€'
            });
            ecoClient.subtract(parseInt(args[1]), "balance")
            return message.reply({
                embeds: [Embed]
            });   
        }
    }else if(message.content.startsWith("+advertise")){
        if(args.length < 4){
            return message.reply("[+] Command syntax :\n\n+advertise <investement> <invite> <server_id>\n\nPrice per day : " + ad_price)
        }
        createAd(ecoClient, message, args[1], args[2], args[3])
    }else if(message.content.startsWith("+join") && !message.content.startsWith("+joined")){
        returnLink(ecoClient,message)
    }else if(message.content.startsWith("+joined")){
        if(args.length < 2){
            return message.reply("[+] Command syntax : \n\n+joined <server_id>")
        }
        checkInServer(message, args, ecoClient)
    }else if(message.content.startsWith("+give") && message.author.id == admin){
        if(args.length < 3){
            return message.reply("[+] Command syntax :\n\n+give <amount> <user_id>")
        }
        ecoClient = new eco.guildUser(args[1], serverID);
        try{
            ecoClient.add(parseInt(args[2]), "wallet")
            return message.reply("[+] Gived : " + args[2] + " to " + args[1])
        }catch{
            return message.reply("[+] Error, couldn't add " + args[2] +" to : " + args[1] + " .")
        }
    }else if(message.content.startsWith("+help")){
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
                    value: "Gives " + referral_reward + " :coin:'s to you & your referrer (usable 1 time)"
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
    }else if(message.content.startsWith("+referral")){
        if(args.length < 1){
            return message.reply("[!] Command syntax : +referral <user_id>")
        }
        refer(message,ecoClient, args)
    }else if(message.content.startsWith("+roulette")){
        roulette(message,ecoClient, args);
    }else if(message.content.startsWith("+random")){
        guess_the_number(message, ecoClient, args)
    }
})


client.once(Events.ClientReady, c => {
    console.log(`Ready! ${c.user.tag}`);
});


client.login(token);