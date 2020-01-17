import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    alignContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  listContainer: {
    flex: 1,
    marginTop: '5%',
    flexDirection: 'row',
    borderColor: '#aaaaaa',
    // borderBottomWidth: 1.5,
    width: '100%',
    alignItems: 'flex-start',
    padding: 10,
    minHeight: 40
  },
  listItem: {
    paddingLeft: 5,
    marginTop: 6,
    fontSize: 15,
    color: 'black'
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
  verticalLine: {
    borderBottomColor: 'green',
    borderBottomWidth: 4,
    marginLeft: 10,
    width: '100%',
    position: 'absolute',
    marginTop: 15,
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
    width: '80%',
    marginTop: '5%',
    paddingBottom: 20,
    // borderColor: '#aaaaaa',
    // borderBottomWidth: 1.5,
  },
  runningTimer : {
    
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
  },
  counter: {
    marginTop: '5%',
    fontSize: 70,
    color: 'black',
    paddingBottom: 10
  },
  moodContainer: {
    maxWidth:500,
    marginTop: '5%',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    minHeight: 60
  },
  energyBar: {
    width: '80%',
    marginBottom: '5%',
    marginTop: '5%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  card: {
    width : '100%',
    display: 'flex',
    flexWrap: 'wrap',
    marginRight: -14,
    marginBottom: -14,
},
});