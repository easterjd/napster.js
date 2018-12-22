import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import auth from '../Model/auth'
import { Grid, Container, Card, Button } from 'semantic-ui-react'

import Track from './Track'

export default class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            refreshToken: null,
            tracks: [],
            playing: false,
            shuffle: false,
            repeat: false
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
                
            // Would love to reformat playevent and playtimer to implement a progress bar

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
            // Next and Previous behave very erraticly and break the play button coloring; look into
            case "next":
                this.setState({ playing: false })
                return Napster.player.next()
            case "previous":
                this.setState({ playing: true })
                return Napster.player.previous()
            case "clear":
                this.setState({
                    shuffle: false,
                    repeat: false
                })
                return Napster.player.clearQueue()
            case "repeat":
                this.setState({
                    repeat: !this.state.repeat
                })
                return Napster.player.toggleRepeat()
            case "shuffle":
                this.setState({
                    shuffle: !this.state.shuffle
                })
                return Napster.player.toggleShuffle()
            case "pause":
                this.setState({ playing: false })
                return Napster.player.pause()
            case "resume":
                this.setState({ playing: true })
                return Napster.player.resume()
        }
    }

    onClick = (track, Napster) => {
        var id = track.id.charAt(0).toUpperCase() + track.id.slice(1);
        //TODO: make everything downcase this is a hack so i can debug my queue stuff
        if (Napster.player.currentTrack === id) {
            if (Napster.player.playing) {
                this.setState({ playing: false })
                return Napster.player.pause()
            } else if (!Napster.player.playing) {
                this.setState({ playing: true })
                return Napster.player.resume(id)
            }
        }
        else {
            // $('[data-track="' + id + '"] .progress-bar').width(0);
            // $('[data-track="' + id + '"] .current-time').html($('[data-track="' + id + '"] .duration').html());
            // Napster.player.queue(id);
            this.setState({ playing: true })
            return Napster.player.play(id);
        }
        console.log(Napster.player)
    }

    render() {
        const Napster = window.Napster
        return  (
            <Grid divided inverted padded>
                <Grid.Row verticalAlign="top" textAlign="center">
                    <Grid.Column width={6} floated="left" style={style.body}>
                        <div>
                            <h3>Player</h3>
                            <div className="header" style={style.headerText}>
                                <video id='napster-streaming-player' className='video-js' style={style.napsterStreamingPlayer}></video>
                                <div className="header-text">napster.js Sample App<span className="user"></span></div>
                            </div>
                        </div>
                        <div style={style.buttons}>
                            <Button size="huge" circular color="grey" icon="step backward" id="previous" onClick={() => this.onButton("previous", Napster)} />
                            { this.state.playing ? 
                            <Button size="massive" circular color="orange" icon="pause" id="pause" onClick={() => this.onButton("pause", Napster)}/> : 
                            <Button size="massive" circular color="grey" icon="play" id="resume" onClick={() => this.onButton("resume", Napster)}/>
                            }
                            <Button size="huge" circular color="grey" icon="step forward" id="next" onClick={() => this.onButton("next", Napster)} />
                        </div>
                        <div>
                            <Button circular color="grey" icon="stop" id="clear" onClick={() => this.onButton("clear", Napster)}/>
                            <Button circular color={this.state.repeat ? "orange" : "grey"} icon="sync" id="repeat" onClick={() => this.onButton("repeat", Napster)}/>
                            <Button circular color={this.state.shuffle ? "orange" : "grey"} icon="random" id="shuffle" onClick={() => this.onButton("shuffle", Napster)}/>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={10} floated="right" style={style.body}>
                        <Card.Group itemsPerRow={4}>
                            {this.state.tracks.map( (track, i) => <Track key={i} track={track} onClick={() => this.onClick(track, Napster)} />)}
                        </Card.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const style = {
    body: {
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif"
    },
    headerText: {
        fontWeight: "100",
        fontSize: "50px",
        color: "#31404d",
        paddingBottom: "25px"
    }, 
    napsterStreamingPlayer: {
        marginBottom: "900px"
    },
    buttons: {
        paddingBottom: "15px"
    }
}