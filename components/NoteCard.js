import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function NoteCard({ note, onPress, onLongPress, selected, onTogglePin }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress(note.id)}
      style={[
        styles.card,
        selected && styles.selected,
        note.pinned && styles.pinned,
      ]}
      activeOpacity={0.85}
    >
      <Text style={styles.title} numberOfLines={1}>
        {note.title || ''}
      </Text>
      <Text numberOfLines={3} style={styles.content}>
        {note.content || ''}
      </Text>

      <TouchableOpacity
        onPress={() => onTogglePin(note)}
        style={[styles.pinTouchable, note.pinned && styles.pinActive]}
        activeOpacity={0.7}
      >
        <Text style={[styles.pin, note.pinned && styles.pinActiveText]}>
          {note.pinned ? '📌' : '📍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 6,
    minHeight: 120,
    position: 'relative',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 8,

    elevation: 5,
  },
  selected: {
    borderColor: '#ff4757',
    borderWidth: 2,
  },
  pinned: {
    backgroundColor: '#fff5f0',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: '#222',
    marginBottom: 8,
  },
  content: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  pinTouchable: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinActive: {
    backgroundColor: '#ff6b6b',
  },
  pin: {
    fontSize: 18,
  },
  pinActiveText: {
    color: '#fff',
  },
});
