import React, { Component } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';


class Coins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cryptoCurrencies: [],
            firstCrypto:'BTC',
            cryptoCurrencies2: [],
            secondCrypto:'USDT',
        };
    }
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getCurrencies();
        });
    }

    getCurrencies = async () => {
        this.setState({
            cryptoCurrencies: [
                { 'cryptoId': 'BTC' },
                { 'cryptoId': 'ETH' },
                { 'cryptoId': 'SAND' },
                { 'cryptoId': 'BNB' },
                { 'cryptoId': 'MATIC' },
            ],
            cryptoCurrencies2: [
                { 'cryptoId': 'USDT' },
                { 'cryptoId': 'BUSD' },
                { 'cryptoId': 'USDC' },
            ]
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={{
                    fontSize: 22,
                    textAlign: 'center',
                    alignSelf: 'center',
                    color: '#f9e608',
                }}
                >
                    Choose First Coin
                </Text>
                <View style={{height:200}}>
                <FlatList
                    style={styles.cryptoFound}
                    data={this.state.cryptoCurrencies}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={async () => {
                                await AsyncStorage.setItem('@firstCoin', item.cryptoId);
                                this.setState({firstCrypto: item.cryptoId})
                            }}
                            style={styles.eachCrypto}
                        >
                            <Text style={styles.textStyle}>
                                {item.cryptoId}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => item.cryptoId.toString()}
                />
                </View>
                <Text style={{
                    fontSize: 22,
                    textAlign: 'center',
                    alignSelf: 'center',
                    color: '#f9e608',
                }}
                >
                    Choose Second Coin
                </Text>
                <View style={{height:150}}>
                <FlatList
                    style={styles.cryptoFound}
                    data={this.state.cryptoCurrencies2}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={async () => {
                                await AsyncStorage.setItem('@secondCoin', item.cryptoId);
                                this.setState({secondCrypto: item.cryptoId})
                            }}
                            style={styles.eachCrypto}
                        >
                            <Text style={styles.textStyle}>
                                {item.cryptoId}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => item.cryptoId.toString()}
                />
                </View>
                <View style={{flex:1, alignItems: 'center', justifyContent: 'center',}}>
                    <TouchableOpacity style={styles.touchable}
                        onPress={() => this.props.navigation.navigate('home')}>
                            <Text style={{fontWeight: "bold",justifyContent: 'center', alignSelf: 'center'}}>{this.state.firstCrypto}/{this.state.secondCrypto}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: 'rgb(24, 26, 32)',
        height:"100%",
    },
    touchableContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eachCrypto:{
        paddingBottom:30,
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
    textStyle: {
        fontSize: 24,
    },
    touchable:{
        padding:10,
        backgroundColor:'#f9e608',
        textAlign:'center',
        borderRadius:5,    
    },
});

export default Coins;

