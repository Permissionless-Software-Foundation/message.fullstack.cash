import React from 'react'
import Helmet from 'react-helmet'
import {
  Box, SimpleTable, Inputs, Button
} from 'adminlte-2-react'
import PropTypes from 'prop-types'

import ReactNotification from 'react-notifications-component'

import 'react-notifications-component/dist/theme.css'
import './read.css'

const { Text } = Inputs

const columns = [
  { data: 'select' },
  { data: 'name' },
  { data: 'subject' },
  { data: 'time' }

]

const maxMailRender = 10
let _this
class ReadMessage extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      inboxData: [],
      selectedList: [],
      pages: [],
      pagination: '',
      selectedPage: 1,
      allSelected: false
    }
  }

  render () {
    return (
      <div className=''>
        <ReactNotification />

        <Helmet
          title='IPFS Messages for BCH | FullStack.cash'
          meta={[
            { name: 'description', content: 'Pay BCH to send messages' },
            { name: 'keywords', content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages' }
          ]}
        />
        <Box border className='inbox-card'>
          <div className='inbox-header'>
            <p>Inbox</p>
            <div className='inbox-search'>
              <Text
                placeholder='Search Mail'
                labelPosition='none'
                iconRight='fas-search'
                size='md'
              />
            </div>
          </div>
          <div className='inbox-inputs'>

            <div className='inbox-control'>
              <Button
                className='btn-icon-add'
                icon='fa-trash'
              />
              <Button
                className='btn-icon-add'
                icon='fa-reply'
              />
              <Button
                className='btn-icon-add'
                icon='fa-share'
              />
              <Button
                className='btn-icon-add'
                icon='fa-sync-alt'
              />
            </div>
            <div clas='inbox-pagination'>
              <span className='pagination-info'>
                {`${(_this.state.selectedPage * maxMailRender) - (maxMailRender - 1)} - ${_this.state.selectedPage * maxMailRender} / ${_this.state.inboxData.length}`}
              </span>
              <Button
                className='btn-icon-add'
                icon='fa-chevron-left'
                onClick={() => _this.changePage(_this.state.selectedPage - 1)}
                disabled={_this.state.selectedPage === 1}
              />
              <Button
                className='btn-icon-add'
                icon='fa-chevron-right'
                onClick={() => _this.changePage(_this.state.selectedPage + 1)}
                disabled={_this.state.selectedPage === _this.state.pagesAmount}
              />
            </div>
          </div>
          <SimpleTable columns={columns} data={_this.state.pages[_this.state.selectedPage - 1]} />
        </Box>

      </div>
    )
  }

  componentDidMount () {
    _this.populateInbox()
  }

  handleSelectedMessage (msg) {
    _this.props.hanldeOnReadMessage(msg)
  }

  populateInbox () {
    try {
      // This is a test array with test data
      const messageResponse = []
      // Populating the array with fake data
      for (let i = 0; i < 250; i++) {
        const data = {
          id: i,
          time: ' 20 mins Ago',
          name: `Sender ${i + 1}`,
          subject: `Test Subject ${i + 1}`,
          email: `sender${i + 1}@example.com`,
          message: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        `
        }
        messageResponse.push(data)
      }

      const inboxData = []
      const selectedList = []
      // Processing the data to create the data table
      messageResponse.map((val, i) => {
        const col = _this.getColData(val, i)
        inboxData.push(col)
        selectedList.push(false)
      })

      // Updating state
      _this.setState({
        inboxData,
        selectedList
      })
      // Calculates the total page quantity
      _this.handlePagination(inboxData)
    } catch (error) {
      console.error(error)
    }
  }

  // Creates and return a column of the table
  getColData (message, i) {
    try {
      let shortMsg = ''

      if (message.subject.length < 50) {
        shortMsg = message.message.slice(0, 60 - message.subject.length)
      }

      const col = {
        select:
  <input
    className='inbox-checkbox'
    type='checkbox'
    checked={_this.state.selectedList[i]}
    onChange={() => _this.selectMail(i)}
  />,
        name: <a className='inbox-sender' onClick={() => _this.handleSelectedMessage(message)}>{message.name}</a>,
        subject: <span><b>{message.subject}</b> - {shortMsg}</span>,
        time: message.time
      }
      return col
    } catch (error) {
      console.error(error)
    }
  }

  selectMail (i) {
    try {
      const list = _this.state.selectedList
      list[i] = !list[i]
      _this.setState({
        selectedList: list
      })
    } catch (error) {
      console.error(error)
    }
  }

  handlePagination (inboxData) {
    const pages = []
    let pagesAmount = 0
    if (inboxData.length <= maxMailRender) {
      pages.push(inboxData)
    } else {
      for (let i = 0; i < inboxData.length; i = i + maxMailRender) {
        const page = inboxData.slice(i, i + maxMailRender)
        pages.push(page)
        pagesAmount++
      }
    }

    _this.setState({
      pages,
      pagesAmount
    })
  }

  changePage (i) {
    console.log(i)
    if (!i) {
      return
    }
    _this.setState({
      selectedPage: i
    })
    setTimeout(() => {
      console.log(_this.state)
    }, 1000)
  }
}

ReadMessage.propTypes = {
  hanldeOnReadMessage: PropTypes.func.isRequired
}
export default ReadMessage
