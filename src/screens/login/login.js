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
  AsyncStorage,
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
  Cloud,
  User,
  Query
} from 'leancloud-storage'

import {scale, scaleVertical} from '../../utils/scale'
import { randomString } from '../../utils/randomString'
import CountdownView from '../../components/timer'

const theme = RkTheme.current
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


export class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agreedLicence: true,
      smsCode: '',
      phoneNumber: '',
      isPhoneNumberRegister: false,
      isPhoneNumberLegal: true,
      mobilePhoneVerified: false,
      isSmsCodeLegal: false,
      currentUser: '',
      usingSmsCode: false,
      password: '',
      spinnerVisible: false,
      spinnerText: '',
    }
  }

  static navigationOptions = () => ( {
    // headerBackTitle: '修改手机号码',
  })

  async componentDidMount() {
    // TODO: uncomment this
    const phoneNumber = this.props.navigation.getParam('phoneNumber')
    this.setState({phoneNumber})
    this.setState({username: phoneNumber})
    // 组件加载前判断当前手机号是否已经注册
    // const {phoneNumber} = this.state
    let query = new Query('_User')
    const user = await query.equalTo('mobilePhoneNumber', `+86${phoneNumber}`).find()
    // console.log('user', user)
    const isPhoneNumberRegister = user.length === 0 ? false : true
    this.setState({isPhoneNumberRegister})
    if (isPhoneNumberRegister) {
      const mobilePhoneVerified = user[0].get('mobilePhoneVerified')
      this.setState({ mobilePhoneVerified })
    } else {
      // 手机号码未注册，注册
      const user = new User()
      const username = phoneNumber
      // const password = randomString(5)
      const password = phoneNumber
      user.set('username', username)
      user.set('password', password)
      const mobilePhoneVerified = false
      this.setState({ username, password, mobilePhoneVerified })
      user.setMobilePhoneNumber(`+86${phoneNumber}`)
      try {
        await user.signUp()
        console.log('注册成功')
        console.log('登陆成功')
        console.log('user.current', User.current())
      } catch(e) {
        toast(e.message)
        // console.log('注册失败', e)
        // console.log('登陆失败')
      }
    }
  }

  handleChangeSmsCode = smsCode => {
    this.setState({ smsCode })

    // 手机号正则表达式
    const re = /^\d{6}$/
    let isSmsCodeLegal = re.test(smsCode)
    this.setState({ isSmsCodeLegal })
    // console.log('smsCode', smsCode)
    // console.log('isSmsCodeLegal', isSmsCodeLegal)
  }

  login = async () => {
    const {
      isSmsCodeLegal,
      smsCode,
      phoneNumber,
      isPhoneNumberRegister,
      mobilePhoneVerified,
      usingSmsCode,
      username,
      password,
    } = this.state

    const usingPassword = !usingSmsCode
    if (usingPassword) {
      let user = ''
      try {
        const username = phoneNumber
        this.setState({ spinnerVisible: true })
        user = await User.logIn(username, password)
        this.props.navigation.navigate('Profile')
        this.setState({ spinnerVisible: false })
      } catch(e) {
        toast(e.message)
        console.log('login with password', e)
        return
      }
      try {
        await AsyncStorage.setItem('sessionToken', user.getSessionToken())
        console.log('User.getSessionToken()', User.getSessionToken())
      } catch (error) {
        // Error saving data
        console.log('AsyncStorage.setItem error', error)
      }
      return
    }

    const isSmsCodeIllegal = !isSmsCodeLegal
    if (isSmsCodeIllegal) {
      toast('请输入六位验证码')
      return
    }

    if (mobilePhoneVerified) {
      // 已验证手机号码 请求登陆验证码->登陆
      try {
        this.setState({ spinnerVisible: true })
        await User.logInWithMobilePhoneSmsCode(`+86${phoneNumber}`, smsCode)
        this.setState({ spinnerVisible: false })

        console.log('登陆成功')
        console.log('user.current', User.current)
      } catch (e) {
        toast(e.message)
      }
      this.props.navigation.navigate('ProfileScreen')
    } else {
      // 未验证手机号码 在componentDidMount注册临时用户->发送手机号码验证短信->验证 登陆
      if (usingSmsCode) {
        try {
          await User.verifyMobilePhone(smsCode)
          // await Cloud.verifySmsCode(smsCode, `+86${phoneNumber}`)
        } catch (e) {
          toast(e.message)
          return
        }
      }

      try {
        this.setState({ spinnerVisible: true })
        await User.logIn(username, password)
        this.setState({ spinnerVisible: false })
      } catch (e) {
        toast(e.message)
        this.setState({ spinnerVisible: false })
      }
      try {
        await AsyncStorage.setItem('sessionToken', User.getSessionToken())
        console.log('User.getSessionToken()', User.getSessionToken())
      } catch (error) {
        // Error saving data
        console.log('AsyncStorage.setItem error', error)
      }
      // const user = User.current()
      // user.set('mobilePhoneVerified', true)
      // try {
      //   await user.save()
      // } catch(e) {
      //   toast(e.message)
      //   console.log('set mobilePhoneVerified error', e)
      // }

      this.props.navigation.navigate('SetNicknameAndPasswordScreen', {
        username: username,
        password: password,
      })
    }
  }

  shouldStartCountdown = async () => {
    const { phoneNumber, isPhoneNumberRegister, mobilePhoneVerified } = this.state

    // if (isPhoneNumberRegister) {
    if (mobilePhoneVerified) {
      // 已验证手机号码 请求登陆验证码->登陆
      try {
        await User.requestLoginSmsCode(`+86${phoneNumber}`)
      } catch (e) {
        toast(`${e.message}, 请用密码登陆`)
        console.log('注册shouldStartCountdown', e)
        this.setState({ usingSmsCode: false })
      }
    } else {
      // 未验证手机号码 在componentDidMount注册临时用户->发送手机号码验证短信->验证 登陆
      try {
        await User.requestMobilePhoneVerify(`+86${phoneNumber}`)
        // await Cloud.requestSmsCode({
        //   mobilePhoneNumber: `+86${phoneNumber}`,
        //   ttl: 600,
        //   sign: '变电检修室',
        //   template: 'requestMobilePhoneVerify',
        //   name: '变电检修',
        //   app_name: '变电检修app',
        // })
      } catch (e) {
        toast(e.message)
        this.setState({ usingSmsCode: false })
        console.log('未注册shouldStartCountdown', e)
      }
    }
    return false
  }

  handleNetworkFailed = () => alert('network failed');

  render() {
    const {phoneNumber, usingSmsCode, mobilePhoneVerified} = this.state
    const phoneNumberInDisplay = `+86 ${phoneNumber.substr(0, 3)} ${phoneNumber.substr(3, 4)} ${phoneNumber.substr(7, 4)}`

    const SmsComponent = () => (
      <View style={styles.rowRight}>
        <TextInput
          keyboardType='phone-pad'
          maxLength={6}
          style={styles.input}
          placeholder='请输入验证码'
          onChangeText={this.handleChangeSmsCode}
          value={this.state.smsCode}
        />
        <View style={{ alignSelf: 'center' }}>
          <CountdownView
            ref={r => this.countdown = r}
            time={60}
            title="发送验证码"
            overTitle="重新发送"
            style={styles.countdown}
            titleStyle={styles.countdownTitle}
            countingTitleTemplate="发送中({time})"
            countingStyle={styles.countingdown}
            countingTitleStyle={styles.countingTitle}
            shouldStartCountdown={this.shouldStartCountdown}
            onNetworkFailed={this.handleNetworkFailed}
          />
        </View>
      </View>
    )

    const PasswordComponent = () => (
      <View style={styles.rowRight}>
        <TextInput
          style={styles.input}
          placeholder='请输入密码'
          onChangeText={(password) => {this.setState({ password })}}
          value={this.state.password}
        />
      </View>
    )
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <View style={styles.container} >
            <RkText rkType='xxlarge light gray' style={styles.title}>手机号登陆</RkText>
            <View style={styles.form}>
              <View style={styles.formRow}>
                <View style={styles.rowLeft}>
                  <RkText rkType='small light'>手机号</RkText>
                </View>
                <View style={styles.rowRight}>
                  <RkText rkType='small light' style={{ alignSelf: 'center' }}>{phoneNumberInDisplay}</RkText>
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.rowLeft}>
                  <RkText rkType='small light'>
                    {usingSmsCode ? '验证码' : '密码'}
                  </RkText>
                </View>
                { usingSmsCode ?  SmsComponent() : PasswordComponent() } 
              </View>
            </View>
            <View style={styles.licence}>
              <View style={styles.textRow}>
                {
                  this.state.mobilePhoneVerified &&
                  <RkButton rkType='clear'>
                    <RkText
                      rkType='small'
                      style={{ color: theme.colors.button.primary }}
                      onPress={() => {
                        // TODO:
                        this.setState({ usingSmsCode: !usingSmsCode })
                      }}
                    >
                      {usingSmsCode ? '用密码登陆' : '用手机验证码登陆'}
                    </RkText>
                  </RkButton>
                }
              </View>
            </View>
            <View style={{ marginTop: scaleVertical(30), alignItems: 'stretch' }}>
              <RkButton
                onPress={this.login}
                rkType='stretch'
                style={this.state.agreedLicence ? styles.button : { ...styles.button, backgroundColor: theme.colors.button.disabled }}
                text='LOGIN'
                disabled={!this.state.agreedLicence}
              >
                <RkText rkType='base light' style={{ color: 'white' }}>登陆</RkText>
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
