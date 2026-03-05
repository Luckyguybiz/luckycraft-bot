require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

const CHANNELS = {
  java:          process.env.CHANNEL_JAVA,
  bedrock:       process.env.CHANNEL_BEDROCK,
  announcements: process.env.CHANNEL_ANNOUNCEMENTS,
  information:   process.env.CHANNEL_INFORMATION,
  apply:         process.env.CHANNEL_APPLY,
  roles:         process.env.CHANNEL_ROLES,
  tickets:       process.env.CHANNEL_TICKETS,
};

const MESSAGES = {
  java: `❗ HOW TO JOIN | Java edition
*(Computer/PC)*

💡 **STEPS**
• Launch minecraft
• Click "Multiplayer"
• Click "Add server"
• Enter the server IP **play.luckycraft.net** under "Server address"
• Make sure to have \`Server Resource Packs:\` on \`Prompt\` or \`Enabled\`
• Click "Done" and join the server!

🌟 **INFO**
> \`Server IP:\` **play.luckycraft.net**
> \`Version:\` **1.19.4 - 1.21.4**`,

  bedrock: `🎮 HOW TO JOIN | Bedrock edition
*(Phone/Console)*

💡 **STEPS**
• Launch minecraft
• Click "Play"
• Click "Servers"
• Scroll down till you find "Add server" and click it
• Type the server IP **play.luckycraft.net** under "Server address"
• Type **19132** under port
• Click "Save" and join the server!

🌟 **INFO**
> \`Server IP:\` **play.luckycraft.net**
> \`Port:\` **19132**`,

  announcements: `🍀 **Welcome to Lucky Craft!**

Stay tuned for upcoming announcements, updates, and exciting news about Lucky Craft!

🌟 **IP:** play.luckycraft.net
💛 https://store.luckycraft.net/`,

  information: `🍀 **Vote Links**
🔵 Coming soon...

👨‍💼 **Apply for Staff**
> Interested in joining our staff team and have not received any punishments in the last 30 days? Then feel free to apply via our Staff Application Forum

📖 **Global Server Rules**
> Read the server rules that apply on all gamemodes and discord. You will also read more information on certain topics such as competitive information`,

  apply: `🌟 **OPEN APPLICATIONS**

📋 **Positions**
> Are you interested to join our team and help us improve the server? We'd love to have you! Applications are 24/7 open, so feel free to apply whenever you want. You can apply for the following positions:
• **Staff Member**
• **UX Team**
• *Anything else? Private message me instead*

🤠 **Apply for UX Team**
> Not interested in Staff but still want to help us improve the server? Join the UX Team and get early access to new ideas, beta test new seasons and more.

🤗 **Requirements (UX Team)**
• Must have been playing the server for over 1 month
• Must have no toxic history
• Must have no major punishment in the last 30 days

☁️ **Apply for Staff**
> Interested in joining our staff team? Then feel free to apply via our Staff Application Forum

🤗 **Requirements (Staff)**
• Must be atleast 16 years
• Must have a working recording/clipping software
• Must have been playing the server for around 1 month
• Must have atleast basic understanding of all the server rules
• Must not be actively staff on another server
• Must have no major punishment in the last 30 days

When accepted you will be invited to our staff discord. After joining you'll be assigned to a SrMod+, who will be mentoring you over the next 2 weeks.`,

  roles: `🔔 **| Notification Roles**
Click on the buttons below to receive pings for specific occasions.

📢 | \`Announcements\` - Receive a ping for announcements
🎁 | \`Giveaways\` - Receive a ping for giveaways
🏆 | \`Events\` - Receive a ping for events
❄️ | \`Beta\` - Receive pings for beta testing
⚙️ | \`Updates\` - Receive pings for updates

🍀 **Lucky Craft**`,

  tickets: `**Lucky Craft Support**
Welcome to Lucky Craft Support!
To start, click on the drop down menu.

• **Ticket Support**
This ticket support is dedicated to supporting you, our players. Our team will typically respond within the first hour of the ticket being opened so with this in mind please provide as much detail as you can regarding your queries. This will dramatically decrease the amount of time it will take for your support to be given.`,
};

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function clearChannel(channel) {
  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    if (messages.size === 0) return 0;
    for (const msg of messages.values()) {
      try { await msg.delete(); } catch(e) { console.log('Could not delete msg: ' + e.message); }
      await sleep(500);
    }
    return messages.size;
  } catch(e) {
    console.error('Error clearing channel: ' + e.message);
    return 0;
  }
}

async function postMessages() {
  console.log('Lucky Craft Bot starting...');
  let posted = 0;
  for (const [key, channelId] of Object.entries(CHANNELS)) {
    if (!channelId || !MESSAGES[key]) { console.log('Skipping ' + key); continue; }
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) { console.log('Not found: ' + key); continue; }
      
      // Clear old messages first
      const cleared = await clearChannel(channel);
      if (cleared > 0) console.log('Cleared ' + cleared + ' messages from #' + key);
      
      await channel.send(MESSAGES[key]);
      console.log('Posted to #' + key);
      posted++;
      await sleep(1500);
    } catch(e) { console.error('Error ' + key + ': ' + e.message); }
  }
  console.log('Done! Posted ' + posted + ' messages.');
  process.exit(0);
}

client.once('ready', async () => {
  console.log('Logged in as ' + client.user.tag);
  await postMessages();
});

client.login(process.env.BOT_TOKEN);
