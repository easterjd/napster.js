import React, { Component } from 'react'

export default class Track extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: null
        }
    }

    async componentDidMount() {
        this.props.Napster.player.queue(this.props.track.id.charAt(0).toUpperCase() + this.props.track.id.slice(1));
        await this.props.Napster.api.get(false, '/albums/' + this.props.track.albumId + '/images', async (data) => {
            var images = data.images[0].url;
            this.setState({
                image: images
            })
        })
    }

    onClick = async (track, Napster) => {
        var $ = window.$
        var id = track.id.charAt(0).toUpperCase() + track.id.slice(1);
        //TODO: make everything downcase this is a hack so i can debug my queue stuff
        if (Napster.player.currentTrack === id) {
            Napster.player.playing ? Napster.player.pause() : Napster.player.resume(id);
        }
        else {
            // $('[data-track="' + id + '"] .progress-bar').width(0);
            // $('[data-track="' + id + '"] .current-time').html($('[data-track="' + id + '"] .duration').html());

            Napster.player.play(id);
        }
        Napster.player.queue(track.id.charAt(0).toUpperCase() + track.id.slice(1));
    }

    render() {
        return (
            <div className="track" onClick={() => this.onClick(this.props.track, this.props.Napster)} data-track={this.props.track.id}>
                <div className="album-art">
                    <img src={this.state.image}></img>
                </div>
                <div className="track-info">
                    <div className="progress-bar"></div>
                    <div className="name">{this.props.track.name}</div>
                    <div className="artist">{this.props.track.artistName}</div>
                    <div className="duration">{this.props.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
                    <div className="current-time">{this.props.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
                </div> 
            </div>
        )
    }
}