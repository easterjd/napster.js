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
            ...parameters
        })
    }

    async temp({ accessToken, refreshToken }) {
            const Napster = window.Napster
            const $ = window.$
            var currentTrack;
            Napster.init({ consumerKey: 'YzI4ZTZjODUtY2MxMS00YjI1LWE4MDQtMmRiYTNhOTRmOTM4', isHTML5Compatible: true });
    
            Napster.player.on('ready', function(e) {
              // Uncomment to know when The Napster Player is ready
              console.log('initialized');
    
              if (accessToken) {
                Napster.member.set({accessToken, refreshToken});
              }
    
              Napster.api.get(false, '/tracks/top', function(data) {
                var tracks = data.tracks;
                var appendTracks = tracks.map( track => <Track track={track} Napster={Napster} />)
                Napster.player.clearQueue();
                tracks.forEach(function(track, i) {
                  var $t = $('<div class="track" data-track="' + track.id + '">' +
                               '<div class="album-art"></div>' +
                               '<div class="track-info">' +
                                 '<div class="progress-bar"></div>' +
                                 '<div class="name">' + track.name + '</div>' +
                                 '<div class="artist">' + track.artistName + '</div>' +
                                 '<div class="duration">' + Napster.util.secondsToTime(track.playbackSeconds) + '</div>' +
                                 '<div class="current-time">' + Napster.util.secondsToTime(track.playbackSeconds) + '</div>' +
                               '</div>' +
                              '</div>');
    
                  $t.click(function() {
                    var id = track.id.charAt(0).toUpperCase() + track.id.slice(1);
                    //TODO: make everything downcase this is a hack so i can debug my queue stuff
                    if (Napster.player.currentTrack === id) {
                      Napster.player.playing ? Napster.player.pause() : Napster.player.resume(id);
                    }
                    else {
                      $('[data-track="' + id + '"] .progress-bar').width(0);
                      $('[data-track="' + id + '"] .current-time').html($('[data-track="' + id + '"] .duration').html());
    
                      Napster.player.play(id);
                    }
                  });
    
                  $t.appendTo('#tracks');
                  Napster.player.queue(track.id.charAt(0).toUpperCase() + track.id.slice(1));
    
                  Napster.api.get(false, '/albums/' + track.albumId + '/images', function(data) {
                    var images = data.images;
                    $('[data-track="' + track.id + '"] .album-art')
                      .append($('<img>', { src: images[0].url }));
                  });
                });
              });
            });
    
            $( "#next" ).click(function() {
              Napster.player.next();
            });
            $( "#previous" ).click(function() {
              Napster.player.previous();
            });
            $( "#clear" ).click(function() {
              Napster.player.clearQueue();
            });
            $( "#repeat" ).click(function() {
              Napster.player.toggleRepeat();
            });
            $( "#shuffle" ).click(function() {
              Napster.player.toggleShuffle();
            });
            $( "#pause" ).click(function() {
              Napster.player.pause();
            });
            $( "#resume" ).click(function() {
              Napster.player.resume();
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
    }

    render() {
        return  (
            <div>
                <p>Player</p>
                <div className="header">
                    <video id='napster-streaming-player' className='video-js'></video>
                    <div className="header-text">napster.js Sample App<span className="user"></span></div>
                </div>
                <button id="next">Next</button>
                <button id="previous">Previous</button>
                <button id="clear">Clear</button>
                <button id="repeat">Repeat</button>
                <button id="shuffle">Shuffle</button>
                <button id="pause">Pause</button>
                <button id="resume">Resume</button>
                <div id="tracks"></div>
            </div>
            
        )
    }
}