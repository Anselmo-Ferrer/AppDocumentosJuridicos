import React from 'react';
import { styles } from './styles';
import { View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function LogoutButton() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>
        <AntDesign
          name="logout"
          size={25}
          color="#1F41BB"
          style={styles.icon}
          onPress={navigation.goBack}
        />
        <Text>Sair</Text>
      </View>
    </View>
  );
}