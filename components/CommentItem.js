import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Avatar from './Avatar';
import moment from 'moment';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import { wp, hp } from "../helpers/common";

const CommentItem = ({ item, canDelete = false, onDelete = () => { } }) => {
  const createdAt = moment(item?.created_at).format('MMM D');

  const handleDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to do this ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('modal cancelled'),
        style: 'cancel'
      },
      {
        text: 'Delete',
        onPress: () => onDelete(item),
        style: 'destructive'
      }
    ])
  }

  return (
    <View style={{
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      alignItems:'center'
    }}>
      <Avatar
        uri={item?.user?.image}
        style={{ marginRight: 10,height:hp(7),width:hp(7) }}
      />
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
          }}>
            {item?.user?.name}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            {createdAt}
          </Text>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <DeleteIcon size={20} color="#f00" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginTop: 5,
        }}>
          {item?.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;
