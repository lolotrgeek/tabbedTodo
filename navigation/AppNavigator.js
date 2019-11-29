import * as React from 'react';
import MainStack from './MainTabNavigator';

import { NavigationNativeContainer } from '@react-navigation/native';

export default function AppNavigator() {
  return (
    <NavigationNativeContainer>
      <MainStack />
    </NavigationNativeContainer>
  )
}
