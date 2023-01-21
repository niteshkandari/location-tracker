import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomBtn = ({ onPress = () => {}, btnStyle = {}, btnText = "" }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.btnStyle, ...btnStyle }}
      onPress={onPress}
    >
      <Text style={{color:"white", fontSize:20}}>{btnText}</Text>
    </TouchableOpacity>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({
  btnStyle: {
    padding:13,
    borderWidth:1,
    backgroundColor:"black",
    borderRadius:4,
    alignItems:"center",
    justifyContent:"center",
  },
});
