import { View, SafeAreaView, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/Entypo'
import SysModal from '../sysModal/sys_modal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import AppContext from '../component/AppContext'

const Login = ({navigation}) => {
   const {setID} = React.useContext(AppContext)
   const [hidePass, setHidePass] = useState(true)
   const [showModal, setShowModal] = useState(false)
   const [errorMessage, setErrorMessage] = useState('')
   const [isValidPhone, setValidPhone] = useState(true);
   const [isValidPass, setValidPass] = useState(true);
   const [phoneNumber, setPhoneNumber] = useState('');
   const [password, setPassword] = useState('');

   let messagePhone, messagePass
   if (!isValidPhone) {
      messagePhone = (
         <Text style={styles.textMessage}>Số điện thoại chưa hợp lệ</Text>
      )
   }
   if (!isValidPass) {
      messagePass = (
         <Text style={styles.textMessage}>Mật khẩu phải có tối thiểu 8 ký tự</Text>
      )
   }
   const setLenghtPhone = (text) => {
      if (text.length == 0) {
         setValidPhone(true)
      }
   }
   const setLenghtPass = (text) => {
      if (text.length == 0) {
         setValidPass(true)
      }
   }
   const onHideModal = () => {
      setShowModal(false)
   }
   const data = {
      phone: phoneNumber,
      password: password
   }
   const getData = async () => {
      const accessToken = await AsyncStorage.getItem('access_token')
      const refreshToken = await AsyncStorage.getItem('refresh_token')
      const data = {
         headers: {
            'Authorization': accessToken
         }
      }
      await axios.get('https://delivery-server-s54c.onrender.com/driver', data)
         .then(async(res) => {
            await AsyncStorage.setItem('id',res.data.userData.id.toString())
            await AsyncStorage.setItem('name',res.data.userData.name)
            await AsyncStorage.setItem('dob',res.data.userData.dob)
            await AsyncStorage.setItem('gender',JSON.stringify(res.data.userData.gender))
            await AsyncStorage.setItem('phone',res.data.userData.phone)
            await AsyncStorage.setItem('vehicle_num',res.data.userData.vehicle_num)
            setID(await AsyncStorage.getItem('id'))
         })
         .catch((err) => {
            console.log(err)
         })
   }
   const onClickLogin = async () => {
      await axios.post('https://delivery-server-s54c.onrender.com/driver/login', data)
         .then(async (res) => {
            if (res.data.err == 0) {
               await AsyncStorage.setItem('access_token', res.data.access_token)
               await AsyncStorage.setItem('refresh_token', res.data.refresh_token)
               navigation.navigate('tabbar')
               setPassword('')
               setHidePass(true)
               getData()
            } else {
               setErrorMessage('Đăng nhập thất bại. Số điện thoại hoặc mật khẩu không chính xác')
               setShowModal(true)
               setPassword('')
               setHidePass(true)
            }
         })
         .catch((err) => {
            console.log(err + '222')
         })
   }
   const onClickEye = () => {
      console.log('display password')
      setHidePass(!hidePass)
   }

   const verifyPhone = (phone) => {
      let phoneNumberRegex = /^(03[2-9]|05[6-9]|07[0-9]|08[1-9]|09[0-9])+([0-9]{7})$/; // Biểu thức chính quy kiểm tra đầu số Việt Nam
      if (phoneNumberRegex.test(phone)) {
         return true
      }
      return false
   }
   const verifyPassword = (password) => {
      if (password.length < 8) {
         return false
      }
      return true
   }

   const onClickRegister = () => {
      navigation.navigate('register')
   }

   const isValidLogin = () => phoneNumber.length > 0 && password.length > 0
      && isValidPhone == true && isValidPass == true

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
         <SysModal onHide={onHideModal} Visible={showModal} Message={errorMessage} />
         <ScrollView>
            <View style={styles.header}>
               <Image source={require('../contains/Image/ghn1.jpg')} style={{ resizeMode: 'stretch', width: '100%', height: '100%' }} />
            </View>
            <View style={styles.body}>
               <Text style={styles.text_title}>ĐĂNG NHẬP</Text>

               <View style={[styles._input, {
                  borderColor: isValidPhone ? 'black' : 'red'
               }]}>
                  <View style={styles.e_icon}>
                     <Icon name="user" color='lightslategray' size={30} />
                  </View>
                  <TextInput
                     keyboardType='numeric'
                     style={styles.TextInput}
                     placeholder='Nhập số điện thoại'
                     placeholderTextColor={'black'}
                     value={phoneNumber}
                     onChangeText={(text) => {
                        setPhoneNumber(text)
                        const isvalid = verifyPhone(text)
                        isvalid ? setValidPhone(true) : setValidPhone(false)
                        setLenghtPhone(text)
                     }}
                  />
               </View>
               {messagePhone}
               <View style={[styles._input, {
                  borderColor: isValidPass ? 'black' : 'red'
               }]}>
                  <View style={styles.e_icon}>
                     <Icon name="lock" color='lightslategray' size={30} />
                  </View>
                  <TextInput
                     style={styles.TextInput}
                     secureTextEntry={hidePass ? true : false}
                     placeholder='Nhập mật khẩu'
                     placeholderTextColor={'black'}
                     value={password}
                     onChangeText={(text) => {
                        setPassword(text)
                        const invalid = verifyPassword(text)
                        invalid ? setValidPass(true) : setValidPass(false)
                        setLenghtPass(text)
                     }}
                  />
                  <View style={styles.e_icon}>
                     <TouchableOpacity onPress={onClickEye}>
                        <Icon name={hidePass ? 'eye-slash' : 'eye'} color='lightslategray' size={20} />
                     </TouchableOpacity>
                  </View>
               </View>
               {messagePass}
               <TouchableOpacity>
                  <Text style={styles.t_forget_pass}>Quên mật khẩu ?</Text>
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.5} onPress={onClickLogin} disabled={isValidLogin() == false}>
                  <View style={[styles.b_login, {
                     backgroundColor: isValidLogin() == true ? 'orange' : 'silver',
                  }]}>
                     <Text style={{ fontSize: 18, color: 'white' }}>ĐĂNG NHẬP</Text>
                  </View>
               </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 20 }}>Hoặc</Text>
            <View style={styles.b_other_login}>
               <TouchableOpacity>
                  <View style={{ marginHorizontal: 10 }}>
                     <Icon2 name='facebook-with-circle' size={47} color={"blue"} />
                  </View>
               </TouchableOpacity>
               <TouchableOpacity>
                  <Image source={require('../contains/Image/google.png')} style={styles.image} />
               </TouchableOpacity>
            </View>
            <Text style={styles.t_question}>Bạn đã có tài khoản chưa ?</Text>
            <View style={{
               marginHorizontal: 120,
               marginBottom: 200
            }}>
               <TouchableOpacity onPress={onClickRegister}>
                  <Text style={styles.t_register}>Đăng ký</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

export default Login

const styles = StyleSheet.create({
   header: {
      height: 250
   },
   body: {
      alignItems: 'center',
      flex: 3
   },
   text_title: {
      fontSize: 25,
      textAlign: 'center',
      marginTop: 20,
      color: 'orange',
      fontWeight: 'bold'
   },
   t_forget_pass: {
      fontSize: 16,
      marginVertical: 10,
      color: 'orange'
   },
   t_question: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 30,
      marginBottom: 10
   },
   b_other_login: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      marginHorizontal: 80,
      justifyContent: 'center'
   },
   t_register: {
      fontSize: 20,
      textAlign: 'center',
      color: 'orange'
   },
   image: {
      width: 50,
      height: 50,
      marginHorizontal: 10
   },
   icon: {
      marginTop: 50,
      alignItems: 'center',
   },
   b_login: {
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 80,
      marginVertical: 5
   },
   TextInput: {
      width: '80%',
      marginHorizontal: 10,
      marginTop: 10,
      fontSize: 16,
   },
   e_icon: {
      justifyContent: 'center',
   },
   row: {
      paddingTop: 10,
      flexDirection: 'row',
      flex: 1
   },
   element: {
      flex: 1,
   },
   text_element_title: {
      fontSize: 15,
      marginBottom: 8,
      marginHorizontal: 20,
      paddingLeft: 10,
      color: 'black'
   },
   text_element: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      paddingBottom: 10,
      borderBottomWidth: 1,
      marginHorizontal: 20,
      paddingLeft: 10
   },
   textMessage: {
      color: 'red',
      marginHorizontal: 10
   },
   _input: {
      flexDirection: 'row',
      marginHorizontal: 9,
      marginVertical: 5,
      borderBottomWidth: 1,
      padding: 10,
      width: '90%',

   },
})