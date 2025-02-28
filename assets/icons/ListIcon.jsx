import React from "react";
import Svg, { Path } from "react-native-svg";

const ListIcon = ({ size = 40, color = "#000" }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path d="M8 7H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 7H4.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 12H8.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 17H8.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 17H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default ListIcon;
