import React, { Component } from 'react'
import {Icon, Button, Input, Menu, Label } from 'semantic-ui-react'

export default class MenuExampleSecondary extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      
      <Menu  secondary>
        <Menu.Item header>
        ICON
        </Menu.Item>


      <Menu.Menu borderless position ='right'>
        <Menu.Item>Company</Menu.Item>
        <Menu.Item name='name' active={activeItem === 'name'} onClick={this.handleItemClick} />

        <Menu.Item>
            <Button primary>Log out</Button>
        </Menu.Item>

        </Menu.Menu>
      </Menu>
      


    )
  }
}