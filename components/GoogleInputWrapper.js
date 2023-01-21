import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "../constants";

const GoogleInputWrapper = ({ placeholder,fetchGeoDetails }) => {
    
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        styles={{
          textInputContainer: styles.inputContainer,
          textInput: styles.inputStyle,
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        onPress={(data, details = null) => {
            fetchGeoDetails(data, details)
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        debounce={400}
        minLength={2}
        nearbyPlacesAPI={"GooglePlacesSearch"}
        enablePoweredByContainer={false}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "en",
        }}
      />
     </View>
  );
};

export default GoogleInputWrapper;

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  inputContainer: {
    padding:10
  },
  inputStyle: {
    height:55,
    fontSize:16,
  },
});
