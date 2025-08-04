import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Option = {
  label: string;
  value: string;
};

type SelectModalProps = {
  visible: boolean;
  options: Option[];
  selectedValue: string;
  onSelect: (item: Option) => void;
  onClose: () => void;
};

const SelectModal: React.FC<SelectModalProps> = ({
  visible,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => {
              const isSelected = selectedValue === item.value;
              return (
                <TouchableOpacity
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => onSelect(item)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#007aff" style={{ marginLeft: 8 }} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height:500,
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 300,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  optionSelected: {
    backgroundColor: '#f2f8ff',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  optionTextSelected: {
    color: '#007aff',
    fontWeight: '600',
  },
});