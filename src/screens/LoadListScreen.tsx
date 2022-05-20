import { ImageBackground, Text, TouchableOpacity, View, Image, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'

import Modal from "react-native-modal";


const LoadList = () => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [isModalSpinnerVisible, setModalSpinnerVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const handleReturn = () => {
    
    if (auth.currentUser?.email == "admin@gmail.com") {
      navigation.replace("Home");
    }
    else {
      auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
    }
  }

  useFocusEffect(
      useCallback(() => {
          getDocuments();
          toggleSpinnerAlert();
  }, []))

  const toggleSpinnerAlert = () => {
    setModalSpinnerVisible(true);
    setTimeout(() => {
      setModalSpinnerVisible(false);
    }, 3500);
  };

  const getDocuments = async () => {
    setLoading(true);
    setData([]);
        try {
            const querySnapshot = await (await getDocs(query(collection(db, "usuariosInfo"), orderBy('lastName', 'asc'), orderBy('name', 'asc'))));  

            querySnapshot.forEach(async (doc) => {
                const res:any = {...doc.data(), id:doc.id};
                const imageUrl = await getDownloadURL(ref(storage, res.image));
                setData((arr: any) => [...arr, {...res, imageUrl: imageUrl}]);
            });
        } catch (error) {
            console.log(error)                    
        }finally{
            setLoading(false);
        }
  };

  
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.exitButton} onPress={handleReturn}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.buttonImageExit}
            />
          </TouchableOpacity>
     ),
      headerTitle: () => (
        <Text style={styles.exitText}>LISTA DE USUARIOS</Text>
      ),
      headerTintColor: "transparent",
      headerBackButtonMenuEnabled: false,
      headerStyle: {
        backgroundColor: 'rgba(168, 229, 128, 0.8);',
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {loading}
      <ImageBackground
        source={require("../../assets/background.jpg")}
        resizeMode="cover"
        style={styles.image}
        imageStyle={{ opacity: 0.2 }}>
        
        <View style={styles.body}>
          <ScrollView>
          {data.map((item : any) => (               
              <View style={styles.cardStyle}>
                <Image resizeMode='cover' style={{ flex: 1, borderRadius: 10 }} source={{ uri: item.imageUrl }} />
                <View style={{ padding: 10, justifyContent: 'space-between', height: 100 }}>
                  <View>
                    <Text style={styles.tableHeaderText}>{item.lastName} {item.name}</Text>
                    <Text style={styles.tableCellText}>DNI: {item.dni}</Text>
                    <Text style={styles.tableCellText}>Correo Electrónico: {item.email}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>           
        </View>
                
        <View>
          <Modal isVisible={isModalSpinnerVisible}>
            <ActivityIndicator size="large" color="3c8e99" />
          </Modal>
        </View>

      </ImageBackground>
    </View>
  );
 }
 export default LoadList
 
 import { StyleSheet } from 'react-native'
import { auth, db, storage } from '../database/firebase';
import { RootStackParamList } from '../../App';

    const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c8e99',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  exitSection: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20
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
    marginRight: 60,
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
  buttonImageVote: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  body: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 10,
  },
  tableCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
  },
  tableHeaderText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  tableCellText: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'AlfaSlabOne_400Regular',
  },
  cardStyle: {
    backgroundColor: '#F2C335',
    borderColor: '#F2C335',
    height: 300, 
    width: '95%', 
    margin: 10,
    borderRadius: 10,
    borderWidth: 2 
  }
});
