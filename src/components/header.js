import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import SearchBar from './Search'

class Header extends React.Component {

    render(){
        return(
            <div id="header">
                <header>
                    <div className="header_wrap">
                        <SearchBar />
                        <div className="notibar"></div>
                    </div>
                </header>


                <div id="sidebar">
                <div className="logo"><Link to="/"><i className="lnr lnr-film-play"></i> Movie Porch</Link></div>
                    <ul>
                        <li><NavLink exact to="/" activeClassName="active-menu"><i className="lnr lnr-film-play"></i> <span>Box Office</span></NavLink></li>
                        <li><NavLink exact to="/top200" activeClassName="active-menu"><i className="lnr lnr-diamond"></i> <span>Top 200</span></NavLink></li>
                        {/* <li><NavLink exact to="/genres" activeClassName="active-menu"><i className="lnr lnr-list"></i> <span>Genres</span></NavLink></li> */}
                        <li><NavLink exact to="/my-movies" activeClassName="active-menu"><i className="lnr lnr-user"></i> <span>Your Movies</span></NavLink></li>
                        <li><NavLink exact to="/trailers" activeClassName="active-menu"><i className="lnr lnr-layers"></i> <span>Latest Trailers</span></NavLink></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Header;