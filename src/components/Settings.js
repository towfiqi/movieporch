import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import {uploadImage} from '../helpers';
import Papa from 'papaparse';
import avatar from '../assets/user.png';

class Settings extends React.Component{

    constructor(){
        super();
        this.state = {allMovies: [], currentUser:{name:'', email:'', imdbid:''}}
    }



    saveSettings = (e)=> {
        e.preventDefault();
        var formData = new FormData(this.refs.settings_from);
        var name = formData.getAll('name').toString();
        var email = formData.getAll('email').toString();
        var imdbid = formData.getAll('imdbid').toString();
        var selectedFile = document.getElementById('uploaditem').files[0];
        var selectedImage = document.getElementById('uploadPhoto').files[0];
        var previewImage = document.querySelector('.pp').children[0];
        var currentPhoto = previewImage.src;
        var imdbMovies = []
        var userInfo = {name: name, email: email, imdbid: imdbid, photo: currentPhoto };
        
        if(selectedFile !== undefined){
            Papa.parse(selectedFile, {complete: (results)=>{ 
                imdbMovies.push(results.data);


                const refinedMovies = this.refineMovies(imdbMovies);
                console.log(refinedMovies);
                this.setState({currentUser:userInfo, allMovies: refinedMovies}, ()=> {
                    console.log(this.state);
                    var statewithoutMovies = {currentUser: this.state.currentUser, allMovies: []}
                    this.props.updateSettings(statewithoutMovies);

                    this.props.resetImportCounter();

                    var movies = [...this.state.allMovies];
                    //console.log(movies);
                    movies.map((movie, idx)=> {
                            window.setTimeout(()=> {
                                console.log('Item ', idx);
                                this.props.fetchUserMovies(movie.imdb, movies);
                            }, 333 * idx);
                    });
                    
                });
    
            }});
        }else{
            if(selectedImage !== undefined){
                
                uploadImage(selectedImage, (result) =>{
                    console.log('retuedn image', result);
                    previewImage.src = result;

                    userInfo = {name: name, email: email, imdbid: imdbid, photo: result };
                    this.setState({allMovies:this.props.settings.allMovies,currentUser:userInfo}, ()=> { this.props.updateSettings(this.state); });
                });
                //console.log(myphoto);

            }else{
                this.setState({allMovies:this.props.settings.allMovies,currentUser:userInfo}, ()=> { this.props.updateSettings(this.state); });
                
            }

        }


        console.log(imdbMovies);
    }

    refineMovies =(arr) => {
        if(arr.length < 1){
            return [];
        }
        var filterarr = arr[0].splice(1, 5000);
        var newArr = [];

        filterarr.filter( (movie)=> { return movie[6] === 'Feature Film' ||  movie[6] === 'Documentary'}).map((movie)=> {
            return newArr.push({
                imdb: movie[1],
                title:movie[5],
                year: movie[11],
                myrating: movie[8],
                created: movie[2],
                modified: movie[3],
                poster_path: '',
                overview:'',
                genre_ids: [],
                vote_average:'',
                id:''
            });
        });

        return newArr; 
    }


    handleImageUpload = ()=> {
        var selectedImage = document.getElementById('uploadPhoto').files[0];
        var previewImage = document.querySelector('.pp').children[0];
        uploadImage(selectedImage, (result) =>{
            //console.log('retuedn image', result);
            previewImage.src = result;

        });   
    }

    render(){
        const ppimg = this.props.settings.currentUser.photo ? <img src={this.props.settings.currentUser.photo} alt="" /> : <img src={avatar} alt="" />;

        return(
            <div id="settings-page">
                <div className="page_wrap">
                <div className="page_header">
                        <div className="ph_inner">
                        </div>
                    </div>

                    <form className="settings_form" ref="settings_from" onSubmit={this.saveSettings} >
                        <div className="pp">{ppimg}</div><input onChange={()=> this.handleImageUpload()} id="uploadPhoto" type="file" name="profile" /><label htmlFor="uploadPhoto"><i className="lnr lnr-upload"></i></label>
                        
                        <h2>My Settings</h2>

                        <input type="text" name="name" placeholder="Name" defaultValue={this.props.settings.currentUser.name} />
                        <input type="email" name="email" placeholder="Email" defaultValue={this.props.settings.currentUser.email}  />
                        <input type="text" name="imdbid" placeholder="IMDB Account Id" defaultValue={this.props.settings.currentUser.imdbid}   />
                        <p><lable>Import IMDB Rating List: </lable><input id="uploaditem" type="file" name="ratings" /></p>
                        <input type="submit" value="Save" />
                    </form>
                </div>

            </div>
        );
    }
}

function mapStateToProps(state){
    return {
       boxOffice: state.boxOffice,
       settings: state.settings,
       watchList: state.watchList,
    }
   }
   
   function mapDispatchToProps(dispatch){
       return bindActionCreators(actionCreators, dispatch);
   }
   
export default connect(mapStateToProps, mapDispatchToProps)(Settings);