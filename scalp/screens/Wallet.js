import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, FlatList
} from 'react-native';
import Binance from 'binance-api-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


class Wallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balanceInfo: [],
            balance:'',
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
                    <FlatList
                        style={styles.cryptoFound}
                        data={this.state.balanceInfo}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={async () => {
                                    //await AsyncStorage.setItem('@firstCoin', item.cryptoId);
                                    //this.setState({ buyOrderAmount: parseFloat(item.price).toFixed(2), confiramtionBuyVisible: true })
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
    calculateBalance = async () => {
        const binanceClient = Binance();
        const info =(await binanceClient.prices());
        for (let obj of this.state.balanceInfo) {
            if(obj.asset != "USDT"){
                const symbolz = obj.asset+"USDT";
                const currPrice = info[symbolz];
                const amountInDollars = currPrice*obj.free;
                this.setState({
                    balance : balnace + amountInDollars,
                })
            }
            else{
                this.setState({
                    balance : balnace + obj.free,
                })
            }
        }
        console.log(this.state.balance);
    }

    displayBalance = async () => {
        const binanceClient = Binance({
            apiKey: 'rXlac1IZ8KyegOHw8OvFBraaZQgaKPqYyw0lvBr5nI1RH42N809r2upYPseVaRa9',
            apiSecret: 'rd3TVSOnpy8Udopfv2fp2up6kYxB4Lp0XyrEUSZZ4HmnQhRlSoZQEdZ3qr9rIZFH',
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