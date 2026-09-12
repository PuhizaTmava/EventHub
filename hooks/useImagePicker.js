import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function useImagePicker(aspect = [4, 3]) {
  const [imageBase64, setImageBase64] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Leja për fotot u refuzua. Aktivizoje nga Settings.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect,
      quality: 0.5,
    });

    if (result.canceled) return;

    const original = result.assets[0];

    const manipulated = await ImageManipulator.manipulateAsync(
      original.uri,
      [{ resize: { width: 500 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    const base64String = `data:image/jpeg;base64,${manipulated.base64}`;
    setImageBase64(base64String);
    return base64String;
  };

  const clearImage = () => setImageBase64(null);

  return { imageBase64, setImageBase64, pickImage, clearImage };
}
