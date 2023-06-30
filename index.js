const Discord = require('discord.js-self');
const client = new Discord.Client();
const express = require('express');
const ImageHash = require('image-hash');
const fs = require('fs');
const axios = require('axios');
const chalk = require("chalk");
const config = require('./config.json');
const targetHash = require('./namefix.json');
const allowedChannels = ["CATCH_CHANNEL_ID1", "CATCH_CHANNEL_ID2", "CATCH_CHANNEL_ID3"];

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
function findOutput(input) {
  if (targetHash.hasOwnProperty(input)) {
    return targetHash[input];
  } else {
    return input;
  }
}
client.on('messageCreate', async (msg) => {
  const Pokebots = ["716390085896962058", "874910942490677270"];
  
  if (allowedChannels.length > 0 && !allowedChannels.includes(msg.channel.id)) {
    return;
  }
  if (Pokebots.includes(msg.author.id)) {
    let preferredURL = null;
    msg.embeds.forEach((e) => {
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
          msg.reply(`@poketwo c ${pokemonName}!`);
        } else {
          // Code for sending more
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
});

async def calculateHash(url):
  response = await axios.get(url, { 'responseType': 'arraybuffer' })
  imageData = bytes(response.data, 'binary')
  hash = await ImageHash.hash(imageData)
  return hash
def getPokemonName(hash):
  return pokemonData[hash] if hash in pokemonData else 'Unknown Pokémon'
client.login(config.TOKEN)
