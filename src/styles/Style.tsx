import { StyleSheet } from "react-native";

const primaryColor = '#e72b58';
const secondaryColor = '#4a4b4a';
const tertiaryColor = '#a6c2d6';
const fourthColor = '#ffffff';
const buttonBorderRadius = 100;

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: fourthColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: '50%',
        top: '-20%',

    },
    logoHome: {
        width: '100%',
        height: '20%',
        marginTop: '10%',
    },
    inputContainer: {
        width: '80%',
        marginTop: 10,
    },
    input: {
        backgroundColor: primaryColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: buttonBorderRadius,
        borderBottomColor: fourthColor,
        borderBottomWidth: 2,
        marginTop: '5%',
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
        backgroundColor: primaryColor,
        marginTop: 5,
        borderColor: fourthColor,
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
        color: fourthColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonRegisterText: {        
        color: primaryColor,
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