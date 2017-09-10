import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import boxOffice from './boxOffice';
import users from './users';
import topMovies from './topMovies';

const rootReducer = combineReducers({boxOffice, settings:users, topMovies, routing: routerReducer});

export default rootReducer;