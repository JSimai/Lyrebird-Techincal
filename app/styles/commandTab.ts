import { StyleSheet } from 'react-native';
import { getResponsiveStyle } from '../utils/responsive';
import { COLORS } from '../utils/constants';

export const commandTabStyles = StyleSheet.create({
  buttonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },

  container: getResponsiveStyle(
    {
      alignItems: 'center',
      bottom: 16,
      left: 0,
      position: 'absolute',
      right: 0,
    },
    {
      bottom: 24,
    }
  ),

  divider: {
    backgroundColor: COLORS.GRAY_500,
    height: 20,
    width: 1,
  },

  popupContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 20,
    right: 20,
    backgroundColor: COLORS.GRAY_800,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  popupText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
  },

  recordButtonCont: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  recordingIndicator: {
    backgroundColor: COLORS.RECORDING,
    borderRadius: 100,
    height: 10,
    width: 10,
  },

  recordingIndicatorText: {
    color: COLORS.RECORDING,
    fontSize: 16,
    fontWeight: 'bold',
  },

  stopButton: {
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 100,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_100,
    elevation: 3,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    gap: 16,

    shadowColor: '#000',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});