const TelegramBot = require('node-telegram-bot-api');
const { getWeather } = require('./services/weatherInfo');
const { BingSearch } = require('./services/bing');
const { getOngoingMovies, getTrendingMovies } = require('./services/movies')
require('dotenv').config()

const botToken = process.env.TOKENBOT;
const bot = new TelegramBot(botToken, { polling: true });
const bing = new BingSearch();
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';
const allowedChatId = process.env.ALLOWED_CHAT_ID

bot.on('message', async (msg) => {
  console.log('Message received\n', msg);
  const chatId = msg.chat.id;
  const messageText = msg?.text;
  const latitude = msg.location?.latitude
  const longitude = msg.location?.longitude
  bot.sendChatAction(chatId, 'typing');

  if (chatId.toString() === allowedChatId) {

    if (messageText && messageText.startsWith('/')) {
      const command = messageText.split(' ')[0].substring(1);

      switch (command) {
        case 'news':
          try {
            const news = await bing.newsSearch();
            news.forEach((element) => {
              bot.sendMessage(chatId, element, { parse_mode: 'HTML' });
            });
          } catch (error) {
            ErrorHandler(error, chatId);
          }
          break;

        case 'weather':
          try {
            const data = await getWeather();
            bot.sendMessage(chatId, data);
          } catch (error) {
            ErrorHandler(error, chatId);
          }
          break;

        case 'movies':
          try {
            const keyboard = {
              inline_keyboard: [
                [
                  { text: 'Ongoing movies updates', callback_data: 'ongoing' },
                  { text: 'Trending movies updates', callback_data: 'trending' },
                ]
              ],
            };

            const message = `
        *Choose what you want to know about movies:*
        
        🎬 [Ongoing movies updates](callback:ongoing)
        🔥 [Trending movies updates](callback:trending)
        `;

            bot.sendMessage(chatId, message, {
              parse_mode: 'Markdown',
              reply_markup: JSON.stringify(keyboard),
            });
          } catch (error) {
            ErrorHandler(error, chatId);
          }
          break;

        default:
          bot.sendMessage(chatId, 'Unknown command. Type /help for available commands.');
          break;
      }
    }
    else if (longitude && latitude) {
      const data = await getWeather(latitude, longitude);
      bot.sendMessage(chatId, data);
    }

  } else {
    const responseMessage = `*I'm not responding to you* because you're not my FATHER.`;
    bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' });
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const callbackData = query.data;
  console.log('Callback query received from:', chatId, 'with data:', callbackData);
  getMovies(callbackData, chatId);
  bot.answerCallbackQuery(query.id, { text: `You chose ${callbackData}` });
});



function ErrorHandler(error, chatId) {
  console.error(error);
  bot.sendMessage(chatId, error.message);
}


// Assuming getOnegoingMovies and getTrendingMovies return a list of movies

async function getMovies(type, chatId) {
  let data = []

  if (type === 'ongoing') {
    data = await getOngoingMovies();
    data.results.forEach(movie => {
      console.log(movie.title);
      sendMovieMessage(chatId, movie)
    });
  } else if (type === 'trending') {
    data = await getTrendingMovies();
    data.results.forEach(movie => {
      console.log(movie.title);
      sendMovieMessage(chatId, movie)
    });
  }
}

// Function to send a formatted movie message
function sendMovieMessage(chatId, movie) {
  const message = `
  # 🎬 Movie Information

  **Title:** *${movie.title}*
  
  **Release Date:** _${movie.release_date}_
  
  **Overview:** ${movie.overview}
  
  ## 📷 Poster
  [![Movie Poster](${baseImageUrl}${movie.poster_path})](#)
  
  ## 📊 Stats
  - **Popularity:** **${movie.popularity}**
  - **Vote Average:** **${movie.vote_average}**
  - **Vote Count:** **${movie.vote_count}**
  
`;

  // Sending the formatted message
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  console.log(chatId, message);

}
