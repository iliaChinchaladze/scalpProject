import React, { Component, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, Image,
} from 'react-native';

require('dotenv').config();

const ccxt = require ('ccxt');
const axios = require('axios');

import AsyncStorage from '@react-native-async-storage/async-storage';



class Home extends Component {

    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        orderBookData : [],
        firstCrypto:'BTC',
        secondCrypto: 'USDT',
        currPrice:'',
        prevPrice:"",
        priceUp: false,
      };
    }
    componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.getCurrencies();
          this.displayBook();
      });
    }
    

    getCurrencies = async () =>{
      this.setState({
        firstCrypto: await AsyncStorage.getItem('@firstCoin'),
        secondCrypto: await AsyncStorage.getItem('@secondCoin'),
      })
    }

    render() {
      
      const testStyles = {
        popup:{
          color: this.state.priceUp ? "green" : "red",
          fontSize: 18,
          fontWeight: "bold"
        }
      }; 

      const ItemDividerBuy = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "green",
            }}
          />
        );
      }
      const ItemDividerSell = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "red",
            }}
          />
        );
      }
      return (
        <View style={styles.container}>
          <View style={styles.touchableContainer}>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.props.navigation.navigate('coins')}>
              <View style={{ felx: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{this.state.firstCrypto}/{this.state.secondCrypto}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.props.navigation.navigate('coins')}>
              <View style={{ felx: 1 }}>
                <Image style={{width:25, height:20}} source={require('../assets/moneyIcon.png')}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{height:'45%', width:400}}>
            <FlatList
                      style={styles.cryptoFound}
                      data={this.state.orderBookData.asks}
                      renderItem={({ item }) => (
                          <TouchableOpacity
                              onPress={async () => {
                                  //await AsyncStorage.setItem('@firstCoin', item.cryptoId);
                                  //this.setState({firstCrypto: item.cryptoId})
                              }}
                              style={styles.eachCrypto}
                          >
                              <Text style={styles.textStyleSell}>
                                  {item[0].toFixed(2)}
                              </Text>
                              <Text style={styles.textStyleSell}>
                                  {item[1]}
                              </Text>
                              <Text style={styles.textStyleSell}>
                                  {(item[1]*item[0]).toFixed(1)}
                              </Text>
                          </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => item.toString()}
                      ItemSeparatorComponent={ItemDividerSell}
                  />
          </View>

          <Text  style={testStyles.popup}>{this.state.currPrice}</Text> 

         
          <View style={{height:'45%', width:400}}>
            <FlatList
                      style={styles.cryptoFound}
                      data={this.state.orderBookData.bids}
                      renderItem={({ item }) => (
                          <TouchableOpacity
                              onPress={async () => {
                                  //await AsyncStorage.setItem('@firstCoin', item.cryptoId);
                                  //this.setState({firstCrypto: item.cryptoId})
                              }}
                              style={styles.eachCrypto}
                          >
                              <Text style={styles.textStyleBuy}>
                                  {item[0].toFixed(2)}
                              </Text>
                              <Text style={styles.textStyleBuy}>
                                  {item[1].toFixed(5)}
                              </Text>
                              <Text style={styles.textStyleBuy}>
                                  {(item[1]*item[0]).toFixed(1)}
                              </Text>
                          </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => item.toString()}
                      ItemSeparatorComponent={ItemDividerBuy}
                  />
          </View>
        </View>
      );
    }
    comparePrices = async()=>{
      const prevPrice =await AsyncStorage.getItem("@prevCoin");
      if(prevPrice==null){
        this.setState({
          priceUp: true
        }) 
      }
      else if (prevPrice > this.state.currPrice){
        this.setState({
          priceUp: false
        })
      }
      else if (prevPrice < this.state.currPrice){
        this.setState({
          priceUp: true
        })
      }
      else if (prevPrice == this.state.currPrice){
        this.setState({
          priceUp: true
        })
      }
      else{
        console.log('something went wrong')
        console.log(prevPrice,this.state.currPrice);
      }
    }
    displayBook =async()=>{
         const binanceClient =new ccxt.binance({
             
         }); 
      const prevPrice = await AsyncStorage.getItem("@prevCoin");
      setInterval(async() => {
        const coinOne = await AsyncStorage.getItem("@firstCoin");
        const coinTwo = await AsyncStorage.getItem("@secondCoin");
        const orders = await binanceClient.fetchOrderBook(coinOne+'/'+coinTwo);
        const currPrice = await binanceClient.fetchTicker (coinOne+'/'+coinTwo);
        this.comparePrices();
        this.setState({
          orderBookData: orders,
          currPrice: currPrice.ask,
        })
        await AsyncStorage.setItem("@prevCoin", currPrice.ask);
      }, 3000); 
    }
    
}

const styles = StyleSheet.create({
  container: {
    felx:1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: 'rgb(24, 26, 32)',
    height:'100%',
  },
  touchableContainer: {
    felx: 1,
    width:'80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eachCrypto: {
    flex:1,
    flexDirection:'row',
    justifyContent: "space-between",
  },
  cryptoFound: {
    width: '80%',
    margin: 10,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  textStyleBuy: {
    fontSize: 12,
    paddingBottom:5,
    color:"green",
    fontWeight: "bold",
  },
  textStyleSell: {
    fontSize: 12,
    paddingBottom:5,
    color:"red",
    fontWeight: "bold"
  },
  textPriceStyle: {
    fontSize: 18,
  },
  touchable:{
    felx:1,
    padding:10,
    backgroundColor:'#f9e608',
    textAlign:'center',
    borderRadius:5,    
  },
  
});

export default Home;

