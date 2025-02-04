import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import authService from "./app/services/authService";
import AdminNavigator from "./app/navigation/owner/AdminNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import AuthNavigator from "./app/navigation/AuthNavigatior";
import PassengerDrawer from "./app/navigation/passenger/DrawerNavigator";
import * as SplashScreen from "expo-splash-screen";

import {
  OriginContextProvider,
  DestinationContextProvider,
  AuthContext,
} from "./app/contexts/contexts";
import RiderNavigator from "./app/navigation/rider/RiderNavigator";
import GaurdianNavigator from "./app/navigation/gaurdian/GaurdianNavigator";

export default function App(props) {

  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const user = await authService.getUser();
    if (user) setUser(user);
  };
  useEffect(() => {
    async function prepare() {
      try {
        // await SplashScreen.preventAutoHideAsync();
        await restoreUser();
      } catch (error) {
        console.log("Error loading app", error);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);
  
  const onNavigationContainerReady = useCallback(async () => {
    if (isReady) await SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return null;

  return (
    <DestinationContextProvider>
      <OriginContextProvider>
        <AuthContext.Provider value={{ user, setUser }}>
          <NavigationContainer
            onReady={onNavigationContainerReady}
            theme={navigationTheme}
          >
            {
              user ? (
                user.role === "admin" ? (
                  <AdminNavigator />
                ) : user.role === "passenger" ? (
                  <PassengerDrawer />
                ) : user.role === "rider" ? (
                  <RiderNavigator/>
                ) : user.role === "gaurdian" ? (
                  <GaurdianNavigator/>
                ) : (
                  <AuthNavigator />
                )
              ) : (
                <AuthNavigator />
              )
            }
          </NavigationContainer>
        </AuthContext.Provider>
      </OriginContextProvider>
    </DestinationContextProvider>
  );
}
