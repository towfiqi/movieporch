import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import {NavLink, Link} from 'react-router-dom';
import SearchBar from './Search';
import avatar from '../assets/user.png';

class Header extends React.Component {

    constructor(props){
        super(props);

        this.props.resetImportCounter();
    }

    renderImportProgress =(currentItem, totalMovies) =>{
        if(this.props.settings.allMovies.length > 0){
            var activeClass = currentItem > 0 ? 'importing' : '';
            if(currentItem === totalMovies ){ activeClass = ''}

            return(
                <div className={`progressBar ${activeClass}`}>
                    <p><i className="lnr lnr-sync"></i> {`${currentItem} / ${totalMovies}`} Importing Movies...</p>
                </div>
            );
        }

    }

    render(){
        const ppimg = this.props.settings.currentUser.photo ? <img src={this.props.settings.currentUser.photo} /> : <img src={avatar} alt="" />
        return(
            <div id="header">
                <header>
                    <div className="header_wrap">
                        <SearchBar />
                        <div className="notibar">
                            <div className="noti_pp">{ppimg}</div>
                            <div className="noti_menu"></div>
                        </div>
                    </div>
                </header>


                <div id="sidebar">
                <div className="logo"><Link to="/"><i className="lnr lnr-film-play"></i> Movie Porch</Link></div>
                    <ul>
                        <li><NavLink exact to="/" activeClassName="active-menu"><i className="lnr lnr-film-play"></i> <span>Box Office</span></NavLink></li>
                        <li><NavLink exact to="/top200" activeClassName="active-menu"><i className="lnr lnr-diamond"></i> <span>Top 200</span></NavLink></li>
                        {/* <li><NavLink exact to="/genres" activeClassName="active-menu"><i className="lnr lnr-list"></i> <span>Genres</span></NavLink></li> */}
                        <li><NavLink exact to="/my-movies" activeClassName="active-menu"><i className="lnr lnr-user"></i> <span>My Movies</span></NavLink></li>
                        <li><NavLink exact to="/trailers" activeClassName="active-menu"><i className="lnr lnr-layers"></i> <span>Latest Trailers</span></NavLink></li>
                    </ul>
                </div>
                {this.renderImportProgress(this.props.settings.importCount, this.props.settings.allMovies.length)}
            </div>
        );
    }
}
function mapStateToProps(state){
    return {
       boxOffice: state.boxOffice,
       settings: state.settings,
    }
   }
   
   function mapDispatchToProps(dispatch){
       return bindActionCreators(actionCreators, dispatch);
   }
   
export default connect(mapStateToProps, mapDispatchToProps)(Header);