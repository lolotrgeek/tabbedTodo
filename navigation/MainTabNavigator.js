import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProjectScreen from '../screens/ProjectScreen';
import JournalScreen from '../screens/JournalScreen';
import TodoScreen from '../screens/TodoScreen';
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

/**
 * Home Stack
 */
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
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
  ),
};
HomeStack.path = '';

/**
 * Journal Stack
 */
const JournalStack = createStackNavigator(
  {
    Journal: JournalScreen,
  },
  config
);
JournalStack.navigationOptions = {
  tabBarLabel: 'Journal',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};
JournalStack.path = '';

/**
 * Project Stack
 */
const ProjectStack = createStackNavigator(
  {
    Project: ProjectScreen
  },
  config
);

ProjectStack.navigationOptions = {
  tabBarLabel: 'Projects',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  initialRouteName: 'Project',

};
ProjectStack.path = '';

/**
 * TodoStack
 */
const TodoStack = createStackNavigator(
  {
    Links: TodoScreen,
  },
  config
);

TodoStack.navigationOptions = {
  tabBarLabel: 'Todos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};
TodoStack.path = '';

/**
 * SettingStack
 */
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

/**
 * Exports
 */
const tabNavigator = createBottomTabNavigator({
  HomeStack,
  ProjectStack,
  JournalStack,
  TodoStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
