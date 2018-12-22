import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

export default class Login extends Component {
    render() {
        return  (
            <Container fluid>
                <div style={style.content}>
                    <h2 style={style.self}>Hello</h2>
                    <a style={style.self} href="http://localhost:2000">Click Here to Login</a>
                </div>
            </Container>
        )
    }
}

const style = {
    content: {
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
    },
    self: {
        alignSelf: "center"
    }
}