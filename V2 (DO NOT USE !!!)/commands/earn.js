exports.run = async(client, message, args, ecoClient, EmbedBuilder, pe) => {
    var url = pe.API_URL + "createCode?password=" + pe.ADMINPASSWORD + "&id=" + message.author.id

    request(url, function(error, response, body) {
    
        var endpoint = pe.API_URL + "redeem?code=" + body + "&id=" + message.author.id + "&messageauthor=" + message.author.id
        Pastee.paste({
            "contents": endpoint,
            "name": "Code",
            "expire": 100
        }).then(res => {
            if(randomInteger(1, 5) == 3){
                var link = linkvertise(res["link"], pe.YOUR_LINKVERTISE_ID)
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
}


exports.name = "earn";