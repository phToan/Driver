import React, { useState, useEffect } from 'react'
import { View, ScrollView, SafeAreaView, Button, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg'
import { Dropdown } from 'react-native-element-dropdown'
import Icon from 'react-native-vector-icons/FontAwesome'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
// import CalendarIcon from '@mui/icons-material/CalendarMonthTwoTone';
import { useNavigation } from '@react-navigation/native'

const genderData = [
   { id: true, label: 'Nam' },
   { id: false, label: 'Nữ' },
]

const Register = () => {
   const navigation = useNavigation()
   const [isValidPhone, setValidPhone] = useState(true)
   const [phoneNumber, setPhoneNumber] = useState('')
   const [name, setName] = useState('')
   const [isName, setValidName] = useState(true)
   const [vehicle, setVehicle] = useState('')
   const [dateOfBirthday, setDateOfBirthday] = useState('Ngày sinh')
   const [gender, setGender] = useState(null);
   const [date, setDate] = useState(new Date())

   const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDate(currentDate);
      setDateOfBirthday(currentDate.toLocaleDateString('en-GB'))
   };
   const showMode = (currentMode) => {
      DateTimePickerAndroid.open({
         value: date,
         onChange,
         mode: currentMode,
         is24Hour: true,
         // setDateOfBirthday(date.toLocaleDateString('en-GB'))
      });
   };
   const setLengthName = (text) => {
      if (text.length == 0) {
         setValidName(true)
      }
   }
   const setLengthPhone = (text) => {
      if (text.length == 0) {
         setValidPhone(true)
      }
   }
   let messagePhone
   if (!isValidPhone) {
      messagePhone = (
         <View>
            <Text style={{
               color: 'red',
               marginHorizontal: 20
            }}>Vui lòng nhập số điện thoại hợp lệ</Text>
         </View>
      )
   }

   let messageName
   if (!isName) {
      messageName = (
         <Text style={{
            color: 'red',
            marginHorizontal: 20
         }}>Vui lòng nhập ít nhất 6 ký tự</Text>
      )
   }
   const onClickDOB = () => {
      showMode('date');
   }
   const data = {
      name: name,
      phone: phoneNumber,
      dob: dateOfBirthday,
      gender: gender,
      vehicle_num: vehicle
   }
   const onClickContinue = () => {
      navigation.navigate('pass',{data})
   }
   const verifyPhone = (phone) => {
      let phoneNumberRegex = /^(03[2-9]|05[6-9]|07[0-9]|08[1-9]|09[0-9])+([0-9]{7})$/; // Biểu thức chính quy kiểm tra đầu số Việt Nam
      if (phoneNumberRegex.test(phone)) {
         return true
      }
      return false
   }

   const verifyName = (name) => {
      if (name.length < 6) {
         return false
      }
      return true
   }
   const onClickExit = () => {
      navigation.popToTop()
   }

   const isValidRegisterUser = () => name.length > 0 && phoneNumber.length > 0 && isValidPhone == true && isName == true && vehicle.length >0

   let fname
   if (name.length > 0) {
      fname = (
         <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Họ và tên</Text>
      )
   }
   let fvehicle
   if (vehicle.length > 0) {
      fvehicle = (
         <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Số xe</Text>
      )
   }
   let fphone
   if (phoneNumber.length > 0) {
      fphone = (
         <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Số điện thoại</Text>
      )
   }
   let fdob
   if (dateOfBirthday !== 'Ngày sinh') {
      fdob = (
         <Text style={{ fontSize: 12, color: '#34343b', marginBottom: 2 }}>Năm sinh</Text>
      )
   }

   //////==========================================================================================================

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
               <Text style={styles.text_header}>Đăng ký</Text>
            </View>
            <View style={{ flex: 1 }} />
         </View>

         <View style={styles.body}>
            <ScrollView>
               <View style={[{ borderColor: isName ? 'black' : 'red' }, styles._input]}>
                  {fname}
                  <TextInput
                     style={styles.TextInput}
                     placeholder='Họ và tên'
                     placeholderTextColor={'#34343b'} sssss
                     value={name}
                     onChangeText={(text) => {
                        setName(text)
                        const isvalid = verifyName(text)
                        isvalid ? setValidName(true) : setValidName(false)
                        setLengthName(text)
                        const words = text.split(' ')
                        const formattedText = words
                           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                           .join(' ')
                        setName(formattedText)
                     }}
                  />
               </View>
               {messageName}
               <View style={[styles._input, {
                  borderColor: isValidPhone ? 'black' : 'red'
               }]}>
                  {fphone}
                  <TextInput
                     keyboardType='numeric'
                     style={styles.TextInput}
                     placeholder='Số điện thoại'
                     placeholderTextColor={'black'}
                     value={phoneNumber}
                     onChangeText={(text) => {
                        setPhoneNumber(text)
                        const isvalid = verifyPhone(text)
                        isvalid ? setValidPhone(true) : setValidPhone(false)
                        setLengthPhone(text)
                     }}
                  />
               </View>
               {messagePhone}
               <View style={styles._input_dob}>
                  <View>
                     {fdob}
                     <Text style={{ fontSize: 16 }}>{dateOfBirthday}</Text>
                  </View>
                  <TouchableOpacity onPress={onClickDOB}>
                     {/* <CalendarIcon sx={{fontSize:20,color:'orange'}}/> */}
                     <Icon name='calendar' size={30} color={'orange'} />
                  </TouchableOpacity>
               </View>

               <View style={styles.dropdown_gender}>
                  <Dropdown
                     style={{ width: '100%' }}
                     placeholderStyle={{ fontSize: 16, marginHorizontal: 10 }}
                     selectedTextStyle={{ fontSize: 16, marginHorizontal: 10 }}
                     data={genderData}
                     labelField="label"
                     valueField="id"
                     placeholder={'Giới tính'}
                     onChange={item => {
                        setGender(item.id);
                     }}
                  />
               </View>
               <View style={styles._input}>
                  {fvehicle}
                  <TextInput
                     style={styles.TextInput}
                     placeholder='Số xe'
                     placeholderTextColor={'#34343b'}
                     value={vehicle} 
                     onChangeText={(text) => {
                        setVehicle(text)
                     }}
                  />
               </View>
               <TouchableOpacity
                  style={[styles.footer, {
                     backgroundColor: isValidRegisterUser() == true ? 'orange' : 'silver',
                  }]}
                  activeOpacity={0.5}
                  onPress={onClickContinue}
                  disabled={isValidRegisterUser() == false}
               >
                  <Text style={{ fontSize: 18, color: 'white' }}>TIẾP TỤC</Text>
               </TouchableOpacity>
            </ScrollView>
         </View>
      </SafeAreaView>
   )
}

export default Register

const styles = StyleSheet.create({
   component: {
      flex: 1
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
   background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
   },
   text_header: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
      color: 'orange',
      textAlign: 'center'
   },
   icon_exit: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 20
   },
   body: {
      flex: 1
   },
   footer: {
      marginHorizontal: 40,
      marginTop: 60,
      marginBottom: 10,
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 80,
   },
   itext1: {
      color: 'orange',
      // textDecorationLine: 'underline',
   },
   LabelView: {
      height: 50,
      width: 120,
      borderWidth: 1,
      borderRadius: 30,
      backgroundColor: 'orange',
      justifyContent: 'center',
      alignItems: 'center'
   },
   LabelViewGender: {
      height: 50,
      width: 120,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: 'blue',
      justifyContent: 'center',
      alignItems: 'center'
   },
   LabelTextView: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
   },
   TextInput: {
      marginHorizontal: 10,
      fontSize: 16,
      width: '90%'
   },
   _input: {
      height: 50,
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginTop: 20,
      marginHorizontal: 10,
      justifyContent: 'center'
   },
   _input_dob: {
      height: 50,
      alignItems: 'center',
      paddingHorizontal: 20,
      borderWidth: 1,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 10,
   },
   dropdown_gender: {
      justifyContent: 'center',
      height: 50,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 20,
   },

})
