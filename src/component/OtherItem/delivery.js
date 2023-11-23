import React, { useState, useContext } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native'
import AppContext from '../AppContext'
import MapView, { Marker } from 'react-native-maps'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'
import Icon1 from 'react-native-vector-icons/FontAwesome'

import axios from 'axios'
import moment from 'moment-timezone'

const TakeOrder = ({ navigation, route }) => {
    const API_KEY = 'uGwlo6yHxKnoqSPqp0Enla92wOd1YpmpbYrEy3GK'
    const { socket, setStatus, setScreen, setSelectedID, setTake, setDisplay } = useContext(AppContext)
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [region, setRegion] = useState(null);
    const item = route?.params.item
    const currentTime = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')
    const onclickDel = () => {
        setStatus(false)
        setScreen(0)
        setSelectedID(null)
        navigation.navigate('Đơn hàng')
    }
    const onClickReturn = () => {
        navigation.navigate('Đơn hàng')
        setScreen(2)
    }
    const data = {
        id_Order: item.id,
        confirmAt: currentTime,
        status: 1
    }

    const openGoogleMaps = () => {
        const destinationAddress = item.receiver_address
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationAddress}`;

        Linking.openURL(googleMapsUrl)
            .then((result) => {
                if (result) {
                    console.log('Successfully opened Google Maps');
                } else {
                    console.log('Failed to open Google Maps');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const onClickSuccess = async () => {
        if (socket) {
            await axios.get('https://delivery-server-s54c.onrender.com/socket', {
                params: {
                    user_id: item.customer_id,
                    type: 0
                }
            })
                .then(res => {
                    if (res.data.err == 0) {
                        socket.emit('deliverySuccess', {
                            socket_id: res.data.data.socket_id,
                            id: item.id
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        await axios.put('https://delivery-server-s54c.onrender.com/order/driver/update', data)
            .then((res) => {
                console.log(res)
                if (res.data.err == 0) {
                    setTake(false)
                    setDisplay(false)
                    setStatus(false)
                    navigation.navigate('Đơn hàng')
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }
    const onClickPhone = async () => {
        const isAvailable = await Linking.canOpenURL(`tel:${item.phone}`);
        if (isAvailable) {
            // Mở ứng dụng gọi điện thoại
            Linking.openURL(`tel:${item.phone}`);
        } else {
            console.log('Ứng dụng gọi điện thoại không khả dụng trên thiết bị.');
        }
    }
    const onClickDetail = () => {
        navigation.navigate('detail_order', { item })
    }
    React.useEffect(() => {
        const getLocationCoordinates = async () => {
            try {
                const addresses = item.receiver_address
                const response = await axios.get(
                    `https://rsapi.goong.io/Geocode?address=${addresses}&api_key=${API_KEY}`
                )
                const data = response.data
                if (data.status === 'OK' && data.results.length > 0) {
                    const location = data.results[0].geometry.location
                    setLatitude(location.lat)
                    setLongitude(location.lng)
                    setRegion({
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001,
                    })
                }
            } catch (error) {
                console.log(error.message + 'l');
            }
        }
        getLocationCoordinates()
    },[])
    const calculateDelta = () => {
        const LATITUDE_DELTA = 0.01;
        const LONGITUDE_DELTA = 0.01;
        return {
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClickReturn} style={{ flex: 1, alignItems: 'center' }}>
                    <Icon name='arrowleft' color={'black'} size={25} />
                </TouchableOpacity>
                <Text style={styles.t_header}>Thông tin giao hàng</Text>
                <View style={{ flex: 1 }} />
            </View>

            <View style={styles.body}>
                <ScrollView>
                    <View style={styles._body_title}>
                        <Text style={{ fontWeight: 'bold' }}>Địa điểm giao hàng</Text>
                    </View>
                    <View style={styles.map}>
                        {latitude && longitude && (
                            <MapView
                                style={{ flex: 1 }}
                                initialRegion={{
                                    latitude,
                                    longitude,
                                    ...calculateDelta(),
                                }}
                                region={region}
                            >
                                <Marker coordinate={{ latitude, longitude }} />
                            </MapView>
                        )}
                    </View>
                    <View style={styles.address}>
                        <Text style={styles.t_address}>{item.receiver_address}</Text>
                        <TouchableOpacity style={styles.b_route} onPress={openGoogleMaps}>
                            <Text style={styles.t_route}>Đường đi</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 14, marginTop: 5, fontWeight: '500' }}>Địa chỉ chi tiết</Text>
                    <Text style={{ color: 'silver' }}>{item.rêciver_detail_address}</Text>

                    <Text style={{ fontSize: 16, marginTop: 20, fontWeight: 'bold', borderTopWidth: 0.5, paddingTop:10 }}>Thông tin người nhận</Text>
                    <View style={styles.user}>
                        <Icon1 name='user-circle-o' color={'black'} size={45} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                            }}>{item.receiver_name}</Text>
                            <Text style={{}}>Người nhận</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClickPhone} style={styles.phone}>
                        <Icon1 name='phone' size={25} color={'black'} />
                        <Text style={{ fontSize: 16, marginLeft: 5 }}>Gọi điện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.detail} onPress={onClickDetail}>
                        <Text style={styles.t_detail}>Xem chi tiết đơn hàng</Text>
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop:10, borderTopWidth: .5, marginTop:20}}>
                        <Text style={{fontSize: 16, fontWeight: '500'}}>Thanh toán</Text>
                        <Text style={{fontSize: 16, fontWeight: '500', color: 'green'}}>{item.price} đ</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:5}}>
                        <Text style={{fontSize: 16, fontWeight: '500'}}> Hình thức thanh toán</Text>
                        <Text style={{fontSize: 16, fontWeight: '500'}}>Tiền mặt</Text>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.ButtonF}
                    onPress={onclickDel}
                >
                    <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Thất bại</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClickSuccess} style={{ flex: 3, backgroundColor: 'darkorange', marginLeft: 10, justifyContent: 'center' }}>
                    <Text style={styles.textBT}>Giao hàng thành công</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default TakeOrder
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        flex: 0.6,
        backgroundColor: 'white',
        paddingBottom: 10,
        borderBottomWidth: 0.2,
        borderColor: 'orange',
    },
    phone: {
        borderWidth: 0.5,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 90,
        justifyContent: 'center'
    },
    user: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 10
    },
    t_header: {
        flex: 7,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    t_phone: {
        textDecorationLine: 'underline',
        color: 'blue'
    },
    body: {
        flex: 5,
        marginTop: 10,
        backgroundColor: 'white',
        padding: 10,
        paddingBottom: 20
    },
    _body_title: {
        borderBottomWidth: 0.5,
        paddingBottom: 5
    },
    b_route: {
        padding: 5,
        backgroundColor: '#fff0db',
        borderRadius: 10,
        flex: 1,
        marginLeft: 5,
        justifyContent: 'center'
    },
    t_route: {
        fontSize: 16,
        color: '#ff6833',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    detail: {
        marginTop: 20,
        marginHorizontal: 80,
        padding: 10,
        backgroundColor: '#ec09a8',
        justifyContent: 'center'
    },
    t_detail: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        color: 'white'
    },
    address: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between'
    },
    address_detail: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 7,
        marginTop: 10
    },
    t_address: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 3
    },
    ButtonC: {
        backgroundColor: 'green',
        padding: 12
    },
    ButtonF: {
        backgroundColor: 'silver',
        paddingVertical: 10,
        flex: 2,
        justifyContent: 'center'
     },
    textBT: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    footer: {
        flex: 0.5,
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row'
     },
    map: {
        height: 170,
        backgroundColor: 'white',
        marginTop: 10,
        borderColor: 'darkorange',
        borderWidth: 0.5
    },
})