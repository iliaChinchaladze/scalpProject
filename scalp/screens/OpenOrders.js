import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Modal, TextInput, Image, TouchableOpacity, FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Binance from 'binance-api-react-native';

class OpenOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            confirmationCancel: false,
        };
    }
    //display all the open orders
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.showOpenOrders();
        });
    }
    cancelOrder = async () => {
        let cancelId = await AsyncStorage.getItem("@cancelId");
        let cancelSymbol = await AsyncStorage.getItem("@cancelSymbol");
        const binanceClient = Binance({
            apiKey: await AsyncStorage.getItem("@api-key"),
            apiSecret: await AsyncStorage.getItem("@api-secret"),
        })
        console.log(await binanceClient.cancelOrder({
            symbol: cancelSymbol,
            orderId: cancelId
        }));
        this.props.navigation.navigate('Home');
    }
    modalFunction() {
        if (this.state.confirmationCancel) {
            return (
                <Modal
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Cancel order by pressing button below{this.state.amountToBid}</Text>
                            <TouchableOpacity onPress={() => this.cancelOrder()}>
                                <Text style={styles.modalText}>Cancel Order</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ confirmationCancel: false })}>
                                <Text style={styles.modalText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            );
        }
        return
    }

    render() {
        //devider for open orders
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
                <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.flatListText}>Symbol</Text>
                    <Text style={styles.flatListText}>Type</Text>
                    <Text style={styles.flatListText}>Order Id</Text>
                </View>
                < View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                    {this.modalFunction()}
                    <FlatList
                        style={styles.cryptoFound}
                        data={this.state.orders}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={async () => {
                                    await AsyncStorage.setItem('@cancelSymbol', item.symbol),
                                    await AsyncStorage.setItem('@cancelId', JSON.stringify(item.orderId)),
                                    this.setState({confirmationCancel: true})
                                }}
                                style={styles.eachCrypto}
                            >
                                <Text style={styles.flatListText}>
                                    {item.symbol}
                                </Text>
                                <Text style={styles.flatListText}>
                                    {item.side}
                                </Text>
                                <Text style={styles.flatListText}>
                                    {item.orderId}
                                </Text>

                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => item.orderId}
                        ItemSeparatorComponent={ItemDivider}
                    />
                </View>
            </View>
        );
    }
    //API call. gets the data for the open orders and setState
    showOpenOrders = async () => {
        const binanceClient = Binance({
            apiKey: await AsyncStorage.getItem("@api-key"),
            apiSecret: await AsyncStorage.getItem("@api-secret"),
        })
        const firstCoin = await AsyncStorage.getItem("@coinOrders");
        const secondCoin = await AsyncStorage.getItem("@secondCoin");
        const data = await binanceClient.openOrders({ symbol: firstCoin + secondCoin })
        this.setState({
            orders: data,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        backgroundColor: 'rgb(24, 26, 32)',
        height: "100%",
        width: '100%',
    },
    guide: {
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
    touchable: {
        padding: 30,
        backgroundColor: '#f9e608',
        margin: 10,
        textAlign: 'center',
        borderRadius: 5,
    },
    eachCrypto: {
        flex: 1,
        flexDirection: 'row',
    },
    flatListText: {
        fontSize: 20,
        padding: 5,
        fontWeight: "bold",
        color: '#f9e608',
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

});

export default OpenOrders;