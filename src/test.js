import React, { useState, useEffect, useContext } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from 'react-native'
// import Swiper from 'react-native-swiper'
import Icon from 'react-native-vector-icons/Entypo'
import Icon1 from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
// import { useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from './component/AppContext'
// import { useFocusEffect } from '@react-navigation/native'
import { Permissions } from 'expo-permissions';


const Home = ({ navigation }) => {
    const { address, setAddress } = useContext(AppContext)
    // const API_KEY_GEOCODE = 'AIzaSyDCvGy8hmWNcrt9aslb7m8yIbhkwHvhIYo'
    const API_KEY_GEOCODE = 'AIzaSyCS-qxrrYUPQH_R_ZfLdHhqlnGSOwtIhRs'
    // const navigation = useNavigation()
    //    const route = useRoute()
    // const [currentLocation, setCurrentLocation] = useState(null);
    // const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [region, setRegion] = useState(null)

    const onClickDetailedAddress = async () => {
        navigation.navigate('detailedAddressSender')

    }
    const onClickPlaceDelivery = () => {
        navigation.navigate('placeDelivery')
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return
            }
            let location = await Location.getCurrentPositionAsync();
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${API_KEY_GEOCODE}`
                )
                const data = response.data
                console.log(data)
                if (data.status === 'OK' && data.results.length > 0) {
                    const locate = data.results[1].formatted_address
                    await AsyncStorage.setItem('setCurrPos', locate)
                    setAddress(locate)
                }
            } catch (error) {
                console.log(error.message)
            }
        })()

    }, [])

    useEffect(() => {
        const renderMap = async () => {
            try {
                const itemLocate = address
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${itemLocate}&key=${API_KEY_GEOCODE}`)
                const data = response.data

                if (data.status === 'OK' && data.results.length > 0) {
                    setAddress(data.results[0].formatted_address)
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
                console.log(error.message)
            }
        }
        renderMap()
    }, [address])


    useEffect(() => {
        const renderMap = async () => {
            try {
                const itemLocate = address
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${itemLocate}&key=${API_KEY_GEOCODE}`)
                const data = response.data

                setAddress(data.results[0].formatted_address)
                const location = data.results[0].geometry.location
                setLatitude(location.lat)
                setLongitude(location.lng)
                setRegion({
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                })

            } catch (error) {
                console.log(error.message)
            }
        }
        renderMap()
    }, [])

    const calculateDelta = () => {
        const LATITUDE_DELTA = 0.009
        const LONGITUDE_DELTA = 0.009
        return {
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
    }
    return (
        <SafeAreaView style={{
            flex: 1
        }}>
            <View style={{
                flex: 0.5,
                backgroundColor: 'slide',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                paddingHorizontal: 10
            }}>
            </View>
            <View style={{
                flex: 10
            }}>
                <ScrollView>
                    <View style={{
                        height: 250,
                        backgroundColor: 'slide',
                        paddingVertical: 10
                    }}>
                        {/* <Swiper
                     loop
                     autoplay
                     horizontal
                  >
                     <Image
                        source={require('../../Contains/Image/slide1.jpg')}
                        style={styles.image}
                     />
                     <Image source={require('../../Contains/Image/slide2.jpg')}
                        style={styles.image}
                     />
                     <Image source={require('../../Contains/Image/slide3.jpg')}
                        style={styles.image}
                     />
                  </Swiper> */}
                    </View>

                    <View style={{
                        marginVertical: 5,
                        backgroundColor: 'white',
                        paddingHorizontal: 15
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 5
                        }}>
                            <Icon2 name='truck-delivery' color={'orange'} size={20} />
                            <Text style={{ fontWeight: 'bold', marginHorizontal: 10 }}>GIAO HÀNG</Text>
                        </View>
                        <TouchableOpacity onPress={onClickDetailedAddress}>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 10
                            }}>

                                <View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Icon1 name='stop-circle' size={16} />
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            marginHorizontal: 15
                                        }}>Địa điểm lấy hàng</Text>
                                    </View>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 18,
                                        marginHorizontal: 10
                                    }}> {address}</Text>
                                    {/* <Text style={{ paddingHorizontal: 25 }}> Mễ Trì, Từ Liêm, Hà Nội, Việt Nam</Text> */}
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Icon name='chevron-small-right' size={20} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClickPlaceDelivery}>
                            <View style={{
                                flexDirection: 'row',
                                marginVertical: 10,
                                padding: 10,
                                backgroundColor: 'light',
                                alignItems: 'center',
                                borderRadius: 10
                            }}>
                                <View>
                                    <Icon2 name='arrow-down-box' size={20} color={'orange'} />
                                </View>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    marginHorizontal: 10
                                }}>Bạn muốn giao hàng đến đâu ?</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        height: 500,
                        width: '100%',
                        backgroundColor: 'white',
                        marginVertical: 5,

                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '700',
                            marginTop: 15,
                            marginHorizontal: 15
                        }}>XUNG QUANH CÓ GÌ?</Text>

                        <View style={{
                            marginTop: 10,
                            marginBottom: 20,
                            marginHorizontal: 15,
                            backgroundColor: 'base',
                            height: 450
                        }}>
                            {/* <MapView
                                initialRegion={{
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            /> */}
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
                    </View>
                </ScrollView>
            </View>

        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    }
})