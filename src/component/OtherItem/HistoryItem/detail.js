import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity , Linking} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign'
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'
import Icon3 from 'react-native-vector-icons/FontAwesome5'
import Icon4 from 'react-native-vector-icons/Octicons'
import { useNavigation } from "@react-navigation/native";
import moment from "moment/moment";

const Detail = ({ route }) => {
   const navigation = useNavigation()
   const onClickExit = () => {
      navigation.goBack()
   }
   const onClickPhone = async() => {
      const isAvailable = await Linking.canOpenURL(`tel:${route?.params.data.orderData.sender_phone}`);

      if (isAvailable) {
         // Mở ứng dụng gọi điện thoại
         Linking.openURL(`tel:${route?.params.data.orderData.sender_phone}`);
      } else {
         console.log('Ứng dụng gọi điện thoại không khả dụng trên thiết bị.');
      }
   }
   const status = () => {
      if (route?.params.data.confirmAt == null) {
         return (
            <View>
               <Text style={styles.t_status}>Đã hủy đơn hàng</Text>
               <Text style={{ color: 'white', marginTop: 5 }}>{renderTime(route?.params.data.deleteAt)}</Text>
            </View>
         )
      } else {
         return (
            <View>
               <Text style={styles.t_status}>Đơn hàng đã hoàn thành</Text>
               <Text style={{ color: 'white', marginTop: 5 }}>Cảm ơn bạn đã tin tưởng chúng tôi!</Text>
            </View>
         )
      }
   }
   const renderTime = (time) => {
      const localDate = moment.utc(time).utcOffset('+07:00');
      const formattedDate = localDate.format("HH:mm:ss DD-MM-YYYY");
      return formattedDate
   }
   const isStatus = () => {
      if (route?.params.data.confirmAt == null) {
         return false
      } else {
         return true
      }
   }
   const isExpress = () => {
      if (route?.params.data.orderData.infor_shipping == 1) {
         return true
      } else {
         return false
      }
   }
   const onClickMap = () => {

   }
   const detail_sen = route?.params.data.orderData.sender_detail_address
   const detail_rec = route?.params.data.orderData.receiver_detail_address
   const size_order = route?.params.data.orderData.size_item
   const detail_order = route?.params.data.orderData.detail_item

   return (
      <SafeAreaView style={styles.component}>
         <View style={styles.header}>
            <TouchableOpacity style={{ flex: 1 }} onPress={onClickExit}>
               <Icon name={'arrowleft'} size={20} color={'darkorange'} />
            </TouchableOpacity>
            <Text style={styles.t_header}>Chi tiết đơn hàng</Text>
            <View style={{ flex: 1 }} />
         </View>

         <View style={styles.body}>
            <ScrollView>
               <View style={styles._body_status}>
                  {status()}
                  {isStatus() ? <Icon1 name={'clipboard-check-multiple-outline'} size={40} color={'white'} /> : <Icon name={"frown"} size={40} color={'yellow'} />}

               </View>
               <View style={styles._body_delivery}>
                  <View style={{ flexDirection: 'row' }}>
                     <Icon1 name={'truck-check'} size={20} color={'orange'} />
                     <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Thông tin vận chuyển</Text>
                        <Text style={{ color: '#3c3c38', marginTop: 5 }}>Giao hàng {isExpress() ? 'hỏa tốc' : 'tiết kiệm'}</Text>
                        {isStatus() ?
                           <View>
                              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                 <Icon4 name={'dot-fill'} color={'#26ab9a'} size={15} />
                                 <Text style={{ color: '#26ab9a', marginLeft: 5 }}>Đơn hàng đã được giao thành công</Text>
                              </View>
                              <Text style={{ marginLeft: 10 }}>{renderTime(route?.params.data.confirmAt)}</Text>
                           </View>
                           : null}
                     </View>
                  </View>
               </View>
               <View style={styles.distance}>
                  <View style={{ flexDirection: 'row' }}>
                     <Icon1 name={"map-marker-distance"} color={'darkorange'} size={22} />
                     <Text style={styles.t_distance}>Quãng đường: <Text style={{ color: 'blue' }}>{route?.params.data.orderData.distance} km</Text></Text>
                  </View>
                  <TouchableOpacity style={{ justifyContent: 'center' }} activeOpacity={0.8} onPress={onClickMap}>
                     <Text style={{ color: '#1db874' }}>Xem trên bản đồ</Text>
                  </TouchableOpacity>
               </View>
               <View style={{ borderWidth: 0.2, marginHorizontal: 5 }} />
               <View style={styles._body_delivery}>
                  <View style={{ flexDirection: 'row' }}>
                     <Icon2 name="location-sharp" size={20} color={'red'} />
                     <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Địa chỉ lấy hàng</Text>
                        <Text style={{ color: '#3c3c38', marginTop: 5 }}>{route?.params.data.orderData.sender_name}</Text>
                        <TouchableOpacity onPress={onClickPhone}>
                           <Text style={{ color: '#3c3c38' }}>{route?.params.data.orderData.sender_phone}</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#3c3c38' }}>{route?.params.data.orderData.sender_address}</Text>
                        {detail_sen == null ? null : <Text style={{ color: '#3c3c38' }}>{detail_sen}</Text>}
                     </View>
                  </View>
               </View>
               <View style={{ marginLeft: 40, borderWidth: 0.2, borderColor: 'silver' }} />
               <View style={styles._body_delivery}>
                  <View style={{ flexDirection: 'row' }}>
                     <Icon3 name="location-arrow" size={18} color={'#26ab9a'} />
                     <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500' }}>Địa chỉ giao hàng</Text>
                        <Text style={{ color: '#3c3c38', marginTop: 5 }}>{route?.params.data.orderData.receiver_name}</Text>
                        <Text style={{ color: '#3c3c38' }}>{route?.params.data.orderData.receiver_phone}</Text>
                        <Text style={{ color: '#3c3c38' }}>{route?.params.data.orderData.receiver_address}</Text>
                        {detail_rec == null ? null : <Text style={{ color: '#3c3c38' }}>{detail_rec}</Text>}
                     </View>
                  </View>
               </View>
               <View style={styles.order}>
                  <View style={{ flexDirection: 'row', padding: 10 }}>
                     <Icon1 name={'calendar-text-outline'} size={23} color={'orange'} />
                     <Text style={styles.t_order}>Chi tiết đơn hàng</Text>
                  </View>
                  <View style={{ borderWidth: 0.2, marginHorizontal: 5, borderColor: 'silver' }} />
                  <View style={{ padding: 10 }}>
                     <Text style={{ color: '#3c3c38' }}>Kích thước đơn: {size_order == 1 ? 'cồng kềnh ()' : 'nhỏ gọn ()'}</Text>
                     {detail_order == null ? null : <Text style={{ color: '#3c3c38' }}>Thông tin đơn: {detail_order}</Text>}
                  </View>
               </View>
               <View style={styles.payment}>
                  <Text style={styles.t_payment}>Thanh toán: </Text>
                  <Text style={styles.t_payment}><Text style={{ textDecorationLine: 'underline', color: 'red' }}>đ</Text> {route?.params.data.orderData.price}</Text>
               </View>
               <View style={styles.id_order}>
                  <View style={styles._id_order_item}>
                     <Text style={styles.t_payment}>Mã đơn hàng</Text>
                     <Text style={styles.t_payment}>{route?.params.data.orderData.id}</Text>
                  </View>
                  <View style={styles._id_order_item}>
                     <Text style={{ color: '#3c3c38' }}>Thời gian nhận đơn</Text>
                     <Text style={{ color: '#3c3c38' }}>{renderTime(route?.params.data.createdAt)}</Text>
                  </View>
                  {isStatus()
                     ? <View>
                        <View style={styles._id_order_item}>
                           <Text style={{ color: '#3c3c38' }}>Thời gian lấy hàng</Text>
                           <Text style={{ color: '#3c3c38' }}>{renderTime(route?.params.data.takeAt)}</Text>
                        </View>
                        <View style={styles._id_order_item}>
                           <Text style={{ color: '#3c3c38' }}>Thời gian hoàn thành</Text>
                           <Text style={{ color: '#3c3c38' }}>{renderTime(route?.params.data.confirmAt)}</Text>
                        </View>
                     </View>
                     : <View style={styles._id_order_item}>
                        <Text style={{ color: '#3c3c38' }}>Thời gian hủy đơn</Text>
                        <Text style={{ color: '#3c3c38' }}>{renderTime(route?.params.data.deleteAt)}</Text>
                     </View>
                  }
               </View>
            </ScrollView>
         </View>

         <View style={styles.footer}>
            <TouchableOpacity style={styles._footer_inside} activeOpacity={0.8} onPress={onClickExit}>
               <Text style={styles.t_evaluate}>Xác nhận</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   )
}

export default Detail

const styles = StyleSheet.create({
   component: {
      flex: 1,
   },
   header: {
      height: 80,
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: 'white',
      paddingVertical: 15,
      paddingHorizontal: 7,
      flexDirection: 'row'
   },
   body: {
      flex: 15,
      marginTop: 1
   },
   footer: {
      flex: 1,
      padding: 10,
      backgroundColor: 'white',
      marginTop: 5,
      justifyContent: 'center'
   },
   _footer_inside: {
      backgroundColor: '#ec5e09',
      height: 45,
      justifyContent: 'center'
   },
   t_header: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 6,
      textAlign: 'center'
   },
   t_evaluate: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center'
   },
   _body_status: {
      height: 90,
      backgroundColor: '#26ab9a',
      alignItems: 'center',
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   t_status: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
   },
   _body_delivery: {
      backgroundColor: 'white',
      padding: 10
   },
   distance: {
      backgroundColor: 'white',
      marginTop: 10,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   t_distance: {
      fontSize: 16,
      fontWeight: '500',
      marginHorizontal: 10
   },
   order: {
      backgroundColor: 'white',
      marginTop: 10,
      // padding: 10
   },
   t_order: {
      fontWeight: '500',
      fontSize: 16,
      marginLeft: 10
   },
   payment: {
      backgroundColor: 'white',
      marginTop: 10,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   t_payment: {
      fontSize: 16,
      fontWeight: '500',
   },
   id_order: {
      backgroundColor: 'white',
      marginTop: 10,
      padding: 10
   },
   _id_order_item: {
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
})