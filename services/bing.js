'use strict';
const axios = require('axios');
require('dotenv').config();

class BingSearch {
  constructor() {
    this.subscriptionKey = process.env.BING_KEY;
    this.host = 'api.bing.microsoft.com';
    this.header = {
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
    };
    this.params = {
      'mkt': 'en-US',
      'category': 'Technology',
    };
  }

  async newsSearch() {
    try {
      const path = '/v7.0/news';
      const response = await axios.get(`https://${this.host}${path}`, {
        headers: this.header,
        params: this.params,
      });

      const formattedData = response.data.value.map(item => ({
        name: item.name,
        description: item.description,
        url: item.url,
        thumbnail: item.image?.thumbnail.contentUrl,
        datePublished: new Date(item.datePublished).toLocaleString(),
      }));

      const emoji = {
        link: '🔗',
      };

      const message = formattedData.map(entry => `
${entry.datePublished}
<a href="${entry.url}">Read more..</a>
`);
      return message;

    } catch (error) {
      console.error('Error fetching news data:', error);
      throw error;
    }
  }


}

module.exports = { BingSearch }