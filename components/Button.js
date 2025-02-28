import { View, Text, Pressable,StyleSheet } from 'react-native'
import React from 'react'

const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading = false,
    hasShadow=true
}) => {
    const shadowStyle = {

    }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle,hasShadow && shadowStyle]} >
      <Text style={[styles.text,textStyle]} >{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    button :{

    },
    text : {

    }
})

export default Button