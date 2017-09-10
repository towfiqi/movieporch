import _ from 'lodash';
var parseString = require('xml2js').parseString;



const initialState = { allMovies: [], moviesToSync: [], currentUser: {name:'', email:'', imdbid:'', photo: ''}, importCount: 0}

function users(state=initialState, action){
    
    switch(action.type){
        case 'UPDATE_SETTINGS':

            var newUpdateState = {...state, ...{currentUser:action.payload.currentUser, allMovies:action.payload.allMovies} };
            console.log(newUpdateState);
            return newUpdateState;
            
        case 'FETCH_MOVIE':
            var fetchData = action.payload.data.movie_results[0]
            var url = action.payload.config.url;
            var imdbid = url.split('?')[0];
            imdbid = imdbid.split('find/')[1];

            var newMovie = mergedMovie(imdbid, fetchData, action.meta.allMovies);
            //console.log('Reducer Recieved: ', imdbid, fetchData, action.meta.allMovies, newMovie);
            var newState = {...state, ...{currentUser:state.currentUser, allMovies:[...action.meta.allMovies, ...newMovie], importCount:state.importCount + 1} };
            return newState;

        case 'RESET_IMPORT_COUNTER':
            var newResetState = {...state, ...{importCount:action.payload} };
            return newResetState;

        case 'SYNC_USER_MOVIES':
            var newSyncMovies = syncUserMovies(action.payload, state);

            var syncState = {...state, ...{allMovies:[...newSyncMovies, ...state.allMovies ], moviesToSync:newSyncMovies} };
            console.log(syncState);
            return syncState;

        case 'RESET_IMDB_SYNC':
            var deletedSyncMovies = [ ...state.moviesToSync.slice(0, action.payload), ...state.moviesToSync.slice(action.payload + 1)]
            //console.log(deletedSyncMovies);
            var newsyncState = {...state, ...{moviesToSync:deletedSyncMovies} };
            console.log(newsyncState);
            return newsyncState;


        default:

            return state;
    }
}


function syncUserMovies(payload, state){

        var newMovies = []
        parseString(payload.data,  (err, result) => {

            if(err){ 
                return 
            }

            //console.log(result.rss.channel[0].item, state);
            var xmlMovies = result.rss.channel[0].item;
    
            var filteredmovies = [];
            filteredmovies = xmlMovies.filter((movie)=> {
                return movie.title[0].includes('TV Series') !== true && movie.title[0].includes('Mini-Series') !== true;
            });
    
            filteredmovies = filteredmovies.filter((movie)=> {
                var imdbid = movie.link[0].split('/title/')[1];  imdbid = imdbid.split('/')[0];
                return _.some(state.allMovies, ['imdb', imdbid]) !== true;
            });
    
            
            filteredmovies.map( (movie)=> {
                var imdbid = movie.link[0].split('/title/')[1];  imdbid = imdbid.split('/')[0];
                var rating = movie.description[0].split('rated this ')[1];  rating = rating.split('.')[0];
                var created = movie.pubDate[1];
    
                var newMovie = {imdb:imdbid, myrating: rating, created: created};
                //console.log(newMovie);
                return newMovies.push(newMovie);
            })

        });

        return newMovies;


}

function mergedMovie(imdbId, imdbInfo, allMovies){
        //var isString = typeof imdbId === 'string' ? true : false;
        //var currentMovie = allMovies.splice(0, 10).filter( (movie)=> { console.log(movie.imdb, imdbId); return  imdbId === movie.imdb; });
        var newItem = []
        allMovies.map((item)=>{
            if(item.imdb !== imdbId){
                return;
            }
            if(item.imdb === imdbId){
                if(imdbInfo){
                    item.id = imdbInfo.id;
                    item.title = imdbInfo.title;
                    item.poster_path = imdbInfo.poster_path;
                    item.overview = imdbInfo.overview;
                    item.genre_ids = imdbInfo.genre_ids;
                    item.vote_average = imdbInfo.vote_average;
                    item.release_date = imdbInfo.release_date;
                }

                
                console.log('Movie Found:', item, imdbInfo);
                return newItem.push(item);
            }
            
        })
        
        
        //console.log('Selected Movie',imdbId);    
        return newItem[0];
}



export default users;