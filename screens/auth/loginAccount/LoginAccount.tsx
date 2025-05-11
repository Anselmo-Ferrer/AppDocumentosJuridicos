import React, { useState } from 'react';
import { styles } from './styles';
import { View, Text, Pressable, TextInput } from 'react-native';
import Background from '../../ui/background/Background';
import { dbAccounts } from '../../../services/firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import Toast from 'react-native-toast-message';
import AntDesign from '@expo/vector-icons/AntDesign';
import BackButton from '../../ui/backButton/BackButton';

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
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
  
        const nameUsuario = userData.name;
        const emailUsuario = userData.email;
        const senhaUsuario = userData.senha;
        const idUsuario = userData.id;
        const roleUsusuario = userData.role;
  
        console.log('Login bem-sucedido!');
        console.log('Usuário:', { emailUsuario, senhaUsuario, idUsuario, roleUsusuario });

        if (roleUsusuario === 'Advogado') {
          navigation.navigate('CasosList', {
            user: {
              name: nameUsuario,
              email: emailUsuario,
              id: idUsuario,
            }
          });
        } else {
          navigation.navigate('Casos', {
            user: {
              name: nameUsuario,
              email: emailUsuario,
              id: idUsuario,
            }
          });
        }
  
        
      } else {
        console.warn('Email ou senha inválidos!');
        showToast()
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Email ou senha invalido',
      text2: 'Tente novamente'
    });
  }

  return (
    <View style={styles.View}>
      <Background />
      <BackButton />
      <View style={styles.ToastView}>
        <Toast/>
      </View>
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Entre em sua conta</Text>
        <Text style={styles.SubTitle}>
        Bem vindo de volta, estávamos sentindo sua falta
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