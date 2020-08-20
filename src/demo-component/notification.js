
import React from 'react'
import { store } from 'react-notifications-component'

let _this
class Notification extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.store = store
  }

  notify (title, msj, type, time) {
    _this.store.addNotification({
      title: title,
      message: msj,
      type: type, // danger, success
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: {
        duration: time || 2500,
        onScreen: true
      },
      slidingExit: {
        duration: 100,
        timingFunction: 'ease-out',
        delay: 0
      }
    })
  }
}
export default Notification
