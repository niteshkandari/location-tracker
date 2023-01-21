import { showMessage } from "react-native-flash-message";
import * as Location from "expo-location";

//for react-native cli
// import { PermissionsAndroid, Platform } from "react-native";
// import Geolocation from "react-native-geolocation-service";

// export const getCurrentLocation = () =>
//   new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const cords = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           heading: position?.coords?.heading,
//         };
//         resolve(cords);
//       },
//       (error) => {
//         reject(error.message);
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   });
// export const locationPermissions = () => {
//   return new Promise(async (resolve, reject) => {
//     if (Platform.OS === "ios") {
//       try {
//         const permissionStatus = await Geolocation.requestAuthorization(
//           "whenInUse"
//         );
//         if (permissionStatus === "granted") {
//           return resolve(permissionStatus);
//         }
//         return reject("permission denied");
//       } catch (error) {
//         reject(error);
//       }
//     }
//     return PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//     )
//       .then((granted) => {
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           return resolve("granted");
//         }
//         return reject("Location permission denied");
//       })
//       .catch((error) => reject("Ask Location permission error:", error));
//   });
// };

const locationPermissions = () => {
  return new Promise(async (resolve, reject) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return reject("Permission to access location was denied");
    } else {
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
      // let location = await Location.getLastKnownPositionAsync({});
      return resolve(location.coords);
    }
  });
};

const showError = (message) => {
  showMessage({
    message,
    type: "danger",
    icon: "danger",
  });
};

const showSuccess = (message) => {
  showMessage({
    message,
    type: "success",
    icon: "success",
  });
};

export { showError, showSuccess, locationPermissions };
