import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { dbAccounts } from '../../firebase/firebaseAccount';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'LawyerCases'>;
type LawyerCasesRouteProp = RouteProp<RootStackParamList, 'LawyerCases'>;

export default function LawyerCases({ navigation }: Props) {

  const route = useRoute<LawyerCasesRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  const [meusCasos, setMeusCasos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarMeusCasos();
  }, []);

  const buscarMeusCasos = async () => {
    try {
      const q = query(
        collection(dbAccounts, 'casosProgress'),
        where('advogadoId', '==', id)
      );

      const snapshot = await getDocs(q);
      const casos: any[] = [];

      snapshot.forEach((doc) => {
        casos.push({ ...doc.data(), firebaseId: doc.id });
      });

      setMeusCasos(casos);
      setCarregando(false);
    } catch (error) {
      console.error('Erro ao buscar casos assumidos:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Casos</Text>

      {carregando ? (
        <Text>Carregando...</Text>
      ) : meusCasos.length === 0 ? (
        <Text>Nenhum caso assumido ainda.</Text>
      ) : (
        <ScrollView>
          {meusCasos.map((caso, index) => (
            <View key={index} style={styles.card}>
              <Text>Cliente: {caso.client}</Text>
              <Text>Caso ID: {caso.casoId}</Text>
              <Text>Status: {caso.casoStatus}</Text>
              <Text>Assumido em: {new Date(caso.createdAt.seconds * 1000).toLocaleDateString()}</Text>
              <Pressable 
                style={styles.button} 
                onPress={() => navigation.navigate('CaseInformations', {
                  user: {
                    name: name,
                    email: email,
                    id: id,
                  },
                  caso: caso.casoId
                })}
              >
                <Text style={styles.buttonText}>My cases</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F41BB',
  },
  card: {
    backgroundColor: '#E7ECFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  button: {
    height: 40,
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