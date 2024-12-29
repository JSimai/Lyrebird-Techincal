import { StyleSheet } from 'react-native';
import { getResponsiveStyle } from '../utils/responsive';
import { COLORS } from '../utils/constants';

export const notesStyles = StyleSheet.create({
  addNoteButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    flex: 1,
  },
  noteItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    padding: 10,
  },
  notesSection: getResponsiveStyle(
    {
      height: 250,
    },
    {
      width: '40%',
      height: '100%',
    }
  ),
});