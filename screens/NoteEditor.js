import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createNote, updateNote } from '../utils/api';

export default function NoteEditor({ route, navigation }) {
  const editingNote = route.params?.note || null;

  const [title, setTitle] = useState(editingNote ? editingNote.title : '');
  const [content, setContent] = useState(editingNote ? editingNote.content : '');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    setSaving(true);

    const noteData = {
      title,
      content,
      pinned: editingNote ? editingNote.pinned : 0,
      archived: 0,
    };

    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
      } else {
        await createNote(noteData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Title"
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
          editable={!saving}
          returnKeyType="next"
        />
        <TextInput
          placeholder="Write your notes here..."
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#999"
          editable={!saving}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 20,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    borderBottomWidth: 3,
    borderBottomColor: '#ff6b6b',
    paddingVertical: 8,
    marginBottom: 24,
    color: '#222',
  },
  contentInput: {
    flex: 1,
    fontSize: 18,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  saveButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // android shadow
    shadowColor: '#ff6b6b',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  saveButtonDisabled: {
    backgroundColor: '#ffa5a5',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
