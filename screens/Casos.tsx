import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import Background from './Background';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Casos'>;

export default function CasosScreen({ navigation }: Props) {
  const file = [
    { Id: 1, Name: 'caso 1 - processo de transito', Date: '01/01/2025', Status: 'Recusado' },
    { Id: 2, Name: 'caso 2 - processo de transito', Date: '05/04/2024', Status: 'Aprovado' },
    { Id: 3, Name: 'caso 3 - processo de transito', Date: '03/08/2023', Status: 'Em andamento' },
    { Id: 4, Name: 'caso 4 - processo de transito', Date: '03/08/2023', Status: 'Aprovado' },
    { Id: 5, Name: 'caso 5 - processo de transito', Date: '03/08/2023', Status: 'Aprovado' },
  ];

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Processos Ativos</Text>
        <Text style={styles.SubTitle}>20 processos em andamento</Text>
      </View>

      <ScrollView>
        {file.map((item) => (
          <View style={styles.CasosContainer} key={item.Id}>
            <View>
              <Text style={styles.casosTitle}>{item.Name}</Text>
              <Text
                style={[
                  styles.casosStatus,
                  item.Status === 'Aprovado'
                    ? { backgroundColor: '#55C06D' }
                    : item.Status === 'Recusado'
                    ? { backgroundColor: '#EF5350' }
                    : item.Status === 'Em andamento'
                    ? { backgroundColor: '#F8C33E' }
                    : {},
                ]}
              >
                {item.Status}
              </Text>
            </View>
            <AntDesign name="delete" size={24} color="gray" />
          </View>
        ))}
      </ScrollView>

      <Pressable
        style={styles.NewDocumentButton}
        onPress={() => navigation.navigate('Documents')}
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
  casosTitle: {
    color: '#000',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
  },
  casosStatus: {
    width: 110,
    fontSize: 12,
    borderRadius: 10,
    height: 21,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
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