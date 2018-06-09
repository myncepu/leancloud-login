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
  // Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native'
import {
  RkButton,
  RkText,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten'
import Toast from 'react-native-root-toast'
import Spinner from 'react-native-loading-spinner-overlay'
import {
  User,
  Query
} from 'leancloud-storage'

import {scale, scaleVertical} from '../../utils/scale'

const theme = RkTheme.current
// console.log('theme', theme)
const fontBaseValue = theme.fonts.sizes.base // base字号为scale(18)

const toast = (msg) => {
  let toast = Toast.show(msg, {
    duration: Toast.durations.LONG,
    position: 0, // 0 will position the toast to the middle of screen
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
  })
  setTimeout(function () {
    Toast.hide(toast)
  }, 2000)
}

export class SetNicknameAndPasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneNumber: '',
      isPhoneNumberLegal: false,
      currentUser: '',
      username: '',
      nickname: '',
      oldPassword: '',
      password1: '',
      password2: '',
      isLogin: false,
      spinnerVisible: false,
      spinnerText: '',
    }
  }

  static navigationOptions = () => ( {
    // headerBackTitle: '修改手机号码',
  })

  async componentDidMount() {
    // TODO: uncomment this
    // let username = this.props.navigation.getParam('username')
    // const oldPassword = this.props.navigation.getParam('password')
    // this.setState({username, oldPassword})
  }

  handleChangePhoneNumber = (phoneNumber) => {
    // 手机号正则表达式
    const re = /^1[34578]\d{9}$/
    const isPhoneNumberLegal = re.test(phoneNumber)
    const username = phoneNumber
    this.setState({ isPhoneNumberLegal, username, phoneNumber })
  }

  login = async () => {
    // TODO: change let to const
    let {
      username,
      phoneNumber,
      isPhoneNumberLegal,
      password1,
      password2,
      oldPassword,
      nickname,
    } = this.state

    if (phoneNumber.length === 0) {
      toast('手机号码不能为空')
      return
    }

    const isPhoneNumberIllegal = !isPhoneNumberLegal
    if (isPhoneNumberIllegal) {
      toast('请检查手机号码')
      return
    }

    if (password1.length === 0 || password2.length === 0) {
      toast('密码不能为空')
      return
    }

    if (password1 !== password2) {
      toast('两次输入的密码不同，请重试')
      return
    }

    let query = new Query('_User')
    this.setState({ spinnerVisible: true, spinnerText: '' })
    const existingUser = await query.equalTo('mobilePhoneNumber', `+86${phoneNumber}`).find()
    this.setState({ spinnerVisible: false })
    if (existingUser.length > 0) {
      toast('该手机号码已经注册，您可以直接登陆或者找回密码')
      return
    }

    let user = new User()
    user.setUsername(username)
    user.setPassword(password1)
    let currentUser = ''
    try {
      this.setState({ spinnerVisible: true, spinnerText: '注册中' })
      currentUser = await user.signUp()
      this.setState({ spinnerVisible: false })
      console.log('登陆成功', currentUser)
    } catch(e) {
      toast(e.message)
      console.log('login error', e)
      return
    }

    // console.log('user', user)
    // user.set('nickname', nickname)
    // try {
    //   currentUser = await user.save()
    //   console.log('nickname修改成功', currentUser)
    // } catch(e) {
    //   toast(e.message)
    //   console.log('login error', e)
    //   return
    // }

    // const currentUser = User.current()
    // try {
    //   const authenticated = await currentUser.isAuthenticated()
    //   console.log('authenticated', authenticated)
    // } catch(e) {
    //   toast(e.message)
    //   console.log('currentUser isAuthenticated error', e)
    // }
    // console.log('currentUser', currentUser)
    // const sessionToken = currentUser._sessionToken
    // console.log('sessionToken', sessionToken)
    // try {
    //   await currentUser.updatePassword(oldPassword, password1, {
    //     sessionToken
    //   })
    //   toast('密码修改成功')
    // } catch(e) {
    //   toast(e.message)
    //   console.log('updatePassword', e)
    // }
  }

  render() {
    const PasswordComponent = (idx) => (
      <View style={styles.rowRight}>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder={idx === 1 ? '请输入密码' : '请再次输入密码'}
          onChangeText={(password) => {this.setState({ [`password${idx}`]: password })}}
          value={this.state[`password${idx}`]}
        />
      </View>
    )
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <View style={styles.container} >
            <RkText rkType='xxlarge light gray' style={styles.title}>注册账号</RkText>
            <View style={styles.form}>
              <View style={styles.formRow}>
                <View style={styles.rowLeft}>
                  <RkText rkType='small light'>手机号码</RkText>
                </View>
                <View style={styles.rowRight}>
                  <TextInput
                    style={styles.input}
                    placeholder='请输入手机号码'
                    onChangeText={this.handleChangePhoneNumber}
                    value={this.state.password}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.rowLeft}>
                  <RkText rkType='small light'>
                    密码
                  </RkText>
                </View>
                {PasswordComponent(1)}
              </View>

              <View style={styles.formRow}>
                <View style={styles.rowLeft}>
                  <RkText rkType='small light'>
                    确认密码
                  </RkText>
                </View>
                {PasswordComponent(2)}
              </View>
            </View>
            <View style={{ marginTop: scaleVertical(50), alignItems: 'stretch' }}>
              <RkButton
                onPress={this.login}
                rkType='stretch'
                style={styles.button}
              >
                <RkText rkType='base light' style={{ color: 'white' }}>注册</RkText>
              </RkButton>
              <RkButton
                onPress={this.login}
                rkType='stretch outline'
                style={styles.button}
              >
                <RkText rkType='base light' style={{ color: theme.colors.button.primary }}>登陆</RkText>
              </RkButton>
            </View>
          </View>
          <View style={styles.footer}>
            <RkText rkType='xsmall light' style={{ color: theme.colors.text.gray }}>Copyright {'\u00A9'} 2018 国网太原供电公司 变电检修室. All Rights Reserved.</RkText>
          </View>
          <Spinner
            visible={this.state.spinnerVisible}
            textContent={this.state.spinnerText}
            textStyle={{color: '#FFF'}}
          />
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
    paddingHorizontal: scale(20),
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
    height: fontBaseValue * 3, // 参考h5字号为scale(16)
    marginVertical: fontBaseValue * 1,
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
  countdown: {
    borderRadius: 5,
    borderColor: 'black',
    width: fontBaseValue * 5,
    backgroundColor: 'transparent',
  },
  countingdown: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
  },
  countdownTitle: {color: 'black'},
  countingTitle: {color: '#ccc'}
}))
