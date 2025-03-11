import { Redirect } from 'expo-router';

export default function Index() {
  // Intro ekranına yönlendir
  return <Redirect href="/intro" />;
}