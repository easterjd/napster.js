import React, { Component } from 'react'

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


    render() {
        return (
            <div className="track" onClick={this.props.onClick} data-track={this.props.track.id}>
                <div className="album-art">
                    <img src={this.state.image}></img>
                </div>
                <div className="track-info">
                    <div className="progress-bar"></div>
                    <div className="name">{this.props.track.name}</div>
                    <div className="artist">{this.props.track.artistName}</div>
                    <div className="duration">{window.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
                    <div className="current-time">{window.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
                </div> 
            </div>
        )
    }
}