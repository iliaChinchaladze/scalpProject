import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, ImageBackground, 
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
      };
    }
  
    render() {
      return (
        <View style={styles.container}>
          <Image
            style={{ width: 150, height: 150, alignSelf: 'center', borderRadius:50, margin:10, }}
            source={require('./logos/Scalp-logos.jpeg')}
          />
          <TextInput
            style={styles.input}
            placeholder="login"
            onChangeText={(text) => { this.setState({ email: text }); }}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => { this.setState({ password: text }); }}
          />
          <View style={{felx:1, alignItems: 'center', justifyContent: 'center', }}>  
            <TouchableOpacity style={styles.touchable} onPress={() => { this.login() }}>
              <Text style={{fontWeight: "bold"}}>Log in</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row', marginTop:20,}}>
              <Text style={{color:'#f9e608'}}>Dont't have an account?</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Sign-up Page')}>
                <Text style={styles.link}> Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    // login function goes here
    login = async () => {
      let users = JSON.parse(await AsyncStorage.getItem("@users"));
      var length = users.length;
      var authorise = false;
      for (let i =0; i<length; i++){
        if (this.state.email == users[i].email && this.state.password == users[i].password){
          authorise = true;
        }
      }
      if (authorise == true){
        this.props.navigation.navigate('Home');
      }
      else{
        alert('Login or password incorrect ');
      }
    }
}

const styles = StyleSheet.create({
  container: {
    felx:1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(24, 26, 32)',
    height:'100%',
    width:'100%',
  },
  input: {
    width: 300,
    height: 40,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  touchable:{
    felx:1,
    padding:30,
    backgroundColor:'#f9e608',
    margin: 10,
    textAlign:'center',
    borderRadius:5,
  },
  button: {
    margin: 10,
    marginVertical: 20,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  link:{
    color:'blue'
  },
});

export default Login;