import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import Background from './Background';
import { dbAccounts } from '../firebase/firebaseAccount';
import { collection, addDoc } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [cpf, setCpf] = useState<string>();
  const [senha, setSenha] = useState<string>();

  const criarConta = async () => {
    try {
      if (!name || !email || !cpf || !senha) {
        console.warn('Preencha todos os campos');
        return;
      }

      const docRef = await addDoc(collection(dbAccounts, 'users'), {
        name,
        email,
        cpf,
        senha,
        createdAt: new Date()
      });

      console.log('Conta criada com ID: ', docRef.id);
      navigation.navigate('LoginAccount'); // redireciona para tela de login
    } catch (e) {
      console.error('Erro ao criar conta: ', e);
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
          placeholder="Nome"
          placeholderTextColor="#9E9E9E"
          onChangeText={setName}
        />
        <TextInput
          style={styles.Input}
          placeholder="Email"
          placeholderTextColor="#9E9E9E"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.Input}
          placeholder="CPF"
          placeholderTextColor="#9E9E9E"
          onChangeText={setCpf}
        />
        <TextInput
          style={styles.Input}
          placeholder="Senha"
          placeholderTextColor="#9E9E9E"
          onChangeText={setSenha}
          secureTextEntry
        />
        <TextInput
          style={styles.Input}
          placeholder="Confirme sua senha"
          placeholderTextColor="#9E9E9E"
          secureTextEntry
        />
      </View>
      <Pressable style={styles.CreateAccountButton} onPress={criarConta}>
        <Text style={styles.CreateAccountText}>Entrar</Text>
      </Pressable>
      <Pressable
        style={styles.HaveAccountButton}
        onPress={() => navigation.navigate('LoginAccount')}
      >
        <Text style={styles.HaveAccountText}>Já tenho uma conta</Text>
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
    //borderWidth: 2,
    //borderColor: '#1F41BB',
    backgroundColor: '#F1F4FF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  CreateAccountButton: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 53,

    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  CreateAccountText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
  HaveAccountButton: {
    display: 'flex',
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20
  },
  HaveAccountText: {
    color: '#494949',
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'normal',
    fontFamily: 'Poppins_600SemiBold',
  }
})