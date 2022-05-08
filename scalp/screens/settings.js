import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity, ImageBackground,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class Settings extends Component {
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
        <Image
            style={{ width: 150, height: 150, alignSelf: 'center', borderRadius:50, margin:10, }}
            source={require('./logos/Scalp-logos.jpeg')}
          />
        <View style={styles.guide}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 18,
            textAlign: 'center',
            alignSelf: 'center',
            color: 'rgb(24, 26, 32)',
          }}
          >
            In order to use an app on full capabilities set up an API from your binance account,
            make sure trading is enabled and input your API key and secret in text input below.
          </Text>
        </View>
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
        <View style={{ flex: 1, }}>
          <TouchableOpacity style={styles.touchable} onPress={() => {this.handleSubmit()}}>
            <Text>Save Api</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  handleSubmit= async()=>{
    await AsyncStorage.setItem("@api-key", this.state.API_KEY)
    await AsyncStorage.setItem("@api-secret", this.state.API_SECRET);
    this.props.navigation.navigate('Home');
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
    width:'100%'
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
  button: {
    margin: 10,
    marginVertical: 20,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  link: {
    color: 'blue'
  },
});

export default Settings;