import React, { Component } from 'react'
import {
  View
} from 'react-native'
import {
  createStackNavigator
} from 'react-navigation'
import {AppLoading, Font} from 'expo'
import * as Screens from './screens'
import {bootstrap} from './config/bootstrap'
import {KittenTheme} from './config/theme'

bootstrap()

const KittenApp = createStackNavigator({
  First: {
    screen: Screens.LoginScreen,
  },
}, {
  navigationOptions: {
    headerMode: 'screen',
    headerTintColor: KittenTheme.colors.text.inverse,
    headerStyle: {
      backgroundColor: KittenTheme.colors.primary,
    }
  },
})

class App extends Component {
  state = {
    loaded: false
  };

  componentWillMount() {
    this._loadAssets()
  }

  _loadAssets = async() => {
    await Font.loadAsync({
      'fontawesome': require('./assets/fonts/fontawesome.ttf'),
      'icomoon': require('./assets/fonts/icomoon.ttf'),
      'Righteous-Regular': require('./assets/fonts/Righteous-Regular.ttf'),
      'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
    })
    this.setState({loaded: true})
  };

  render() {
    if (!this.state.loaded) {
      return <AppLoading />
    }

    return (
      // <KittenApp
      //   onNavigationStateChange={(prevState, currentState) => {
      //     // TODO: 之后可以在这儿集成页面访问统计
      //     // 可以参考 kittenTricks/app/app.js
      //   }}
      // />
      <View style={{flex: 1}}>
        <KittenApp />
      </View>
    )
  }
}

export default App
