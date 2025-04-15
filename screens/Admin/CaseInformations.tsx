import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { doc, getDocs, query, where, updateDoc, collection } from 'firebase/firestore';
import { dbAccounts } from '../../firebase/firebaseAccount';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'CaseInformations'>;
type CaseInformationsRouteProp = RouteProp<RootStackParamList, 'CaseInformations'>;

export default function CaseInformations({ navigation }: Props) {
  const route = useRoute<CaseInformationsRouteProp>();
  const { user, caso } = route.params;
  const { name, email, id } = user;

  const [detalhes, setDetalhes] = useState<any | null>(null);

  useEffect(() => {
    buscarDetalhes();
  }, []);

  const buscarDetalhes = async () => {
    try {
      const q = query(collection(dbAccounts, 'casosProgress'), where('casoId', '==', caso));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        setDetalhes({ ...docSnap.data(), firebaseId: docSnap.id });
      } else {
        Alert.alert('Erro', 'Caso não encontrado');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const aprovarCaso = async () => {
    if (!detalhes) return;
    try {
      const docRef = doc(dbAccounts, 'casosProgress', detalhes.firebaseId);
      await updateDoc(docRef, {
        advogadoId: id,
        advogadoName: name,
        casoStatus: 'Em andamento',
      });
      Alert.alert('✅ Caso aprovado!');
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  const recusarCaso = async () => {
    if (!detalhes) return;
    try {
      const docRef = doc(dbAccounts, 'casosProgress', detalhes.firebaseId);
      await updateDoc(docRef, {
        casoStatus: 'Recusado',
      });
      Alert.alert('❌ Caso recusado.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  if (!detalhes) return <Text style={{ padding: 20 }}>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/pdf.png')} style={styles.avatar} />
      <Text style={styles.name}>{detalhes.client}</Text>
      <Text style={styles.subtitle}>processo de trânsito</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.input}>xxx@gmail.com</Text>

      <Text style={styles.label}>Phone Number</Text>
      <Text style={styles.input}>+93123135</Text>

      <Text style={styles.label}>CPF</Text>
      <Text style={styles.input}>000.000.000-00</Text>

      <Text style={styles.label}>Documentos</Text>
      <TouchableOpacity 
        style={styles.buttonDocs} 
        onPress={() => navigation.navigate('CaseDocuments', {
          user,
          caso: caso
        })}
      >
        <Text style={styles.buttonDocsText}>Ver documentos</Text>
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.buttonRecusar} onPress={recusarCaso}>
          <Text style={styles.buttonText}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAprovar} onPress={aprovarCaso}>
          <Text style={styles.buttonText}>Aprovar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: '600', textTransform: 'capitalize' },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 20 },
  label: { alignSelf: 'flex-start', fontWeight: '600', marginTop: 15 },
  input: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
    padding: 12,
    width: '100%',
    borderRadius: 10,
    color: 'gray',
  },
  buttonDocs: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1F41BB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonDocsText: { color: '#1F41BB', fontWeight: '600' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginTop: 40 },
  buttonRecusar: {
    backgroundColor: '#EF5350',
    padding: 15,
    borderRadius: 10,
    width: 130,
    alignItems: 'center',
    shadowColor: '#FCA9A9',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
  },
  buttonAprovar: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: 130,
    alignItems: 'center',
    shadowColor: '#B9F8C7',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});