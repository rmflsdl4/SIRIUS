import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
// 페이지 불러오기
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Main from "./pages/Main";


const Stack = createStackNavigator();

const App = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Intro">
                <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
