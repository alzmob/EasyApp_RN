import React, { Component } from "react";
import {
  StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, Image, Modal, ScrollView, Alert
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Textarea, Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

const url = "http://localhost:5000/"
const logo = require("./image/logo.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      firstName: "",
      surName: "",
      email: "",
      phoneNumber: "",
      requestType: "",
      description: "",
      is_description_empty: false,
      modalVisible: false,
      visible: false,
      requestType_array: null
    }
    this.DochangeCompany=this.DochangeCompany.bind(this);
    this.DochangeFirstName=this.DochangeFirstName.bind(this);
    this.DochangeSurName=this.DochangeSurName.bind(this);
    this.DochangeEmail=this.DochangeEmail.bind(this);
    this.DochangePhoneNumber=this.DochangePhoneNumber.bind(this);
  }

  DochangeCompany(value) {
    this.setState({company: value})
  }
  DochangeFirstName(value) {
    this.setState({firstName: value})
  }
  DochangeSurName(value) {
    this.setState({surName: value})
  }
  DochangeEmail(value) {
    this.setState({email: value})
  }
  DochangePhoneNumber(value) {
    this.setState({phoneNumber: value})
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  clickType(type) {
    this.setState({requestType: type})
    this.setModalVisible(false)
  }

  showRequestTypes() {
    if (this.state.requestType_array != null) {
      var i=-1;
      return this.state.requestType_array.map((data) => {
        i++;
        return (
          <TouchableOpacity key={i} style={{margin:10}} onPress={() => this.clickType(data.type)}>
            <Text style={{fontSize:15}}>{data.type}</Text>
          </TouchableOpacity>
        )
      })
    }
  }

  onChangeDescription(description) {
    this.setState({description: description})
    if (description == "") {
      this.setState({is_description_empty: true})
    } else {
      this.setState({is_description_empty: false})
    }
  }

  onFocus() {
    if (this.state.description == "") {
      this.setState({is_description_empty : true})
    }
  }

  clickSendBtn() {
    var data = {
      "company": this.state.company,
      "firstName": this.state.firstName,
      "surName": this.state.surName,
      "email": this.state.email,
      "phoneNumber": this.state.phoneNumber,
      "requestType": this.state.requestType,
      "description": this.state.description
    }
    

    if (this.state.company=="" || this.state.firstName=="" || this.state.surName=="" ||this.state.email=="" || this.state.phoneNumber=="" || this.state.requestType=="" || this.state.description=="") {
      Alert.alert("Please fill all fields.")
    } else {
      let email_valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      if(email_valid.test(this.state.email) === false) {
        Alert.alert("Invalid email.")
      } else {
        this.setState({visible: true})

        var self=this;
        var temp=url + 'notes'
        fetch(temp, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            company: this.state.company,
            firstName: this.state.firstName,
            surName: this.state.surName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            requestType: this.state.requestType,
            description: this.state.description
          })
        })
        .then((response) => response.json())
        .then((responseData) => {
          console.log('Response====', responseData)
          if (responseData.message == "success") {
            Alert.alert("Saved to database successfully")
            this.clickClearBtn()
          } else {
            Alert.alert("Failed to save. Please try later")
          }
          setTimeout(function(){
            self.setState({visible: false})
          }, 500);
        })
      }
    }
  }

  clickClearBtn() {
    this.setState({company:"", firstName:"", surName:"", email:"", phoneNumber:"", requestType:"", description:"", is_description_empty: false})
    this.textInput1.clear()
    this.textInput2.clear()
    this.textInput3.clear()
    this.textInput4.clear()
    this.textInput5.clear()
  }

  get_types() {
    this.setModalVisible(true)
    this.setState({visible: true})

    var self=this;
    var temp=url + 'types'
    fetch(temp, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({requestType_array: responseData.allTypes})
      setTimeout(function(){
        self.setState({visible: false})
      }, 500);
    })
  }


  render () {
    return (
      <Container>
        <Content style={{alignSelf:'center', flex:1}} showsVerticalScrollIndicator={false} >
          <Image source={logo} style={styles.logoStyle} />
          <TextInputComponent ref={input1 => { this.textInput1 = input1 }}  holdText="Company" keyboardType="default" autoCapitalize="words" maxLength={100} changeText={this.DochangeCompany} />
          <TextInputComponent ref={input2 => { this.textInput2 = input2 }} holdText="First Name" keyboardType="default" autoCapitalize="words" maxLength={100} changeText={this.DochangeFirstName} />
          <TextInputComponent ref={input3 => { this.textInput3 = input3 }} holdText="Sur Name" keyboardType="default" autoCapitalize="words" maxLength={100} changeText={this.DochangeSurName} />
          <TextInputComponent ref={input4 => { this.textInput4 = input4 }} holdText="Email" keyboardType="email-address" autoCapitalize="none" maxLength={100} changeText={this.DochangeEmail} />
          <TextInputComponent ref={input5 => { this.textInput5 = input5 }} holdText="Phone Number" keyboardType="number-pad" autoCapitalize="none" maxLength={20} changeText={this.DochangePhoneNumber} />

          <TouchableOpacity style={styles.requestTypeStyle} onPress={() => this.get_types()}>
            <Text>{this.state.requestType=="" ? "Request Type" : this.state.requestType}</Text>
          </TouchableOpacity>

          <Textarea style={this.state.is_description_empty? styles.errorTextareaStyle: styles.textareaStyle} clearButtonMode="while-editing" rowSpan={5} bordered placeholder="Description" maxLength={2000} value={this.state.description} onFocus={() => this.onFocus()} onChangeText={description => this.onChangeDescription(description)} />


          <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical: deviceHeight*0.05}}>
            <TouchableOpacity style={styles.btnStyle} onPress={() => this.clickClearBtn()}>
              <Text>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnStyle} onPress={() => this.clickSendBtn()}>
              <Text>Send</Text>
            </TouchableOpacity>
          </View>


          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => this.setModalVisible(false)}
          >
            <Spinner visible={this.state.visible} overlayColor='rgba(0,0,0,0.3)' />

            <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize:17, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30, marginTop:deviceHeight*0.04}}>Request Types</Text>
              <TouchableOpacity style={{marginRight:deviceWidth/30, marginTop:deviceHeight*0.04}} onPress={() => this.setModalVisible(false)}>
                  <Text style={{fontSize:14, fontWeight:'600', color:'#4f70ca'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={{margin:deviceWidth/30}}>
                {this.showRequestTypes()}
              </View>
            </ScrollView>

          </Modal>

        </Content>
      </Container>
    );
  }
};


class TextInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      is_empty: false
    }
  }

  changeText(value) {
    this.props.changeText(value)
    this.setState({value});
    if (value == "") {
      this.setState({is_empty: true})
    } else {
      this.setState({is_empty: false})
    }
  }

  clear() {
    this.setState({value:""})
    this.setState({is_empty: false})
  }

  onFocus() {
    if (this.state.value == "") {
      this.setState({is_empty: true})
    }
  }

  render () {
    return (
      <TextInput clearButtonMode="while-editing" underlineColorAndroid='rgba(0,0,0,0)' style={this.state.is_empty?styles.errorTextInputStyle : styles.textInputStyle} placeholder={this.props.holdText} placeholderTextColor="rgba(0,0,0,0.6)" keyboardType = {this.props.keyboardType} autoCapitalize = {this.props.autoCapitalize} value = {this.state.value} underlineColorAndroid='transparent' maxLength={this.props.maxLength} onFocus={() => this.onFocus()}
      onChangeText={this.changeText.bind(this)}/>
      );
  }
};


const styles = StyleSheet.create({
  logoStyle : {
    width : deviceWidth*0.15,
    height: deviceWidth*0.15*196/257,
    marginTop: deviceHeight*0.05,
    marginBottom: deviceHeight*0.1
  },
  textInputStyle: {
    height:deviceHeight/15, 
    width:deviceWidth*10/12, 
    paddingLeft:deviceWidth/30, 
    backgroundColor:'#fff', 
    marginVertical:10,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)'
  },
  errorTextInputStyle: {
    height:deviceHeight/15, 
    width:deviceWidth*10/12, 
    paddingLeft:deviceWidth/30, 
    backgroundColor:'#fff', 
    marginVertical:10,
    borderWidth:1,
    borderColor:'rgba(255,0,0,0.9)'
  },
  textareaStyle: {
    width:deviceWidth*10/12, 
    marginTop: 10,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)'
  },
  errorTextareaStyle: {
    marginTop: 10,
    width:deviceWidth*10/12, 
    borderWidth:1,
    borderColor:'rgba(255,0,0,0.9)'
  },
  btnStyle: {
    backgroundColor:'rgba(0,0,0,0.3)',
    alignItems:'center',
    justifyContent:'center',
    width:deviceWidth*0.4,
    height:deviceHeight*0.06,
    
  },
  requestTypeStyle: {
    height:deviceHeight/15, 
    width:deviceWidth*10/12,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    justifyContent: 'center',
    marginVertical: 10,
  }
});
