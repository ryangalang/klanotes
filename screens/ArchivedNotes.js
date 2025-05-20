import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NoteCard from '../components/NoteCard';
import { fetchNotes, deleteNote, updateNote } from '../utils/api';

export default function ArchivedNotes({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadArchivedNotes = async () => {
    setRefreshing(true);
    try {
      const data = await fetchNotes();
      const archivedNotes = data.filter(note => note.archived === 1);
      setNotes(archivedNotes);
      setSelectedIds([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load archived notes');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadArchivedNotes();
    }, [])
  );

  const toggleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((sid) => sid !== id)
        : [...prevSelected, id]
    );
  };

  const onNotePress = (note) => {
    if (selectedIds.length > 0) {
      toggleSelect(note.id);
    } else {
      navigation.navigate('NoteEditor', { note });
    }
  };

  const onNoteLongPress = (id) => {
    toggleSelect(id);
  };

  const onDelete = () => {
    Alert.alert(
      'Delete Archived Notes',
      `Are you sure you want to delete ${selectedIds.length} archived note(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(selectedIds.map((id) => deleteNote(id)));
              setNotes((prevNotes) =>
                prevNotes.filter((note) => !selectedIds.includes(note.id))
              );
              setSelectedIds([]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notes');
            }
          },
        },
      ]
    );
  };

  const onUnarchive = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateNote(id, { archived: 0 })
        )
      );
      setNotes((prevNotes) =>
        prevNotes.filter((note) => !selectedIds.includes(note.id))
      );
      setSelectedIds([]);
      Alert.alert('Success', 'Selected notes unarchived');
    } catch {
      Alert.alert('Error', 'Failed to unarchive notes');
    }
  };

  const onCancelSelection = () => {
    setSelectedIds([]);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {selectedIds.length > 0 && (
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={onCancelSelection} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onUnarchive} style={styles.button}>
            <Text style={styles.buttonText}>Unarchive ({selectedIds.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search archived notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadArchivedNotes} />
        }
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={onNotePress}
            onLongPress={onNoteLongPress}
            selected={selectedIds.includes(item.id)}
            onTogglePin={() => {}} // optionally disable pin toggle here
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 12 },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#6c757d',
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
