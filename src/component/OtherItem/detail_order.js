import React from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/Entypo'
import Icon3 from 'react-native-vector-icons/FontAwesome'


const Detail_order = ({ route }) => {
   const navigation = useNavigation()
   const item = route.params?.item
   const onClickReturn = () => {
      navigation.goBack()
   }
   let description = ''
   if (item.size_item) {
      description = 'nhỏ gọn'
   } else {
      description = 'cồng kềnh'
   }

   return (
      <SafeAreaView style={{ flex: 1 }}>
         <View style={styles.header}>
            <TouchableOpacity onPress={onClickReturn} style={{ flex: 1 }}>
               <Icon name='arrowleft' size={25} color={'darkorange'} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '500', marginLeft: 15, flex: 3, textAlign: 'center' }}>Thông tin đơn hàng</Text>

            <View style={{ flex: 1 }} />
         </View>
         <View style={{ flex: 11 }}>
            <ScrollView style={{ marginTop: 5 }}>
               <View style={styles.delivery_infor}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Icon1 name='truck-fast-outline' size={25} color={'orange'} />
                     <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>Thông tin vận chuyển</Text>
                  </View>
                  <View style={{ marginTop: 5, marginHorizontal: 20 }}>
                     {item.infor_shipping ? <Text>Giao hàng hỏa tốc</Text> : <Text>Giao hàng tiết kiệm</Text>}
                  </View>
               </View>
               <View style={styles.route}>
                  {/* <View style={styles.t_route}> */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 }}>
                     <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Lộ trình .</Text>
                     <Text style={styles.t_distance}>{item.distance} km</Text>
                  </View>

                  {/* </View> */}
                  <View style={styles.sender}>
                     <View style={{ marginHorizontal: 10, alignItems: 'flex-end' }}>
                        <Icon2 name='location' size={25} color={'darkorange'} />
                     </View>
                     <View style={{ marginHorizontal: 10, paddingRight: 30 }}>
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
            </ScrollView>
         </View>
         <View style={styles.price}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Thành tiền</Text>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.price}đ</Text>
         </View>

      </SafeAreaView>
   )
}

export default Detail_order

const styles = StyleSheet.create({
   header: {
      flex: 1.3,
      alignItems: 'flex-end',
      flexDirection: 'row',
      backgroundColor: 'white',
      paddingBottom: 10,
      paddingHorizontal: 10,
      borderBottomWidth:0.3,
      borderColor:'darkorange'
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
   t_distance: {
      color: 'blue',
      fontWeight: '500',
      fontSize: 15
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
      borderColor: 'darkorange',
      borderWidth: .5,
      flexDirection: 'row',
      // padding:10,
      paddingRight: 10,
      paddingVertical:10,
      marginTop: 10,
      borderRadius: 5
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
      justifyContent: 'space-between',
      flex: 0.7,
      alignItems: 'center'
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