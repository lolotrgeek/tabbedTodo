import * as React from 'react';
import { Platform } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProjectScreen from '../screens/ProjectScreen';
import JournalScreen from '../screens/JournalScreen';
import TodoScreen from '../screens/TodoScreen';
import SettingsScreen from '../screens/SettingsScreen';


/**
 * Main stack
 */
const Tab = createBottomTabNavigator();
export default function MainStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        options={HomeTab.options}
        component={HomeTab}
      />
      <Tab.Screen
        name='Settings'
        options={SettingsTab.options}
        component={SettingsTab}
      />
    </Tab.Navigator>
  )
}

/**
 * Home Tab
 */
const HomeStack = createStackNavigator();
const ProjectStack = createStackNavigator();
const HomeTab = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Projects" component={ProjectScreen} />
      <HomeStack.Screen name="Journal" component={JournalScreen} />
      <HomeStack.Screen name="Todo" component={TodoScreen} />
    </HomeStack.Navigator>
  )
}
HomeTab.options = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  )
}


/**
 * Setting Tab
 */
const SettingsStack = createStackNavigator();
const SettingsTab = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} >
      </SettingsStack.Screen>
    </SettingsStack.Navigator>

  )
}
SettingsTab.options = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};