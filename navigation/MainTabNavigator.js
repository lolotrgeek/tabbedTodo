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
 * Project stack
 */
const TimelineStack = createStackNavigator();
export default function MainStack() {
  return (
    <TimelineStack.Navigator screenOptions={stackOptions}>
      <TimelineStack.Screen name="Timeline" component={TimelineScreen} />
      <TimelineStack.Screen name='Projects' component={ProjectScreen} />
      <TimelineStack.Screen name='Edit' component={EditorScreen} />
      <TimelineStack.Screen name='Timer' component={TimerScreen} />
      <TimelineStack.Screen name="TimerList" component={TimerListScreen} />
      <TimelineStack.Screen name="TimerEditor" component={TimerEditorScreen} />
    </TimelineStack.Navigator>
  )
}

// const Tab = createBottomTabNavigator();
// const TabbedStack = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         name="Entries"
//         options={HomeTab.options}
//         component={TimerListScreen}
//       />
//       <Tab.Screen
//         name="Stats"
//         options={HomeTab.options}
//         component={HomeTab}
//       />
//     </Tab.Navigator>
//   )
// }

// /**
//  * Home Tab
//  */
// const ProjectStack = createStackNavigator();
// const HomeTab = () => {
//   return (
//     <ProjectStack.Navigator screenOptions={stackOptions}>
//       <ProjectStack.Screen name="TimerList" component={TimerListScreen} />
//       <ProjectStack.Screen name="Timer" component={TimerScreen} />
//       <ProjectStack.Screen name="TimerEditor" component={TimerEditorScreen} />
//     </ProjectStack.Navigator>
//   )
// }

// HomeTab.options = {
//   tabBarLabel: 'TimerList',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={
//         Platform.OS === 'ios'
//           ? `ios-information-circle${focused ? '' : '-outline'}`
//           : 'md-information-circle'
//       }
//     />
//   )
// }


// /**
//  * Setting Tab
//  */
// const SettingsStack = createStackNavigator();
// const SettingsTab = () => {
//   return (
//     <SettingsStack.Navigator>
//       <SettingsStack.Screen name="Settings" component={SettingsScreen} >
//       </SettingsStack.Screen>
//     </SettingsStack.Navigator>

//   )
// }
// SettingsTab.options = {
//   tabBarLabel: 'Settings',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
//   ),
// };

const stackOptions = {
  // headerTitle: '',
  headerShown: true,
  headerHideShadow: true,
  headerLargeTitle: true,
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