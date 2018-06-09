/*
 * changeNickname.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
} from 'react-native'
import {User} from 'leancloud-storage'

export class ProfileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
    }
  }

  async componentDidMount() {
    const sessionToken = await AsyncStorage.getItem('sessionToken')
    const user = await User.become(sessionToken)
    this.setState({ username: user.getUsername() })
  }
  render() {
    return (
      <View>
        <Text>
          欢迎来到
        </Text>
        <Text>
          {this.state.username}
        </Text>
      </View>
    )
  }
}
