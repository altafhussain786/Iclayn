import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LogoText = () => {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text1}>Iclayn</Text>
              
            </View>
        </>
    )
}

export default LogoText

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 20,
        gap: 5,
        alignItems: 'center'
    },
    text1: {
        fontSize: 30,
        fontWeight: '400',
        color: '#2363D1'
    },
    text2: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2363D1'
    }
})