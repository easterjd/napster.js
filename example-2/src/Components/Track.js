import React, { Component } from 'react'
import { Card, Image } from 'semantic-ui-react'

export default class Track extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: null
        }
    }

    async componentDidMount() {
        window.Napster.player.queue(this.props.track.id.charAt(0).toUpperCase() + this.props.track.id.slice(1));
        await window.Napster.api.get(false, '/albums/' + this.props.track.albumId + '/images', async (data) => {
            var images = data.images[0].url;
            this.setState({
                image: images
            })
        })
    }

    // isPlaying = (track, Napster) => {
    //     let id = track.id.charAt(0).toUpperCase() + track.id.slice(1);
    //     if (Napster.player.currentTrack === id) {
    //         return (
    //             <span style={{color: "orange"}}>Now Playing</span>
    //         )
    //     } else return null
    // }

    render() {
        return (
            <Card className="track" onClick={this.props.onClick} data-track={this.props.track.id}>
                <Image src={this.state.image} />
                <Card.Content>
                    <Card.Header>{this.props.track.name}</Card.Header>
                    <Card.Meta>
                        {this.props.track.artistName}
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>{window.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</Card.Content>
            </Card>
            // <div className="track" onClick={this.props.onClick} data-track={this.props.track.id}>
            //     <div className="album-art">
            //         <img src={this.state.image}></img>
            //     </div>
            //     <div className="track-info">
            //         <div className="progress-bar"></div>
            //         <div className="name">{this.props.track.name}</div>
            //         <div className="artist">{this.props.track.artistName}</div>
            //         <div className="duration">{window.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
            //         <div className="current-time">{window.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
            //     </div> 
            // </div>
        )
    }
}