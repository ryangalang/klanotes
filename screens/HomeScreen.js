import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import NoteCard from '../components/NoteCard';
import NoteToolbar from '../components/NoteToolbar';
import { fetchNotes, deleteNote, updateNote } from '../utils/api';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const sortNotes = (notesArray) => {
    return notesArray.slice().sort((a, b) => b.pinned - a.pinned);
  };

  const loadNotes = async () => {
    setRefreshing(true);
    try {
      const data = await fetchNotes();
      setNotes(sortNotes(data));
      setSelectedIds([]);
    } catch (error) {
      alert('Failed to load notes');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const togglePin = async (note) => {
    try {
      const updatedPin = note.pinned ? 0 : 1;
      await updateNote(note.id, {
        title: note.title,
        content: note.content,
        pinned: updatedPin,
      });
      setNotes((prevNotes) =>
        sortNotes(
          prevNotes.map((n) =>
            n.id === note.id ? { ...n, pinned: updatedPin } : n
          )
        )
      );
    } catch {
      alert('Failed to toggle pin');
    }
  };

  const onNotePress = (note) => {
    if (selectedIds.length > 0) {
      toggleSelect(note.id);
    } else {
      navigation.navigate('NoteEditor', { note });
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((sid) => sid !== id)
        : [...prevSelected, id]
    );
  };

  const onNoteLongPress = (id) => {
    toggleSelect(id);
  };

  const onDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteNote(id)));
      setNotes((prevNotes) =>
        prevNotes.filter((note) => !selectedIds.includes(note.id))
      );
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (error) {
      alert('Failed to delete notes');
    }
  };

  const onCancelSelection = () => {
    setSelectedIds([]);
  };

  const filteredNotes = notes
    .filter(note => note.archived === 0)
    .filter(note =>
      (note.title || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );

  return (
    <View style={styles.container}>
      <NoteToolbar
        selected={selectedIds}
        onDelete={() => setShowDeleteModal(true)}
        onCancel={onCancelSelection}
      />

      <View style={styles.searchContainer}>
        <Icon name="search" size={22} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadNotes} />
        }
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={onNotePress}
            onLongPress={onNoteLongPress}
            selected={selectedIds.includes(item.id)}
            onTogglePin={() => togglePin(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NoteEditor')}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Custom Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Delete Notes</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {selectedIds.length}
              </Text>{' '}
              note(s)? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onDelete}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 0,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#ff6b6b',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4d4d',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginRight: 10,
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
