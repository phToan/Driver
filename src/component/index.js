import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Order from './order';
import Notification from './NotificationScreen';
import History from './HistoryScreen';
import Statistics from './statistics';
import Others from './others'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

const TabDriver = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'orange',
                headerShown: false,
                tabBarStyle: {
                    paddingBottom: 5
                }
            }}
        >
            <Tab.Screen
                options={{
                    tabBarIcon: ({ color }) => < Icon name='text-box-check' color={color} size={22} />
                }} name='Đơn hàng' component={Order} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ color }) => < Icon name='clock-time-ten' color={color} size={22} />
                }} name='Lịch sử' component={History} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ color }) => < Icon2 name='notifications' color={color} size={24} />
                }} name='Thông báo' component={Notification} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ color }) => < Icon2 name='stats-chart' color={color} size={24} />
                }} name='Thống kê' component={Statistics} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ color }) => < Icon name='dots-grid' color={color} size={24} />
                }} name='Thêm' component={Others} />
        </Tab.Navigator>
    )
}

export default TabDriver