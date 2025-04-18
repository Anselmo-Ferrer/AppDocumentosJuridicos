import {
  Image, StyleSheet, View, Text, TouchableOpacity, Pressable,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Background from './Background';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Progress'>;
type ProgressRouteProp = RouteProp<RootStackParamList, 'Progress'>;

export default function ProgressBarScreen({ navigation }: Props) {

  const route = useRoute<ProgressRouteProp>();
  const { user } = route.params;
  const { name, email, id } = user;

  const stats = [
    { title: 'Petição inicial enviada', done: true },
    { title: 'Criação do Réu', done: true },
    { title: 'Contestação', done: true },
    { title: 'Abertura do processo', done: false },
  ];

  return (
    <View style={styles.View}>
      <Background />
      <View style={styles.ViewBackIcon}>
        <AntDesign name="left" size={30} color="#1F41BB" style={styles.BackIcon}
          onPress={() => navigation.navigate('Casos', {
            user: {
              name: name,
              email: email,
              id: id,
            }
          })}/>
      </View>
      <View style={styles.ViewTop}>
        <Text style={styles.Title}>Processos Ativos</Text>
        <Text style={styles.SubTitle}>Verifique a atualizacao do processo</Text>
      </View>

    {stats.map((item, index) => {
      return (
        <View style={styles.ContainerStats} key={index}>
        <View style={styles.LeftStats}>
          <View style={styles.Check}>
            <AntDesign
              name={item.done ? 'check' : 'close'}
              size={28}
              color={item.done ? '#fff' : '#EF5350'}
            />
          </View>
          <View style={styles.lineStats}></View>
        </View>
        <View style={styles.RightStats}>
          <Text style={styles.TitleStats}>{item.title}</Text>
        </View>
      </View>
      )
    })}

      
      
      
    </View>
  )
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
  ViewBackIcon: {
    padding: 16,
    marginTop: 30,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  BackIcon: {
    backgroundColor: '#CBD6FF',
    borderRadius: 30,
    padding: 4,
    textAlign: 'center'
  },
  ContainerStats: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%'
  },
  LeftStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  RightStats: {
    marginLeft: 20,
    height: '30%',
    display: 'flex',
    justifyContent: 'center',
  },
  TitleStats: {
    color: '#1F41BB',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },  
  Check: {
    backgroundColor: '#1F41BB',
    borderRadius: 30,
    width: 50,
    height: 50,
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lineStats: {
    backgroundColor: '#1F41BB',
    height: 50,
    width: 3,
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
});