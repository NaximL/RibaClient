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
import { Gstyle } from '@styles/gstyles';

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
  const { isDark,GlobalColor } = Gstyle();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? '#1c1c1e' : '#fff' },
          ]}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isSelected = selectedValue === item.value;
              const isLast = index === options.length - 1;
              return (
                <TouchableOpacity
                  style={[

                    styles.option,
                    { borderBottomColor: isDark ? '#333' : '#f2f2f7' },
                    index === 0 && { borderTopLeftRadius: 18, borderTopRightRadius: 18 },
                    isLast && { borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
                    isSelected && {
                      backgroundColor: isDark ? '#2a2a2e' : '#f2f8ff',
                    },
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isDark ? '#f5f5f5' : '#222' },
                      isSelected && { color: GlobalColor, fontWeight: '600' },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={GlobalColor}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity >
    </Modal >
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
    maxHeight: 500,
    borderRadius: 18,
    width: 300,
    // paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});