import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'

const Input = (props) => {
  return (
    <View style={[styles.container,props.containerStyles && props.containerStyles]} >
      {props.icon && props.icon}
      <TextInput
        style={{flex:1}}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({

    container : {
        flexDirection : 'row',
        height : hasRestParameter(7.2),
        alignItems : 'center',
        justifyContent : 'center',
        borderWidth : 0.4,
        borderCurve : 'continuous',
        gap : 12
    }
})

export default Input