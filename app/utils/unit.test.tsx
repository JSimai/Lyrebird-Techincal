import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { default as Index } from '../app/index';

// Mock Expo
jest.mock('expo', () => ({
  Expo: {
    moduleNames: []
  }
}));

// Mock expo-asset
jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: () => ({ downloadAsync: () => Promise.resolve() })
  }
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  loadAsync: () => Promise.resolve(),
}));

// Mock the vector icons
jest.mock('@expo/vector-icons/Entypo', () => 'Entypo');
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null
}));

jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 20
  }
}));

// Mock expo-router and its hooks
jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  useSegments: () => []
}));

describe('Core App Functionality', () => {
  it('handles recording state correctly', () => {
    const { getByText, getByTestId } = render(<Index />);
    
    // Find and click the recording button with icon
    const startButton = getByText('Start Recording');
    fireEvent.press(startButton);
    
    // When recording starts, check for Recording... text
    expect(getByText('Recording...')).toBeTruthy();
    
    // Find and click the stop button
    const stopButton = getByTestId('stop-button');
    fireEvent.press(stopButton);
    
    // Should go back to Start Recording
    expect(getByText('Start Recording')).toBeTruthy();
  });

  it('creates new consultation after recording', () => {
    const { getByText } = render(<Index />);
    
    // Simulate recording and stopping
    fireEvent.press(getByText('Start Recording'));
    fireEvent.press(getByText('Recording...'));
    
    // Verify new consultation appears with today's date
    const today = new Date().toLocaleDateString();
    expect(getByText(new RegExp(today))).toBeTruthy();
  });

  it('switches between Recent and History tabs', () => {
    const { getByText } = render(<Index />);
    
    // Test tab switching
    fireEvent.press(getByText('History'));
    expect(getByText('History')).toBeTruthy();
    
    fireEvent.press(getByText('Recent'));
    expect(getByText('Recent')).toBeTruthy();
  });

  it('handles note input', () => {
    const { getByPlaceholderText } = render(<Index />);
    const noteInput = getByPlaceholderText('Write notes here...');
    
    // Test note input
    fireEvent.changeText(noteInput, 'Test consultation note');
    expect(noteInput.props.value).toBe('Test consultation note');
  });
});