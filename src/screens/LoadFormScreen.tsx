import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";

import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-simple-toast';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from "firebase/firestore";

import { getBlob } from "../utils/utils";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { auth, storage, db } from "../database/firebase";
import { RootStackParamList } from "../../App";
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/Style';


type NewUser = {
  apellido:string;
  nombre:string;
  dni:string;
  email:string;
  password:string;
  confirmPassword:string;
}

const LoadForm = () => {
  const [apellidoForm, setApellido] = useState("Apellido   ");
  const [nombreForm, setNombre] = useState("Nombre   ");
  const [dniForm, setDni] = useState("DNI   ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [scanned, setScanned] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const {control, handleSubmit, getValues, formState:{errors}, reset, setValue} = useForm<NewUser>();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholderColor, setPlaceholderColor] = useState("grey");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleReturn = () => {
    navigation.replace("Home")
  }

  useEffect(() => {
    (async () => {
        await Camera.requestCameraPermissionsAsync();
        await BarCodeScanner.requestPermissionsAsync();
    })();
  }, []);

  async function handlerSingOut() {
    await auth
        .signOut()
        .then(() => { navigation.replace('Index') })
        .catch((error: any) => alert(error.message))
}

function handlerBack() {
  navigation.replace('Home');
}

  useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={handlerSingOut}>
                <FontAwesome name="power-off" size={24} color="#3770b6" />
            </TouchableOpacity>
        ),
        headerLeft: () => (
            <TouchableOpacity onPress={handlerBack}>
                <FontAwesome name="step-backward" size={24} color="#3770b6" />
            </TouchableOpacity>
        ),
        headerTitle: () => (

            <Text style={styles1.buttonText}>{auth?.currentUser?.displayName}</Text>
        ),
        headerTintColor: "#fff",
        headerTitleAlign: 'center',
        headerBackButtonMenuEnabled: false,
        headerStyle: {
            backgroundColor: '#a5d1f1',  
        }
    });
}, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setOpenQR(false);
    const dataSplit = data.split('@');
    const dni = dataSplit[4].trim();
    const nombre = dataSplit[2].trim();
    const apellido = dataSplit[1].trim();
    setValue("dni",dni);
    setValue("nombre",nombre);
    setValue("apellido",apellido);
    setApellido(apellido);
    setNombre(nombre);
    setDni(dni);
    setPlaceholderColor("black");
    console.log(dni);
    console.log(nombre);
    console.log(apellido);
  };

  const handleOpenQR = () => {
    setScanned(false);
    setOpenQR(true);
  }

  const onSubmit = async () => {
    const values=getValues();
    let error=false;
    Object.values(values).map(value=>{
      if(!value){
        error=true;
        return;
      }
    })
    if(error){
      Toast.showWithGravity(
        "Todos los campos son requeridos",
        Toast.LONG, 
        Toast.CENTER);
      return;
    }
    if(!image){
      Toast.showWithGravity(
        "Debe tomar una foto",
        Toast.LONG, 
        Toast.CENTER);
      return;
    }
    if(values.password!==values.confirmPassword){
      Toast.showWithGravity(
        "Las contraseñas no coinciden",
        Toast.LONG, 
        Toast.CENTER);
    }
    setLoading(true)
    toggleSpinnerAlert();
    try {
      await createUserWithEmailAndPassword(auth,values.email,values.email);
      const blob:any = await getBlob(image);
      const fileName = image.substring(image.lastIndexOf("/") + 1);
      const fileRef = ref(storage, "usuariosFotos/" + fileName);
      await uploadBytes(fileRef, blob);
      await addDoc(collection(db, "usuariosInfo"), {
        lastName:values.apellido,
        name:values.nombre,
        dni:values.dni,
        email:values.email,
        image:fileRef.fullPath,
        creationDate:new Date()
      });
      Toast.showWithGravity(
        "Usuario creado exitosamente",
        Toast.LONG, 
        Toast.CENTER);      
    reset();
    setImage("");
    } catch (error:any) {
      Toast.showWithGravity(
        "usuario ya existente",
        Toast.LONG, 
        Toast.CENTER); 
    }finally{
      setLoading(false);
    }
  }

  const handleCamera = async (type: any) => {
    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
    });
    if (!result.cancelled) {
      setImage(result["uri"]);
    }
  };

  const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);

  const toggleSpinnerAlert = () => {
    setModalSpinnerVisible(true);
    setTimeout(() => {
      setModalSpinnerVisible(false);
    }, 3000);
  };

  return (
    !openQR ?
      
      <ImageBackground
        source={require("../../assets/background.jpg")}
        resizeMode="cover"
        style={styles.image}
        imageStyle = {{opacity:0.3}}>        
        {loading}
    

        <View style={styles.container}> 

          <View style={{
            flexDirection: 'row', 
            alignContent: 'center', 
            justifyContent: 'center', 
            marginBottom: 20}}>
            {!image?
              <TouchableOpacity onPress={handleCamera}>
                <Image 
                  style={{height:100, width:130, borderRadius:20, margin:10}} 
                  resizeMode="cover" 
                  source={require("../../assets/camera.png")}
                />
              </TouchableOpacity>:
              <View>
                <Image style={{height:150, width:150, borderRadius:20, margin:10}} resizeMode="cover" source={{uri:image}}/>
              </View>
            }

            <TouchableOpacity onPress={handleOpenQR}>
              <Image 
                  style={{height:150, width:150, borderRadius:20, margin:10}} 
                  resizeMode="cover" 
                source={require("../../assets/qr.png")}
              />
            </TouchableOpacity>
          </View>


          <View style={styles.inputContainer}>
            
              <TextInput
                placeholder= {apellidoForm}
                placeholderTextColor= {placeholderColor}
                style={[styles.buttonRole, styles.buttonOutlineRole]}
                onChangeText={(text) => setValue("apellido",text)}
              />
           

            
              <TextInput
                placeholder={nombreForm}
                placeholderTextColor= {placeholderColor}
                style={styles.input}
                onChangeText={(text) => setValue("nombre",text)}
              />
            

           
              <TextInput
                placeholder={dniForm}
                placeholderTextColor= {placeholderColor}
                style={styles.input}
                keyboardType={'numeric'}
                onChangeText={(text) => setValue("dni",text)}
              />
          

            
              <TextInput
                placeholder="Correo Electrónico   "
                placeholderTextColor="grey"
                style={styles.input}
                onChangeText={(text) => setValue("email",text)}
              />
          

          
              <TextInput
                placeholder="Contraseña   "
                placeholderTextColor="grey"
                style={styles.input}
                onChangeText={(text) => setValue("password",text)}
                secureTextEntry
              />
           

           
              <TextInput
                placeholder="Confirmar Contraseña   "
                placeholderTextColor="grey"
                style={styles.input}
                onChangeText={(text) => setValue("confirmPassword",text)}
                secureTextEntry
              />
        
          </View>

          <TouchableOpacity onPress={onSubmit} style={styles.button}>
              <Text style={styles.buttonText}>CARGAR USUARIO</Text>         
          </TouchableOpacity>
      </View> 

      <View>
        <Modal isVisible={isModalSpinnerVisible}>
          <ActivityIndicator size="large" color="#A4C3B2" />
        </Modal>
      </View>
         
      </ImageBackground>
     : <BarCodeScanner
                  onBarCodeScanned={scanned && openQR ? undefined : handleBarCodeScanned}
                  style={StyleSheet.absoluteFillObject} />
  );
}

                

export default LoadForm;


const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c8e99'    
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  inputContainer: {
    width: '80%',      
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ' rgba(24, 2, 12, 0.5);', 
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 5,
    width: '100%',
  },
  inputImage: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
    color: '#CCE3DE',
  },
  buttonLogin: {
    backgroundColor: ' rgba(131, 133, 140, 0.8);',
    borderLeftColor: '#05153F',
    borderLeftWidth: 10,
    borderRadius: 10,
    marginTop: 60,
    margin: 5,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  buttonRegister: {
    backgroundColor: ' rgba(131, 133, 140, 0.8);',
    borderLeftColor: '#05153F',
    borderLeftWidth: 10,
    borderRadius: 10,
    marginTop: 60,
    margin: 5,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRole: {
    backgroundColor: ' rgba(168, 229, 128, 0.8);',
    borderLeftColor: '#F2C335',
    borderLeftWidth: 10,
    borderRadius: 10,
    marginTop: 10,
    margin: 5,
    padding: 15,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  roleText: {
    color: '#343434',
    fontSize: 20,
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  footerText: {
    color: '#AD8350',
    fontSize: 15,
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  title: { 
    fontSize: 50,    
    color: "#764134",
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  textInput: {
    color: 'black',
    fontFamily: 'AlfaSlabOne_400Regular',
    fontSize: 15,
    width: '100%',
  },
  body: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',    
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
  },
  modalContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  modalBody: {
    backgroundColor: ' rgba(24, 2, 12, 0.5);',
    borderLeftColor: '#F2C335',
    borderLeftWidth: 10,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  modalText: {
    flexShrink: 1,
    fontFamily: 'AlfaSlabOne_400Regular',
    fontSize: 18,
    color: '#F0FFF1',
  },
  escapeButton: {
    backgroundColor: 'transparent',
    width: '25%',
    padding: 15,
    borderColor: '#AFD5AA',
    borderWidth: 0,
    borderRadius: 25,
    alignItems: 'center',
  },
  faIcon: {
    color: '#F0FFF1',
  },
  exitSection: {
    flex: 0.2,
    width: '80%',
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  exitText: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'AlfaSlabOne_400Regular',
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    width: '30%',
    padding: 15,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: "center",
  },
  buttonImageExit: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  buttonList: {
    backgroundColor: ' rgba(168, 229, 128, 0.8);',
    borderLeftColor: '#F2C335',
    borderLeftWidth: 10,
    borderRadius: 10,
    marginTop: 40,
    margin: 5,
    padding: 15,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});



