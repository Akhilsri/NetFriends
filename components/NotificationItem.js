import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import Avatar from './Avatar'
import { wp, hp } from "../helpers/common";
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const NotificationItem = ({
    item,router
}) => {

    const navigation = useNavigation()

    const handleClick = () => {
        try {
            console.log("Type of item:", typeof item, "Value:", item); 
    
            let parsedItem = item; // Default to the item itself
    
            if (typeof item === "string") {
                parsedItem = JSON.parse(item); // Parse only if it's a string
            }
    
            // Extract data if it's nested
            if (typeof parsedItem.data === "string") {
                parsedItem.data = JSON.parse(parsedItem.data);
            }
    
            // Ensure postId and commentId are correctly extracted
            const postId = parsedItem.data.postId?.id; // Access id inside postId object
            const commentId = parsedItem.data.commentId;
    
            if (!postId || !commentId) {
                console.error("Error: Missing postId or commentId", parsedItem);
                return;
            }

            // router.push({
            //     pathname: "PostDetails",
            //     params:{ postId},
            // });

            navigation.navigate('PostDetails',{postId,commentId})
    
        } catch (error) {
            console.error("Error parsing item:", error);
        }
    };
    

    const createdAt = moment(item?.created_at).format('MMM D')

  return (
    <TouchableOpacity onPress={handleClick} >
      <Avatar
        uri={item?.sender?.image}
        size={hp(5)}
      />
      <View>
        <View>
            <Text>{item?.sender?.name}</Text>
        </View>
        <View>
            <Text>{item?.title}</Text>
        </View>
        <View>
            <Text>{createdAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default NotificationItem