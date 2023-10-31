const axios = require('axios');

class Movies {
    constructor() {
        this.options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDczNjQ4MzRiNDZjY2ZiYTI4YmMwYzU0ZjI3MzEwMSIsInN1YiI6IjY1M2Y4MDQxNTkwN2RlMDEzOGUyYjU3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LXtOwB5IORNxUvqQBvKHvRH7g9R5khkAA6WLLXl0POY'
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