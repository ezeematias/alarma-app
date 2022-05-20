import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
 
 const HomeScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch((error: { message: any; }) => alert(error.message))
  }

  const createUser = () => {
    navigation.replace("LoadForm")
  }

  const loadUserList = () => {
    navigation.replace("LoadList")
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/background.jpg")}
        resizeMode="cover"
        style={styles.image}
        imageStyle = {{opacity:0.4}}>

        <View style={ styles.exitSection }>
          <Text style={styles.exitText}>USUARIO: {auth.currentUser?.email}</Text>
          <TouchableOpacity style={styles.exitButton} onPress={handleSignOut}>
  
          </TouchableOpacity>
        </View>

        
        <View style={styles.body}>

        <TouchableOpacity onPress={createUser} style={styles.buttonLoadData}>
          <Text style={styles.buttonText}>CARGA DE USUARIO</Text>         
        </TouchableOpacity>
        
        <TouchableOpacity onPress={loadUserList} style={styles.buttonList}>
              <Text style={styles.buttonText}>VER LISTADO DE USUARIOS</Text>         
        </TouchableOpacity>

      </View>
      </ImageBackground>
    </View>
  );
 }

 export default HomeScreen
 
 import { StyleSheet } from 'react-native'
import { auth } from '../database/firebase';
import { RootStackParamList } from '../../App';

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#3c8e99'
   },
   image: {
     flex: 1,
     justifyContent: "center"
   },
   header: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: 'transparent',    
   },
   body: {
     marginTop: 200,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: 'transparent',
     marginBottom: 300,    
   },
   button: {
     backgroundColor: 'transparent',
     borderColor: 'white',
     margin: 5,
     width: '30%',
     padding: 15,
     borderRadius: 25,
     borderWidth: 2,
     alignItems: 'center',
   },
   buttonText: {
     color: 'white',
     fontSize: 15,
     fontFamily: 'AlfaSlabOne_400Regular',
   },
   exitSection: {
     width: '90%',
     alignItems: 'center',
     flexDirection: "row",
     justifyContent: 'space-between',
   },
   exitText: {
     color: 'black',
     fontSize: 15,
     fontFamily: 'AlfaSlabOne_400Regular',
     marginLeft: 10,
   },
   exitButton: {
     backgroundColor: 'transparent',
     borderColor: 'black',
     margin: 5,
     width: '30%',
     padding: 15,
     borderRadius: 25,
     borderWidth: 2,
     marginLeft: 35,
     alignItems: 'center',
     justifyContent: "center",
   },
   buttonImageIconStyle: {
     padding: 10,
     margin: 5,
     height: 50,
     width: 50,
     resizeMode: 'contain',
   },
   faIcon: {
     color: 'black',
   },
   buttonLoadData: {
     backgroundColor: ' rgba(131, 133, 140, 0.8);',
     borderLeftColor: '#05153F',
     borderLeftWidth: 10,
     borderRadius: 10,
     margin: 5,
     padding: 15,
     justifyContent: 'center',
     alignItems: 'center',
     width: '80%',
   },
   buttonList: {
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
 });
 
 
 
 