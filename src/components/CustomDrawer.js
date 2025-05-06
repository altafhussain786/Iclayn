import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import LogoText from './LogoText';
import { IconUri } from '../constants';

const CustomDrawer = (props) => {
    const navigation = useNavigation();

    const DrawerButton = ({ label, icon, onPress, isActive }) => (
        <TouchableOpacity
            style={[styles.drawerItem, isActive && styles.activeItem]}
            onPress={onPress}
        >
            {icon}
            {/* <Text style={styles.icon}>{icon}</Text> */}
            <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
        </TouchableOpacity>
    );

    const currentRoute = props.state.routeNames[props.state.index];

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            {/* Logo/Header */}
            <View style={styles.logoContainer}>
                {/* <Text style={styles.logoText}>
          <Text style={{ color: '#555' }}>Inventory</Text>
          <Text style={{ color: '#007bff', fontWeight: 'bold' }}>GO</Text>
        </Text> */}
                <LogoText />
            </View>

            {/* Drawer Items */}
            <View style={styles.itemsContainer}>
                <DrawerButton
                    label="Home"
                    icon={<Image style={styles.icon} source={IconUri?.home} />}
                    isActive={currentRoute === 'Home'}
                    onPress={() => navigation.navigate('Home')}
                />
                <DrawerButton
                    label="Change password"
                    icon={<Image style={styles.icon} source={IconUri?.changePassword} />}

                    isActive={currentRoute === 'ChangePassword'}
                    onPress={() => navigation.navigate('ChangePassword')}
                />
                <DrawerButton
                    label="Logout"
                    icon={<Image style={styles.icon} source={IconUri?.logout} />}

                    onPress={() => {
                        // Handle logout logic here
                        console.log('Logged out');
                    }}
                />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.powered}>Powered by: SDC</Text>
                <Text style={styles.version}>V 1.0</Text>
            </View>
        </DrawerContentScrollView>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 40
    },
    logoContainer: {
        alignItems: 'center',
        // marginBottom: 30
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    itemsContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 5
    },
    activeItem: {
        backgroundColor: '#e0f0ff'
    },
    icon: {
        // fontSize: 16,
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginRight: 10
    },
    label: {
        fontSize: 16,
        color: '#333'
    },
    activeLabel: {
        fontWeight: 'bold',
        color: '#007bff'
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 20,
        marginTop: 'auto'
    },
    powered: {
        fontSize: 12,
        color: '#aaa'
    },
    version: {
        fontSize: 12,
        color: '#aaa'
    }
});
