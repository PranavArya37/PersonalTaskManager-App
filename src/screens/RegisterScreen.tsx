import React, { useState, useRef, useEffect } from 'react'
import { Image, Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, Icon, Input } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { formObjectRegister, UserInfo, formParams } from '../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    DashboardScreen: undefined;
    LoginScreen: undefined;
    RegisterScreen: undefined;
    SettingsScreen: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterScreen'>;

const RegisterScreen = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formValue, setFormValue] = useState<formObjectRegister>({ name: '', email: '', password: '' });
    const [userInfo, setUserInfo] = useState<any>({});

    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const flashMessageRef = useRef<FlashMessage>(null);

    const addIntoForm = ({ value, name }: formParams) => {
        setFormValue(formValue => ({ ...formValue, [name]: value }));
    }

    const getUserInfo = async (email: string) => {
        let user: string | null;
        user = await AsyncStorage.getItem(email);
        const userInfo: UserInfo = user ? JSON.parse(user) : null;
        console.log(userInfo);
        setUserInfo(userInfo);
    }

    const saveUserInfo = async () => {
        await AsyncStorage.setItem(formValue.email, JSON.stringify(formValue));
    }

    const validateForm = () => {
        if (formValue?.name === '') {
            flashMessageRef.current?.showMessage({
                message: "Name",
                description: "Name can not be empty",
                type: 'danger',
                icon: 'danger'
            })
        }
        else if (formValue?.email === '') {
            flashMessageRef.current?.showMessage({
                message: "Email",
                description: "Email Id can not be empty!",
                type: 'danger',
                icon: 'danger'
            })
        }
        else if (formValue?.email !== '' && (!formValue?.email.includes('@') || !formValue?.email.includes('.com'))) {
            flashMessageRef.current?.showMessage({
                message: "Invalid Email",
                description: "Please enter a valid email id!",
                type: 'danger',
                icon: 'danger'
            })
        }
        else if (formValue?.password === '') {
            flashMessageRef.current?.showMessage({
                message: "Password",
                description: "Password can not be empty!",
                type: 'danger',
                icon: 'danger'
            })
        }
        else if (formValue?.email === userInfo?.email) {
            flashMessageRef.current?.showMessage({
                message: "User already exists.",
                description: "Please sign in with the correct credentials!",
                type: 'danger',
                icon: 'danger'
            })
        }
        else {
            saveUserInfo();
            setFormValue({ name: '', email: '', password: '' });
            navigation.navigate('LoginScreen');
        }
    }

    useEffect(() => {
        if (formValue.email) {
            getUserInfo(formValue.email);
        }
    }, [formValue.email]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <Image source={require('../../assets/images/main-logo.png')} style={styles.image} />
                        <Text style={styles.title}>Signup</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.nameLabel}>Name:</Text>
                            <Input
                                containerStyle={styles.inputFieldContainer}
                                inputContainerStyle={styles.input}
                                onChangeText={(e) => addIntoForm({ value: e, name: 'name' })}
                                value={formValue?.name}
                                placeholder="Enter Name"
                                autoCorrect={false}
                                autoCapitalize="none"
                                leftIcon={
                                    <Icon
                                        name="user"
                                        type="feather"
                                        size={20}
                                        color="#808080"
                                    />
                                }
                            />
                            <Text style={styles.emailLabel}>Email:</Text>
                            <Input
                                containerStyle={styles.inputFieldContainer}
                                inputContainerStyle={styles.input}
                                onChangeText={(e) => addIntoForm({ value: e, name: 'email' })}
                                value={formValue?.email}
                                placeholder="Enter Email"
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                leftIcon={
                                    <Icon
                                        name="mail"
                                        type="feather"
                                        size={20}
                                        color="#808080"
                                    />
                                }
                            />
                            <Text style={styles.passwordLabel}>Password:</Text>
                            <Input
                                containerStyle={styles.inputFieldContainer}
                                inputContainerStyle={styles.input}
                                onChangeText={(e) => addIntoForm({ value: e, name: 'password' })}
                                value={formValue?.password}
                                placeholder="Enter Password"
                                secureTextEntry={!showPassword}
                                autoCorrect={false}
                                autoCapitalize="none"
                                leftIcon={
                                    <Icon
                                        name="lock"
                                        type="feather"
                                        size={20}
                                        color="#808080"
                                    />
                                }
                                rightIcon={
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Icon
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            type="feather"
                                            size={20}
                                            color="#808080"
                                        />
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                        <View style={styles.buttonsContainer}>
                            <Button
                                title="SIGNUP"
                                buttonStyle={{
                                    backgroundColor: 'black',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                    height: 55
                                }}
                                containerStyle={{
                                    width: 200,
                                    marginHorizontal: 50,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => {
                                    validateForm()
                                }}
                            />
                        </View>
                        <View style={styles.logInLinkContainer}>
                            <Text>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                                <Text style={styles.logInLinkText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
            <FlashMessage ref={flashMessageRef} position="top" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    innerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 35
    },
    image: {
        height: 170,
        width: 170,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 10,
    },
    inputContainer: {
        width: '85%',
        flexDirection: 'column',
        marginTop: 5,
    },
    nameLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 5,
    },
    emailLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 5,
    },
    passwordLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 5,
    },
    inputFieldContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderRadius: 7,
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    logInLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    logInLinkText: {
        color: 'red',
    },
})

export default RegisterScreen