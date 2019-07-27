var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var userList = [];
var userCounts = [];
var usernameList = [];
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // !drank
            case 'drank':
                if(userList.includes(userID)){
                    userCounts[userList.indexOf(userID)] = userCounts[userList.indexOf(userID)] + 1;
                }
                else{
                    userList.push(userID);
                    usernameList.push(user);
                    userCounts.push(1);
                }
                if(userCounts[userList.indexOf(userID)] === 1){
                    bot.sendMessage({
                        to: channelID,
                        message: user + ' drank water ' + userCounts[userList.indexOf(userID)] + ' time today!'
                    })
                }
                else{
                    bot.sendMessage({
                        to: channelID,
                        message: user + ' drank water ' + userCounts[userList.indexOf(userID)] + ' times today!'
                    })
                }
            break;
            // !start
            case 'start':
                bot.sendMessage({
                    to: channelID,
                    message: '3 hour reminder to drink water!'
                });
                var interval = setInterval (function (){
                    bot.sendMessage({
                        to: channelID,
                        message: '3 hour reminder to drink water!'
                    });
                }, 1000 * 60 * 60 * 3);
            break;
            // !leaderboard
            case 'leaderboard':
                // let first = userCounts.reduce(function(a, b) {
                //     return Math.max(a, b)
                // })
                // let firstPlaceUser = userList[userCounts.indexOf(first)]
                let first = -Infinity,
                second = -Infinity,
                third = -Infinity
                for(let i = 0; i < userCounts.length; i++){
                    let nr = userCounts[i]
                    if(nr > first){
                        third = second;
                        second = first;
                        first =  nr;
                    }
                    else if (nr < first && nr > second){
                        third = second;
                        second = nr;
                    }
                    else if (nr < second && nr > third){
                        third = nr;
                    }      
                }
                let firstPlaceUser = usernameList[userCounts.indexOf(first)]
                let secondPlaceUser = usernameList[userCounts.indexOf(second)]
                let thirdPlaceUser = usernameList[userCounts.indexOf(third)]
                bot.sendMessage({
                    to: channelID,
                    message: '1st Place: ' + firstPlaceUser + ', ' + first + '\n' + '2nd Place: ' + secondPlaceUser + ', ' + second + '\n' + '3rd Place: ' + thirdPlaceUser + ', ' + third
                });
            break;
         }
     }
});

