/*
 * leanStorageTest.js
 * Copyright (C) 2018 yanpengqiang <yan2010@live.com>
 *
 * Distributed under terms of the MIT license.
 */
import AV from 'leancloud-storage'

// LeanCloud - 注册
// https://leancloud.cn/docs/leanstorage_guide-js.html#注册
// export const signUp = async () => {
export const signUp = async () => {
  let user = new AV.User()
  user.setUsername('yan')
  user.setPassword('yan')
  user.setEmail('yan@yan.com')
  try {
    const userInCloud = await user.signUp()
    user = userInCloud
  } catch(e) {
    console.log('error', e)
  }
}

export const logIn = () => {
  AV.User.logIn('yan', 'yan').then(function (loginedUser) {
    // 登录成功，跳转到商品 list 页面
    console.log(loginedUser)
  }, function (error) {
    alert(JSON.stringify(error))
  })
}

export const newRestaurant = function newRestaurant(restaurantData) {
  let name = restaurantData.name || ''
  if (name == '') {
    throw new Error('餐厅必须得有个名字吧，😜')
  }
  let id = restaurantData.id || ''
  let restaurant = new AV.Object('Restaurant')
  restaurant.set('name', name)
  restaurant.set('id', id)
  return restaurant.save()
}

export const newSeat = function newSeat(seatData) {
  let restaurant = seatData.restaurant
  if (restaurant == undefined) throw new Error('一个座位必须属于一个餐厅啊，亲 🏚')
  let capacity = seatData.capacity || 1
  let seat = new AV.Object('Seat')
  let id = seatData.id || ''
  seat.set('under', restaurant)
  seat.set('id', id)
  seat.set('capacity', capacity)

  return seat.save()
}

export const newBooking = function newBooking(bookingtData) {
  let seat = bookingtData.seat
  if(typeof seat === 'undefined') throw new Error('订座位的时候一定要指定座位...')
  let from = bookingtData.from
  if(typeof from === 'undefined') throw new Error('订座位的时候一定要指定预订起始时间') 
  let to = bookingtData.to
  if(typeof to === 'undefined') throw new Error('订座位的时候一定要指定就餐结束的时间')

  let booking = new AV.Object('Booking')
  booking.set('seat',seat)
  booking.set('from',from)
  booking.set('to',to)

  return booking.save()
}
// 调用代码如下:

export const leanStorageTest = async () => {
}
