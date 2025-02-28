import * as FileSystem from 'expo-file-system';
import { supabase } from '@/lib/supabase';
import { YOUR_REACT_NATIVE_SUPABASE_URL } from '../constants/index';

export const supabaseUrl = YOUR_REACT_NATIVE_SUPABASE_URL;

export const getUserImageSrc = (imagePath) => {
    if (imagePath) {
        return { uri: imagePath };
    } else {
        return require('../assets/images/welcome.png');
    }
};

export const getSupabaseFileUrl = (filePath) => {
    if (filePath) {
        return { uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}` };
    }
    return null;
};

// Helper function to generate file paths
const getFilePath = (folderName, isImage) => {
    const timestamp = new Date().getTime();
    const fileExtension = isImage ? 'jpg' : 'mp4'; // Adjust extensions as needed
    return `${folderName}/${timestamp}.${fileExtension}`;
};

// Helper function to convert base64 to Uint8Array
const base64ToArrayBuffer = (base64) => {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        const imageData = base64ToArrayBuffer(fileBase64); // Convert to ArrayBuffer

        let { data, error } = await supabase.storage.from('uploads').upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: isImage ? 'image/*' : 'video/*'
        });

        if (error) {
            console.log('file upload error: ', error);
            return { success: false, msg: 'Could not upload media' }
        }

        return { success: true, data: data.path }
    } catch (error) {
        console.log(error);
        return { success: false, msg: 'Could not upload media' }
    }
}

export const downloadFile = async(url) =>{
    try{
        const {uri} = await FileSystem.downloadAsync(url,getLocalFilePath(url))
        return uri
    }catch(error){
        return null
    }
}

export const getLocalFilePath = (filePath) =>{
    let fileName = filePath.split('/').pop();
    return `${FileSystem.documentDirectory}${fileName}`
}