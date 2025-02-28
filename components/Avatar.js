import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import {wp,hp} from '../helpers/common'
import { Image } from 'expo-image'
import {getUserImageSrc} from '../service/imageService'

const Avatar = ({
    uri,
    size=hp(4.5),
    style={}
}) => {
  return (
    <Image
    source={getUserImageSrc(uri)}
    transition={100}
    style={[StyleSheet.avatar,{height:size,width:size,borderRadius:'rounded'},style]}
    />
  )
}

const styles = StyleSheet.create({
    avatar :{
        borderCurve : 'continuous',
        borderColor : 'black',
        borderWidth : 1
    }
})

export default Avatar