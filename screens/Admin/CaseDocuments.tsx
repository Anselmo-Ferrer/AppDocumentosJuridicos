import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { supabase } from '../../supabase/supabaseClient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, getDocs, query, where, updateDoc, collection } from 'firebase/firestore';
import { dbAccounts } from '../../firebase/firebaseAccount';

type CaseDocumentsRouteProp = RouteProp<RootStackParamList, 'CaseDocuments'>;
type Props = NativeStackScreenProps<RootStackParamList, 'CaseDocuments'>;

export default function CaseDocuments({ navigation }: Props) {
  const route = useRoute<CaseDocumentsRouteProp>();
  const { user, caso } = route.params;
  const { name, email, id } = user;

  const [documentos, setDocumentos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

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













  useEffect(() => {
    carregarDocs();
  }, []);

  const carregarDocs = async () => {
    console.log(caso)
    const path = `envios/${detalhes.clientId}/${detalhes.casoName}_${detalhes.casoId}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .list(path);

    if (error) {
      console.error('Erro ao buscar documentos:', error.message);
      setCarregando(false);
      return;
    }

    const arquivos = data.filter(doc => doc.name);
    setDocumentos(arquivos);
    setCarregando(false);
  };

  const abrirDocumento = async (fileName: string) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(`envios/${detalhes.clientId}/${detalhes.casoName}_${detalhes.casoId}/${fileName}`);

    if (data?.publicUrl) {
      Linking.openURL(data.publicUrl);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documentos do Caso</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#1F41BB" />
      ) : (
        <ScrollView>
          {documentos.map((doc, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => abrirDocumento(doc.name)}
            >
              <Text>{doc.name.replace(/_/g, ' ')}</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F41BB',
  },
  card: {
    backgroundColor: '#F1F4FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
});