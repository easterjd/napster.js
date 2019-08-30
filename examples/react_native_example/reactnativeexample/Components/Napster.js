import React, { Component } from 'react';
import { AsyncStorage, Alert, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Audio } from 'expo-av';
import _ from 'lodash';
import Auth from '../Models/Auth';
import Scripts from '../Models/Scripts';
import NavigationService from '../Models/NavigationService';
import { styles } from '../Styles/Login.styles.js';
import { INTERRUPTION_MODE_IOS_DO_NOT_MIX, INTERRUPTION_MODE_ANDROID_DO_NOT_MIX } from 'expo-av/build/Audio';

export default class Napster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKey: this.props.apiKey,
            accessToken: null,
            refreshToken: null,
            authTime: null,
            expiresIn: null,
            host: 'api.napster.com',
            catalog: 'US',
            version: 'v2.2',
            dataType: 'json',
            email: '',
            password: '',
            streamingPlayer: null
        }
    }

    async componentDidMount() {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const authTime = await AsyncStorage.getItem('authTime');
        const expiresIn = await AsyncStorage.getItem('expiresIn');
        if (accessToken) {
            // Init
            const originalTime = parseInt(authTime);
            const currentTime = new Date();
            if (currentTime.getMilliseconds() - originalTime >= parseInt(expiresIn)) {
                // TODO: make refresh token call
                console.log('TOKEN EXPIRED')
                AsyncStorage.clear();
            } else {
                setTimeout(() => NavigationService.navigate('Genre', { access_token: accessToken }), 2000);
                // Config Audio for this app
                Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    allowsRecordingIOS: false,
                    staysActiveInBackground: true,
                    interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                    shouldDuckAndroid: false,
                    interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                    playThroughEarpieceAndroid: true
                })
                const streamingPlayer = new Audio.Sound();
                streamingPlayer.setOnPlaybackStatusUpdate(this.statusUpdate);
                // streamingPlayer.loadAsync({
                //     uri: "https://rhapsodyev.hs.llnwd.net/v1/1B1H7H1J9E6E9A2C/s/3/8/1/2/7/1007172183.m4a?e=1567112941&h=97b448a698e601ecb47f31007f0d3a19"
                // }, {
                //     progressUpdateIntervalMillis: 1000,
                //     positionMillis: 0,
                //     seekMillisToleranceBefore: 1000,
                //     seekMillisToleranceAfter: 1000,
                //     shouldPlay: true,
                //     rate: 1,
                //     shouldCorrectPitch: false,
                //     volume: 1,
                //     isMuted: false,
                //     isLooping: false
                // }, false)
                this.setState({
                    accessToken,
                    refreshToken,
                    authTime,
                    expiresIn,
                    streamingPlayer
                });
                // return Scripts.getStreamingPlayer()
                //     .then(response => this.setState({ streamingPlayer: response }))
                // TODO: fix nav to not setup on first mount to remove timeout here
            }
        } else {
            throw new Error('There was a problem retreiving your token from AsyncStorage');
        }
    }

    statusUpdate = playbackStatus => {
        const {
            isLoaded,
            uri,
            durationMillis,
            positionMillis,
            playableDurationMillis,
            shouldPlay,
            isPlaying,
            isBuffering,
            rate,
            volume,
            isMuted,
            isLooping,
            disJustFinish
        } = playbackStatus;
    }

    endpoint = secure => (secure ? 'https://' : 'http://') + (this.state.host, this.state.version).join('/');

    headers = secure => {
        let h = {};
        if (secure && this.state.accessToken) {
            h['Authorization'] = 'Bearer ' + this.state.accessToken;
        }
        h['Content-Type'] = 'application/json';
        return h;
    }

    get = (secure, path, cb) => {
        let data = { apiKey: this.state.apiKey };
        fetch(`${this.endpoint(secure) + path}`, {
            method: 'GET',
            data,
            headers: this.headers(secure)
        })
            .then((data, textStatus, jqXHR) => cb(data))
            .catch(jqXHR => cb({ status: jqXHR.status, error: jqXHR.statusText, response: jqXHR.responseJSON }))
    }

    post = (secure, path, data, cb) => {
        if (!data) data = {};
        fetch(`${this.endpoint(secure) + path + (secure ? '' : '?apikey=' + this.consumerKey)}`, {
            method: data._method || 'POST',
            data,
            headers: this.headers(secure)
        })
            .then((data, textStatus, jqXHR) => cb(data))
            .catch(jqXHR => cb({ status: jqXHR.status, error: jqXHR.statusText, response: jqXHR.responseJSON }))
    }

    put = (secure, path, data, cb) => this.post(secure, path, { ...data, _method: 'PUT'}, cb);

    del = (secure, path, data, cb) => this.post(secure, path, { ...data, _method: 'DELETE' }, cb);

    secondsToTime = s => {
        if (!isNaN(s)) {
            const minutes = Math.floor(s / 60);
            const seconds = Math.floor(s) % 60;
            return minutes + ":" + ((seconds < 10) ? '0' + seconds : seconds);
        }
        return '0:00';
    }

    jsonClean = o => JSON.parse(JSON.stringify(o, (k, v) => {
        if (k === 'genre') return { id: v.id, name: v.name };
        return v;
    }))

    onChangeText = (key, val) => {
        this.setState({[key]: val})
    }

    validateLogin = (email, password) => Auth.authenticate(email, password)
        .then(result => {
        if (result.access_token) {
            if (this.state.access_token !== result.access_token) {
                AsyncStorage.setItem('accessToken', result.access_token)
                AsyncStorage.setItem('refreshToken', result.refresh_token)
                const currentTime = new Date();
                AsyncStorage.setItem('authTime', `${currentTime.getMilliseconds()}`)
                AsyncStorage.setItem('expiresIn', `${result.expires_in}`)
                this.setState({
                    accessToken: result.access_token,
                    refreshToken: result.refresh_token,
                    authTime: `${currentTime.getMilliseconds()}`,
                    expiresIn: `${result.expires_in}`
                });
            }
            NavigationService.navigate('Genre', { access_token: this.state.accessToken });
        } else {
            Alert(result.message)
        }
        })
        .catch(err => Error(err, "Trouble Getting Token"));
    
    validateSession = () => {
        if (!_.isEmpty(this.state.accessToken)) {
            const currentTime = new Date();
            if (currentTime.getMilliseconds() - parseInt(this.state.authTime) >= parseInt(this.state.expiresIn)) return false;
            return true
        }
        return false;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>Napster Example</Text>
                <Text></Text>
                <TextInput style={styles.inputBox}
                onChangeText={(value) => this.onChangeText('email', value)}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Email"
                placeholderTextColor = "#002f6c"
                selectionColor="#fff"
                keyboardType="email-address"
                />

                <TextInput style={styles.inputBox}
                onChangeText={(value) => this.onChangeText('password', value)}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor = "#002f6c"
                />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={() => { this.validateLogin(this.state.email, this.state.password); }}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
};