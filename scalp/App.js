import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from './screens/loginPage';
import Signup from './screens/signupPage';
import Home from './screens/Home';
import Settings from './screens/settings';
import Coins from './screens/Coins';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreenNav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: {} }}>
      <Tab.Screen name="home" component={Home} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>🏡</Text>) }} />
      <Tab.Screen name='settings' component={Settings} options={{ tabBarIcon: () => (<Text style={{ fontSize: 25 }}>⚙️</Text>) }} />
    </Tab.Navigator>
  );
}

class todo extends Component {
  render() {
    return (
      // eslint-disable-next-line no-use-before-define
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="loginPage">
            <Stack.Screen name="Login Page" component={Login} />
            <Stack.Screen name="Sign-up Page" component={Signup} />
            <Stack.Screen name="Home" component={HomeScreenNav} options={{ headerShown: false }} />
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
