import React from 'react';
import {Switch, Route} from 'react-router-dom';
import LoginForm from './LoginForm';
import Menu from './Menu';
import NavBar from './NavBar';
import { Segment } from 'semantic-ui-react';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="App" style={{width:800, margin:"auto"}}>
                <Segment>  
                <Menu/>
                </Segment>  
                <Segment.Group  horizontal>

                <Segment id="nav" style={{left: "auto"}}>
                <NavBar/>
                </Segment>
                <Segment id="login" style={{right: "150px"}}>    
                <Switch>
                    <Route exact path="/" render={() =>
                        <LoginForm />
                    }/>
                </Switch>
                </Segment>   

                </Segment.Group>     
          </div>
        );
    }
  }

export default App;
