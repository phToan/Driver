import React from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native'
// import Icon from 'react-native-vector-icons/Entypo'
import Header from './header'
import { addDays, eachDayOfInterval, eachWeekOfInterval, format, setDate, subDays } from 'date-fns'
import PagerView from 'react-native-pager-view'
import Chart from './OtherItem/chart'
import axios from 'axios'


const Statistics = () => {
   const [selectedDate, setSelectedDate] = React.useState(null)
   const [sum, setSum] = React.useState(0)
   const [completeOr, setcompleteOr] = React.useState(0)
   const [income, setIncome] = React.useState(0)
   const [display, setDisplay] = React.useState(false)
   const [date, setDate] = React.useState('')

   const dates = eachWeekOfInterval({
      start: subDays(new Date(), 14),
      end: addDays(new Date(), 0)
   },
      {
         weekStartsOn: 1
      }
   ).reduce((acc: Date[][], cur) => {
      const allDays = eachDayOfInterval({
         start: cur,
         end: addDays(cur, 6)
      })
      acc.push(allDays)
      return acc
   }, [])



   const fetchData = async (Day: any) => {
      await axios.get('https://delivery-server-s54c.onrender.com/order/driver/day', { params: { day: Day } })
         .then((res) => {
            let count = 0
            let price = 0
            res.data.data.rows.map((e: any) => {
               if (e.status) {
                  count++
                  price += e.orderData.price
               }
            })
            setIncome(price)
            setcompleteOr(count)
            setSum(res.data.data.count)
         })
         .catch((err) => {
            console.log(err)
         })
   }

   React.useEffect(() => {
      var ngayHienTai = new Date();
      var ngay = ngayHienTai.getDate();
      var thang = ngayHienTai.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0, nên cần cộng thêm 1
      var nam = ngayHienTai.getFullYear();
      const date = nam + '-' + '0' + thang + '-' + ngay
      fetchData(date)
      setDisplay(true)
      setDate(ngay + '/' + '0' + thang + '/' + nam)
   }, [])

   const handleDayClick = (day: Date) => {
      setSelectedDate(day);
      const date = day.getFullYear() + '-' + '0' + (parseInt(day.getMonth().toString()) + 1) + '-' + day.getDate()
      fetchData(date)
      setDisplay(false)
   };

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
         <Header />
         <PagerView style={{ flex: 1, backgroundColor: '#73d0ec', padding: 10, alignItems:'center'}}>
            {dates.map((week, i) => {
               return (
                  <View key={i}>
                     <View style={styles.row}>
                        {week.map(day => {
                           const today = new Date()
                           const isSelected = selectedDate && day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear();
                           const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
                           const txt = format(day, 'EEEEE')
                           return (
                              <View style={styles.week}>
                                 <Text style={styles.day}>{txt}</Text>
                                 <TouchableOpacity
                                    key={day.toString()}
                                    onPress={() => handleDayClick(day)}
                                 >
                                    <Text style={[styles.date, isToday && styles.todayText, isSelected && styles.selectedText]}>{day.getDate()}</Text>
                                 </TouchableOpacity>
                              </View>
                           )
                        })}
                     </View>
                  </View>
               )
            })}
         </PagerView>
         <View style={styles.body}>
            {sum == 0 ?
               <Chart text={sum} percentage={0} />
               :
               <React.Fragment>
                  <Chart text={sum} percentage={completeOr / sum * 100} />
                  <View style={{ marginTop: 30, alignItems: 'center' }}>
                     <Text style={styles.text}>Số đơn hoàn thành :<Text style={styles.textChild}> {completeOr}</Text></Text>
                     <Text style={styles.text}>Số đơn bị hủy :<Text style={styles.textChild}> {sum - completeOr}</Text></Text>
                     <Text style={styles.text}>Tỷ lệ thành công :<Text style={styles.textChild}> {(completeOr / sum * 100).toFixed(2)}%</Text></Text>
                     <Text style={styles.text}>Thu nhập trong ngày:<Text style={styles.textChild}> {income.toLocaleString('vi-VN')}đ</Text></Text>
                  </View>
               </React.Fragment>

            }
         </View>
         {selectedDate && (
            <View style={styles.selectedDateContainer}>
               <Text style={styles.selectedDateText}>Thống kê trong ngày: {format(selectedDate, 'dd/MM/yyyy')}</Text>
            </View>
         )}

         {
            display ?
               <View style={styles.selectedDateContainer}>
                  <Text style={styles.selectedDateText}>Thống kê trong ngày: {date}</Text>
               </View>
               : null
         }
      </SafeAreaView>
   )
}

export default Statistics

const styles = StyleSheet.create({
   body: {
      flex: 5,
      alignItems: 'center',
      marginTop: 20
   },
   row: {
      flexDirection: 'row',
      justifyContent: 'space-around'
   },
   week: {
      marginTop: 20,
   },
   day: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   date: {
      marginTop: 7,
      fontSize: 22,
      color: 'white'
   },
   todayText: {
      fontWeight: 'bold',
      fontSize: 22,
      color: 'blue'
   },
   selectedDateContainer: {
      // marginTop: 20,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   },
   selectedDateText: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   selectedText: {
      fontWeight: 'bold',
      color: 'red',
   },
   text: {
      fontSize: 18,
      color: 'black'
   },
   textChild: {
      fontSize: 20,
      fontWeight: 'bold'
   }
})