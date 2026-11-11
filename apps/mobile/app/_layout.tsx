import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Xəstələr' }} />
      <Stack.Screen name="labs" options={{ title: 'Analizlər' }} />
    </Stack>
  );
}