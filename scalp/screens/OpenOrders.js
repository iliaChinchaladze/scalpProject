import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Binance from 'binance-api-react-native';

class OpenOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
        };
    }
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.showOpenOrders();
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
                        data={this.state.orders}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={async () => {

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
                                    {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(item.time)}
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
    showOpenOrders = async () => {
        const binanceClient = Binance({
            apiKey: await AsyncStorage.getItem("@api-key"),
            apiSecret: await AsyncStorage.getItem("@api-secret"),
        })
        const firstCoin = await AsyncStorage.getItem("@coinOrders");
        const secondCoin = await AsyncStorage.getItem("@secondCoin");
        const data = await binanceClient.openOrders({ symbol: firstCoin + secondCoin })
        console.log(data)
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
        justifyContent: "space-between",
    },
    flatListText: {
        fontSize: 29,
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

});

export default OpenOrders;