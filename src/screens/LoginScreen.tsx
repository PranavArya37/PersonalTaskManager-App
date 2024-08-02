import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef, useState } from 'react'
import { Alert, Image, Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import FlashMessage from 'react-native-flash-message';
import { formObjectLogin, UserInfo, formParams } from '../types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Icon, Input } from '@rneui/themed';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
    DashboardScreen: undefined;
    LoginScreen: undefined;
    RegisterScreen: undefined;
    SettingsScreen: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

const LoginScreen = () => {
    const { setUser } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formValue, setFormValue] = useState<formObjectLogin>({ email: '', password: '' });


    const navigation = useNavigation<LoginScreenNavigationProp>();

    const flashMessageRef = useRef<FlashMessage>(null);


    const addIntoForm = ({ value, name }: formParams) => {
        setFormValue(formValue => ({ ...formValue, [name]: value }));
    }

    const signingIn = async () => {
        if (formValue.email === '') {
            flashMessageRef.current?.showMessage({
                message: "Email",
                description: "Email Id can not be empty!",
                type: 'danger',
                icon: 'danger'
            });
            return;
        }

        if (!formValue.email.includes('@') || !formValue.email.includes('.com')) {
            flashMessageRef.current?.showMessage({
                message: "Invalid Email",
                description: "Please enter a valid email id!",
                type: 'danger',
                icon: 'danger'
            });
            return;
        }

        if (formValue.password === '') {
            flashMessageRef.current?.showMessage({
                message: "Password",
                description: "Password can not be empty!",
                type: 'danger',
                icon: 'danger'
            });
            return;
        }

        let user: string | null = await AsyncStorage.getItem(formValue.email);
        const currentUser: UserInfo = user ? JSON.parse(user) : null;

        if (!currentUser) {
            flashMessageRef.current?.showMessage({
                message: "Invalid User",
                description: "Looks like your account does not exist. Please Signup!",
                type: 'danger',
                icon: 'danger'
            });
            return;
        }

        if (formValue.password !== currentUser.password) {
            flashMessageRef.current?.showMessage({
                message: "Incorrect Password",
                description: "Please enter correct password!",
                type: 'danger',
                icon: 'danger'
            });
            return;
        }

        const userData = { email: formValue.email };
        await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));
        setUser(userData);
        setFormValue({ email: '', password: '' });
        navigation.navigate('DashboardScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <Image source={require('../../assets/images/main-logo.png')} style={styles.image} />
                        <Text style={styles.title}>Login</Text>
                        <View style={styles.inputContainer}>
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
                        <View style={styles.rememberView}>
                            <View style={styles.rememberContainer}>
                                <TouchableOpacity
                                    onPress={() => setRememberMe(!rememberMe)}
                                    style={styles.rememberCheckbox}
                                >
                                    {rememberMe && (
                                        <Text style={{ fontSize: 18, color: '#007AFF' }}>✓</Text>
                                    )}
                                </TouchableOpacity>
                                <Text style={styles.rememberText}>Remember Me</Text>
                            </View>
                            <Pressable onPress={() => Alert.alert('Forgot Password!')}>
                                <Text style={styles.forgetText}>Forgot Password?</Text>
                            </Pressable>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <Button
                                title="LOGIN"
                                buttonStyle={{
                                    backgroundColor: 'black',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                    height: 55,
                                }}
                                containerStyle={{
                                    width: 200,
                                    marginHorizontal: 50,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={signingIn}

                            />
                        </View>
                        <View style={styles.signUpLinkContainer}>
                            <Text>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                                <Text style={styles.signUpLinkText}>Sign Up</Text>
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
    inputFieldContainer: {
        width: '100%',
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
    inputContainer: {
        width: '85%',
        flexDirection: 'column',
        marginTop: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderRadius: 7,
    },
    rememberView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginVertical: 10,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberCheckbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rememberText: {
        fontSize: 13,
        marginLeft: 10,
    },
    forgetText: {
        fontSize: 13,
        color: 'red',
    },
    buttonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    signUpLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signUpLinkText: {
        color: 'red',
    }
})

export default LoginScreen