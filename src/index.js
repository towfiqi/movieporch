import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import {createBrowserHistory} from 'history';
//import createHistory from 'history/createHashHistory';
import store from './store';
import './index.css';
import App from './App';
import BoxOffice from './components/BoxOffice';
import Single from './components/Single';
import Header from './components/header';
import TopMovies from './components/TopMovies';
import Settings from './components/Settings';
import MyMovies from './components/MyMovies';
import './App.scss';
import './assets/fonts/linearicons.css';
import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();

const root = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Route component={Header}/>
                <Route component={App}/>
                <Switch>
                    <Route exact path="/" component={BoxOffice} />
                    <Route exact path="/top200" component={TopMovies} />
                    <Route exact path="/settings" component={Settings} />
                    <Route exact path="/my-movies" component={MyMovies} />
                    <Route path="/movie/:movieID" component={Single} />
                </Switch>
            </div>
        </ConnectedRouter>
    </Provider>
);


ReactDOM.render(root, document.getElementById('root'));
registerServiceWorker();
