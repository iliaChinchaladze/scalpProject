import React, { Component, useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal, map, TextInput
} from 'react-native';


import Binance from 'binance-api-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


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
      limit:"",
      indicatorValue:0,
      finalIndicator:0,
      indicatorUp: false,
    };
  }
  componentDidMount() {
    //this functions are run every time page is visited
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      //get currencies to observe
      this.getCurrencies();
      //displays orderboock, current price and indicator. Runs on timer
      this.displayBook();
      //clears indicator in order to avoid errors
      this.restartIndicator();
    });
  }
  //in order to prevent indicators from other values mixing up
  restartIndicator(){
    this.state.finalIndicator=0;
  }
  //load currencies that need to be displayed
  getCurrencies = async () => {
    this.setState({
      firstCrypto: await AsyncStorage.getItem('@firstCoin'),
      secondCrypto: await AsyncStorage.getItem('@secondCoin'),
    })
  }
  //modal function to choose amount to bid
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
            <TouchableOpacity onPress={() => this.setState({amountToBid:'20'})}>
              <Text style={styles.modalText}>$20</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({amountToBid:'30'})}>
              <Text style={styles.modalText}>$30</Text>
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
  //modal function for liquidation 
  liquiditationFunction(){
    if(this.state.liquidationVisible){
      return(
        <Modal
        animationType="slide"
        transparent={true}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>In order to liquidate an order, navigate to a wallet page and choose the currency</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('wallet')}>
              <Text style={styles.modalText}>Navigate to the wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({liquidationVisible:false})}>
              <Text style={styles.modalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      );
    }
    return
  }
  //modal for sell order confiramtion
  //if amount to bid is 0 display different content
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
              <TouchableOpacity onPress={() => this.makeSellOrder()}>
                <Text style={styles.modalText}>OK</Text>
              </TouchableOpacity>
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
  //API call for putting limit sell order
  makeSellOrder= async () =>{
    console.log('makeASellOrder');
    const coinOne = await AsyncStorage.getItem("@firstCoin");
    const coinTwo = await AsyncStorage.getItem("@secondCoin");
    const quantity = Math.round(parseFloat(this.state.amountToBid/this.state.currPrice));
    const binanceClient = Binance({
      apiKey: await AsyncStorage.getItem("@api-key"),
      apiSecret: await AsyncStorage.getItem("@api-secret"),
    })
    console.log(await binanceClient.order({
      symbol: coinOne+coinTwo,
      side: 'SELL',
      type: 'LIMIT',
      quantity: quantity,
      price: this.state.currPrice,
    }));
  }
  //API call for puttting limit buy order
  makeBuyOrder= async () =>{
    const coinOne = await AsyncStorage.getItem("@firstCoin");
    const coinTwo = await AsyncStorage.getItem("@secondCoin");
    const quantity = Math.round(parseFloat(this.state.amountToBid/this.state.currPrice));

    const binanceClient = Binance({
      apiKey: await AsyncStorage.getItem("@api-key"),
      apiSecret: await AsyncStorage.getItem("@api-secret"),
    })
    console.log(await binanceClient.order({
      symbol: coinOne+coinTwo,
      side: 'BUY',
      type: 'LIMIT',
      quantity: quantity,
      price: this.state.currPrice,
    }));
  }
  //modal for buy order confiramtion
  //if amount to bid is 0 display different content
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
              <TouchableOpacity onPress={() => this.makeBuyOrder()}>
                <Text style={styles.modalText}>OK</Text>
              </TouchableOpacity>
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

//conditional style rendering for price and indicator
  render() {
    const testStyles = {
      popup: {
        color: this.state.priceUp ? "green" : "red",
        fontSize: 18,
        flex:1,
        fontWeight: "bold",
      },
      indicator:{
        backgroundColor: this.state.indicatorUp ? 'green' : 'red',
        width:"50%",
        borderRadius:5,
        height:'80%',
        flex:1,
      },
    };
    // item deviders for flatlist
    // puts lines between orders red lines for sell orders and green lines for buy orders 
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
            <View style={{ flex: 1,  }}>
              <Text style={{ fontWeight: "bold",justifyContent: 'center', alignSelf: 'center'}}>{this.state.firstCrypto}/{this.state.secondCrypto}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={{flex:1, flexDirection:'row', justifyContent:"flex-end"}}>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.setState({liquidationVisible: true})}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Image style={{ width: 25, height: 20 }} source={require('../assets/dropletIcon.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable}
              onPress={() => this.setState({modalVisible: true})}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Image style={{ width: 25, height: 20 }} source={require('../assets/moneyIcon.png')} />
              </View>
            </TouchableOpacity>
          </View>
          {this.liquiditationFunction()}
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
                  this.setState({sellOrderAmount: parseFloat(item.price).toFixed(2), confiramtionSellVisible: true})
                }}
                style={styles.eachCrypto}
              >
                <Text style={styles.textStyleSell}>
                  {parseFloat(item.price).toFixed(2)}
                </Text>
                <Text style={styles.textStyleSell}>
                  {parseFloat(item.quantity).toFixed(5)}
                </Text>
                <Text style={styles.textStyleSell}>
                  {(item.price * item.quantity).toFixed(1)}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => (item.quantity*item.price).toString()}
            ItemSeparatorComponent={ItemDividerSell}
          />
        </View>

        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',width:'80%',height:'80%',alignItems:'center',alignSelf:'center'}}>
          <Text style={testStyles.popup}>{this.state.currPrice}</Text>
          <View style={testStyles.indicator}>
            <Text style={{textAlign:'center',
                          fontSize:16,
                          fontWeight: "bold",
                          alignSelf: 'center',
                          justifyContent: 'center'}}>
                {this.state.finalIndicator}
              </Text>
          </View>
        </View>

        <View style={{ height: '45%', width: 400, }}>
        {this.confirmationBuyFunction()}
          <FlatList
            style={styles.cryptoFound}
            data={this.state.orderBookData.bids}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={async () => {
                  //await AsyncStorage.setItem('@firstCoin', item.cryptoId);
                  this.setState({buyOrderAmount: parseFloat(item.price).toFixed(2), confiramtionBuyVisible: true})
                }}
                style={styles.eachCrypto}
              >
                <Text style={styles.textStyleBuy}>
                  {parseFloat(item.price).toFixed(2)}
                </Text>
                <Text style={styles.textStyleBuy}>
                  {parseFloat(item.quantity).toFixed(5)}
                </Text>
                <Text style={styles.textStyleBuy}>
                  {(item.quantity * item.price).toFixed(1)}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => (item.quantity*item.price).toString()}
            ItemSeparatorComponent={ItemDividerBuy}
          />
        </View>
      </View>
    );
  }
  //function that compares price to previous price
  //to determine if price increased or decrease, following that conditional styling is applied
  comparePrices = async () => {
    const prevPrice = await AsyncStorage.getItem("@prevCoin");
    // on a first run previous price is null and price will show up as green
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
    //in case previous price equals current price keep price green
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
  // function that adds indicators and also checks if indicator is positive or negative nad styles accordingly
  compareIndicator = async() =>{
    var finalValue = parseFloat(this.state.finalIndicator) + parseFloat(this.state.indicatorValue);
    this.setState({
      finalIndicator: (finalValue).toFixed(2),
    })
    if (finalValue == null) {
      this.setState({
        indicatorUp: true
      })
    }
    else if (finalValue < 0) {
      this.setState({
        indicatorUp: false
      })
    }
    else if (finalValue > 0) {
      this.setState({
        indicatorUp: true
      })
    }
  }
  displayBook = async () => {
    //create a client for a library that supports API calls
    const binanceClient = Binance({
      apiKey: await AsyncStorage.getItem("@api-key"),
      apiSecret:await AsyncStorage.getItem("@api-secret"),
    })
    //function that runs on timer and updates the data
    setInterval(async () => {
      //load currecies that will be used in API calls
      const coinOne = await AsyncStorage.getItem("@firstCoin");
      const coinTwo = await AsyncStorage.getItem("@secondCoin");  
      //get the current price of an asset that will be parsed later
      const info =(await binanceClient.prices());
      //create a symbol to pass to an API call
      const symbolz = coinOne+coinTwo;
      //parse the info to get the price in format that we need
      const currPrice = info[symbolz];
      //get order book reading
      const orders = await binanceClient.book({ symbol: coinOne+coinTwo, limit: 15 });
      //creating variables to calculate total bids and asks
      let totalAsks =0;
      let totalBids =0;
      //go through asks and calculate voulme of sellers
      for(let obj of orders.asks){
        //calculate total ask for each object by multiplying ask price by quantity
        totalAsks = totalAsks + (obj.price*obj.quantity);
      }
      //go through asks and calculate voulme of buyers
      for(let obj of orders.bids){
        //calculate total ask for each object by multiplying buy price by quantity
        totalBids = totalBids + (obj.price*obj.quantity);
      }
      //get the differance betweeen binds and asks
      const total = parseFloat(totalBids-totalAsks);
      //set order book data, current price and indicator that will be added to total.
      this.setState({
        orderBookData: orders,
        currPrice: parseFloat(currPrice).toFixed(2),
        indicatorValue : total.toFixed(2),
      })
      //function that adds the price to total indicator
      this.compareIndicator();
      //function that checks if indicator is positive or negative and style accordingly
      this.comparePrices();
      //set previous coin for price comparison
      await AsyncStorage.setItem("@prevCoin", parseFloat(currPrice).toFixed(2));
      //time in which function wil re-run
    }, 5000);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: 'rgb(24, 26, 32)',
    height: '100%',
    width:'100%',
    justifyContent:'space-between',
  },
  touchableContainer: {
    width: '80%',
    height: '6.8%',
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
    flex: 1,
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
    borderColor: '#f9e608',
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

