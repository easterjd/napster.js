import React, { Component } from 'react'
import { Card, Image } from 'semantic-ui-react'

// Next steps:
// -Is playing icon on each track when played
// -After implimenting Redux, pass track information to Player to display current track info

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
            <Card style={style.card} className="track" onClick={this.props.onClick} data-track={this.props.track.id}>
                <Image src={this.state.image} />
                <Card.Content>
                    <Card.Header style={style.cardFont}>{this.props.track.name}</Card.Header>
                    <Card.Meta style={style.cardFont}>
                        {this.props.track.artistName}
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra style={style.cardFont}>{window.Napster.util.secondsToTime(this.props.track.playbackSeconds)}</Card.Content>
            </Card>
        )
    }
}

const style = {
    card: {
        backgroundColor: "transparent"
    },
    cardFont: {
        color: "white"
    }
}