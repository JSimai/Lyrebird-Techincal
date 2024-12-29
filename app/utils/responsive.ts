import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

export const window = Dimensions.get('window');
export const isSmallScreen = window.width < 768;

export const getResponsiveStyle = (mobileStyle: object, webStyle: object) => {
  return isWeb ? { ...mobileStyle, ...webStyle } : mobileStyle;
}; 