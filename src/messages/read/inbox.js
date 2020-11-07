import React from 'react'
import Helmet from 'react-helmet'
import { Box, SimpleTable, Inputs, Button } from 'adminlte-2-react'
import PropTypes from 'prop-types'

import ReactNotification from 'react-notifications-component'

import 'react-notifications-component/dist/theme.css'
import './read.css'

const { Text } = Inputs

const columns =
  window.innerWidth > 600
    ? [
      { data: 'select' },
      { data: 'name' },
      { data: 'subject' },
      { data: 'time' }
    ]
    : [
      { data: 'select' },
      { data: 'name' },
      { title: ' ', data: 'subject', width: '35%' }
    ]

// Maximum emails rendered per page view
const maxMailRender = 20
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
      allSelected: false,
      messages: [],
      associatedNames: {},
      isLoaded: false,
      section: 'inbox'
    }
  }

  render () {
    return (
      <div className=''>
        <ReactNotification />

        <Helmet
          title='message.FullStack.cash'
          meta={[
            { name: 'description', content: 'Pay BCH to send messages' },
            {
              name: 'keywords',
              content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages'
            }
          ]}
        />
        <Box loaded={_this.state.isLoaded} border className='inbox-card'>
          <div className='inbox-header'>
            <div>
              <Button
                className={_this.state.section === 'inbox' ? 'inbox-send-tab-selected' : 'inbox-send-tab'}
                onClick={() => _this.changeSection('inbox')}
                text='Inbox'
              />
              <Button
                className={_this.state.section === 'sent' ? 'inbox-send-tab-selected' : 'inbox-send-tab'}
                onClick={() => _this.changeSection('sent')}
                text='Sent'
              />
            </div>
            <hr />

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
              <Button className='btn-icon-add' icon='fa-trash' />
              <Button className='btn-icon-add' icon='fa-reply' />
              <Button className='btn-icon-add' icon='fa-share' />
              <Button className='btn-icon-add' icon='fa-sync-alt' />
            </div>
            <div clas='inbox-pagination'>
              <span className='pagination-info'>
                {`${
                  _this.state.selectedPage * maxMailRender - (maxMailRender - 1)
                }
                 - ${
      _this.state.selectedPage * maxMailRender <
                    _this.state.inboxData.length
        ? _this.state.selectedPage * maxMailRender
        : _this.state.inboxData.length
      }
                 / ${_this.state.inboxData.length}`}
              </span>
              <Button
                className='btn-icon-add'
                icon='fa-chevron-left'
                onClick={() => _this.changePage(_this.state.selectedPage - 1)}
                disabled={_this.state.selectedPage <= 1}
              />
              <Button
                className='btn-icon-add'
                icon='fa-chevron-right'
                onClick={() => _this.changePage(_this.state.selectedPage + 1)}
                disabled={_this.state.selectedPage >= _this.state.pagesAmount}
              />
            </div>
          </div>
          {_this.state.isLoaded && (
            <SimpleTable
              columns={columns}
              data={_this.state.pages[_this.state.selectedPage - 1]}
            />
          )}
        </Box>
      </div>
    )
  }

  changeSection (section) {
    _this.props.handleChangeSection(section)
    _this.setState({
      section
    })
  }

  async componentDidUpdate () {
    // Update state
    if (_this.state.messages !== _this.props.messages) {
      const { messages } = _this.props
      // console.log(`messages: ${JSON.stringify(messages, null, 2)}`)
      _this.setState({
        messages
      })
      this.populateInbox(messages)
    }
  }

  handleSelectedMessage (ipfsHash) {
    _this.props.hanldeOnReadMessage(ipfsHash)
  }

  // Parse Date to string
  getReadableDate (timestamp) {
    try {
      const _date = new Date(timestamp * 1000).toISOString().slice(0, 10)
      const _time = new Date(timestamp * 1000).toISOString().slice(11, 19)

      return `${_date}  ${_time}`
    } catch (error) {
      console.error(error)
    }
  }

  async populateInbox (messages) {
    try {
      const { associatedNames } = _this.props

      if (!messages.length) {
        // Updating state
        _this.setState({
          inboxData: [],
          selectedList: [],
          pages: []
        })
        return
      }

      const messagesData = []
      // Set table data
      for (let i = 0; i < messages.length; i++) {
        const value = messages[i]
        const data = {
          id: i,
          time: _this.getReadableDate(value.time),
          name: associatedNames[value.sender] || value.sender,
          subject: value.subject,
          email: value.sender,
          message: '',
          ipfsHash: value.hash
        }
        messagesData.push(data)
      }

      const inboxData = []
      const selectedList = []
      // Processing the data to create the data table
      messagesData.map((val, i) => {
        const col = _this.getColData(val, i)
        inboxData.push(col)
        selectedList.push(false)
      })

      // Updating state
      _this.setState({
        inboxData,
        selectedList,
        isLoaded: true
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
      const col = {
        select: (
          <input
            className='inbox-checkbox'
            type='checkbox'
            onChange={() => _this.selectMail(i)}
          />
        ),
        name: (
          <a
            className='inbox-sender'
            onClick={() => _this.handleSelectedMessage(message)}
          >
            {message.name}
          </a>
        ),
        subject: (
          <span>
            <b>{message.subject}</b>
          </span>
        ),
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
    if (!i) {
      return
    }

    _this.setState({
      selectedPage: i
    })
  }
}

ReadMessage.propTypes = {
  hanldeOnReadMessage: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  associatedNames: PropTypes.object,
  handleChangeSection: PropTypes.func.isRequired
}
export default ReadMessage
