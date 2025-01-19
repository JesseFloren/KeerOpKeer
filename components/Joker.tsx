import { useState } from "react";
import { Pressable, Text } from "react-native";
import Row from "./Row";

export default ({index, checked, checkJkr}: {index: number, checked: boolean, checkJkr: (x: number) => void}) => {
    return (
        <Pressable onPress={() => checkJkr(index)} style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
            <Row style={{width: 23, height: 23, margin: 3, backgroundColor: "white", borderRadius: 100, borderStyle: "solid", borderColor: "black", borderWidth: 2}}>
                <Text style={{color: "black", fontSize: 20, fontFamily: "OpenSans_800ExtraBold"}}>!</Text>
                <Text style={{...{position: "absolute", fontSize: 26, color: "#222222"}, opacity: checked ? 1 : 0}}>X</Text>
            </Row>
        </Pressable>
    );
}