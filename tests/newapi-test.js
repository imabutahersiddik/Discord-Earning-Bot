
var request = require('request');

var url = "https://shrtfly.com/api?api=991c075a6768bbc7055c27749cce16d0&type=1&url=" +"https://google.com" 

request(url, function(error, response, body) {

    console.log(body)

})