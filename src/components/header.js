import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import {NavLink, Link} from 'react-router-dom';
import SearchBar from './Search';
import WatchList from './WatchList';
import avatar from '../assets/user.png';
import jQuery from 'jquery';

class Header extends React.PureComponent {

    constructor(props){
        super(props);
        this.state = {expanded: false};
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

    watchListNotiClick = (e) => {
        if(jQuery('.noti_watchlist').hasClass('active')){
            jQuery('.noti_watchlist, #watchlist').removeClass('active');
            this.setState({expanded: false});
        }else{
            jQuery('.noti_watchlist, #watchlist').addClass('active');
            this.setState({expanded: true});
            this.props.resetWatchlistNoti();
        }

    }

    expandSubmenu = ()=> {
        if(jQuery('.noti_menu').hasClass('active')){
            jQuery('.noti_menu').removeClass('active');
        }else{
            jQuery('.noti_menu').addClass('active');
        }
        
    }


    render(){
        const ppimg = this.props.settings.currentUser.photo ? <img src={this.props.settings.currentUser.photo} alt="" /> : <img src={avatar} alt="" />
        const watchlistCount = this.props.watchList.justAdded > 0 ? <span className="noti-bubble">{this.props.watchList.justAdded.toString()}</span> : ''

        return(
            <div id="header">
                <header>
                    <div className="header_wrap">
                        <SearchBar />
                        <div className="notibar">
                            <div className="noti_pp" onClick={()=> this.expandSubmenu()}>{ppimg}</div>
                            <div className="noti_watchlist" onClick={()=> this.watchListNotiClick()}><i className="lnr lnr-heart"></i>{watchlistCount}</div>
                            <div className="noti_menu">
                                <ul>
                                    <li><NavLink exact onClick={()=> this.expandSubmenu()} to="/my-movies" activeClassName="active-menu">My Movies</NavLink></li>
                                    <li><NavLink exact onClick={()=> this.expandSubmenu()} to="/settings" activeClassName="active-menu">Settings</NavLink></li>
                                </ul>
                            </div>
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
            
                <WatchList />
            
            </div>
        );
    }
}
function mapStateToProps(state){
    return {
       settings: state.settings,
       watchList: state.watchList,
    }
   }
   
   function mapDispatchToProps(dispatch){
       return bindActionCreators(actionCreators, dispatch);
   }
   
export default connect(mapStateToProps, mapDispatchToProps)(Header);