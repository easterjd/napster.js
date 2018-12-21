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
            console.log('Napster created')
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
    
            //   $('[data-track]').removeClass('playing paused');
            //   $('[data-track="' + currentTrack + '"]').toggleClass('playing', playing).toggleClass('paused', paused);
            });
    
            Napster.player.on('playtimer', function(e) {
              var id = currentTrack;
              var current = e.data.currentTime;
              var total = e.data.totalTime;
              var width = $("[data-track='" + id + "'] .track-info").width();
    
            //   $("[data-track='" + id + "']").addClass("playing");
            //   $("[data-track='" + id + "'] .progress-bar").width(parseInt((current / total) * width).toString() + "px");
            //   $("[data-track='" + id + "'] .current-time").html(Napster.util.secondsToTime(total - current));
            });
    
            Napster.player.on('error', console.log);
        })
    }

    onButton = (cmd, Napster) => {
        console.log(Napster.player)
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
                Napster.player.paused = !Napster.player.paused
                Napster.player.playing = !Napster.player.playing
            case "resume":
                Napster.player.resume()
        }
    }

    onClick = (track, Napster) => {
        var id = track.id.charAt(0).toUpperCase() + track.id.slice(1);
        //TODO: make everything downcase this is a hack so i can debug my queue stuff
        if (Napster.player.currentTrack === id) {
            Napster.player.playing ? Napster.player.pause() : Napster.player.resume(id);
        }
        else {
            // $('[data-track="' + id + '"] .progress-bar').width(0);
            // $('[data-track="' + id + '"] .current-time').html($('[data-track="' + id + '"] .duration').html());
            Napster.player.queue(id);
            Napster.player.play(id);
        }
        console.log(Napster.player)
    }

    render() {
        const Napster = window.Napster
        return  (
            <div>
                <p>Player</p>
                <div className="header">
                    <video id='napster-streaming-player' className='video-js'></video>
                    <div className="header-text">napster.js Sample App<span className="user"></span></div>
                </div>
                <div id="tracks">
                    <button id="next" onClick={() => this.onButton("next", Napster)}>Next</button>
                    <button id="previous" onClick={() => this.onButton("previous", Napster)}>Previous</button>
                    <button id="clear" onClick={() => this.onButton("clear", Napster)}>Clear</button>
                    <button id="repeat" onClick={() => this.onButton("repeat", Napster)}>Repeat</button>
                    <button id="shuffle" onClick={() => this.onButton("shuffle", Napster)}>Shuffle</button>
                    <button id="pause" onClick={() => this.onButton("pause", Napster)}>Pause</button>
                    <button id="resume" onClick={() => this.onButton("resume", Napster)}>Resume</button>
                    {this.state.tracks.map( (track, i) => <Track key={i} track={track} onClick={() => this.onClick(track, Napster)} />)}
                </div>
            </div>
            
        )
    }
}