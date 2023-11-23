import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/login/index';
import Home from './src/component';
import Register from './src/register/index';
import { Password } from './src/register/password';
import TabBar from './src/component/index'
import { AppProvider } from './src/component/AppContext'
import HistoryScreen from './src/component/HistoryScreen';
import NotificationScreen from './src/component/NotificationScreen';
import Order from './src/component/order';
import Others from './src/component/others';
import Statistics from './src/component/statistics';
import CompletedOrder from './src/component/OtherItem/HistoryItem/CompletedOrder';
import CanceledOrder from './src/component/OtherItem/HistoryItem/CanceledOrder';
import DetailOrder from './src/component/OtherItem/detailOrder';
import TakeOrder from './src/component/OtherItem/takeOrder';
import Detail from './src/component/OtherItem/HistoryItem/detail';
import UserAccount from './src/component/OtherItem/user_account';
import Delivery from './src/component/OtherItem/delivery';
import Detail_order from './src/component/OtherItem/detail_order';
import EditPassword from './src/component/OtherItem/EditAccount/edit_pass'
import EditProfile from './src/component/OtherItem/EditAccount/edit_profile';
import Chart from './src/component/OtherItem/chart';

// import home from './src/test';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <AppProvider>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          {/* <Stack.Screen name='chart' component={Chart}/> */}
          <Stack.Screen name='login' component={Login} />
          <Stack.Screen name='register' component={Register} />
          <Stack.Screen name='home' component={Home} />
          <Stack.Screen name='pass' component={Password} />
          <Stack.Screen name='tabbar' component={TabBar} />
          <Stack.Screen name='history' component={HistoryScreen} />
          <Stack.Screen name='notificationDriver' component={NotificationScreen} />
          <Stack.Screen name='order' component={Order} />
          <Stack.Screen name='others' component={Others} />
          <Stack.Screen name='statistics' component={Statistics} />
          <Stack.Screen name='completedOrder' component={CompletedOrder} />
          <Stack.Screen name='canceledOrder' component={CanceledOrder} />
          <Stack.Screen name='detaiOrder' component={DetailOrder} />
          <Stack.Screen name='takeorder' component={TakeOrder} />
          <Stack.Screen name='details' component={Detail} />
          <Stack.Screen name='userAccount' component={UserAccount} />
          <Stack.Screen name='delivery' component={Delivery} />
          <Stack.Screen name='detail_order' component={Detail_order} />
          <Stack.Screen name='editpassword' component={EditPassword} />
          <Stack.Screen name='editprofile' component={EditProfile} />
        </Stack.Navigator>
      </AppProvider>
    </NavigationContainer>
  );
}

