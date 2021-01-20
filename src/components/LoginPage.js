import React from 'react';
import { View, Context, Alert, Text, TextInput, Button} from "react-native";

const ACCOUNTS = [
    {
      'username': 'mushkie',
      'password': 'lentil'
    },
    {
      'username': 'admin',
      'password': 'allin1ship'
    },
    {
      'username': 'driver_1',
      'password': '123'
    },
    {
      'username': 'driver_2',
      'password': '123'
    }
  ]
  
class LoginPage extends React.Component {
    state = {
      username: '',
      password: ''
    };
  
    static contextType = Context;
  
    onButtonPress = () => {
      if (ACCOUNTS.find(account => account.username === this.state.username.toLowerCase() && account.password === this.state.password)) {
        this.context.updateUsername(this.state.username.toLowerCase())
        this.props.history.push('/welcome')
      } else{
        Alert.alert('error', 'your username or password were incorrect. please try again')
      }
    }
  
    render() {
      return (
        <View style={styles.container}>
          <Text style={{fontWeight: 'bold', bottom: 50}}>Login Page</Text>
         
          <Text>Username:</Text>
          <TextInput
          value={this.state.username}
          onChangeText={(text) => this.setState({username: text})}
          style={{width: 100, borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5}}>
          </TextInput>
          <Text>Password:</Text>
          <TextInput
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(text) => this.setState({password: text})}
          style={{width: 100 , borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 5}}>
          </TextInput>
          <Button
            title="sign me in! (brings to welcome page)"
            onPress={this.onButtonPress}
          /> 
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EBC52A',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#020670',
    }
  });
  //how to set buttons style? need to use touchableopacity?
  export default LoginPage;