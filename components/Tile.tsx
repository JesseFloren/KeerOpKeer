import { PropsWithChildren, useState } from "react"
import { View, Text, StyleSheet, ColorValue, Pressable } from "react-native"

type TileType = "standard" | "standard-star" | "column" | "color"

const CheckMark = ({checked}: {checked: boolean}) => {
    return <Text style={[styles.checkMark, {opacity: checked ? 1 : 0}]}>X</Text>
}

export default ({type, color, content = "", onCheck = null, wide = false, center = false}: {type: TileType, color: ColorValue, content?: string, onCheck?: (x: boolean) => void, wide?: boolean, center?: boolean}) => {
    const [checked, setChecked] = useState<boolean>(false);
    const checkable = onCheck != null;
    const onPress = () => {
      if(!checkable) return;
      onCheck(!checked);
      setChecked(!checked);
    }
    return (
        <Pressable onPress={onPress} style={({pressed}) => [styles.tile, {width: wide ? 60 : 30, backgroundColor: color, opacity: pressed && checkable ? 0.5 : 1}]}>
            {type == "standard" ? <View style={styles.tileCircle}/> : null}
            {type == "standard-star" ? <View style={styles.tileStar}/> : null}
            <Text style={{fontFamily: "OpenSans_700Bold", fontSize: 18, color: center ? "red" : "black"}}>{content}</Text> 
            {checkable ? <CheckMark checked={checked}/> : null}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tile: {
      width: 30, 
      height: 30, 
      borderRadius: 5,
      flex: 1,
      justifyContent: 'center',
      alignItems: "center",
      borderStyle: "solid",
      borderWidth: 1.5,
    },
    tileCircle: {
      width: 24, 
      height: 24,
      borderRadius: 50,
      backgroundColor: "#ffffff77"
    },
    tileStar: {
      width: 18,
      height: 18,
      transform: "rotate(45deg)",
      backgroundColor: "#ffffff77",
      borderColor: "white",
      borderWidth: 2,
      borderStyle: "solid"
    },
    checkMark: {
        position: "absolute", 
        fontSize: 26, 
        color: "#222222"
    }
  });