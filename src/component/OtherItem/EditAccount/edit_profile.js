import React, { useState, useContext } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import axios from 'axios'
import SysModal from '../../../sysModal/sys_modal'
import AppContext from '../../AppContext'

const EditProfile = ({ route }) => {
    const {setUpdate} = useContext(AppContext)
    const navigation = useNavigation()
    const [nameUser, setNameUser] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState(route.params.data.dob)
    const [date, setDate] = useState(new Date())
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const gender = route.params.data.gender
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setDateOfBirth(currentDate.toLocaleDateString('en-GB'))
    };
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    }
    const onClickReturn = () => {
        navigation.navigate('userAccount')
    }
    const onClickCalendar = () => {
        showMode('date')
    }
    const onClickUpdate = () => {
        if (nameUser !== '' && nameUser !== route.params.data.name) {
            data['name'] = nameUser
        }
        if (dateOfBirth !== '' && dateOfBirth !== route.params.data.dob) {
            data['dob'] = dateOfBirth
        }
        if (Object.keys(data).length > 1) {
            const res = updateData(data)

        } else {
            setErrorMessage('Vui lòng thay đổi thông tin cá nhân trước khi cập nhật')
            setShowModal(true)
        }
    }

    if (gender) {
        imageSource = require('../../../contains/Image/man_icon.jpg')
    } else {
        imageSource = require('../../../contains/Image/girl_icon.jpg')
    }
    const data = {
        id: route.params.data.id
    }
    const updateData = async (data) => {
        await axios.put('https://delivery-server-s54c.onrender.com/driver', data)
            .then((res) => {
                if (res.data.err == 0) {
                    setIsSuccess(true)
                    setErrorMessage('Cập nhật thông tin thành công')
                    setShowModal(true)
                } else {
                    setErrorMessage('Cập nhật thông tin thất bại')
                    setShowModal(true)
                }
            })
            .catch((err) => {
                return 1
            })
    }

    const onHideModal = () => {
        if (isSuccess) {
            setUpdate(true)
            setIsSuccess(false)  
            setTimeout(()=>{
                setShowModal(false)
                navigation.goBack()
            }, 2000)
            
        } else {
            setShowModal(false)
        }
    }

    return (
        <SafeAreaView style={styles.component}>
            <SysModal onHide={onHideModal} Visible={showModal} Message={errorMessage} />
            <View style={styles.header}>
                <TouchableOpacity onPress={onClickReturn} style={{ flex: 1, alignItems: 'center' }}>
                    <Icon name='arrowleft' color={'black'} size={25} />
                </TouchableOpacity>
                <View style={{ flex: 7, alignItems: 'center', }}>
                    <Text style={styles.t_header}>Chỉnh sửa hồ sơ</Text>
                </View>
                <View style={{ flex: 1 }} />
            </View>

            <View style={styles.body}>
                <View style={styles._image}>
                    <Image source={imageSource} style={styles.avatar} />
                </View>
                <View style={styles.textInput}>
                    <Text style={{ fontSize: 12 }}>Họ Tên</Text>
                    <TextInput
                        style={{ fontSize: 16 }}
                        defaultValue={route?.params.data.name}
                        placeholderTextColor={'black'}
                        onChangeText={(text) => {
                            setNameUser(text)
                        }}
                    />
                </View>
                <View style={styles._body_dob}>
                    <View>
                        <Text style={{ fontSize: 12 }}>Ngày Sinh</Text>
                        <Text style={{ fontSize: 16, marginVertical: 3 }}>{dateOfBirth}</Text>
                    </View>
                    <TouchableOpacity onPress={onClickCalendar}>
                        <Icon name='calendar' size={30} color={'darkorange'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textInput}>
                    <Text style={{ fontSize: 12 }}>Số điện thoại</Text>
                    <Text style={{ fontSize: 16, marginVertical: 3 }}>{route.params.data.phone}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.footer} onPress={onClickUpdate} >
                <Text style={styles.t_update}>Cập nhật</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    component: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        backgroundColor: 'white',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        alignItems:'flex-end',
        borderBottomWidth: 0.5,
        borderColor: 'silver',
        flex: 1,
        paddingBottom:15
    },
    t_header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    _image: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10
    },
    body: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 10,
        flex: 8
    },
    _body_dob: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        
    },
    footer: {
        backgroundColor: '#f9660d',
        flex: 0.8,
        margin:10,
        justifyContent: 'center'
    },
    textInput: {
        marginTop: 5,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 5
    },
    avatar: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    t_update: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    }
})