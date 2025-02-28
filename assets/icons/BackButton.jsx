import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';

const BackButton = (props) => {
  return (
    <View>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={props.width || 24}
        height={props.height || 24}
        fill="none"
      >
        <Path
          d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
          stroke={props.color || "#000"}  // Use prop for dynamic color
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  )
}

export default BackButton