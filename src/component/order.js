import React, { useState, useEffect, useContext } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, StyleSheet, Image, FlatList } from 'react-native'
import AppContext from './AppContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from './header'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'

const Order = ({ navigation }) => {
   const { lightDot, setStatus, screen, SelectedID, socket, isTake, display, setDisplay } = useContext(AppContext)
   const [data, setData] = useState([])
   const [order, setOrder] = useState({});
   const [id, setID] = useState('');

   const fetchData = async () => {
      try {
         const response = await axios.get('https://delivery-server-s54c.onrender.com/order/customer', { params: payload })
         if (response.data.err == 0) {
            setData(response.data.data.rows);
         }
      } catch (error) {
         console.error(error);
      }
   };

   const payload = {
      status: 1,
      driver_id: 0
   }

   useEffect(() => {
      if (lightDot && socket) {
         // socket.emit('joinRoom', {id: 1})
         socket.on('connect', () => {
            // socket.emit('joinRoom', {id: 1});
            // console.log(0)
            fetchData()
         });
         socket.on('newOrder', function (jsonString) {
            fetchData()
         })
         socket.on('cancle-order', () => {
            fetchData()
         })
         socket.on('cancle-order-driver', () => {
            fetchData()
         })
         socket.on('other-user-taken',()=>{
            fetchData()
         })
      }
      fetchData()
   }, [lightDot, socket])

   useEffect(() => {
      const getData = async () => {
         setID(await AsyncStorage.getItem('id'))
      }
      getData()
   }, [])
   // let order = {}
   useEffect(() => {
      const getData = async () => {
         await axios.get('https://delivery-server-s54c.onrender.com/order/customer', {
            params: {
               status: 1,
               driver_id: id
            }
         })
            .then(res => {
               fetchData()
               console.log(res.data.data.rows)
               if (res.data.err == 0) {
                  setOrder(res.data.data.rows[0])
                  setDisplay(true)
               } else {
                  console.log('failure')
               }
            })
            .catch(err => {
               console.log(err)
            })
      }
      if (isTake) {
         getData()
      }
   }, [isTake])


   const RenderItem = ({ item }) => {
      return (
         <TouchableOpacity style={{
            padding: 10,
            backgroundColor: 'white'
         }} onPress={() => getItem(item)}>

            <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
               <Icon name='my-location' size={20} color={'green'} />
               <Text style={{ marginLeft: 10 }}>{item.sender_address}</Text>
            </View>
            <View style={{ borderLeftWidth: 1, marginHorizontal: 30, height: 20 }} />

            <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
               <Icon name='location-on' size={20} color={'darkorange'} />
               <Text style={{ marginLeft: 10 }}>{item.receiver_address}</Text>
            </View>

            <View style={{ flexDirection: 'row', borderTopWidth: .5, marginTop: 10, paddingTop: 10 }}>
               <View style={{ flex: 1, marginLeft: 20 }}>
                  {item.infor_shipping ?
                     <Image source={require('./../contains/Image/rocketicon.jpg')} style={styles.image} /> :
                     <Image source={require('./../contains/Image/flash.png')} style={styles.image} />}
               </View>
               <View style={{ flex: 5 }}>
                  <Text style={styles.t_shipping}>{item.infor_shipping ? 'Hỏa Tốc' : 'Tiết kiệm'}</Text>
                  <Text style={styles.t_money}><Text style={styles.t_initmoney}>đ</Text> {item.price} -<Text style={{ color: 'blue' }}>- {item.distance} km</Text></Text>
               </View>
            </View>
         </TouchableOpacity>
      )
   }

   const Separator = () => {
      return (
         <View style={{
            height: 1,
            width: '100%',
            backgroundColor: '#c8c8c8',
            marginBottom: 10
         }} />
      )
   }

   const getItem = (item) => {
      navigation.navigate('detaiOrder', { newItem: item })
   }

   const selectOrder = (item) => {
      if (screen == 1) {
         navigation.navigate('takeorder', { item })
      } else {
         navigation.navigate('delivery', { item })
      }
   }

   const setScreen = () => {
      if (lightDot) {
         return (
            <React.Fragment>
               {
                  display ?
                     <TouchableOpacity style={{
                        padding: 10,
                        borderBottomWidth: .5,
                        borderColor: 'darkorange',
                        backgroundColor: '#ecfbd6',
                        marginBottom: 10
                     }} onPress={() => selectOrder(order)}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                           <Icon name='my-location' size={20} color={'green'} />
                           <Text style={{ marginLeft: 10 }}>{order.sender_address}</Text>
                        </View>

                        <View style={{ borderLeftWidth: 1, marginHorizontal: 30, height: 20 }}></View>

                        <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                           <Icon name='location-on' size={20} color={'darkorange'} />
                           <Text style={{ marginLeft: 10 }}>{order.receiver_address}</Text>
                        </View>

                        <View style={{backgroundColor: 'white', marginTop:5}}>
                           <View style={{ flexDirection: 'row', marginTop: 5, paddingTop: 5 }}>
                              <View style={{ flex: 1, marginLeft: 20 }}>
                                 {order.infor_shipping ?
                                    <Image source={require('./../contains/Image/rocketicon.jpg')} style={styles.image} /> :
                                    <Image source={require('./../contains/Image/flash.png')} style={styles.image} />}
                              </View>
                              <View style={{ flex: 5, }}>
                                 <Text style={styles.t_shipping}>{order.infor_shipping ? 'Hỏa Tốc' : 'Tiết kiệm'}</Text>
                                 <Text style={styles.t_money}><Text style={styles.t_initmoney}>đ</Text> {order.price} -<Text style={{ color: 'blue' }}>- {order.distance} km</Text></Text>
                              </View>
                           </View>


                           <View style={{ flexDirection: 'row', marginVertical: 5, marginHorizontal: 30, alignItems: 'flex-end' }}>
                              <Icon1 name='truck-fast-outline' size={20} color={'#26ab9a'} />
                              <Text style={{ color: '#26ab9a', marginHorizontal: 10 }}>{screen == 1 ? 'Đang lấy hàng' : 'Đang giao hàng'}</Text>
                           </View>
                        </View>

                     </TouchableOpacity>
                     : null
               }
               {data.length == 0 ?
                  <View style={{ marginTop: 40 }}>
                     <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Đang tìm kiếm đơn hàng !!</Text>
                  </View>
                  :
                  <FlatList
                     data={data}
                     renderItem={RenderItem}
                     ItemSeparatorComponent={Separator}
                     keyExtractor={item => item.id}
                  />
               }

            </React.Fragment>
         )
      } else {
         return (
            <View style={styles._not_list}>
               <Image source={require('../contains/Image/101.jpg')} style={styles.Image} />
               <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Không có đơn hàng</Text>
               <Text>Hãy chuyển sang chế độ Trực tuyến để nhận đơn</Text>
            </View>
         )
      }
   }
   return (
      <SafeAreaView style={{ flex: 1 }}>
         <Header />
         <View style={{
            flex: 1,
            marginVertical: 5,
            backgroundColor: lightDot ? '#f7f5f5' : '#f7f8fa'
         }}>
            {setScreen()}
         </View>
      </SafeAreaView>
   )
}

export default Order

const styles = StyleSheet.create({
   Image: {
      width: '70%',
      height: 250,
      marginBottom: 30
   },
   image: {
      height: 50,
      width: 50
   },
   _not_list: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 150,
      paddingBottom: 250
   },
   item: {
      height: 90,
      justifyContent: 'center',
      backgroundColor: 'white'
   },
   _item_icon: {
      borderRadius: 100,
      paddingVertical: 5,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center'
   },
   t_shipping: {
      fontSize: 16,
      fontWeight: 'bold'
   },
   t_money: {
      color: 'red'
   },
   t_initmoney: {
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      fontSize: 16
   },
})