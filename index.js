const Discord = require('discord.js');
const request = require('request');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Bot = new Discord.Client();

//Be able to change region
//Player can have spaces in their name
//If getting wrong name code hangs up

//Things I need right now;
var tier;
var rank;
var Sumname = "laserjagare1";
var region = "euw1";
var SUMID = "";
var CHAMPID = "2";



//LOL related
const LOLAPIKEY = 



const PREFIX = "bot."

Bot.on("ready", () =>{
    console.log("Bot is online");
});

Bot.on('message', msg =>{
    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case "lol":
            if (args[1] != null){
                Sumname = args[1];
                let URLID = "https://"+ region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + Sumname + "?api_key=" + LOLAPIKEY;
                if(args[2] == null){
                    //tell rank
                    console.log("getting rank");
                    request(URLID, function(err, response, body) {
                        if(response.statusCode === 200){
                            var json =JSON.parse(body);
                            SUMID = json["id"];
                            let URLRANK = "https://"+ region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + SUMID + "?api_key=" + LOLAPIKEY;
                            request(URLRANK, function(err, response, body) {
                                var newjson =JSON.parse(body);
                                for (x = 0, i = false; i == false || x < 3; x++){
                                    if(newjson[x] != null){
                                        if(newjson[x]["queueType"] == "RANKED_SOLO_5x5"){
                                            tier = newjson[x]["tier"];
                                            if(newjson[x]["rank"] != null){
                                                rank = newjson[x]["rank"];
                                            }

                                            i = true;
                                        }
                                    }
                                }
                                switch(tier){
                                    case "IRON":
                                        msg.reply( Sumname +' ARE A FUCKING IRON ' + rank + ' PLAYER, THE WORST OF THE WORST');
                                    break;
                                    case "BRONZE":
                                            msg.reply( Sumname + " are bronze " + rank + " that's pretty bad feel sorry for" + Sumname);  
                                    break;
                                    case "SILVER":
                                            msg.reply(Sumname + " is Silver " + rank + ", still pretty bad but getting there");
                                    break;
                                    case "GOLD":
                                            msg.reply(Sumname + " is mediocre at the game and is Gold " + rank);
                                    break;
                                    case "PLATINUM":
                                            msg.reply(Sumname + " is pretty good at the game but probably a toxic as person and always thinks he/she is right. Platinum " + rank);
                                    break;
                                    case "DIAMOND":
                                            msg.reply(Sumname + " is now good at the game but still probably toxic is Diamond " + rank);
                                    break;
                                    case "MASTER":
                                            msg.reply(Sumname + " You gonna go pro soon Master?");
                                    break;
                                    case "GRANDMASTER":
                                            msg.reply(Sumname + " is Grandmaster");
                                    break;
                                    case "CHALLENGER":
                                            msg.reply(Sumname + " Can stop bragging cuz we all know now you are CHALLENGER");
                                    break;
                                }
                                
                            });
                        }
                        else{
                            console.log(response.statusCode)
                        }
                    });
                }
                else{
                    //tell mastery with champ
                    
                    request(URLID, function(err, response, body) {
                        if(response.statusCode === 200){
                            var json =JSON.parse(body);
                            SUMID = json["id"];
                        }
                        request("http://ddragon.leagueoflegends.com/cdn/9.12.1/data/en_US/champion.json", function(err, response, body) {
                            var json =JSON.parse(body);
                            champ = args[2];
                            let champBIG = champ.charAt(0).toUpperCase() + champ.slice(1);
                            if(json["data"][champBIG]["key"] == null){
                                msg.reply("This champion doesn't exist!");
                            }
                            else{
                            CHAMPID = json["data"][champBIG]["key"];
                            let CHAMPURL = "https://"+ region + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+ SUMID +"/by-champion/" + CHAMPID + "?api_key=" + LOLAPIKEY;
                                request(CHAMPURL, function(err, response, body) {
                                    if(response.statusCode === 200){
                                        var json =JSON.parse(body);
                                        msg.reply(Sumname + " Have Mastery " + json["championLevel"] + " on " + champBIG + "\n" + "And " + json["championPoints"] + " championpoints.");
                                        
                                        console.log(body);
                                        console.log(CHAMPURL);
                                    }
                                    else if(response.statusCode === 404){
                                        msg.reply(Sumname + " Doesn't have " + champBIG);
                                    }
                                    else{
                                        console.log(response.statusCode)
                                    }
                                });
                            }
                        });
                        
                    });
                }
            }
            else{
                msg.channel.send('Say something more I need more info, if you need info do "bot.help"');
            }
                
            break;
        case "help":
            msg.channel.send("bot. to activate (use this for every command in the begining)" + "\n" + "help to get help " + "\n" + " lol (Don't do this) " + "\n" + " lol [League username] (to get League of Legeds Rank) " + "\n" + " lol [League username] [League champion] (Gets Players mastery with that champion and that champion mastery points)");
    }
});


Bot.login(token);
