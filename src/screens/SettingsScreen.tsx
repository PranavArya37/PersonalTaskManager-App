import React, { useEffect, useRef, useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text } from 'react-native'
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';

const SettingsScreen = () => {
    const { signOut } = useAuth();
    const [userName, setUserName] = useState('');

    const flashMessageRef = useRef<FlashMessage>(null);

    const deleteAccount = async () => {
        try {
            flashMessageRef.current?.showMessage({
                message: "Account Deleted",
                description: "Your account has been deleted successfully!",
                type: 'success',
                icon: 'success',
                duration: 3000
            });
            setTimeout(async () => {
                const storedUserJSON = await AsyncStorage.getItem('@AuthData:user');
                if (storedUserJSON) {
                    const storedUser = JSON.parse(storedUserJSON);
                    const userEmail = storedUser.email;

                    await AsyncStorage.removeItem(userEmail);

                    await AsyncStorage.removeItem('@AuthData:user');

                    signOut();
                }
            }, 3000);
        } catch (error) {
            console.error('Error deleting user account:', error);
        }
    };

    const signedOut = async () => {
        try {
            flashMessageRef.current?.showMessage({
                message: "Signed Out",
                description: "You have been Signed Out Successfully!",
                type: 'success',
                icon: 'success',
                duration: 3000
            });


            setTimeout(() => {
                signOut();
            }, 3000);

        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedUserJSON = await AsyncStorage.getItem('@AuthData:user');
                if (storedUserJSON) {
                    const storedUser = JSON.parse(storedUserJSON);
                    const userEmail = storedUser.email;

                    const userKey = userEmail;
                    const userDataJSON = await AsyncStorage.getItem(userKey);

                    if (userDataJSON) {
                        const userData = JSON.parse(userDataJSON);
                        setUserName(userData.name);
                    }
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };

        loadStorageData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.greetings}>Hello, {userName}</Text>
            <Image source={require('../../assets/images/main-logo.png')} style={styles.image} />
            <Text style={styles.appNameTitle}>Personal Task Manager</Text>
            <Text style={styles.createdByTitle}>Created By Pranav Arya</Text>
            <Button title="Sign Out"
                onPress={signedOut}
                buttonStyle={styles.signedOutButton}
                containerStyle={{
                    width: 200,
                    alignSelf: 'center',
                }}
            />
            <Button title="Delete Account / User" onPress={deleteAccount}
                buttonStyle={styles.deleteAccountButton}
                containerStyle={{
                    width: 250,
                    alignSelf: 'center'
                }}
            />
            <FlashMessage ref={flashMessageRef} position="center" />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white'
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetings: {
        fontSize: 35,
        fontWeight: 'bold',
        marginTop: 40
    },
    image: {
        height: 170,
        width: 170,
        marginTop: 80,
    },
    appNameTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 7
    },
    createdByTitle: {
        fontSize: 15,
        marginBottom: 14
    },
    signedOutButton: {
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        height: 55,
        marginTop: 100
    },
    deleteAccountButton: {
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 30,
        height: 55,
        marginTop: 30
    }
})

export default SettingsScreen
