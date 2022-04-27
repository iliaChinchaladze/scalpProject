import React, { Component, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal,
} from 'react-native';

require('dotenv').config();

const ccxt = require('ccxt');
const axios = require('axios');

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';



class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      orderBookData: [],
      firstCrypto: 'BTC',
      secondCrypto: 'USDT',
      currPrice: '',
      prevPrice: "",
      priceUp: false,
      modalVisible: false,
      confiramtionSellVisible: false,
      confiramtionBuyVisible: false,
      liquidationVisible: false,
      amountToBid: '0',
      sellOrderAmount:'',
      buyOrderAmount:'',
    };
  }
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getCurrencies();
      this.displayBook();
    });
  }
  getCurrencies = async () => {
    this.setState({
      firstCrypto: await AsyncStorage.getItem('@firstCoin'),
      secondCrypto: await AsyncStorage.getItem('@secondCoin'),
    })
  }
  modalFunction () {
    if(this.state.modalVisible){
      return(
        <Modal
        animationType="slide"
        transparent={true}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose amount to bid</Text>
            <TouchableOpacity onPress={() => this.setState({amountToBid:'5'})}>
              <Text style={styles.modalText}>$5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({amountToBid:'10'})}>
              <Text style={styles.modalText}>$10</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({amountToBid:'50'})}>
              <Text style={styles.modalText}>$50</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({amountToBid:'100'})}>
              <Text style={styles.modalText}>$100</Text>
            </TouchableOpacity>
            <TextInput
            style={styles.modalInput}
            placeholder="$"
            keyboardType='numeric'
            maxLength={6}
            onChangeText={(text) => { this.setState({ amountToBid: text }); }}
            />
            <Text style={styles.modalText}>Amount to bid ${this.state.amountToBid}</Text>
            <TouchableOpacity onPress={() => this.setState({modalVisible:false})}>
              <Text style={styles.modalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      );
    } 
    return
  }
  confirmationSellFunction () {
    if(this.state.confiramtionSellVisible){
      if(this.state.amountToBid!=0){
        return(
          <Modal
          animationType="slide"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Sell Order will be placed at value: ${this.state.sellOrderAmount}</Text>
              <Text  style={styles.modalText}>with an amount of ${this.state.amountToBid}</Text>
              <Text style={styles.modalText}>Please press ok to confirm</Text>
              <TouchableOpacity onPress={() => this.setState({confiramtionSellVisible:false})}>
                <Text style={styles.modalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        );
      }
      else{
        return(
          <Modal
          animationType="slide"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Please chooose an amount from top left corner before bidding</Text>
              <TouchableOpacity onPress={() => this.setState({confiramtionSellVisible:false})}>
                <Text style={styles.modalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        );
      }
    } 
    return
  }
  confirmationBuyFunction () {
    if(this.state.confiramtionBuyVisible){
      if(this.state.amountToBid!=0){
        return(
          <Modal
          animationType="slide"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Buy Order will be placed at value: ${this.state.buyOrderAmount}</Text>
              <Text  style={styles.modalText}>with an amount of ${this.state.amountToBid}</Text>
              <Text style={styles.modalText}>Please press ok to confirm</Text>
              <TouchableOpacity onPress={() => this.setState({confiramtionBuyVisible:false})}>
                <Text style={styles.modalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        );
      }
      else{
        return(
          <Modal
          animationType="slide"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Please chooose an amount from top left corner before bidding</Text>
              <TouchableOpacity onPress={() => this.setState({confiramtionBuyVisible:false})}>
                <Text style={styles.modalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        );
      }
    } 
    return
  }

  render() {
    const testStyles = {
      popup: {
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
          <View style={{flex:1, flexDirection:'row', justifyContent:"flex-end",}}>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.setState({modalVisible: true})}>
              <View style={{ felx: 1 }}>
                <Text>💧</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.setState({modalVisible: true})}>
              <View style={{ felx: 1 }}>
                <Image style={{ width: 25, height: 20 }} source={require('../assets/moneyIcon.png')} />
              </View>
            </TouchableOpacity>
          </View>
          {this.modalFunction()}
        </View>

        <View style={{ height: '45%', width: 400 }}>
        {this.confirmationSellFunction()}
          <FlatList
            style={styles.cryptoFound}
            data={this.state.orderBookData.asks}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={async () => {
                  //await AsyncStorage.setItem('@firstCoin', item.cryptoId);
                  this.setState({sellOrderAmount: item[0].toFixed(2), confiramtionSellVisible: true})
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
                  {(item[1] * item[0]).toFixed(1)}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => item.toString()}
            ItemSeparatorComponent={ItemDividerSell}
          />
        </View>

        <Text style={testStyles.popup}>{this.state.currPrice}</Text>


        <View style={{ height: '45%', width: 400 }}>
        {this.confirmationBuyFunction()}
          <FlatList
            style={styles.cryptoFound}
            data={this.state.orderBookData.bids}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={async () => {
                  //await AsyncStorage.setItem('@firstCoin', item.cryptoId);
                  this.setState({buyOrderAmount: item[0].toFixed(2), confiramtionBuyVisible: true})
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
                  {(item[1] * item[0]).toFixed(1)}
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
  comparePrices = async () => {
    const prevPrice = await AsyncStorage.getItem("@prevCoin");
    if (prevPrice == null) {
      this.setState({
        priceUp: true
      })
    }
    else if (prevPrice > this.state.currPrice) {
      this.setState({
        priceUp: false
      })
    }
    else if (prevPrice < this.state.currPrice) {
      this.setState({
        priceUp: true
      })
    }
    else if (prevPrice == this.state.currPrice) {
      this.setState({
        priceUp: true
      })
    }
    else {
      console.log('something went wrong')
      console.log(prevPrice, this.state.currPrice);
    }
  }
  displayBook = async () => {
    const binanceClient = new ccxt.binance({

    });
    const prevPrice = await AsyncStorage.getItem("@prevCoin");
    setInterval(async () => {
      const coinOne = await AsyncStorage.getItem("@firstCoin");
      const coinTwo = await AsyncStorage.getItem("@secondCoin");
      const orders = await binanceClient.fetchOrderBook(coinOne + '/' + coinTwo);
      const currPrice = await binanceClient.fetchTicker(coinOne + '/' + coinTwo);
      this.comparePrices();
      this.setState({
        orderBookData: orders,
        currPrice: currPrice.ask.toFixed(2),
      })
      await AsyncStorage.setItem("@prevCoin", currPrice.ask);
    }, 3000);
  }

}

const styles = StyleSheet.create({
  container: {
    felx: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: 'rgb(24, 26, 32)',
    height: '100%',
  },
  touchableContainer: {
    felx: 1,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eachCrypto: {
    flex: 1,
    flexDirection: 'row',
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
    backgroundColor: 'rgb(32, 33, 36)',
  },
  textStyleBuy: {
    fontSize: 12,
    paddingBottom: 5,
    color: "green",
    fontWeight: "bold",
  },
  textStyleSell: {
    fontSize: 12,
    paddingBottom: 5,
    color: "red",
    fontWeight: "bold"
  },
  textPriceStyle: {
    fontSize: 18,
  },
  touchable: {
    felx: 1,
    padding: 10,
    backgroundColor: '#f9e608',
    textAlign: 'center',
    borderRadius: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: '#f9e608',
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgb(32, 33, 36)",
    borderRadius: 20,
    borderColor: 'f9e608',
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalInput: {
    width: '30%',
    backgroundColor: 'rgb(32, 33, 36)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#f9e608',
    borderRadius:5,
    borderWidth: 1,
    marginBottom: 10,
    textAlign: "center",
    color: '#f9e608',
    fontSize: 16,
    marginBottom: 10,
  },

});

export default Home;

