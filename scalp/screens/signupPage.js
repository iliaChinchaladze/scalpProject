import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button, TextInput, Image, ScrollView, TouchableOpacity, Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class Signup extends Component {
    constructor(props) {
      super(props);
      this.state = {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          password1: '',
          userData: {
            userID:'',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
          },
      };
    }
    setData = async () => {
      let users = JSON.parse(await AsyncStorage.getItem("@users"));
      
      if (this.state.password !== this.state.password1) {
        //throw new Error('Passwords are not the same');
        alert('Passwords are not the same');
      } else if (this.state.first_name === '') {
        //throw new Error('Name can not be an empty space');
        alert('Name can not be an empty space');
      } else if (this.state.last_name === '') {
        //throw new Error('Surname can not be an empty space');
        alert('Surname can not be an empty space');
      } else if (this.state.email.includes('@') === false) {
        //throw new Error('Invalid Mail');
        alert('Invalid Mail');
      } else if (this.state.password.length < 6) {
        //throw new Error('Password needs to be greater then 6 characters');
        alert('Password needs to be greater then 6 characters');
      }
      else{
          this.state.userData.first_name = this.state.first_name;
          this.state.userData.last_name = this.state.last_name;
          this.state.userData.email = this.state.email;
          this.state.userData.password = this.state.password;

          
          if (users == null){
            let tosend =[{
              id:0,
              first_name:this.state.first_name,
              last_name:this.state.last_name,
              email:this.state.email,
              password:this.state.password
            }];
            await AsyncStorage.setItem("@users", JSON.stringify(tosend));
          }
          else{
            let length=users.length;
            let tosend ={
              id:length,
              first_name:this.state.first_name,
              last_name:this.state.last_name,
              email:this.state.email,
              password:this.state.password
            };
            users.push(tosend);
            await AsyncStorage.setItem("@users", [JSON.stringify(users)]);
            
          }
          this.props.navigation.goBack();
        }
    }
    // singup function goes here
    render() {
      return (
        <View style={styles.container}>
        <Image
          style={{ width: 150, height: 150, alignSelf: 'center', borderRadius:50, margin:10, }}
          source={require('./logos/Scalp-logos.jpeg')}
        />
        <TextInput
            style={styles.input}
            placeholder="Enter your first name..."
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
        />
        <TextInput
            style={styles.input}
            placeholder="Enter your last name..."
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
          />
        <TextInput
            style={styles.input}
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
        />
        <TextInput
            style={styles.input}
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
        />
        <TextInput
            style={styles.input}
            placeholder="Repeat your password..."
            onChangeText={(password1) => this.setState({ password1 })}
            value={this.state.password1}
            secureTextEntry
        />
        <View style={{ justifyContent: 'center', alignSelf:'center', marginBottom: 20, width:150, }}>
            <TouchableOpacity style={styles.touchable} onPress={() => this.setData()}>
              <Text style={{fontWeight: "bold"}}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchable} onPress={() => this.props.navigation.goBack()}>
              <Text style={{fontWeight: "bold"}}>Go Back</Text>
            </TouchableOpacity>
          </View>
      </View>
      );
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
    flex: 1,
    padding: 30,
    backgroundColor: '#f9e608',
    margin: 10,
    textAlign: 'center',
    borderRadius: 5,
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
  button: {
    margin: 10,
    marginVertical: 20,

  },
});

export default Signup;