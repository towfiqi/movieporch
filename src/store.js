import {createStore, compose, applyMiddleware } from 'redux';
import {createBrowserHistory} from 'history';
// import {syncHistoryWithStore} from 'react-router-redux';
//import createHistory from 'history/createHashHistory';
import { routerMiddleware } from 'react-router-redux';
import promise from 'redux-promise';
import rootReducer from './reducers/index';
import {loadState, saveState} from './localStorage';
//import {boxOffice, users, topMovies, genres, routing} from './data/defaultData'
const history = createBrowserHistory();


//Import Default Data
const persistedState = loadState()
 var historyMW = routerMiddleware(history);
 let middleware = [promise, historyMW]

//Redux Devtools
const enhancers = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(rootReducer,persistedState, enhancers);

store.subscribe(()=> {
    saveState({settings:store.getState().settings, watchList:store.getState().watchList})
})

//export const history = syncHistoryWithStore(browserHistory, store);

export default store;