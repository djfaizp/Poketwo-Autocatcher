Developer: Djfaiz
Name: Poketwo-Autocatcher
Version: V1
Description: bot to help users with catching Pokemons
@Supported: poketwo/pokemon
STAR THIS REPO FOR IT TO WORK
*/

const Discord = require('discord.js-self');
const client = new Discord.Client()
const express = require('express');
const ImageHash = require('image-hash');
const fs = require('fs');
const axios = require('axios');
const chalk = require("chalk");

const config = require('./config.json')
const targetHash = require('./namefix.json');

const allowedChannels = ["CATCH_CHANNEL_ID1","CATCH_CHANNEL_ID2" , "CATCH_CHANNEL_ID3"]; // Add your allowed channel IDs to this array or leave it like [] if you want to it to catch from all channels

//------------------------- KEEP-ALIVE--------------------------------//

const app = express();
if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");
app.get("/", (req, res) => {
  res.status(200).send({ success: "true" });
});
app.listen(process.env.PORT || 3000);

//--------------------------------------------------------------//

//-------------------------SOME EXTRA FUNCTIONS----------------------------//


function findOutput(input) {
  if (targetHash.hasOwnProperty(input)) {
    return targetHash[input];
  } else {
    return input;
  }
}
//--------------------------------------------------------------------------//

//-------------------------READY HANDLER+SPAMMER-----------------------//

client.on('ready', () => {
  console.log(`${client.user.username} is ready, Made by Djfaiz`) 
  
  const channel = client.channels.cache.get(config.spamChannelID) 
  
 function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function spam() {
  channel.send("SPAMMing! (Made by Djfaiz) ")
  const randomInterval = getRandomInterval(1500, 5000); // Random interval for spam between 1 second and 5 seconds
  setTimeout(spam, randomInterval);
}
spam(); 
})
//------------------------------------------------------------//


//-------------------------Anti-Crash-------------------------//

process.on("unhandledRejection", (reason, p) => {
  console.log(" [antiCrash] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch");
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(" [antiCrash] :: Multiple Resolves");
  console.log(type, promise, reason);
});

//------------------------------------------------------------//

//-------------------------SAY COMMAND-----------------------//
client.on('message', message => {
  if (message.content.startsWith("$say")) {
    let say = message.content.split(" ").slice(1).join(" ")
    message.channel.send(say)
  }
})

//------------------------------------------------------------//

//----------------------------AUTOCATCHER--------------------------------------//

// On message event
client.on('messageCreate', async msg => {
  
const Pokebots = ["716390085896962058","874910942490677270"]; //Poketwo ,pokename
   if (allowedChannels.length > 0 && !allowedChannels.includes(message.channel.id)) {
    return; 
 }
  if(Pokebots.includes(message.author.id)) {
     let preferredURL = null; 
    message.embeds.forEach((e) => {
      if (e.image) {
        const imageURL = e.image.url;
        if (imageURL.includes("pokemon.jpg")) {
          preferredURL = imageURL; 
        } else if (imageURL.includes("pokemon.jpg") && !preferredURL) {
          preferredURL = imageURL; 
        }
      }
    });

    if (preferredURL) {
      let url = preferredURL;
 try {
      const hash = await calculateHash(preferredURL);

      console.log('Target Hash:', targetHash);
      console.log('Image Hash:', hash);

      if (hash === targetHash) {
        const pokemonName = getPokemonName(targetHash);
        console.log('Pokemon caught:', pokemonName);
        message.reply(`@poketwo c ${pokemonName}!`);
      } else {
        console.log('Not a match!');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
});

const calculateHash = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const imageData = Buffer.from(response.data, 'binary');
  const hash = await ImageHash.hash(imageData);
  return hash;
};

const getPokemonName = (hash) => {
  return pokemonData[hash] || 'Unknown Pokémon';
};

client.login(config.TOKEN) 
