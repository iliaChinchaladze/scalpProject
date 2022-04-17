import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, ImageBackground, 
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import backImg from './logos/backgroundImage.JPG';

class Coins extends Component {
    constructor(props) {
      super(props);
      this.state = {
        API_KEY: '',
        API_SECRET: '',
      };
    }
  
    render() {
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Api Key"
            autoCompleteType="off"
            onChangeText={(text) => { this.setState({ API_KEY: text }); }}
          />
          <TextInput
            style={styles.input}
            placeholder="Api Secret"
            secureTextEntry
            autoCompleteType="off"
            onChangeText={(text) => { this.setState({ API_SECRET: text }); }}
          />
          <View style={{felx:1, }}>  
            <TouchableOpacity style={styles.touchable} onPress={() => { this.login() }}>
              <Text>Save Api</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
}

const styles = StyleSheet.create({
  container: {
    felx:1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:60,
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

export default Coins;