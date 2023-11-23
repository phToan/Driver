import React, { useState, useEffect } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
// import color from '../../../Contains/color'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon1 from 'react-native-vector-icons/AntDesign'
import SysModal from '../../../sysModal/sys_modal'
import axios from 'axios'

const EditPassword = ({ route }) => {
    const navigation = useNavigation()
    const [isValidPass, setValidPass] = useState(true)
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [isRePassword, setValidRePassword] = useState(true)
    const [isValidOldPass, setValidOldPass] = useState(true)
    const [passwordOld, setPasswordOld] = useState('')
    const [hideOldPass, setHideOldPass] = useState(true)
    const [hideNewPass, setHideNewPass] = useState(true)
    const [hideRePass, setHideRePass] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

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
    const setLengthOldPassword = (text) => {
        if (text.length == 0) {
            setValidOldPass(true)
        }
    }
    const onClickEye1 = () => {
        setHideOldPass(!hideOldPass)
    }
    const onClickEye2 = () => {
        setHideNewPass(!hideNewPass)
    }
    const onClickEye3 = () => {
        setHideRePass(!hideRePass)
    }

    let messageOldPassword
    if (!isValidOldPass) {
        messageOldPassword = (
            <Text style={{ color: 'red', marginHorizontal: 20 }}>Vui lòng nhập ít nhất 8 ký tự</Text>
        )
    }
    let messagePassword
    if (!isValidPass) {
        messagePassword = (
            <Text style={{ color: 'red', marginHorizontal: 20 }}>Vui lòng nhập ít nhất 8 ký tự</Text>
        )
    }
    let messageRePassword
    if (!isRePassword) {
        messageRePassword = (
            <Text style={{ color: 'red', marginHorizontal: 20 }}>Mật khẩu chưa trùng khớp</Text>
        )
    }
    const verifyOldPassword = (password) => {
        if (password.length < 8) return false
        return true
    }
    const verifyPassword = (password) => {
        if (password.length < 8) return false
        return true
    }
    const verifyRePassword = (rePassword) => {
        if (rePassword === password && password === rePassword) return true
        return false
    }
    const onClickReturn = () => {
        navigation.goBack()
    }
    const onClickUpdate = () => {
        const data = {
            id: route.params.id,
            password: passwordOld,
            newPassword: password
        }
        if (passwordOld === password) {
            setErrorMessage('Vui lòng tạo 1 mật khẩu mới trước khi cập nhật')
            setShowModal(true)
        } else {
            updateData(data)
        }
        setHideNewPass(true)
        setHideOldPass(true)
        setHideRePass(true)
    }

    const updateData = async (data) => {
        let result = 0
        await axios.put('https://delivery-server-s54c.onrender.com/driver/password', data)
            .then((res) => {
                if (res.data.err == 0) {
                    setErrorMessage('Cập nhật mật khẩu thành công')
                    setShowModal(true)
                    setIsSuccess(true)
                } else if (res.data.err == 2) {
                    setErrorMessage('Mật khẩu cũ chưa chính xác. Vui lòng nhập lại!')
                    setShowModal(true)
                } else {
                    setErrorMessage('Cập nhạt mật khẩu thất bại!')
                    setShowModal(true)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        return result
    }

    const onHideModal = () => {
        if (isSuccess) {
            setShowModal(false)
            navigation.goBack()
            setIsSuccess(false)
        } else {
            setShowModal(false)
        }
    }
    let fpass
    if (password.length > 0) {
        fpass = (
            <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Mật khẩu mới</Text>
        )
    }
    let frepass
    if (rePassword.length > 0) {
        frepass = (
            <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Nhập lại mật khẩu mới</Text>
        )
    }
    let foldpass
    if (passwordOld.length > 0) {
        foldpass = (
            <Text style={{ fontSize: 12, color: '#34343b', marginLeft: 10 }}>Mật khẩu cũ</Text>
        )
    }

    const ValidUpdate = () => isRePassword == true && isValidOldPass == true && isValidPass == true
        && rePassword.length > 0 && password.length > 0 && passwordOld.length > 0

    return (
        <SafeAreaView style={styles.component}>
            <SysModal onHide={onHideModal} Visible={showModal} Message={errorMessage} />
            <View style={styles.header}>
                <TouchableOpacity onPress={onClickReturn} style={{ flex: 1, alignItems: 'center' }}>
                    <Icon1 name='arrowleft' color={'black'} size={25} />
                </TouchableOpacity>
                <View style={{ flex: 7, alignItems: 'center', }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Đổi mật khẩu</Text>
                </View>
                <View style={{ flex: 1 }} />
            </View>

            <View style={styles.body}>
                <View style={[styles._input_pass, {
                    borderColor: isValidOldPass ? 'black' : 'red',
                }]}>
                    {foldpass}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            style={styles.TextInput}
                            secureTextEntry={hideOldPass ? true : false}
                            placeholder='Nhập mật khẩu cũ'
                            placeholderTextColor={'black'}
                            value={passwordOld}
                            onChangeText={(text) => {
                                setPasswordOld(text)
                                const invalid = verifyOldPassword(text)
                                invalid ? setValidOldPass(true) : setValidOldPass(false)
                                setLengthOldPassword(text)
                            }}
                        />
                        <TouchableOpacity onPress={onClickEye1} >
                            <Icon name={hideOldPass ? 'eye-slash' : 'eye'} color='lightslategray' size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
                {messageOldPassword}
                <View style={[styles._input_pass, {
                    borderColor: isValidPass ? 'black' : 'red',
                }]}>
                    {fpass}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            style={styles.TextInput}
                            secureTextEntry={hideNewPass ? true : false}
                            placeholder='Nhập mật khẩu mới'
                            placeholderTextColor={'black'}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text)
                                const invalid = verifyPassword(text)
                                invalid ? setValidPass(true) : setValidPass(false)
                                setLengthPassword(text)
                            }}
                        />
                        <TouchableOpacity onPress={onClickEye2} >
                            <Icon name={hideNewPass ? 'eye-slash' : 'eye'} color='lightslategray' size={20} />
                        </TouchableOpacity>
                    </View>

                </View>
                {messagePassword}
                <View style={[styles._input_pass, {
                    borderColor: isRePassword ? 'black' : 'red',
                }]}>
                    {frepass}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            style={styles.TextInput}
                            secureTextEntry={hideRePass ? true : false}
                            placeholder='Nhập lại mật khẩu mới'
                            placeholderTextColor={'black'}
                            value={rePassword}
                            onChangeText={(text) => {
                                setRePassword(text)
                                const invalid = verifyRePassword(text)
                                invalid ? setValidRePassword(true) : setValidRePassword(false)
                                setLengthRepassword(text)
                            }}
                        />
                        <TouchableOpacity onPress={onClickEye3}>
                            <Icon name={hideRePass ? 'eye-slash' : 'eye'} color='lightslategray' size={20} />
                        </TouchableOpacity>
                    </View>

                </View>
                {messageRePassword}
            </View>
            <TouchableOpacity style={[styles.footer, {
                backgroundColor: ValidUpdate() ? '#f9660d' : 'silver',
            }]} onPress={onClickUpdate} disabled={!ValidUpdate()}>
                <Text style={styles.t_update}>Cập nhật</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default EditPassword

const styles = StyleSheet.create({
    component: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        backgroundColor: 'white',
        flexDirection: "row",
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 15,
        borderBottomWidth: 0.5,
        borderColor: 'silver',
        flex: 1,
    },
    body: {
        flex: 8
    },
    footer: {
        flex: 0.8,
        margin: 13,
        justifyContent: 'center'
    },
    _input_pass: {
        marginTop: 20,
        // flexDirection: 'row',
        marginHorizontal: 10,
        borderWidth: 1,
        padding: 7,
        // justifyContent: 'space-between',
        borderRadius: 10,
    },
    TextInput: {
        marginHorizontal: 10,
        fontSize: 16,
        width: '85%'
    },
    t_update: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16
    },

})