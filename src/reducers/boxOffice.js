
const initialState = { allMovies: [], actionMovies: [],  dramaMovies: [], comedyMovies: [], rommanceMovies: [], horrorMovies: [], fantasyMovies: [], count: 0};

function boxOffice(state=initialState , action){
    switch(action.type){

        case 'FETCH_DATA':

            var fetchData = [...action.payload.data.results]
            //const actionMov = [...state, ...action.payload.data.results];

            //ACTION MOVIES
            const actionMov = sortMovies(fetchData, 28);
            const dramaMov = sortMovies(fetchData, 18);
            const comedyMov = sortMovies(fetchData, 35);
            const rommanceMov = sortMovies(fetchData, 10749);
            const horrorMov = sortMovies(fetchData, 27);
            const fantasyMov = sortMovies(fetchData, 14);
            const allMov = action.payload.data.results;
            
            console.log('Fetched Data: ',fetchData);
            const curentState = {...state}
            const newState = {...state, ...{ 
                actionMovies: [...curentState.actionMovies, ...actionMov],
                dramaMovies:[...curentState.dramaMovies, ...dramaMov],
                comedyMovies:[...curentState.comedyMovies, ...comedyMov],
                rommanceMovies:[...curentState.rommanceMovies, ...rommanceMov],
                horrorMovies:[...curentState.horrorMovies, ...horrorMov],
                fantasyMovies:[...curentState.fantasyMovies, ...fantasyMov],
                allMovies: [...curentState.allMovies, ...allMov],
                count: curentState.count + action.payload.data.results.length
            }};


           // const newState = {actionMovNew}

            return newState;

        case 'SORT_DATA':

            return state;

        default:
            return state;
    }
    

}

function sortMovies(fetchData, genreID){
    const filteredMov = fetchData.filter(function(movie) {  return movie['genre_ids'].includes(genreID) === true && movie['original_language'] === 'en'; });
    filteredMov.map ( (item)=> { const idx = fetchData.indexOf(item); return fetchData.splice(idx, 1); });
    return filteredMov;
}

export default boxOffice;