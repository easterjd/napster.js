import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import auth from '../Model/auth'

export default class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            refreshToken: null
        }
    }

    async componentDidMount() {
        // await auth.init()
    }

    render() {
        return  (
            <div>
                <p>Hello</p>
                <Loader/>
            </div>
            
        )
    }
}