import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width:'100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  header: {
    marginTop: '5%',
    fontSize: 40,
    color: 'black',
    paddingBottom: 10
  },
  subheader: {
    marginTop: '2%',
    fontSize: 20,
    color: 'black',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    // borderColor: 'black',
    // borderBottomWidth: 1,
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
  },
  sideTitle: {
    fontSize: 20,
    width: 100,
    marginRight: '1%',
    marginLeft: '1%'
  },
  delete: {
    fontSize: 20,
    margin: '2%'
  },
  addButton: {
    width: '100%',
    marginTop: '10%',
    paddingBottom: 20,
    // borderColor: '#aaaaaa',
    // borderBottomWidth: 1.5,
  },
  colorPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    marginBottom: '5%'
  },
  deleteButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '5%',
    marginBottom: '5%'
  },
  doneButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '5%',
    marginBottom: '5%'
  }
});