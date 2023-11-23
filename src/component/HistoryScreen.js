import CanceledOrder from './OtherItem/HistoryItem/CanceledOrder';
import CompletedOrder from './OtherItem/HistoryItem/CompletedOrder';
import Header from './header';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Tab = createMaterialTopTabNavigator()

const HistoryScreen = () => {
    return (
        <React.Fragment>
            <Header/>
            <Tab.Navigator screenOptions={{
                headerShown: false,
                activeTintColor: 'orange',
                inactiveTintColor: 'gray',
                labelStyle: {
                    fontWeight: 'bold',
                },

                tabBarLabelStyle: {
                    fontSize: 15,
                    color: '#f5741a',
                    fontWeight: 'bold'
                },
                tabBarIndicatorStyle: {
                    backgroundColor: 'orange'
                },
                tabBarStyle: {
                    backgroundColor: '#fff1d6'
                }
            }}>
                <Tab.Screen
                    name='HOÀN THÀNH' component={CompletedOrder} />
                <Tab.Screen
                    name='ĐÃ HỦY' component={CanceledOrder} />
            </Tab.Navigator>
        </React.Fragment>

    )
}

// const HistoryScreen = () => {
//     return (
//         <SafeAreaView style={{
//             flex: 1
//         }}>
//             {/* <Header /> */}
//             <View style={{
//                 backgroundColor: 'white',
//                 flex: 8
//             }}>
//                 <TabScreen />
//             </View>
//         </SafeAreaView>
//     )
// }

export default HistoryScreen


