import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { RichToolbar, actions, RichEditor } from "react-native-pell-rich-editor";
import { wp } from "../helpers/common";

const RichTextEditor = ({ editorRef, onChange }) => {
  return (
    <View style={{}}> 
      <RichToolbar
        actions={[
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertVideo,
          actions.checkboxList,
          actions.undo,
          actions.redo,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: (tintColor) => <Text style={{ color: "grey" }}>H1</Text>,
          [actions.heading4]: (tintColor) => <Text style={{ color: "grey" }}>H4</Text>,
        }}
        style={styles.richBar}
        flatContainerStyle={styles.listStyle}
        editor={editorRef}
        disabled={false}
        selectIconTint={"green"}
      />

      <View style={styles.editorContainer}> 
        <RichEditor
          ref={editorRef}
          containerStyle={styles.rich}
          editorStyle={styles.contentStyle}
          placeholder="What's on your mind?"
          onChange={onChange}
          useContainer={true} // ✅ Enables scrolling inside editor
          scrollEnabled={true} // ✅ Ensure scrolling is enabled
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  richBar: {
    margin: wp(1),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    borderWidth: 1,
    borderColor: "black",
    display:'flex'
  },
  rich: {
    minHeight: 240,
  
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomWidth: 2,
    borderBottomLeftRadius: wp(2),
    borderBottomRightRadius: wp(2),
    borderColor: "black",
    padding: 3,
    margin: 4,
  },
  contentStyle: {
    minHeight: 400, // ✅ Ensures enough space for scrolling
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default RichTextEditor;
