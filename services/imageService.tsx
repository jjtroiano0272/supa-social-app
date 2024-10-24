import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';
import { supabaseUrl } from '@/constants';

export const getUserImageSrc = (imagePath: string) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    // defaultUser
    return require('../assets/images/default-user.png');
  }
};

export const getSupabaseFileUrl = (filePath: string) => {
  if (!filePath) return null;

  return {
    uri: filePath.includes('dicebear')
      ? filePath
      : `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`,
  };
};

export const downloadFile = async (url: string) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    return null;
  }
};

export const getLocalFilePath = (filePath: string) => {
  let fileName = filePath.split('/').pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

// export const getLocalFilePath = () => {};

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage = true
) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    let fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let fileData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: false,
        contentType: isImage ? 'image/*' : 'video/*',
      });

    if (error) {
      console.error(`File upload error => ${error}`);
      return { success: false, msg: 'Could not upload media' };
    }

    console.log(`data: ${JSON.stringify(data, null, 2)}`);

    return { success: true, data: data?.path };
  } catch (error) {
    console.error(`File upload error => ${error}`);
    return { success: false, msg: 'Could not upload media' };
  }
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
};
