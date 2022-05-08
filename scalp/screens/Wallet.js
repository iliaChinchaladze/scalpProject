import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, FlatList, Alert
} from 'react-native';
import Binance from 'binance-api-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balanceInfo: [],
            balance:0,
        };
    }
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.displayBalance();
            this.calculateBalance();
        });
    }
    

    render() {
        const ItemDivider = () => {
            return (
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: '#f9e608',
                }}
              />
            );
          }
        return (
            <View style={styles.container}>
                < View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    <Text style={{fontSize: 30, color: 'white', marginTop: 35}}>Balance Total ${this.state.balance}</Text>
                    <FlatList
                        style={styles.cryptoFound}
                        data={this.state.balanceInfo}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={async () => {
                                    this.showOpenOrders(item.asset)
                                }}
                                style={styles.eachCrypto}
                            >
                                <Text style={styles.flatListText}>
                                    {item.asset}
                                </Text>
                                <Text style={styles.flatListText}>
                                    {parseFloat(item.free).toFixed(5)}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => item.asset}
                        ItemSeparatorComponent={ItemDivider}
                    />
                </View>
            </View>
        );
    }
    showOpenOrders =async(item)=>{
        const binanceClient = Binance({
            apiKey: await AsyncStorage.getItem("@api-key"),
            apiSecret:await AsyncStorage.getItem("@api-secret"),
          })
          const firstCoin = await AsyncStorage.setItem("@coinOrders", item);
          const secondCoin = await AsyncStorage.getItem("@secondCoin");
          const order = await binanceClient.openOrders({symbol: item+secondCoin});
          if(order.length===0) {
              Alert.alert('No open orders found for this symbol');
          }
          else{
            this.props.navigation.navigate("OpenOrders");
          }
    }
    calculateBalance = async () => {
        const binanceClient = Binance();
        const info =(await binanceClient.prices());
        var finalBalance = 0;
        for (let obj of this.state.balanceInfo) {
            if(obj.asset != "USDT" && obj.asset!='SOLO'){
                const symbolz = obj.asset+"USDT";
                const currPrice = info[symbolz];
                const amountInDollars = currPrice*obj.free;
                finalBalance += parseFloat(amountInDollars);
            }
            else if(obj.asset == 'SOLO'){

            }
            else{
                finalBalance += parseFloat(obj.free);
            }
        }
        this.setState({
            balance: finalBalance.toFixed(2),
        })
    }

    displayBalance = async () => {
        const binanceClient = Binance({
            apiKey: await AsyncStorage.getItem("@api-key"),
            apiSecret: await AsyncStorage.getItem("@api-secret"),
        })
        const accountInfo = await binanceClient.accountInfo();
        const toSend = [];
        for (let obj of accountInfo.balances) {
            if (obj.free > 0) {
                toSend.push(obj);
            }
        }
        this.setState({
            balanceInfo: toSend,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(24, 26, 32)',
        height: '100%',
        width: '100%',
    },
    touchable: {
        padding: 30,
        backgroundColor: '#f9e608',
        margin: 10,
        textAlign: 'center',
        borderRadius: 5,
    },
    button: {
        margin: 10,
        marginVertical: 20,
    },
    eachCrypto: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
      },
    flatListText: {
        fontSize: 29,
        paddingBottom: 5,
        fontWeight: "bold",
        color: '#f9e608',
      },
});

export default Wallet;