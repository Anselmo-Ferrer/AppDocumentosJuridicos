import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import Background from './Background';
import { dbAccounts } from '../firebase/firebaseAccount';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'LoginAccount'>;

export default function LoginAccount({ navigation }: Props) {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const validarLogin = async () => {
    try {
      const usersRef = collection(dbAccounts, 'users');
      const q = query(usersRef, where('email', '==', email), where('senha', '==', senha));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log('Login bem-sucedido!');
        navigation.navigate('Casos'); // ajuste o nome da rota conforme seu Stack
      } else {
        console.warn('Email ou senha inválidos!');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Criar conta</Text>
        <Text style={styles.SubTitle}>
          Ao criar uma conta você poderá fazer o envio dos documentos
        </Text>
      </View>
      <View style={styles.ViewInputs}>
        <TextInput
          style={styles.Input}
          placeholder="Email"
          placeholderTextColor="#9E9E9E"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.Input}
          placeholder="Senha"
          placeholderTextColor="#9E9E9E"
          secureTextEntry
          onChangeText={setSenha}
          value={senha}
        />
      </View>
      <Pressable
        style={styles.ForgotPassword}
        onPress={() => navigation.navigate('Start')}
      >
        <Text style={styles.ForgotPasswordText}>esqueceu sua senha?</Text>
      </Pressable>
      <Pressable style={styles.LoginAccountButton} onPress={validarLogin}>
        <Text style={styles.LoginAccountText}>Entrar</Text>
      </Pressable>
      <Pressable
        style={styles.CreateAccountButton}
        onPress={() => navigation.navigate('CreateAccount')}
      >
        <Text style={styles.CreateAccountText}>Criar uma nova conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  View: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    paddingTop: 40,
    padding: 20,
    display: 'flex',
    alignItems: 'center'
  },
  ViewTop: {
    width: '80%',
  },
  Title: {
    color: '#1F41BB',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    marginTop: 100,
  },
  SubTitle: {
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    fontStyle: 'normal',
    marginTop: 10,
  },
  ViewInputs: {
    width: '80%',
    alignItems: 'center',
    gap: 26,
    marginTop: 53
  },
  Input: {
    display: 'flex',
    width: 357,
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 35,
    borderRadius: 10,
    backgroundColor: '#F1F4FF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  ForgotPassword: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  ForgotPasswordText: {
    color: '#1F41BB',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  LoginAccountButton: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  LoginAccountText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
  CreateAccountButton: {
    display: 'flex',
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20
  },
  CreateAccountText: {
    color: '#494949',
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Poppins_600SemiBold',
  }
});