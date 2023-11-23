import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native'

const SysModal = ({ Message, Visible, onHide }) => {
   return (
      //visible= true login hien , tranparent =true sysmodal trong suot
      <Modal visible={Visible} transparent={true}>
         <View style={styles.background}>
            <View style={styles.component}>
               {/* Header */}
               <View style={styles.header}>
                  <Text style={styles.message}>THÔNG BÁO</Text>
               </View>

               {/* body */}
               <View>
                  <Text style={{
                     fontSize: 16,
                     textAlign:'center'
                  }}>{Message}</Text>
               </View>

               {/* footer */}
               <TouchableOpacity
                  style={styles.footer}
                  activeOpacity={0.5}
                  onPress={onHide}
               >
                  <Text style={{
                     fontSize: 18,
                     color: "white",
                     textAlign:'center'
                  }}>OK</Text>
               </TouchableOpacity>
            </View>
         </View>
      </Modal>
   )
}

export default SysModal

const styles = StyleSheet.create({
   background: {
      flex: 1,
      backgroundColor: 'rgba(00,00,00,.5)', //trong suot 50%
      justifyContent: 'center',
      alignItems: 'center'
   },
   component: {
      width: '90%',
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: 'center',
   },
   header: {
      paddingBottom: 15
   },
   body: {

   },
   footer: {
      width: '30%',
      backgroundColor: 'orange',
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 20,
      marginTop: 15
   },
   message: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'orange'
   }
})