import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const BottomTabBar = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem}>
        <View style={[styles.tabIcon, styles.activeIcon]} />
        <Text style={[styles.tabText, styles.activeText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <View style={styles.tabIcon} />
        <Text style={styles.tabText}>Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <View style={styles.tabIcon} />
        <Text style={styles.tabText}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    backgroundColor: '#666',
    borderRadius: 12,
  },
  activeIcon: {
    backgroundColor: '#FF4444',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeText: {
    color: '#FF4444',
  },
});

export default BottomTabBar;
