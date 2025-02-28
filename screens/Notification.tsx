import { useAuth } from '@/context/AuthContext'
import { fetchNotifications } from '@/service/postService'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {Text,View,Pressable,StyleSheet} from 'react-native'
import NotificationItem from '../components/NotificationItem'
import BackButton from '@/assets/icons/BackButton'
import { wp, hp } from "../helpers/common";
import { useNavigation } from '@react-navigation/native'

function Notification({navigation}) {
  const [notifications,setNotifications] = useState([])
  const {user} = useAuth()
  const router = useRouter()

  useEffect(()=>{
    getNotifications()
  },[])

  const getNotifications = async() =>{
    let res = await fetchNotifications(user.id)
    if(res.success) setNotifications(res.data)
    console.log(res);
    
  }

  

  return (
   <>
   <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <BackButton size={wp(6)} color="white" />
              </Pressable>
              <Text style={styles.title}>Notifications</Text>
            </View>
   <View>
    <View style={{marginTop:10}} >
      {
        notifications.map(item=>{
          return (
            <NotificationItem
            item={item}
            key={item.id}
            router={router}
            />
          )
        })
      }
      {
        notifications.length==0 && (
          <Text>No notifications yet</Text>
        )
      }
      </View>
   </View>
   </>
  )
}

const styles = StyleSheet.create({
  backButton: {
      backgroundColor: "#ed0581",
      borderRadius: wp(3),
      padding: wp(2),
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
      marginTop: hp(2),
    },
    title: {
      marginTop: hp(2),
      fontSize: hp(2.5),
      fontWeight: "bold",
      marginHorizontal: wp(22),

    },
})

export default Notification
