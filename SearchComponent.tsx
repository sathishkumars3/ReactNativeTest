import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchProps {
  onRenderPress: () => void;
  handleOnChangetext: (input: string) => void;
}

export const SearchComponent: React.FC<SearchProps> = ({
  onRenderPress,
  handleOnChangetext,
}) => {
  return (
    <View>
      <TextInput
        placeholder="Search a text"
        style={styles.inputSearch}
        onChangeText={handleOnChangetext}
      />
      <TouchableOpacity onPress={onRenderPress}>
        <Text style={styles.button}>Re-render</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '40%',
    marginLeft: 5,
    height: 40,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  inputSearch: {
    borderColor: 'gray',
    margin: 5,
    borderWidth: 1,
    paddingLeft: 5,
    fontSize: 14,
  },
});
