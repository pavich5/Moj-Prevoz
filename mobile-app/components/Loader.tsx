import React from 'react';
import { View, ActivityIndicator, ViewStyle } from 'react-native';

interface LoaderProps {
  isDarkTheme: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isDarkTheme }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkTheme ? 'rgb(0, 0, 0)' : '#F5F7FA',
      } as ViewStyle}
    >
      <ActivityIndicator
        size="large"
        color={isDarkTheme ? '#2E2E2E' : '#2E2E2E'}
      />
    </View>
  );
}

export default Loader;
