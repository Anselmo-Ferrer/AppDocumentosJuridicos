import { doc, getDocs, query, where, collection } from 'firebase/firestore';
import { dbAccounts } from './firebaseConfig';
import { Alert } from 'react-native';


export const fetchCasosProgress = async (id: number | string) => {
  try {
    const q = query(
      collection(dbAccounts, 'casosProgress'),
      where('casoId', '==', id)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { ...docSnap.data(), firebaseId: docSnap.id };
    } else {
      Alert.alert('Erro', 'Caso não encontrado');
    }
  } catch (e) {
    console.error(e);
  }
};


export const buscarFirebase = async (field: string, value: string) => {
  try {
    const q = query(
      collection(dbAccounts, 'casosProgress'),
      where(field, '==', value)
    );

    const snapshot = await getDocs(q);
    const resultado: any[] = [];

    snapshot.forEach((doc) => {
      resultado.push({ ...doc.data(), firebaseId: doc.id });
    });

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar casos assumidos:', error);
    return [];
  }
};