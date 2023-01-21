import { useRef, useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Image,
  Alert,
  Button
} from "react-native";
import MapView, { Marker, AnimatedRegion, Circle } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "../constants";
import imagepath from "../utils/helper/imagePath";
import { locationPermissions } from "../utils/helper/helperFunction";
// import io from "socket.io-client";
import DialogInput from 'react-native-dialog-input';
import socketServcies from "../utils/services/socket-service";
// const socket_uri = "http://localhost:9090";
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const HomeScreen = ({ navigation }) => {
  // socket = io.connect(socket_uri, {
  //   transports: ["websocket"],
  //   reconnectionAttempts: 15,
  // });
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [state, setState] = useState({
    userName:"",
    curLoc: {
      latitude: 30.7046,
      longitude: 77.1025,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
  } = state;

  const updateState = (data) => {
    setState((state) => ({ ...state, ...data }));
  }

  useEffect(() =>{
    socketServcies.initializeSocket();
  },[])
  // useEffect(() => {
  //   socket.on("receive", data => {
  //     console.log('received', data);
  //   })
  // },[])
  // useEffect(() => {
  //   socket.on('user-joined', cb => {
  //     console.log('user-joined', cb);
  //     alert(`user joined ${cb.userName}`);
  //   })
  // }, []);
  //another way to zoom out
  useEffect(() => {
    let flag = 1;
    if (!coordinate && !destinationCords) return;
    flag++;
    handleZoomOut(flag);
  }, [coordinate, destinationCords]);
  // useEffect(() => {
  //   let interval = null;
  //   const intervalWrapper = (callback, delay) => {
  //     callback();
  //     onCenter();
  //     interval = setInterval(callback, delay);
  //   };
  //   intervalWrapper(() => getLiveLocation(), 6000);
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    getLiveLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getLiveLocation = () => {
    locationPermissions()
      .then((success) => {
        const { latitude, longitude } = success;
        // console.log(success, "chec");
        animate(latitude, longitude);
        updateState({
          // heading: heading,
          curLoc: { latitude: latitude, longitude: longitude },
          coordinate: new AnimatedRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        });
        socketServcies.emit("send", {
          curLoc: { latitude: latitude, longitude: longitude },
          coordinate: new AnimatedRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })}
         )
      })
      .catch((err) => console.log(err));
  };

  const handleZoomOut = (flag) => {
    // console.log(flag, "flag");
    if (flag > 1) return;
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 500, right: 500, bottom: 500, left: 500 },
    });
  };

  const handleNavigate = () => {
    navigation.navigate("Location", { getCordinates: fetchValue});
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
        mapRef.current.animateToRegion(newCoordinate, 7000);
        // mapRef.current.animateCamera({
        //   center: {...newCoordinate}, duration:100
        // });
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  const fetchValue = (data) => {
    // console.log("this is data", data);
    updateState({
      destinationCords: {
        latitude: data.latitude,
        longitude: data.longitude,
        // description: data.description,
      },
    });
  };
  

  const onCenter = () => {
    // console.count("center");
    mapRef?.current.animateToRegion({
      latitude: curLoc.latitude,
      longitude: curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };
  
  const handleDialogSubmit = (inputText) => {
    updateState({userName:inputText});
    setIsVisible(false);
    socketServcies.emit("new-user-joined", { ...state,userName:inputText });
  }
  return (
    <>
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <DialogInput
          isDialogVisible={isVisible}
          title={"Feedback"}
          message={"Message for Feedback"}
          hintInput={"Enter Text"}
          submitInput={(inputText) => handleDialogSubmit(inputText)}
          closeDialog={() => setIsVisible(false)}
        ></DialogInput>
        <MapView.Animated
          ref={mapRef}
          followsUserLocation={true}
          showsCompass={true}
          // showsUserLocation={true}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            ...curLoc,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker.Animated
            ref={markerRef}
            coordinate={coordinate}
            identifier={"origin"}
            // image={imagepath.icCurLoc}
          >
            <Image
              source={imagepath.icCurLoc}
              resizeMode="contain"
              style={{ height: 40, width: 40 }}
            />
          </Marker.Animated>

          {Object.keys(destinationCords).length > 0 && (
            <Marker
              coordinate={destinationCords}
              image={imagepath.icGreenMarker}
              identifier={"destination"}
            />
          )}
          {/* <Circle center={curLoc} radius={400} fillColor="rgba(2,55,255,0.2)"/> */}
          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={curLoc}
              destination={destinationCords}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={2}
              strokeColor="black"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`
                );
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                // fetchTime(result.distance, result.duration),
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    // right: 30,
                    // bottom: 300,
                    // left: 30,
                    // top: 100,
                  },
                });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />
          )}
        </MapView.Animated>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          onPress={onCenter}
        >
          <Image source={imagepath.greenIndicator} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardWrapper}>
        <Text style={{ fontSize: 18 }}>Where do you wanna go ?</Text>
        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={{ color: "white", fontSize: 20 }}>Choose Location</Text>
        </TouchableOpacity>
      </View>
    </View>

    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    backgroundColor: "white",
    padding: 35,
    width: "100%",
  },
  button: {
    padding: 13,
    borderWidth: 1,
    backgroundColor: "black",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
});
