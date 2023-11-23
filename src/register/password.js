import { Text, TextInput, SafeAreaView, View, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import { useState, useEffect } from "react";
import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Toast } from "react-native-toast-message/lib/src/Toast";
import Toast from 'react-native-toast-message'
// import { ToastAndroid } from "react-native";

export const Password = ({ route }) => {
   const navigation = useNavigation()
   const [hidePass, setHidePass] = useState(true)
   const [hideRePass, setHideRePass] = useState(true)
   const [password, setPassword] = useState('')
   const [rePassword, setRePassword] = useState('')
   const [isValidPass, setValidPass] = useState(true)
   const [isRePassword, setValidRePassword] = useState(true)
   const [value, setValue] = useState({})
   const setLengthPassword = (text) => {
      if (text.length == 0) {
         setValidPass(true)
      }
   }
   const setLengthRepassword = (text) => {
      if (text.length == 0) {
         setValidRePassword(true)
      }
   }
   const onClickEye = () => {
      setHidePass(!hidePass)
   }
   const onClickExit = () => {
      navigation.goBack()
   }
   const onClickEyeRePass = () => {
      setHideRePass(!hideRePass)
   }
   const verifyPassword = (password) => {
      if (password.length < 8) {
         return false
      }
      return true
   }
   const verifyRePassword = (rePassword) => {
      if (rePassword === password && password === rePassword) {
         return true
      }
      return false
   }
   const isValidRegisterUser = () => password.length > 0 && rePassword.length > 0 && isValidPass == true && isRePassword == true
   useEffect(() => {
      if (route?.params?.data) {
         setValue(route?.params.data)
      }
   }, [route?.params?.data])

   const onClickRegister = async() => {
      value['password'] = password
      await axios.post('https://delivery-server-s54c.onrender.com/driver/register',value)
         .then( async(res) =>{          
            if(res.data.err == 0){
               await AsyncStorage.setItem('refresh_token',res.data.refresh_token)
               await AsyncStorage.setItem('access_token',res.data.access_token)
               navigation.navigate('tabbar')
            }else if(res.data.err == 1){
               ToastAndroid.show('Tài khoản đã tồn tại !', ToastAndroid.LONG)
               navigation.popToTop()
            }else{
               ToastAndroid.show('Đăng ký không thành công !', ToastAndroid.LONG)
               navigation.popToTop()
            }
         })
         .catch(err =>{
            console.log(err)
         })
   }
   let messagePassword
   if (!isValidPass) {
      messagePassword = (
         <Text style={{
            color: 'red',
            marginHorizontal: 20
         }}>Vui lòng nhập ít nhất 8 ký tự</Text>
      )
   }
   let messageRePassword
   if (!isRePassword) {
      messageRePassword = (
         <Text style={{
            color: 'red',
            marginHorizontal: 20
         }}>Mật khẩu chưa trùng khớp</Text>
      )
   }
   let fpass
   if (password.length > 0) {
      fpass = (
         <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Mật khẩu</Text>
      )
   }
   let frepass
   if (rePassword.length > 0) {
      frepass = (
         <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Nhập lại mật khẩu</Text>
      )
   }
   return (
      <SafeAreaView style={styles.component}>
         <View style={styles.header}>
            <Svg style={styles.background}>
               <Defs>
                  <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                     <Stop offset="0%" stopColor="rgba(255,255,255,1)" />
                     <Stop offset="35%" stopColor="rgba(255,255,255,1)" />
                     <Stop offset="100%" stopColor="rgba(255,229,220,1)" />
                  </LinearGradient>
               </Defs>
               <Rect width="100%" height="100%" fill="url(#gradient)" />
            </Svg>
            <TouchableOpacity style={styles.icon_exit} onPress={onClickExit}>
               <Icon name='arrow-left' size={20} color={'orange'} />
            </TouchableOpacity>

            <View style={{ flex: 6 }}>
               <Text style={styles.t_header}>Đăng ký</Text>
            </View>
            <View style={{ flex: 1 }} />
         </View>
         <View style={styles.body}>
            <View style={[styles._input_pass, { borderColor: isValidPass ? 'black' : 'red', }]}>
               <View style={{ width: '90%' }}>
                  {fpass}
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
                        setLengthPassword(text)
                     }}
                  />
               </View>
               <TouchableOpacity onPress={onClickEye}>
                  <Icon name={hidePass ? 'eye-slash' : 'eye'} color='lightslategray' size={20} />
               </TouchableOpacity>
            </View>
            {messagePassword}
            <View style={[styles._input_pass, { borderColor: isRePassword ? 'black' : 'red', }]}>
               <View style={{ width: '90%' }}>
                  {frepass}
                  <TextInput
                     style={styles.TextInput}
                     secureTextEntry={hideRePass ? true : false}
                     placeholder='Nhập lại mật khẩu'
                     placeholderTextColor={'black'}
                     value={rePassword}
                     onChangeText={(text) => {
                        setRePassword(text)
                        const invalid = verifyRePassword(text)
                        invalid ? setValidRePassword(true) : setValidRePassword(false)
                        setLengthRepassword(text)
                     }}
                  />
               </View>
               <TouchableOpacity onPress={onClickEyeRePass}>
                  <Icon name={hideRePass ? 'eye-slash' : 'eye'} color='lightslategray' size={20} />
               </TouchableOpacity>
            </View>
            {messageRePassword}
         </View>
         <Text style={styles.t_condition}>Bằng cách nhấp vào Đăng ký, bạn đã đồng ý với <Text style={{ color: 'orange' }}>Điều khoản và Điều kiện</Text> của chúng tôi</Text>
         <TouchableOpacity
            style={[styles.footer, {
               backgroundColor: isValidRegisterUser() == true ? 'orange' : 'silver',
            }]}
            activeOpacity={0.5}
            onPress={onClickRegister}
            disabled={isValidRegisterUser() == false}
         >
            <Text style={{ fontSize: 18, color: 'white' }}>ĐĂNG KÝ</Text>
         </TouchableOpacity>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   component: {
      flex: 1,
      backgroundColor: 'white'
   },
   header: {
      height: 100,
      borderBottomWidth: .2,
      borderColor: 'orange',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      alignItems: 'flex-end'
   },
   t_header: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
      color: 'orange',
      textAlign: 'center'
   },
   body: {
      backgroundColor: 'white'
   },
   icon_exit: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 20
   },
   footer: {
      marginHorizontal: 40,
      marginTop: 20,
      marginBottom: 10,
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 80,
   },
   background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
   },
   t_condition: {
      textAlign: 'left',
      marginTop: 60,
      marginHorizontal: 20
   },
   _input_pass: {
      height: 50,
      marginTop: 20,
      flexDirection: 'row',
      marginHorizontal: 10,
      borderWidth: 1,
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      borderRadius: 10,
      alignItems: 'center'
   },
   TextInput: {
      marginHorizontal: 10,
      fontSize: 16,
      width: '100%',
   },
})