import React from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/Entypo'
import Icon3 from 'react-native-vector-icons/FontAwesome'
import SysModal from '../../sysModal/sys_modal'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from '../AppContext'


const DetailOrder = ({ route, navigation }) => {
   const item = route.params?.newItem
   const { status, setStatus, setSelectedID, isTake, setTake, socket } = React.useContext(AppContext)
   const [showModal, setShowModal] = React.useState(false)
   const [errorMessage, setErrorMessage] = React.useState('')
   const [vehicleID, setVehicle] = React.useState('')
   const [name, setName] = React.useState('')
   const [dob, setDOB] = React.useState('')
   const [phone, setPhone] = React.useState('')
   const [id, setID] = React.useState('')
   const onClickReturn = () => {
      navigation.navigate('Đơn hàng')
   }
   let description = ''
   if (item.size_item) {
      description = 'nhỏ gọn'
   } else {
      description = 'cồng kềnh'
   }

   React.useEffect(() => {
      const getData = async () => {
         setName(await AsyncStorage.getItem('name'))
         setPhone(await AsyncStorage.getItem('phone'))
         setDOB(await AsyncStorage.getItem('dob'))
         setVehicle(await AsyncStorage.getItem('vehicle_num'))
         setID(await AsyncStorage.getItem('id'))
      }
      getData()
   }, [])

   const data = {
      order_id: item.id,
      name: name,
      phone: phone,
      dob: dob,
      vehicle: vehicleID,
   }

   const payload = {
      id_Order: item.id,
      driver_id: id,
      status: 0
   }

   const getOrder = () => {

   }

   const onClickTakeOrder = async () => {
      if (status) {
         setErrorMessage('Bạn đang có đơn hàng chưa hoàn thành !!!')
         setShowModal(true)
      } else {

         await axios.get('https://delivery-server-s54c.onrender.com/order/customer', {
            params: {
               id: item.id
            }
         })
            .then(async res => {
               console.log(res.data.data.rows)
               if (res.data.err == 0) {
                  if (res.data.data.rows[0].driver_id != 0) {
                     setErrorMessage('Đơn hàng đã được tài xế khác nhận vui lòng nhận đơn hàng khác')
                     setShowModal(true)
                  }
                  else {
                     if (socket) {
                        await axios.get('https://delivery-server-s54c.onrender.com/socket', {
                           params: {
                              user_id: item.customer_id,
                              type: 0
                           }
                        })
                           .then(res => {
                              if (res.data.err == 0) {
                                 data.socket_id = res.data.data.socket_id
                                 socket.emit('takeOrder', data)
                              }
                           })
                           .catch(err => {
                              console.log(err)
                           })
                     }
                     await axios.post('https://delivery-server-s54c.onrender.com/order/driver', payload)
                        .then((res) => {
                           console.log(res)
                        })
                        .catch((err) => {
                           console.log(err)
                        })

                     await axios.put('https://delivery-server-s54c.onrender.com/order/customer/update', { id: item.id, driver_id: id })
                        .then((res) => {
                           // console.log(res.data)
                           if (res.data.err == 0) {
                              setStatus(true)
                              setSelectedID(item.id)
                              setTake(true)
                              item.socket_id = data.socket_id
                              navigation.navigate('takeorder', { item })
                           }
                        })
                        .catch((err) => {
                           console.log(err)
                        })
                  }
               } else {
                  console.log('failure')
               }
            })
            .catch(err => {
               console.log(err)
            })


      }
   }
   const onHideModal = () => {
      setShowModal(false)
   }

   const openGoogleMaps = () => {
      const sourceAddress = item.sender_address;
      const destinationAddress = item.receiver_address;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${sourceAddress}&destination=${destinationAddress}`;
      Linking.openURL(url)
   };

   return (
      <SafeAreaView style={{ flex: 1 }}>
         <SysModal onHide={onHideModal} Visible={showModal} Message={errorMessage} />
         <View style={styles.header}>
            <TouchableOpacity onPress={onClickReturn}>
               <Icon name='arrowleft' size={25} color={'darkorange'} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '500', marginLeft: 15 }}>Thông tin đơn hàng</Text>
         </View>
         <View style={{ flex: 11 }}>
            <ScrollView style={{ marginTop: 5 }}>
               <View style={styles.delivery_infor}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Icon1 name='truck-fast-outline' size={25} color={'orange'} />
                     <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>Thông tin vận chuyển</Text>
                  </View>
                  <View style={{ marginTop: 5 }}>
                     {item.infor_shipping ? <Text>Giao hàng hỏa tốc</Text> : <Text>Giao hàng tiết kiệm</Text>}
                     <View style={styles.order_time}>
                        <Icon2 name='dot-single' size={30} color={'#0fc478'} />
                        <Text style={{ color: '#0fc478' }}>Thời gian đặt đơn</Text>
                     </View>
                     <View style={styles.timer}>
                        <Text style={{ marginLeft: 10 }}>{item.createdAt}</Text>
                     </View>
                  </View>
               </View>
               <View style={styles.route}>
                  <View style={styles.t_route}>
                     <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Lộ trình .</Text>
                        <Text>{item.distance} km</Text>
                     </View>
                     <TouchableOpacity style={styles.b_distance} onPress={openGoogleMaps}>
                        <Text style={{ color: 'red' }}>Xem đường đi</Text>
                     </TouchableOpacity>
                  </View>
                  <View style={styles.sender}>
                     <View style={{ marginHorizontal: 10, alignItems: 'flex-end' }}>
                        <Icon2 name='location' size={25} color={'darkorange'} />
                     </View>
                     <View style={{ marginHorizontal: 10, paddingRight: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Địa chỉ lấy hàng</Text>
                        <Text>{item.sender_name} | {item.sender_phone}</Text>
                        <Text>{item.sender_address}</Text>
                        <View style={styles.sender_address}>
                           <Text style={{ fontSize: 12, color: '#8ea199' }}>Địa chỉ chi tiết</Text>
                           <Text>{item.sender_detail_address}</Text>
                        </View>
                     </View>
                  </View>
                  <View style={styles.receiver}>
                     <View style={{ marginHorizontal: 10, alignItems: 'flex-end' }}>
                        <Icon3 name='location-arrow' size={25} color={'#079124'} />
                     </View>
                     <View style={{ marginHorizontal: 10, paddingRight: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Địa chỉ giao hàng</Text>
                        <Text>{item.receiver_name} | {item.receiver_phone}</Text>
                        <Text>{item.receiver_address}</Text>
                        <View style={styles.receiver_address}>
                           <Text style={{ fontSize: 12, color: '#8ea199' }}>Địa chỉ chi tiết</Text>
                           <Text>{item.receiver_detail_address}</Text>
                        </View>
                     </View>
                  </View>
               </View>
               <View style={styles.order}>
                  <Icon name='carryout' size={25} color={'darkorange'} />
                  <View style={{ marginLeft: 10 }}>
                     <Text style={{ fontSize: 16, fontWeight: '500', }}>Chi tiết đơn hàng</Text>
                     <Text style={{ marginTop: 5, color: 'orange', fontSize: 16, fontWeight: 'bold' }}>Mặt hàng {description}</Text>
                     <View style={styles.t_description}>
                        <Text style={{ fontSize: 12, color: '#8ea199' }}>Mô tả mặt hàng</Text>
                        <Text>{item.orderInfor}</Text>
                     </View>
                  </View>
               </View>
               <View style={styles.price}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Thành tiền</Text>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.price}đ</Text>
               </View>
            </ScrollView>
         </View>
         <View style={{ flex: .8, padding: 10, backgroundColor: 'white' }}>
            <TouchableOpacity style={styles.footer} onPress={onClickTakeOrder}>
               <Text style={styles.t_footer}>NHẬN ĐƠN</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   )
}

export default DetailOrder

const styles = StyleSheet.create({
   header: {
      flex: 1,
      backgroundColor: "white",
      alignItems: 'center',
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingBottom: 10
   },
   delivery_infor: {
      backgroundColor: 'white',
      padding: 10,
      borderBottomWidth: .3,
      borderColor: 'silver',
      // marginTop:5
   },
   order_time: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
   },
   timer: {
      borderLeftWidth: 0.3,
      borderColor: 'silver',
      marginLeft: 20
   },
   route: {
      backgroundColor: 'white',
      borderBottomWidth: .3,
      borderColor: 'silver',
      padding: 10
   },
   t_route: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
   },
   b_distance: {
      borderWidth: 0.5,
      padding: 5,
      borderColor: 'red'
   },
   sender: {
      padding: 10,
      borderWidth: .5,
      borderColor: 'darkorange',
      marginTop: 10,
      borderRadius: 5,
      flexDirection: 'row'
   },
   sender_address: {
      borderWidth: 0.2,
      borderRadius: 1,
      padding: 5,
      marginTop: 5
   },
   receiver: {
      borderWidth: .5,
      borderColor: '#079124',
      flexDirection: 'row',
      padding: 10,
      marginTop: 10,
      borderRadius: 5
   },
   receiver_address: {
      borderWidth: 0.2,
      borderRadius: 1,
      padding: 5,
      marginTop: 5
   },
   order: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: 'white',
      padding: 10,
   },
   t_description: {
      borderWidth: .2,
      borderRadius: 2,
      padding: 5,
      width: '100%',
      marginTop: 5
   },
   price: {
      backgroundColor: 'white',
      marginTop: 10,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   footer: {
      backgroundColor: 'darkorange',
      height: '100%',
      justifyContent: 'center'
   },
   t_footer: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
   }
})