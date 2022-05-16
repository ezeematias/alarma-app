import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground, Vibration, TextInput } from 'react-native';
import { RootStackParamList } from '../../App';
import { auth } from "../database/firebase";
import styles from '../styles/StyleHome';
import { showMessage } from 'react-native-flash-message';
import { Accelerometer } from 'expo-sensors';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Audio } from "expo-av";
import { Camera } from 'expo-camera';

const audioPlayer = new Audio.Sound();

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [position, setPosition] = useState('horizontal');
  const [sound, setSound] = useState<any>();
  const [modal, setModal] = useState(false);
  const [cord, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] = useState<any>(null);
  const [flagImage, setFlagImage] = useState(true);
  let imageAlarm = flagImage ? require('../../assets/alarmOn.png') : require('../../assets/alarmOff.png');

  useEffect(() => {
    Accelerometer.setUpdateInterval(700);
  }, [])

  useEffect(() => {
    const { x, y, z } = cord;

    if (x < 1 && x > 0.90 && y < 0.05 && y > 0.01) {
      setPosition('derecha');
    } else if (x < -0.5) {
      setPosition('izquierda');
    } else if (x > -0.01 && x < 0.5 && y > 1 && y < 1.05 && z > 0.01 && z < 0.19) {
      setPosition('vertical');
    } else if (x < -0.00 && x > -0.05 && y > -0.05 && y < 0.05 && z > 0.05 && z < 2) {
      setPosition('horizontal');
    }
  }, [cord]);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    if (cord.x > 0.5) {
      setPosition('izquierda');
    }
    if (cord.x < -0.5) {
      setPosition('derecha');
    }
    if (cord.y > 0.7) {
      setPosition('vertical');
    }
    if (cord.z > 1) {
      setPosition('horizontal');
    }
  }, [cord.x, cord.y, cord.z]);

  console.log(cord.x);
  console.log(cord.y);
  console.log(cord.z);

  React.useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  async function playSound(sound: any) {
    try {
      await audioPlayer.unloadAsync()
      await audioPlayer.loadAsync(sound);
      await audioPlayer.playAsync();
    } catch (err) {
      console.warn("Couldn't Play audio", err)
    }
  }

  useEffect(() => {
    if (start) {
      switch (position) {
        case 'horizontal':
          playSound(require('../../assets/sounds/alarm1.mp3'));
          Vibration.vibrate(5000);
          break;
        case 'izquierda':
          playSound(require('../../assets/sounds/alarm2.mp3'));
          break;
        case 'derecha':
          playSound(require('../../assets/sounds/alarm3.mp3'));
          break;
        case 'vertical':
          playSound(require('../../assets/sounds/alarm4.mp3'));
          Camera.requestPermissionsAsync();
          break;
      }
    }
  }, [position])

  const handleStart = () => {
    setFlagImage(previousState => !previousState);
    if (!start) {
      setStart(true);
      _subscribe();
      setModal(true);
    } else {
      setStart(false);
      _unsubscribe();
      setModal(false);
    }
  }

  const handleEnd = async () => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, auth.currentUser?.email || "", password)
      .then((userCredential: { user: any; }) => {
        const user = userCredential.user;
        console.log("Logged in with", user.email);
        if (user) {
          setModal(false);
          setStart(false);
          handleClose();
          _unsubscribe();
          setFlagImage(previousState => !previousState);
          audioPlayer.pauseAsync();
          audioPlayer.unloadAsync();
        }
      })
      .catch((error) => {
        showMessage({ type: "danger", message: "Error", description: "Contraseña inválida" });
      });
  }

  const handleClose = () => {
    setModal(false);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handlerSingOut}>
          <FontAwesome name="power-off" size={24} color="#1d1e3e" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <Text style={styles.textUser}>{auth?.currentUser?.displayName}</Text>
      ),  
      headerTitle: () => (  
        <Text></Text>                             
      ),     
      headerBackVisible: false,
         
      headerBackButtonMenuEnabled: false,
      headerStyle: {
      backgroundColor: '#fff',
      }
    });
  }, []);

  async function handlerSingOut() {
    await auth
      .signOut()
      .then(() => { navigation.navigate('Index') })
      .catch((error: any) => alert(error.message))
  }

  function handlerBack() {
    navigation.replace('Home');
  }

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        {subscription && position === "vertical" && <Camera flashMode="torch" style={{ height: 1, width: 1 }}
        ></Camera>}


        <View style={styles.body}>
          <TouchableOpacity onPress={handleStart}>
            <Image source={imageAlarm} style={styles.buttonImageIcon} />
          </TouchableOpacity>

          {modal ? (
            <View style={{ flexDirection: 'column', alignContent: 'center', alignItems: 'center' }} >

              <Text style={styles.modalText}></Text>
              <View style={styles.input}>
                <FontAwesome name="key" size={24} color="#d31928" />
                <TextInput
                  placeholder="Confirme contraseña..."
                  placeholderTextColor="#d31928"
                  style={styles.textInput}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry
                  autoCompleteType='off'
                />
              </View>
              <TouchableOpacity onPress={handleEnd} style={styles.buttonStyle}>
                <Text style={styles.buttonText}>Cancelar alarma</Text>
              </TouchableOpacity>
            </View>

          ) :
            <Text style={styles.buttonText}>Presione la alarma para iniciar</Text>
          }
        </View>
      </View>
    </ImageBackground>
  );
}

export default HomeScreen;
