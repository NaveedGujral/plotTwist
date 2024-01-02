import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import supabase from './config/supabaseClient';
import { useEffect, useState } from 'react';

export default function App() {
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('Test')
        .select('*')

        if (error) {
          alert('There was an error!')
        }
        if (data) {
          setList(data)
          console.log(data)
        }
    }

    fetchItems()
  }, [])

  return (
    <View style={styles.container}>
      <ul>
        {list.map((item) => {
          return <li><Text>{item.id}</Text></li>
        })}
      </ul>
      <Text>Hi!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
