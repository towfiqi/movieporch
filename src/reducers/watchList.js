const initialState = { watching: [], justRemoved: '', justAdded: 0};

function watchList(state=initialState, action){
    switch(action.type){
        
        case 'ADD_TO_WATCHLIST':
            console.log(action.payload);
            state.watching.forEach((item)=>{
                if(item.id === action.payload.id){
                    return;
                }
            });
            const addedWatchList = [...action.payload, ...state.watching];
            const addedCount = addedWatchList.length - state.watching.length; 

            const newAddState = {watching:addedWatchList, justRemoved: '', justAdded: state.justAdded + addedCount}
            console.log(addedWatchList);
            return newAddState;

        case 'REMOVE_FROM_WATCHLIST':
            const removedWatchList = [ ...state.watching.slice(0, action.payload),...state.watching.slice(action.payload + 1)]
            const currentCount = state.justAdded > 0? state.justAdded - 1 : 0;

            const newRemoveState = {watching:removedWatchList, justRemoved: state.watching[action.payload].id, justAdded: currentCount}
            

            console.log('Removed Movie: ',state.watching[action.payload].id);
            return newRemoveState;

        case 'RESET_WATCHLIST_NOTIFICATION':
            const resetAddCountState = {watching:state.watching, justRemoved: state.justRemoved, justAdded: 0}
            return resetAddCountState;

        default:
            return state;
    }

}

export default watchList;