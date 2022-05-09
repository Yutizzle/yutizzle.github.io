import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import supabase from '../api/supabase';
import ErrorMessages from '../api/constants';
import plateLogo from '../assets/images/rack-weights.jpg';
import { ErrorMessage } from '../components';
import CommonStyles from '../styles/Common';
import { LoginScreenNavigationProp } from '../types';

function LoginScreen({ navigation }: LoginScreenNavigationProp) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passHide, togglePassHide] = useState(true);
  const [loginError, setLoginError] = useState('');

  const onLogin = async () => {
    // disable button
    setButtonDisabled(true);

    if (email !== '' && password !== '') {
      try {
        await supabase.auth.signIn({
          email,
          password,
        });
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        setLoginError(JSON.stringify(err));
        setButtonDisabled(false);
      }

      return;
    }

    // login error if email/password field empty
    setLoginError(ErrorMessages.EMPTY_LOGIN_FIELD);
    setButtonDisabled(false);
  };

  return (
    <ImageBackground
      style={[CommonStyles.backgroundImage, CommonStyles.flex, CommonStyles.flexGrow]}
      source={plateLogo}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[CommonStyles.flex, CommonStyles.flexGrow, CommonStyles.fullWidth]}
      >
        <TouchableWithoutFeedback
          style={[CommonStyles.flex, CommonStyles.flexGrow]}
          onPress={Keyboard.dismiss}
        >
          {/* Login Area */}
          <SafeAreaView
            style={[
              CommonStyles.flex,
              CommonStyles.flexGrow,
              CommonStyles.justifyCenter,
              CommonStyles.padding10,
            ]}
          >
            {/* Status Bar */}
            <StatusBar style="light" />

            <View style={[CommonStyles.loginContainer]}>
              {/* App Title */}
              <View style={CommonStyles.titleContainer}>
                <Text style={CommonStyles.title}>Workout Logger</Text>
              </View>

              {/* Username Field */}
              <View style={CommonStyles.inputContainer}>
                <TextInput
                  style={[CommonStyles.inputs, CommonStyles.flex]}
                  placeholder="Username"
                  keyboardType="email-address"
                  onChangeText={(em) => setEmail(em)}
                />
              </View>

              {/* Password Field */}
              <View style={CommonStyles.inputContainer}>
                <TextInput
                  style={[CommonStyles.inputs, CommonStyles.flex]}
                  placeholder="Password"
                  secureTextEntry={passHide}
                  textContentType="password"
                  autoCompleteType="password"
                  onChangeText={(pass) => setPassword(pass)}
                />
                <Ionicons
                  name={passHide ? 'eye-off-sharp' : 'eye-sharp'}
                  size={20}
                  color="gray"
                  onPress={() => togglePassHide(!passHide)}
                />
              </View>

              {/* Error message */}
              {loginError ? <ErrorMessage error={loginError} visible /> : null}

              {/* Login Button */}
              <TouchableOpacity
                style={[CommonStyles.buttons, CommonStyles.buttonsPrimary]}
                onPress={async () => {
                  await onLogin();
                }}
              >
                {buttonDisabled ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[CommonStyles.buttonText, CommonStyles.textLight]}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Register Link */}
              <View style={CommonStyles.linkContainer}>
                <Text style={CommonStyles.registerText}>Don&apos;t have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text style={CommonStyles.links}> Sign Up!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default LoginScreen;
