import React from 'react';
import {Switch, Route} from 'react-router-dom';
import LoginForm from './LoginForm';
import Menu from './Menu';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="App" style={{width:600, margin:"auto"}}>
               <Menu/>
                <hr/>
                <Switch>
                    
                    <Route exact path="/" render={() =>
                        <LoginForm />
                    }/>

                </Switch>

          </div>
        );
    }
  }

export default App;
