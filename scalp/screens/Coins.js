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
export default Coins;