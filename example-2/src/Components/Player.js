import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import auth from '../Model/auth'

import Track from './Track'

export default class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            refreshToken: null,
            tracks: []
        }
    }

    async componentDidMount() {
        await this.getParams()
        await this.temp(this.state)
    }

    getParams() {
        var query = window.location.search.substring(1);
        var parameters = {};

        if (query) {
          query.split('&').forEach(function(item) {
            var param = item.split('=');
            parameters[param[0]] = param[1];
          });
        }
        this.setState({
            ...this.state,
            ...parameters
        })
    }

    temp = async ({ accessToken, refreshToken }) => {
            const Napster = window.Napster
            const $ = window.$
            var currentTrack;
            Napster.init({ consumerKey: 'YzI4ZTZjODUtY2MxMS00YjI1LWE4MDQtMmRiYTNhOTRmOTM4', isHTML5Compatible: true });
    
            Napster.player.on('ready', async (e) => {
              // Uncomment to know when The Napster Player is ready
              console.log('initialized');
    
              if (accessToken) {
                Napster.member.set({accessToken, refreshToken});
              }
            
                await Napster.api.get(false, '/tracks/top', async (data) =>{
                    await Napster.player.clearQueue();
                    this.setState({
                        // ...this.state,
                        tracks: data.tracks
                    })
                });
                
    
            Napster.player.on('playevent', function(e) {
              var playing = e.data.playing;
              var paused = e.data.paused;
              var currentTrack = e.data.id;
    
              $('[data-track]').removeClass('playing paused');
              $('[data-track="' + currentTrack + '"]').toggleClass('playing', playing).toggleClass('paused', paused);
            });
    
            Napster.player.on('playtimer', function(e) {
              var id = currentTrack;
              var current = e.data.currentTime;
              var total = e.data.totalTime;
              var width = $("[data-track='" + id + "'] .track-info").width();
    
              $("[data-track='" + id + "']").addClass("playing");
              $("[data-track='" + id + "'] .progress-bar").width(parseInt((current / total) * width).toString() + "px");
              $("[data-track='" + id + "'] .current-time").html(Napster.util.secondsToTime(total - current));
            });
    
            Napster.player.on('error', console.log);
        })
    }

    onButton = (cmd) => {
        const Napster = window.Napster
        switch (cmd) {
            case "next":
                Napster.player.next()
            case "previous":
                Napster.player.previous()
            case "clear":
                Napster.player.clearQueue()
            case "repeat":
                Napster.player.toggleRepeat()
            case "shuffle":
                Napster.player.toggleShuffle()
            case "pause":
                Napster.player.pause()
            case "resume":
                Napster.player.resume()
        }
    }

    render() {
        return  (
            <div>
                <p>Player</p>
                <div className="header">
                    <video id='napster-streaming-player' className='video-js'></video>
                    <div className="header-text">napster.js Sample App<span className="user"></span></div>
                </div>
                <button id="next" onClick={() => this.onButton("next")}>Next</button>
                <button id="previous" onClick={() => this.onButton("previous")}>Previous</button>
                <button id="clear" onClick={() => this.onButton("clear")}>Clear</button>
                <button id="repeat" onClick={() => this.onButton("repeat")}>Repeat</button>
                <button id="shuffle" onClick={() => this.onButton("shuffle")}>Shuffle</button>
                <button id="pause" onClick={() => this.onButton("pause")}>Pause</button>
                <button id="resume" onClick={() => this.onButton("resume")}>Resume</button>
                <div id="tracks">{this.state.tracks.map( (track, i) => <Track key={i} track={track} Napster={window.Napster} />)}</div>
            </div>
            
        )
    }
}