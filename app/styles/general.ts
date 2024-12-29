import { StyleSheet } from 'react-native';
import { getResponsiveStyle } from '../utils/responsive';
import Constants from 'expo-constants';
import { COLORS } from '../utils/constants';

export const generalStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 25,
    padding: 15,
    width: 200,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  consultDateTime: {
    fontSize: 16,
    color: COLORS.GRAY_500,
  },
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  divider: getResponsiveStyle(
    {
      height: 1,
      backgroundColor: COLORS.GRAY_200,
      width: "100%",
    },
    {
      height: "100%",
      backgroundColor: COLORS.GRAY_200,
      width: 1,
    }
  ),
  header: getResponsiveStyle(
    {
      backgroundColor: COLORS.PRIMARY,
      padding: 16,
      paddingTop: Constants.statusBarHeight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    {
      paddingHorizontal: 24,
      paddingTop: 48,
    }
  ),
  headerText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContent: getResponsiveStyle(
    {
      flex: 1,
      padding: 16,
      gap: 16,
    },
    {
      flexDirection: 'row',
      padding: 48,
      paddingTop: 24,
      gap: 48,
    }
  ),

  patientInfoSection: getResponsiveStyle(
    {
      backgroundColor: COLORS.GRAY_100,
      padding: 16,
    },
    {
      paddingHorizontal: 48,
      paddingTop: 48,
    }
  ),
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  recordingIndicator: {
    color: 'red',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // startButton: {
  //   backgroundColor: '#4CAF50',
  // },
  // stopButton: {
  //   backgroundColor: '#f44336',
  // },
});