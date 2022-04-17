import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, ImageBackground, processColor, 
} from 'react-native';

require('dotenv').config();
const ccxt = require('ccxt');
const axios = require('axios');

import AsyncStorage from '@react-native-async-storage/async-storage';

import backImg from './logos/backgroundImage.JPG';

class Home extends Component {
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
          <Text>IM HOME</Text>
          <TouchableOpacity style={styles.touchable} onPress={() => { this.displayBook() }}><Text>orderbook</Text>
        </TouchableOpacity>
        </View>
      );
    }
    displayBook =async()=>{
         const binanceClient =new ccxt.binance({
             apiKey: process.env.API_KEY,
             secret: process.env.API_SECRET
         });
        const orders = await binanceClient.fetchOrderBook('BTC/USDT');
        console.log(orders);
    }
    
}

const styles = StyleSheet.create({
  container: {
    felx:1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:30,
  },
});

export default Home;