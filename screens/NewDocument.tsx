import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';
import { collection, addDoc } from 'firebase/firestore';
import Background from './Background';
import { dbDocuments } from '../firebase/firebaseConfig';
import { supabase } from '../supabase/supabaseClient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'NewDocument'>;

interface Documento {
  name: string;
  desc: string;
  type: string;
  status: string;
  date: string;
  size: number;
}

export default function NewDocumentScreen({ navigation }: Props) {
  const [fileId, setFileId] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileEndereco, setFileEndereco] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileRenda, setFileRenda] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileProvas, setFileProvas] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const salvarDocumento = async (doc: Documento) => {
    try {
      await addDoc(collection(dbDocuments, 'documentos'), doc);
      console.log('Documento enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
    }
  };

  const uploadParaSupabase = async (file: DocumentPicker.DocumentPickerAsset, nomeCustomizado: string): Promise<string | null> => {
    try {
      const fileType = mime.getType(file.name) || 'application/pdf';
      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(nomeCustomizado, fileContent, {
          contentType: fileType,
          upsert: true,
        });

      if (error) {
        console.error('Erro ao fazer upload no Supabase:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(nomeCustomizado);

      return urlData?.publicUrl || null;
    } catch (error) {
      console.error('Erro geral no upload:', error);
      return null;
    }
  };

  const salvarTodosDocumentos = async () => {
    try {
      const documentos = [
        { file: fileId, tipo: 'Documento Pessoal' },
        { file: fileEndereco, tipo: 'Comprovante de Endereço' },
        { file: fileRenda, tipo: 'Comprovante de Renda' },
        { file: fileProvas, tipo: 'Provas Relacionadas ao Caso' },
      ];

      for (const docItem of documentos) {
        if (docItem.file) {
          const nomeArquivoUnico = `${Date.now()}-${docItem.file.name}`;
          const url = await uploadParaSupabase(docItem.file, nomeArquivoUnico);

          if (!url) {
            console.warn(`Falha ao enviar ${docItem.tipo}`);
            continue;
          }

          const doc: Documento = {
            name: docItem.file.name,
            desc: docItem.tipo,
            type: docItem.file.mimeType || 'Desconhecido',
            status: 'Enviado',
            date: new Date().toLocaleDateString(),
            size: docItem.file.size || 0,
          };

          await salvarDocumento(doc);
          console.log(`Documento ${docItem.tipo} enviado com sucesso para:`, url);
        }
      }

      navigation.navigate('Send');
    } catch (error) {
      console.error('Erro ao salvar todos os documentos:', error);
    }
  };

  const pickDocumento = async (
    setter: React.Dispatch<React.SetStateAction<DocumentPicker.DocumentPickerAsset | null>>
  ) => {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled && result.assets.length > 0) {
      setter(result.assets[0]);
    }
  };

  const convertFileSize = (size: number) => {
    const sizeInMB = size / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const renderFileInput = (
    file: DocumentPicker.DocumentPickerAsset | null,
    label: string,
    onPick: () => void
  ) => (
    <View style={styles.inputField}>
      <Text style={styles.inputText}>{label}</Text>
      <TouchableOpacity
        style={[styles.botaoEnviarArquivo, file ? styles.botaoPreenchido : styles.botaoVazio]}
        onPress={onPick}
      >
        <Image
          style={styles.folderimage}
          source={
            file
              ? require('../assets/images/pdf.png')
              : require('../assets/images/open-folder.png')
          }
        />
        <View style={{ flex: 1 }}>
          {!file ? (
            <>
              <Text style={styles.buttonText}>Adicionar documento</Text>
              <Text style={styles.buttonSubText}>PDF</Text>
            </>
          ) : (
            <>
              <Text style={styles.buttonText}>{file.name}</Text>
              <View style={styles.subLineBotaoSalvar}>
                <Text style={styles.buttonSubText}>
                  {file.mimeType?.split('/')[1].toUpperCase() || 'desconhecido'}
                </Text>
                <Text style={styles.buttonSubText}>{convertFileSize(file.size ?? 0)}</Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.View}>
      <Background />
      <Text style={styles.Title}>Enviar documentos</Text>

      {renderFileInput(fileId, 'Documento Pessoais', () => pickDocumento(setFileId))}
      {renderFileInput(fileEndereco, 'Comprovante de Endereço', () => pickDocumento(setFileEndereco))}
      {renderFileInput(fileRenda, 'Comprovante de Renda', () => pickDocumento(setFileRenda))}
      {renderFileInput(fileProvas, 'Provas Relacionadas ao Caso', () => pickDocumento(setFileProvas))}

      <View style={styles.viewBottom}>
        <Pressable style={styles.botaoSalvar} onPress={salvarTodosDocumentos}>
          <Text style={styles.textSalvar}>Salvar</Text>
        </Pressable>
      </View>
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
  Title: {
    color: '#1F41BB',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    fontSize: 30,
    marginTop: 100,
    marginBottom: 53
  },
  viewBottom: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#0B0B0B',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    paddingBottom: 50,
  },
  inputField: {
    width: '90%',
    gap: 10,
    marginBottom: 30,
  },
  inputText: {
    fontSize: 16,
    color: '#0B0B0B',
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonText: {
    fontSize: 12,
    color: '#0B0B0B',
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonSubText: {
    fontSize: 12,
    color: '#6D6D6D',
    fontFamily: 'Poppins_400Regular'
  },
  botaoEnviarArquivo: {
    width: '100%',
    height: 84,
    borderWidth: 1,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
    marginBottom: -5
  },
  botaoVazio: {
    borderColor: '#d3d3d3',
    backgroundColor: '#fff',
  },
  botaoPreenchido: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  folderimage: {
    height: 42,
    width: 42,
  },
  botaoSalvar: {
    width: 357,
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1F41BB',
    borderRadius: 10,
    marginTop: 20,

    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  textSalvar: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
  subLineBotaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    width: '100%',
  }
});
