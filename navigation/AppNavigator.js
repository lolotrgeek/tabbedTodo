import * as React from 'react';
import MainStack from './MainTabNavigator';

import { NavigationContainer } from '@react-navigation/native';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  )
}
