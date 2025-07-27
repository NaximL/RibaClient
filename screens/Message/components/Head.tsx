import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  LayoutAnimation,
  UIManager,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BlurView } from 'expo-blur';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const options = ["Написати повідомлення",'Прочитати всі'];

const Head = ({nav,modal}:any) => {
  
  const [open, setOpen] = useState(false);
  const animations = useRef(options.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (open) {
      Animated.stagger(100,
        animations.map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          })
        )
      ).start();
    } else {
      animations.forEach(anim => anim.setValue(0));
    }
  }, [open]);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View ></View>

      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.circle} onPress={toggleDropdown}>
          <Ionicons name="ellipsis-vertical" size={20} color="#007aff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{modal(true)}} style={styles.circle}>
          <Ionicons name="search" size={20} color="#007aff" />
        </TouchableOpacity>

        {open && (
          <BlurView intensity={15} tint="light" style={styles.dropdown}>
            <View style={styles.dropdownContent}>
              {options.map((option, index) => {
                const opacity = animations[index];
                const translateY = opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                });

                return (
                  <Animated.View
                    key={index}
                    style={[styles.item, { opacity, transform: [{ translateY }] }]}
                  >
                    <TouchableOpacity>
                      <Animated.Text style={styles.text}>{option}</Animated.Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </BlurView>
        )}
      </View>
    </View>
  );
};

export default Head;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
    marginLeft: 8,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 999,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dropdownContent: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
});