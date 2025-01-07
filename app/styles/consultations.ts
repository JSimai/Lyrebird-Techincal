import { StyleSheet } from 'react-native';
import { getResponsiveStyle } from '../utils/responsive';
import { COLORS } from '../utils/constants';

export const consultationsStyles = StyleSheet.create({
  consultationHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  consultationItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
  },
  consultationsList: {
    flex: 1,
    paddingBottom: 80,
  },
  consultationsSection: {
    flex: 1,
  },
  currentConsultationItem: {
    flex: 1,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    // marginHorizontal: 16,
  },
  dateSeparatorText: {
    color: COLORS.GRAY_500,
    fontSize: 14,
    marginHorizontal: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GRAY_500,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summary: {
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#457CBF',
    height: "100%",
    justifyContent: 'center',
  },
  tabButtonHistory: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#457CBF',
  },
  tabButtonText: {
    color: '#457CBF',
    fontWeight: 'bold',
  },
  tabSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
    gap: 8,

  },
});
