import * as React from 'react';
import { Platform } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import ProjectScreen from '../screens/ProjectScreen';
import TimerScreen from '../screens/TimerScreen'
import TimerListScreen from '../screens/TimerListScreen'
// import TodoScreen from '../screens/TodoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditorScreen from '../screens/EditorScreen'
import TimerEditorScreen from '../screens/TimerEditorScreen'
import TimelineScreen from '../screens/TimelineScreen'



/**
 * Main stack
 */
const Tab = createBottomTabNavigator();
export default function MainStack() {
  return (
    <Tab.Navigator>


      <Tab.Screen
        name='Timeline'
        options={TimelineTab.options}
        component={TimelineTab}
      />
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
    <HomeStack.Navigator
      screenOptions={stackOptions}
    >
      <HomeStack.Screen name="Projects" component={ProjectScreen}   />
      <HomeStack.Screen name="Timer" component={TimerScreen}  />
      <HomeStack.Screen name="TimerList" component={TimerListScreen}  />
      <HomeStack.Screen name="TimerEditor" component={TimerEditorScreen}  />
      <HomeStack.Screen name="Edit" component={EditorScreen}  />
    </HomeStack.Navigator>
  )
}

HomeTab.options = {
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
  )
}


/**
 * Timeline Tab
 */
const TimelineStack = createStackNavigator();
const TimelineTab = () => {
  return (
    <TimelineStack.Navigator screenOptions={stackOptions}>
      <TimelineStack.Screen name="Timeline" component={TimelineScreen} />
      <TimelineStack.Screen name="TimerList" component={TimerListScreen} />
      <TimelineStack.Screen name="Timer" component={TimerScreen} />
      <TimelineStack.Screen name="TimerEditor" component={TimerEditorScreen} />
      <TimelineStack.Screen name="TimerLineEditor" component={TimerEditorScreen} />
      <TimelineStack.Screen name="Edit" component={EditorScreen} />
    </TimelineStack.Navigator>

  )
}
TimelineTab.options = {
  tabBarLabel: 'Timeline',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

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

const stackOptions = {
  headerTitle: '',
  headerShown: true,
  headerHideShadow : true,
  headerLargeTitle : true,
  headerTranslucent: true,
  headerStyle: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0
  },
  headerTintColor: '#000',
  headerTitleStyle: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    
  },
}