/*
 * login.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import {
  RkButton,
  RkText,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CheckBox } from 'react-native-elements'
import Toast from 'react-native-root-toast'
import {scale, scaleVertical} from '../../utils/scale'

const theme = RkTheme.current
const fontBaseValue = theme.fonts.sizes.base // base字号为scale(18)

export class GetPhoneNumberScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agreedLicence: true,
      phoneNumber: '',
      isPhoneNumberLegal: false,
    }
  }

  static navigationOptions = {
    title: '生产日志系统登陆',
    headerBackTitle: '修改手机号码',
  }

  handleChangePhoneNumber = phoneNumber => {
    this.setState({ phoneNumber })

    // 手机号正则表达式
    const re = /^1[34578]\d{9}$/
    let isPhoneNumberLegal = re.test(phoneNumber)
    this.setState({ isPhoneNumberLegal })
  }
  next = () => {
    const { isPhoneNumberLegal } = this.state
    const isPhoneNumberIllegal = !isPhoneNumberLegal
    if (isPhoneNumberIllegal) {
      let toast = Toast.show('请输入正确的手机号', {
        duration: Toast.durations.LONG,
        position: 0, // 0 will position the toast to the middle of screen
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
        // backgroundColor: '#E9E9E9',
        // textColor: 'black',
      })
      setTimeout(function () {
        Toast.hide(toast)
      }, 1000)
      return
    }
    this.props.navigation.navigate('Login', {
      phoneNumber: this.state.phoneNumber,
    })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <View style={styles.container} >
            <RkText rkType='xxlarge light gray' style={styles.title}>手机号登陆</RkText>
            <View style={styles.form}>
              <View style={styles.formRow}>
                <View style={styles.rowLeft}>
                  <RkText rkType='small light'>国家/地区</RkText>
                </View>
                <View style={styles.rowRight}>
                  <RkButton
                    rkType='clear'
                    style={styles.region}
                    onPress={() => Alert.alert(
                      '提示',
                      '暂不支持更改 国家/地区',
                      [ {text: '确认', onPress: () => null}, ],
                    )}
                  >
                    <RkText rkType='small light'>中国</RkText>
                    <Icon name='chevron-right' size={fontBaseValue * 1.5} color='gray'></Icon>
                  </RkButton>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.rowLeft}>
                  <RkText rkType='small light'>+86</RkText>
                </View>
                <View style={styles.rowRight}>
                  <TextInput
                    keyboardType='phone-pad'
                    maxLength={11}
                    style={styles.input}
                    placeholder='请输入手机号码'
                    onChangeText={this.handleChangePhoneNumber}
                    value={this.state.phoneNumber}
                  />
                </View>
              </View>
            </View>
            <View style={styles.licence}>
              <CheckBox
                left
                size={scale(15)}
                containerStyle={styles.checkbox}
                textStyle={{ width: 0 }}
                checkedIcon='check-square-o'
                uncheckedIcon='square-o'
                checkedColor={theme.colors.button.highlight}
                checked={this.state.agreedLicence}
                onPress={() => this.setState({agreedLicence: !this.state.agreedLicence})}
              />
              <View style={styles.textRow}>
                <RkText rkType='xsmall light' style={{ color: theme.colors.text.gray }}>已阅读并同意</RkText>
                <RkButton rkType='clear'>
                  <RkText
                    rkType='xsmall'
                    style={{ color: theme.colors.button.primary }}
                    onPress={() => {
                      // TODO: navigate到协议页
                    }}
                  >
                    《相关条款》
                  </RkText>
                </RkButton>
              </View>
            </View>
            <View style={{ alignItems: 'stretch' }}>
              <RkButton
                onPress={this.next}
                rkType='stretch'
                style={this.state.agreedLicence ? styles.button : { ...styles.button, backgroundColor: theme.colors.button.disabled }}
                text='LOGIN'
                disabled={!this.state.agreedLicence}
              >
                <RkText rkType='base light' style={{ color: 'white' }}>下一步</RkText>
              </RkButton>
            </View>
          </View>
          <View style={styles.footer}>
            <RkText rkType='xsmall light' style={{ color: theme.colors.text.gray }}>Copyright {'\u00A9'} 2018 国网太原供电公司 变电检修室. All Rights Reserved.</RkText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base,
  },
  checkbox: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
    backgroundColor: theme.colors.screen.base,
    width: scale(15),
  },
  title: {
    alignSelf: 'flex-start',
    color: theme.colors.text.gray,
  },
  container: {
    // TODO: paddingTop(StatusBar高度)之后由navBar负责
    // paddingTop: UIConstants.StatusbarHeight,
    paddingTop: scaleVertical(80),
    paddingHorizontal: scale(30),
    paddingBottom: scaleVertical(22),
    alignSelf: 'stretch',
    // TODO: 为什么加了maxLength之后ipad container无法居中？
    // maxWidth: fontBaseValue * 30,
  },
  form: {
    alignItems: 'center',
    marginTop: scaleVertical(30),
    borderRadius: scale(5),
    borderColor: '#f2f2f2',
    backgroundColor: 'white',
  },
  formRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#f2f2f2',
    height: fontBaseValue * 3,
  },
  rowLeft: {
    flex: 2.2,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowRight: {
    flex: 5,
    paddingHorizontal: scale(10),
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontSize: theme.fonts.sizes.small,
  },
  licence: {
    paddingTop: scaleVertical(30),
    flexDirection: 'row',
  },
  footer: {
    justifyContent: 'flex-end',
    marginBottom: scaleVertical(20),
    flex: 1
  },
  button: {
    height: fontBaseValue * 3.5, // 参考h5字号为scale(16)
    marginVertical: fontBaseValue * 0.5,
    alignSelf: 'stretch',
  },
  textRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  region: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))
