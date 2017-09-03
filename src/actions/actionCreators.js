import {tmdbkey} from '../keys'
import axios from 'axios';

export function fetchData(query, pagecount){
    
    const baseurl = 'https://api.themoviedb.org/3';
    //const discoverUrl = 'discover/movie?primary_release_date.gte=2017-07-15&primary_release_date.lte=2017-08-22';
    const request = axios.get(`${baseurl}/${query}&page=${pagecount}&api_key=${tmdbkey}`);

    return {
        type: "FETCH_DATA",
        payload: request
    }

}


//update BoxOffice
// export function updateBoxOffice(boxOffice){
//     return {
//         type: "SORT_DATA",
//         payload: boxOffice
//     }
// }

// //update Categories
// export function updateCategories(){
    
// }


// //Update Top Movies
// export function updateTopMovies(){
    
// }


// //Add Newuser to DB
// export function updateUsers(){
    
// }


// //Update user account
// export function updateAccount(){
    
// }


// //Sync user IMDB rating and watchlist when clicked Sync Button
// export function forceSyncImdb(){
    
// }