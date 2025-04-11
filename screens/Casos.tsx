import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Background from './Background';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { supabase } from '../supabase/supabaseClient';

type Props = NativeStackScreenProps<RootStackParamList, 'Casos'>;
type CasosRouteProp = RouteProp<RootStackParamList, 'Casos'>;

export default function CreateCaso({ navigation }: Props) {

  const route = useRoute<CasosRouteProp>();
  const { user } = route.params;
  const { email, id } = user;

  const [casos, setCasos] = useState<any[]>([]);
  const [numCasos, setNumCasos] = useState<number>();
  const [casoSelected, setCasoSelected] = useState<string>('')

  useEffect(() => {
    exportarCasos()
  }, [])

  const file = [
    { Id: 1, Name: 'caso 1 - processo de transito', Date: '01/01/2025', Status: 'Recusado' },
    { Id: 2, Name: 'caso 2 - processo de transito', Date: '05/04/2024', Status: 'Aprovado' },
    { Id: 3, Name: 'caso 3 - processo de transito', Date: '03/08/2023', Status: 'Em andamento' },
    { Id: 4, Name: 'caso 4 - processo de transito', Date: '03/08/2023', Status: 'Aprovado' },
    { Id: 5, Name: 'caso 5 - processo de transito', Date: '03/08/2023', Status: 'Aprovado' },
  ];

  const exportarCasos = async () => {
    const path = `envios/${id}/`;
  
    const { data, error } = await supabase.storage
      .from('documents')
      .list(path, {
        limit: 100,
        offset: 0,
      });
  
    if (error) {
      console.error('Erro ao listar casos:', error);
      return;
    }
  
    // filtra só os diretórios (pastas)
    const pastas = data.filter(item => item.name && item.metadata?.eTag === undefined);
  
    setCasos(pastas); // salva os "casos"
    setNumCasos(pastas.length);
  
    console.log(`Usuário ${id} tem ${pastas.length} caso(s):`);
  };

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Processos Ativos</Text>
        <Text style={styles.SubTitle}>{`${numCasos} processos em andamento`}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {casos.map((item, index) => (
          <TouchableOpacity 
            style={styles.CasosContainer} 
            key={item.Id} 
            onPress={() =>
              navigation.navigate('Documents', {
                user: {
                  email,
                  id,
                },
                caso: item.name, // <-- esse é o nome da pasta/caso
              })
            }
          >
            <View>
              <View style={styles.CasosNameView}>
                <Text style={styles.casosIndex}>{index+1}</Text>
                <Text style={styles.casosTitle}>{item.name.slice(2)}</Text>
              </View>
              <Text
                style={[
                  styles.casosStatus,
                  // item.Status === 'Aprovado'
                  //   ? { backgroundColor: '#55C06D' }
                  //   : item.Status === 'Recusado'
                  //   ? { backgroundColor: '#EF5350' }
                  //   : item.Status === 'Em andamento'
                  //   ? { backgroundColor: '#F8C33E' }
                  //   : {},
                ]}
              >
                Aprovado
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Pressable
        style={styles.NewDocumentButton}
        onPress={() => navigation.navigate('CreateCaso', {
          user: {
            email: email,
            id: id,
          }
        })}
      >
        <Text style={styles.NewDocumentText}>Criar</Text>
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
    alignItems: 'center',
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
    marginTop: 6,
    marginBottom: 50,
  },
  CasosContainer: {
    width: 344,
    height: 120,
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderColor: '#E7E7E7',
    borderWidth: 1,
    marginBottom: 28,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  CasosNameView: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4
  },
  casosTitle: {
    color: '#000',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
  },
  casosIndex: {
    backgroundColor: '#CACACA',
    width: 21,
    height: 21,
    borderRadius: 10.5,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  casosStatus: {
    width: 110,
    fontSize: 12,
    borderRadius: 10,
    height: 21,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    backgroundColor: '#55C06D',
  },
  NewDocumentButton: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 55,
    marginBottom: 55,
    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  NewDocumentText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
});