import React, { Component } from 'react'

export default class Track extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div class="track" data-track={this.props.track.id}>
                <div class="album-art"></div>
                <div class="track-info">
                    <div class="progress-bar"></div>
                    <div class="name">{this.props.track.name}</div>
                    <div class="artist">{this.props.track.artistName}</div>
                    <div class="duration">{this.props.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
                    <div class="current-time">{this.props.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</div>
                </div> 
            </div>
        )
    }
}