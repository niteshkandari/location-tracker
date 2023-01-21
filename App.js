import { KeyboardAvoidingView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen";
import LocationScreen from "./screens/LocationScreen";
import { Store } from "./store/store";
import FlashMessage from "react-native-flash-message";

const App = () => {
  const Stack = createStackNavigator();
  return (
    <Provider store={Store}>
    <NavigationContainer>
      <SafeAreaProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          style={{ flex: 1 }}
        >
          <Stack.Navigator>
            <Stack.Screen
              name={"Home"}
              component={HomeScreen}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name={"Location"}
              component={LocationScreen}
            />
          </Stack.Navigator>
          <FlashMessage position={"top"}/>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </NavigationContainer>
    </Provider>
  );
};
export default App;
