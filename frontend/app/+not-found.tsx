import { Link, Stack, useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        router.push('/(tabs)/AllPosts');
      }, 0);

      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(contentTimer);
      };
    }, [])
  );

  if (!showContent) {
    return null; 
  }

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          This screen doesn't exist.
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          The page you are looking for might have been removed or does not exist.
        </ThemedText>
        <Link href="/(tabs)/AllPosts" style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>
            Go to home screen!
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  link: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  linkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
