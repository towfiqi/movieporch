import {tmdbkey} from '../keys'
import axios from 'axios';
const url = 'https://api.themoviedb.org/3';

export const boxOffice =  
    {
        action: {},
        animation: {},
        comedy: {},
        drama: {},
        fantasy: {},
        horror: {},
        rommance: {},
        scifi: {},
    }

let boxResult;

const discoverUrl = 'discover/movie?primary_release_date.gte=2017-07-15&primary_release_date.lte=2017-08-22';

axios.get(`${url}/${discoverUrl}&api_key=${tmdbkey}`)
    .then(function (response) {
        boxResult = response.data.results;
        console.log(boxResult);
        return boxResult;
    })
    .then(function(boxResult){
        axios.get(`${url}/${discoverUrl}&page=2&api_key=${tmdbkey}`).then(function (response) {
            boxResult.push.apply(boxResult, response.data.results);
            console.log(boxResult);
            
        });
        return boxResult;
    })
    .then(function(boxResult){
        axios.get(`${url}/${discoverUrl}&page=3&api_key=${tmdbkey}`).then(function (response) {
            boxResult.push.apply(boxResult, response.data.results);
            console.log(boxResult);
            return boxResult;
        }).then( function(boxResult){
            console.log('Finished Fethcing Data');

            boxOffice.action = boxResult.filter(function(movie) { return movie['genre_ids'].includes(28) === true; });
            boxOffice.animation = boxResult.filter(function(movie) { return movie['genre_ids'].includes(16) === true; });
            boxOffice.comedy = boxResult.filter(function(movie) { return movie['genre_ids'].includes(35) === true; });
            boxOffice.drama = boxResult.filter(function(movie) { return movie['genre_ids'].includes(18) === true; });
            boxOffice.fantasy = boxResult.filter(function(movie) { return movie['genre_ids'].includes(14) === true; });
            boxOffice.horror = boxResult.filter(function(movie) { return movie['genre_ids'].includes(27) === true; });
            boxOffice.rommance = boxResult.filter(function(movie) { return movie['genre_ids'].includes(10749) === true; });
            boxOffice.scifi = boxResult.filter(function(movie) { return movie['genre_ids'].includes(878) === true; });

            //console.log('Filtered Data: ', action, animation, comedy, drama, fantasy, horror, rommance, scifi);
        });
    })
    .catch(function (error) {
      console.log(error);
});

export const users = {};
export const topMovies = {};
export const genres = {};
export const routing = {};
