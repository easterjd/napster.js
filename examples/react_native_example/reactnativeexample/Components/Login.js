import React from 'react';
import Genre from './Genre';
import Auth from '../Models/Auth';
import { styles } from '../Styles/Login.styles.js'
import { Text, View, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import NavigationService from '../Models/NavigationService';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
      email: '',
      password: '',
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const authTime = await AsyncStorage.getItem('authTime');
    const expiresIn = await AsyncStorage.getItem('expiresIn');
    if (token) {
      const originalTime = parseInt(authTime);
      const currentTime = new Date();
      if (currentTime.getMilliseconds() - originalTime >= parseInt(expiresIn)) {
        // TODO: make refresh token call
        console.log('TOKEN EXPIRED')
      } else {
        this.setState({ access_token: token });
        // TODO: fix nav to not setup on first mount to remove timeout here
        setTimeout(() => NavigationService.navigate('Genre', { access_token: token }), 2000);
      }
    }
  }

  onChangeText = (key, val) => {
    this.setState({[key]: val})
  }

  validateLogin = (email, password) => {
    return Auth.authenticate(email, password)
      .then(result => {
        if (result.access_token) {
          if (this.state.access_token !== result.access_token) {
            this.setState({ access_token: result.access_token });
            AsyncStorage.setItem('accessToken', result.access_token)
            AsyncStorage.setItem('refreshToken', result.refresh_token)
            const currentTime = new Date();
            AsyncStorage.setItem('authTime', `${currentTime.getMilliseconds()}`)
            AsyncStorage.setItem('expiresIn', `${result.expires_in}`)
          }
        const {navigate} = this.props.navigation;
        NavigationService.navigate('Genre', { access_token: this.state.access_token });
        } else {
          alert(result.message)
        }
      })
      .catch(err => Error(err, "Trouble Getting Token"));
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
