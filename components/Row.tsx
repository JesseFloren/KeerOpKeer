import { PropsWithChildren } from "react"
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native"

const styles = StyleSheet.create({
    row: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
      }
})

export default ({children, style}: PropsWithChildren<{style?: StyleProp<ViewStyle>}>) => {
    return (
        <View style={style ? [styles.row, style] : [styles.row]}>
            {children}
        </View>
    )
}