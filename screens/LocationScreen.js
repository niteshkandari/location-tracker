import { StyleSheet, View, ScrollView } from "react-native";
import React, { useState } from "react";
import GoogleInputWrapper from "../components/GoogleInputWrapper";
import CustomBtn from "../components/CustomBtn";
import { useNavigation } from "@react-navigation/native";
import { showError, showSuccess } from "../utils/helper/helperFunction";

const ChooseLocation = (props) => {
  const navigation = useNavigation();
  const [destination, setDestination] = useState(null);

  const handleNavigation = () => {
    if(!Object.keys(destination).length) {
      showError("please select your location");
      return;
    }
    showSuccess("Success !!!");
    console.log(props)
    props?.route?.params?.getCordinates(destination)
    navigation.goBack()
  };

  const fetchGeoDetails = (data, details) => {
    setDestination({
        latitude:details?.geometry.location.lat,
        longitude:details?.geometry.location.lng,
        description:data?.description
      })
  }
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1, }}>
        {/* <GoogleInputWrapper
          fetchGeoDetails={(data, details) =>
            fetchGeoDetails(data, details, "origin")
          }
          placeholder={"enter pickup location..."}
        />
        <View style={{height:20}}/> */}
        <GoogleInputWrapper
          fetchGeoDetails={fetchGeoDetails}
          placeholder={"enter drop location..."}
        />
        <CustomBtn
          btnText="Done"
          btnStyle={{ marginHorizontal: 10, marginTop: 8 }}
          onPress={handleNavigation}
        />
      </ScrollView>
    </View>
  );
};

export default ChooseLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


// import { StyleSheet, Platform, StatusBar } from "react-native";

// export default StyleSheet.create({
//   AndroidSafeArea: {
//     flex: 1,
//     backgroundColor: "white",
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
//   }
// });