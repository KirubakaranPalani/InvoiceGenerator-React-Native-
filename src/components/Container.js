import React from 'react'
import { View } from 'react-native'
import { useTheme } from '../context/ThemeContext'

const Container = ({ children }) => {
    const { isDarkMode } = useTheme()
    const containerStyle = [
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }
    ]
    
    return (
        <View style={containerStyle}>
            {children}
        </View>
    )
}

export default Container

const styles = {
    container: { 
        display: 'flex',
        flexdirection: 'row',
        height: 1000,
        justifycontent:'center'
    }
}