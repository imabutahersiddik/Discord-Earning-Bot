process.on('uncaughtException', function (exception) {}); // Skipping all errors



/*

    Imports

*/


const databaseLib = require("./modules/database.js")
const config = require("./config.json");
const adm = config["Administration"]
const mm = config["Money_Management"]

require('dotenv').config();
const pe = process.env
const express = require('express');
const { Discord, Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const linkvertise = require("linkvertise")
const path = require("path");
const { JsonDB, Config } = require('node-json-db');
var request = require('request');
const PasteeAPI = require("pastee-api")
const eco = require('discord-simple-economy');




/*

    Utilities functions

*/
function CreateDb(name){
    return new JsonDB(new Config(name, true, false, '/'))
}


function RandomString(length) { Math.random().toString(36).slice(2,length + 2); }
function isInt(value) {  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value)) }
function randomInteger(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function RandomFloat(min, max, decimals) { return parseFloat((Math.random() * (max - min) + min).toFixed(decimals)); }




/*

    Configurating modules

*/

const client = new Client({ intents: [ GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, ]});

(async () => { await eco.selectDriver("sqlite"); })();

let Pastee = new PasteeAPI(adm["PasteeApiKey"]);

const app = express()

var db = CreateDb("codes");
var Adsdb = CreateDb("ads");
var IsJoineddb = CreateDb("IsJoineddb");
var referrals = CreateDb("referrals");



/*

    Important Variables

*/

const fournisseurs = config["suppliers"]
const token = config["token"]


var ErrorEmbed = 
    new EmbedBuilder()
        .setColor(0xFC0352)
        .setTitle(':x: Error :x:')
        .setThumbnail('https://media1.giphy.com/media/mq5y2jHRCAqMo/giphy.gif');




























async function refer(message, ecoClient, args) {
    if(args.length < 1){
        return message.reply("[!] Command syntax : +referral <user_id>")
    }

	var isReferred = await referrals.getData("/")
	if (JSON.stringify(isReferred).includes(message.author.id.toString()) || isReferred[message.author.id.toString()] != undefined) {

		return message.reply({ embeds: [ErrorEmbed.addFields({ name: "An error occured", value: "You already used this command." })] });

	}

	if (Date.now() - message.author.createdAt / 1000 / 60 / 60 / 24 < 5) {
		return message.channel.send(`Your account needs to be older than five days to use this command.\n\nAccount age : ${Date.now() - message.author.createdAt / 1000 / 60 / 60 / 24} days`)
	}
	else {

		referrals.push("/" + message.author.id, args[1])
		await ecoClient.add(pe.REF_REWARD, "balance")

		var ecoClient = new eco.guildUser(args[1], pe.SERVER_ID);
		await ecoClient.add(pe.REF_REWARD, "balance")

		return message.reply("[+] You & your referrer won " + pe.REF_REWARD + " :coin:'s")
	}
}














async function checkInServer(message, args, ecoClient) {

    if(args.length < 2){
        return message.reply("[+] Command syntax : \n\n+joined <server_id>")
    }

	let guild = client.guilds.cache.get(args[1]),
		USER_ID = message.author.id;


	var isInDb = await Adsdb.getData("/" + args[1])

	guild.members.fetch(USER_ID)
		.then(async (data) => {
			if (data) {

				var didJoined = await IsJoineddb.getData("/" + args[1] + ":" + message.author.id)

				if (didJoined) {
					return message.reply({ embeds: [ErrorEmbed.addFields({ name: "An error occured", value: "You already joined this server" })] });
				}
				else {

					await IsJoineddb.push("/" + args[1] + ":" + message.author.id, "joined");

					ecoClient.add(parseInt(pe.JOIN_REWARD), "wallet")

					return message.reply("[+] Success ! You won : " + pe.JOIN_REWARD + " :coin:'s !")
				}
			}
			else {
				return message.reply("[+] You didn't joined the server !")
			}
		})

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














async function createAd(ecoClient, message,args) {
    const invest = args[1], 
        invite = args[2], 
        serverID = args[3];

    if(args.length < 4){
        return message.reply("[+] Command syntax :\n\n+advertise <investement> <invite> <server_id>\n\nPrice per day : " + pe.AD_PRICE)
    }    

    var adId = RandomString(10)

    if (parseInt(invest) < pe.AD_MIN) {
        return message.reply("The minimum for an ad is : " + pe.AD_MIN + " :coin:")
    }

    if (parseInt(invest) > await ecoClient.get("balance")) {
        return message.reply("You don't have enough balance.")
    }


    ecoClient.subtract(parseInt(invest), "balance")
    await Adsdb.push("/" + serverID, invite + ";;;" + invest / pe.AD_PRICE);


    message.reply("[+] Your ad ( ID : " + serverID + " ) has been created.")
    message.author.send("[!] Add the bot to the server : https://discord.com/oauth2/authorize?client_id=1094730986392137788&scope=bot&permissions=8")

    setTimeout(async function() {
        console.log("Ad Deleted : " + adId)
        await Adsdb.delete("/" + adId);
    }, 86400000 * invest / pe.AD_PRICE, adId);
}




app.get('/createCode', async (req, res) => {
    if (req.query.password == pe.ADMINPASSWORD) {
        var userID = req.query.id
        var code = await databaseLib.createCode(RandomString, db, userID, RandomFloat(7, 100))
        res.send(code)
    } else {
        res.send("Password Invalid / Error ")
    }
})




app.get('/redeem', (req, res) => {

    databaseLib.checkCode(db, req.query.code, req.query.id).then(async function(result) {
        if (result == true) {
            var value = RandomFloat(1, 50)
            var ecoClient = new eco.guildUser(req.query.messageauthor, pe.SERVER_ID);
            await ecoClient.add(value, "balance");
            res.send("The code is valid, your account will be credited.")

            const channel = client.channels.cache.find(channel => channel.id === pe.ALERTS_CHANNEL)
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Redeem')
                    .setDescription('User : <@' + req.query.messageauthor + "> redeemed : **" + value + "** :coin:'s !")
                    .setFooter({
                        text: '100 :coin: = 0.01€'
                    })
                ]
            })


        } else {
            res.send("Invalid code")
        }

    })

})




app.listen(80, () => {
    console.log('[+] Api listening')
})



client.on(Events.MessageCreate, async (message) => {
    if(message.author.bot) return;
    const args = message.content.trim().split(/ +/g);
    var ecoClient = new eco.guildUser(message.author.id, pe.SERVER_ID);
    ErrorEmbed.data.fields = [];



    if (message.content == "+bal" || message.content == "+balance") {
        
        balance(message)

    }else if (message.content == "+earn") {
    
        earn(message, args, pe)
    
    }else if(message.content.startsWith("+cashout")){
    
        cashout(client, message, ecoClient, args)
    
    }else if(message.content.startsWith("+advertise")){

        createAd(ecoClient, message, args)
    
    }else if(message.content.startsWith("+join") && !message.content.startsWith("+joined")){
    
        returnLink(ecoClient,message)

    }else if(message.content.startsWith("+joined")){
    
        checkInServer(message, args, ecoClient)
    
    }else if(message.content.startsWith("+give") && message.author.id == pe.ADMIN_ID){
    
        give(message, args, ecoClient)
    
    }else if(message.content.startsWith("+help")){
    
        help(message, args, ecoClient)
    
    }else if(message.content.startsWith("+referral")){

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