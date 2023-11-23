import React, { useState } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import Header from './header';
import Icon1 from 'react-native-vector-icons/Ionicons'

const data = [
    { id: 1, value: 'item1', iconName: 'location-sharp', color: 'blue' },
    { id: 2, value: 'item2', iconName: 'location-sharp', color: 'blue' },
    { id: 3, value: 'item3', iconName: 'location-sharp', color: 'blue' },
    { id: 4, value: 'item4', iconName: 'location-sharp', color: 'blue' },
    { id: 5, value: 'item5', iconName: 'location-sharp', color: 'blue' },
]

const NotificationScreen = () => {
    const [listItems, setListItems] = useState(data)
    const [notifiText, setNotifiText] = useState('Thông báo')
    const [dateTime, setDateTime] = useState('26/05/2023, 00:35')
    const ItemView = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => getItem(item)}
                style={styles.item}>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles._item_icon}>
                        < Icon1 name='notifications' color={'orange'} size={24} />
                    </View>
                    <View>
                        <Text style={{
                            fontWeight: 'bold'
                        }}>{notifiText} </Text>
                        <Text>{dateTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    const getItem = (item) => {
        alert('ID: ' + item.id + ' value:  ' + item.value)
    }
    const ItemSeparatorView = () => {
        return (
            <View style={{
                height: 0.5,
                width: '100%',
                backgroundColor: '#c8c8c8',
                marginLeft: 60
            }} />
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <View style={{ flex: 8 }}>
                <FlatList
                    data={listItems}
                    renderItem={ItemView}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={ItemSeparatorView}
                />
            </View>
        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    item: {
        height: 90,
        justifyContent: 'center',
        backgroundColor: 'base',
    },
    _item_icon:{
        borderRadius: 100,
        backgroundColor: '#FEEBD0',
        paddingVertical: 5,
        paddingHorizontal: 7,
        marginHorizontal: 15
    },
})