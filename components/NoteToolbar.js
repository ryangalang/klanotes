import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function NoteToolbar({ selected, onDelete, onCancel }) {
  if (selected.length === 0) return null;

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={onCancel} style={styles.buttonOutline}>
        <Icon name="close" size={18} color="#333" style={styles.icon} />
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} style={styles.buttonFilled}>
        <Icon name="trash" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.buttonTextFilled}>Delete ({selected.length})</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffffee', // soft translucent white
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginHorizontal: 12,

    // subtle shadow
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 24,
  },
  buttonFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5c5c',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonTextFilled: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});
