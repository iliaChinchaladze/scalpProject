import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './screens/loginPage';
import Signup from './screens/signupPage';
import Home from './screens/Home';
import Settings from './screens/Settings';
import Coins from './screens/Coins';
import Wallet from './screens/Wallet';
import OpenOrders from './screens/OpenOrders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreenNav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: {} }}>
      <Tab.Screen name='coins' component={Coins} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>🪙</Text>) }} />
      <Tab.Screen name="home" component={Home} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>🏡</Text>) }} />
      {/* <Tab.Screen name='settings' component={Settings} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>⚙️</Text>) }} /> */}
      <Tab.Screen name='wallet' component={Wallet} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>👛</Text>)}}/>
    </Tab.Navigator>
  );
}


class todo extends Component {
  render() {
    return (
      // eslint-disable-next-line no-use-before-define
      <View style={styles.container}>
        <NavigationContainer>
        <StatusBar hidden />
          <Stack.Navigator initialRouteName="loginPage">
            <Stack.Screen name="Login Page" component={Login}  options={{ headerShown: false }}/>
            <Stack.Screen name="Sign-up Page" component={Signup}   options={{ headerShown: false }}/>
            <Stack.Screen name="Home" component={HomeScreenNav} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
            <Stack.Screen name="OpenOrders" component={OpenOrders} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
  },
});
export default todo;
