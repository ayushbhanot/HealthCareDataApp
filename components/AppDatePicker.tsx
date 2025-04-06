import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppTextInput from './AppTextInput';

const AppDatePicker = ({ dob, setDob }: { dob: string, setDob: (val: string) => void }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    const formatted = date.toISOString().split('T')[0];
    setDob(formatted);
  };

  return (
    <View>
      <Pressable onPress={() => setPickerVisible(true)}>
        <AppTextInput
          placeholder="Select Date of Birth"
          value={dob}
          editable={false}
          pointerEvents="none"
        />
      </Pressable>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        themeVariant="light"
        display="spinner"
        maximumDate={new Date()}
      />
    </View>
  );
};

export default AppDatePicker;
