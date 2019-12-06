import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },
    header: {
      marginTop: '15%',
      fontSize: 40,
      color: 'black',
      paddingBottom: 10
    },
    textInputContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      borderColor: 'black',
      borderBottomWidth: 1,
      paddingRight: 10,
      paddingBottom: 10
    },
    textInput: {
      flex: 1,
      height: 20,
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      paddingLeft: 10,
      minHeight: '3%'
    }
  });