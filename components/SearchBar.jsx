import { icons } from '@/constants/icons';
import React from 'react';
import { Image, TextInput, View } from 'react-native';

const SearchBar = ({ onPress, placeholder }) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image source={icons.search} className="size-5" />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        placeholderTextColor="#a8b5db"
        value=""
        onChangeText={() => {}}
        className="flex-1 ml-2  text-white"
      />
    </View>
  );
};

export default SearchBar;
