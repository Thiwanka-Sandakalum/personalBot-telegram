const axios = require('axios');
require('dotenv').config()


class Movies {
    constructor() {
        this.options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.MOVIES_API_KEY}`
            },
            params: {
                'language': 'en-US'
            }
        };
    }

    async request(path) {
        const url = `https://api.themoviedb.org/3${path}`;

        try {
            const response = await axios.request({
                url,
                ...this.options
            });
            return response.data;
        } catch (error) {
            return error;
        }
    }
}

// Create an instance of the Movies class
const movieApi = new Movies();

// Function to get trending movies
async function getTrendingMovies() {
    try {
        const trendingMovies = await movieApi.request('/trending/movie/week?');
        console.log(typeof(trendingMovies.results));
        console.log('movies details recived')
        return trendingMovies
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return error
    }
}
// Get a list of movies that are currently in theatres.
async function getOngoingMovies() {
    try {
        const ongoingMovies = await movieApi.request('/movie/now_playing');
        console.log('Movies details received');
        
        ongoingMovies.results.forEach(movie => {
            // console.log(movie.title);
        });

        return ongoingMovies;
    } catch (error) {
        console.error('Error fetching ongoing movies:', error);
    }
}

module.exports = { getOngoingMovies, getTrendingMovies }