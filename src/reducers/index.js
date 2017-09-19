import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import boxOffice from './boxOffice';
import users from './users';
import watchList from './watchList';

const rootReducer = combineReducers({boxOffice, watchList, settings:users, routing: routerReducer});

export default rootReducer;