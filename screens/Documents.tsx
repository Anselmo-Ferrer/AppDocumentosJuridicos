import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Background from './Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Documents'>;

export default function DocumentsScreen({ navigation }: Props) {

  const file = [
    { Id: 1, Name: 'Foto Identidade', Date: '01/01/2025 23:45', Size: 1023123, Type: 'PDF', Status: 'Declined' },
    { Id: 2, Name: 'Comprovante de endereco', Date: '05/04/2024 23:45', Size: 1023123, Type: 'PNG', Status: 'Success' },
    { Id: 3, Name: 'Comprovante de renda', Date: '03/08/2023 23:45', Size: 1023123, Type: 'PDF', Status: 'Declined' },
    { Id: 4, Name: 'Provas relacionadas ao caso', Date: '12/07/2020 23:45', Size: 1023123, Type: 'PDF', Status: 'Success' },
  ];

  const convertFileSize = (size: number) => {
    const sizeInMB = size / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  };

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Documentos</Text>
        <Text style={styles.SubTitle}>caso 1 - processo de transito</Text>
      </View>

      <ScrollView>
        {file.map((item) => (
          <View style={styles.CasosContainer} key={item.Id}>
            <View style={styles.CasosContainerLeft}>
              <Image
                style={styles.pdfImg}
                source={require('../assets/images/pdf.png')}
              />
              <View>
                <Text style={styles.casosTitle}>{item.Name}</Text>
                <Text>{item.Date}</Text>
              </View>
            </View>
            <AntDesign name="delete" size={24} color="gray" />
          </View>
        ))}
      </ScrollView>

      <Pressable
        style={styles.NewDocumentButton}
        onPress={() => navigation.navigate('NewDocument')}
      >
        <Text style={styles.NewDocumentText}>Enviar</Text>
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
    marginTop: 6,
    marginBottom: 50
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
  
    // Box shadow equivalente
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // Necessário para Android
  },
  CasosContainerLeft: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  pdfImg: {
    width: 36,
    height: 36
  },
  casosTitle: {
    color: '#000',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 5,
  },
  casosStatus: {
    width: 110,
    backgroundColor: '#55C06D',
    fontSize: 12,
    borderRadius: 10,
    height: 21,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
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
  
})