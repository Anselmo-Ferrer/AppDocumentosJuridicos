import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { dbAccounts } from '../../firebase/firebaseAccount';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'CasosList'>;
type CasosListRouteProp = RouteProp<RootStackParamList, 'CasosList'>;

export default function CasosList({ navigation }: Props) {

  const route = useRoute<CasosListRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  const [casos, setCasos] = useState<any[]>([]);
  const [numCasos, setNumCasos] = useState(0);

  useEffect(() => {
    carregarCasosFirebase();
  }, []);

  const carregarCasosFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbAccounts, 'casosProgress'));

      const casosExtraidos: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        casosExtraidos.push({ ...data, firebaseId: doc.id });
      });

      // Filtra apenas casos ainda não assumidos
      const pendentes = casosExtraidos.filter((c) => c.advogadoId === '');
      setCasos(pendentes);
      setNumCasos(pendentes.length);
    } catch (error) {
      console.error('Erro ao carregar casos do Firebase:', error);
    }
  };

  const assumirCaso = async (firebaseId: string) => {
    try {
      const ref = doc(dbAccounts, 'casosProgress', firebaseId);

      await updateDoc(ref, {
        advogadoName: name,
        advogadoId: id,
        casoStatus: 'Em andamento',
      });

      // Remove da lista atual
      setCasos((prev) => prev.filter((c) => c.firebaseId !== firebaseId));
      setNumCasos((prev) => prev - 1);

      console.log('✅ Caso assumido com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao assumir o caso:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total de casos: {numCasos}</Text>
      {casos.map((caso, index) => (
        <View key={index} style={styles.card}>
          <Text>Cliente: {caso.client}</Text>
          <Text>Caso ID: {caso.casoId}</Text>
          <Text>Status: {caso.casoStatus}</Text>
          <Pressable style={styles.button} onPress={() => assumirCaso(caso.firebaseId)}>
            <Text style={styles.buttonText}>Assumir Caso</Text>
          </Pressable>
        </View>
      ))}
      <Pressable 
        style={styles.button} 
        onPress={() => navigation.navigate('LawyerCases', {
          user: {
            name: name,
            email: email,
            id: id,
          }
        })}
      >
        <Text style={styles.buttonText}>My cases</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#F1F4FF',
    borderRadius: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#1F41BB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});