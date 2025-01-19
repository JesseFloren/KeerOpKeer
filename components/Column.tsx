import { PropsWithChildren } from "react"
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native"

const styles = StyleSheet.create({
    column: {
        display: "flex",
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: "column"
      }
})

export default ({children, style}: PropsWithChildren<{style?: StyleProp<ViewStyle>}>) => {
    return (
        <View style={style ? [styles.column, style] : [styles.column]}>
            {children}
        </View>
    )
}