import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import boxOffice from './boxOffice';
import users from './users';
import topMovies from './topMovies';
import genres from './genres';

const rootReducer = combineReducers({boxOffice, users, topMovies, genres, routing: routerReducer});

export default rootReducer;