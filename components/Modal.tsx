import React from 'react';
import { Modal, View, StyleSheet, Text, Pressable,Platform } from 'react-native';
import { ScrollView } from 'react-native';

type FullScreenModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function FullScreenModal({ visible, onClose, children }: FullScreenModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {children}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Закрити</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    maxHeight: '90%',
    minHeight: 0,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 20,
    gap: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007aff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#007aff',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});