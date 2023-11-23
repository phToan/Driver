import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native'

const CompletedOrder = () => {
   const [data, setData] = useState([])
   const navigation = useNavigation()
   const isFocused = useIsFocused();

   const getOrder = async () => {
      const require = {
         driver_id: await AsyncStorage.getItem('id'),
         status: '1'
      }
      await axios.get('https://delivery-server-s54c.onrender.com/order/driver', { params: require })
         .then((res) => {
            // console.log(res.data.data.rows)
            setData(res.data.data.rows)
         })
         .catch((err) => {
            console.log(err)
         })
   }

   useEffect(() => {
      if (isFocused) {
         getOrder()
      }
   }, [isFocused])

   useEffect(() => {
      getOrder()
   }, [])

   const ItemView = ({ item }) => {
      const isExpress = item.orderData.infor_shipping
      return (
         <TouchableOpacity style={{
            padding: 10,
         }} onPress={() => getItem(item)}>
            <View style={{ flexDirection: 'row' }}>
               <View style={styles.icon}>
                  {isExpress ?
                     <Image source={require('../../../contains/Image/rocketicon.jpg')} style={styles.image} /> :
                     <Image source={require('../../../contains/Image/flash.png')} style={styles.image} />}
               </View>
               <View style={styles.title}>
                  <Text style={styles.t_shipping}>{item.orderData.infor_shipping ? 'Hỏa Tốc' : 'Tiết kiệm'}</Text>
                  <Text style={styles.t_money}><Text style={styles.t_initmoney}>đ</Text> {item.orderData.price} -<Text style={{ color: 'blue' }}>- {item.orderData.distance} km</Text></Text>
               </View>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
               <Icon name='location-on' size={20} />
               <Text style={styles.t_locate}>{item.orderData.sender_address}</Text>
            </View>
         </TouchableOpacity>
      )
   }
   const getItem = (item) => {
      const data = item
      navigation.navigate('details', { data })
   }
   const ItemSeparatorView = () => {
      return (
         <View style={{
            height: 0.5,
            width: '100%',
            backgroundColor: '#c8c8c8',
         }} />
      )
   }
   return (
      <SafeAreaView style={{ backgroundColor: 'white', marginTop: 5 }}>
         {data.length === 0 ?
            <Text>Không có đơn hàng ở trạng thái này !!</Text>
            : null}
         <FlatList
            data={data}
            renderItem={ItemView}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={ItemSeparatorView}
         />

      </SafeAreaView>
   )
}

export default CompletedOrder

const styles = StyleSheet.create({
   t_shipping: {
      fontSize: 16,
      fontWeight: 'bold'
   },
   image: {
      height: 50,
      width: 50
   },
   icon: {
      flex: 1
   },
   title: {
      flex: 5
   },
   t_money: {
      color: 'red'
   },
   t_initmoney: {
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      fontSize: 16
   },
   t_locate: {
      marginLeft: 10,

   }
})

