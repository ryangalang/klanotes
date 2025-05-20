import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import NoteEditor from './screens/NoteEditor';
import ArchivedNotes from './screens/ArchivedNotes';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#ff6b6b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Klanotes' }}
        />
        <Stack.Screen
          name="NoteEditor"
          component={NoteEditor}
          options={({ route }) => ({
            title: route.params?.note ? 'Edit Note' : 'New Note',
          })}
        />
        <Stack.Screen
          name="ArchivedNotes"
          component={ArchivedNotes}
          options={{ title: 'Archived Notes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
