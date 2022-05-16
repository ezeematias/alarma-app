import { StyleSheet } from "react-native";

const primaryColor = '#d31928';
const secondaryColor = '#4a4b4a';
const tertiaryColor = '#7f1620';
const fourthColor = '#fff';
const buttonBorderRadius = 100;

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: '50%',
        top: '-10%',
    },
    logoHome: {
        width: '100%',
        height: '20%',
        marginTop: '10%',
    },
    logoLogin: {
        width: '100%',
        height: '30%',
        marginTop: '-20%'

    },
    inputContainer: {
        width: '80%',
        marginTop: 10,
    },
    input: {
        backgroundColor: tertiaryColor,
        color: 'white',        
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: buttonBorderRadius,
        marginTop: '5%',
    },
    image: {
        flex: 1,
        justifyContent: 'center'
      },

    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
    },
    button: {
        backgroundColor: primaryColor,
        width: '100%',
        padding: 50,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonLogin: {
        backgroundColor: primaryColor,
        width: '100%',
        padding: 10,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonRole: {
        backgroundColor: secondaryColor,
        width: '100%',
        padding: 5,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonError: {
        backgroundColor: secondaryColor,
        width: '100%',
        padding: 15,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: fourthColor,
        marginTop: 5,
        borderColor: primaryColor,
        borderWidth: 2,
    },
    buttonRegister: {
        marginTop: '15%',
    },
    buttonOutlineRole: {
        backgroundColor: secondaryColor,
        marginTop: 5,
        borderColor: secondaryColor,
        borderWidth: 2,
    },
    buttonText: {
        color: fourthColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: primaryColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonRegisterText: {        
        color: fourthColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineTextRole: {
        color: primaryColor,
        fontWeight: '700',
        fontSize: 16,
    },
    spinnerTextStyle: {
        color: 'white',
    },
    spinContainer: {
        position: 'absolute',
        display: 'flex',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 100,
    },
    textHome:{
        fontSize: 60,
        marginTop: 40, 
        color: secondaryColor,
        fontWeight: 'bold',        
    },
    textDescription:{
        fontSize: 20,
        marginTop: '10%', 
        color: secondaryColor,
        fontWeight: 'bold',  
        textAlign: 'center',
        margin: 5,
    },   

    
})