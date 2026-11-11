import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { Patient } from '@clinic/api-client';
import { api } from './src/lib/api';

export default function App() {
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.patients
      .list()
      .then(setPatients)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>API bağlantı testi</Text>
      <Text style={styles.url}>{process.env.EXPO_PUBLIC_API_URL}</Text>

      {error && <Text style={styles.error}>{error}</Text>}
      {!patients && !error && <ActivityIndicator />}

      {patients?.map((p) => (
        <View key={p.id} style={styles.row}>
          <Text style={styles.name}>{p.fullName}</Text>
          <Text style={styles.meta}>{p.age} yaş</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 72, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  url: { color: '#666' },
  error: { color: '#B42318' },
  row: { padding: 14, borderRadius: 12, backgroundColor: '#F1F4F2', gap: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#4A5A54' },
});