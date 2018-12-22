import React, { Component } from 'react'
import { Grid, Card, Button, Visibility, Sticky } from 'semantic-ui-react'

import Track from './Track'

// Next Steps:
// -Impliment Redux to pass track information to Player and display current track
// -Impliment progress bar for each track
// -Impliment redirect to login when tokens expire

export default class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            refreshToken: null,
            tracks: [],
            playing: false,
            shuffle: false,
            repeat: false,
            calculations: {
                direction: 'none',
                height: 0,
                width: 0,
                topPassed: false,
                bottomPassed: false,
                pixelsPassed: 0,
                percentagePassed: 0,
                topVisible: false,
                bottomVisible: false,
                fits: false,
                passing: false,
                onScreen: false,
                offScreen: false,
              }
        }
    }

    async componentDidMount() {
        await this.getParams()
        await this.init(this.state)
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

    init = async ({ accessToken, refreshToken }) => {
            const Napster = window.Napster
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
                        tracks: data.tracks
                    })
                });
                
            // Would love to reformat playevent and playtimer to implement a progress bar
    
            Napster.player.on('error', console.log);
        })
    }

    onButton = (cmd, Napster) => {
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
            default:
                return
        }
    }

    onClick = (track, Napster) => {
        var id = track.id.charAt(0).toUpperCase() + track.id.slice(1);
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
            this.setState({ playing: true })
            return Napster.player.play(id);
        }
    }

    handleContextRef = contextRef => this.setState({ contextRef })

    handleUpdate = (e, { calculations }) => this.setState({ calculations })

    render() {
        const Napster = window.Napster
        const { contextRef } = this.state
        return  (
            <div ref={this.handleContextRef}>
            <Grid divided inverted padded style={style.page}>
                <Grid.Row verticalAlign="top" textAlign="center">
                    <Grid.Column width={6} floated="left" style={style.body}>
                    <Sticky context={contextRef}>
                        <div>
                            <h3>Player</h3>
                            <div className="header" style={style.headerText}>
                                <video id='napster-streaming-player' className='video-js' style={style.napsterStreamingPlayer}></video>
                                <div className="header-text">napster.js Sample App<span className="user"></span></div>
                            </div>
                        </div>
                        { /* Would love to impliment "Current Track" image and progress bar here */ }
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
                    </Sticky>
                        
                    </Grid.Column>
                    <Grid.Column width={10} floated="right" style={style.body}>
                        
                        <Visibility onUpdate={this.handleUpdate}>
                            <Card.Group itemsPerRow={4}>
                                {this.state.tracks.map( (track, i) => <Track key={i} track={track} onClick={() => this.onClick(track, Napster)} />)}
                            </Card.Group>
                        </Visibility>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
            </div>
        )
    }
}

const style = {
    page: {
        backgroundColor: "#232323"
    },
    body: {
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        color: "white"
    },
    headerText: {
        fontWeight: "100",
        fontSize: "50px",
        paddingBottom: "25px",
        color: "white"
    }, 
    napsterStreamingPlayer: {
        marginBottom: "900px"
    },
    buttons: {
        paddingBottom: "15px"
    }
}