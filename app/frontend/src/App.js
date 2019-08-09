import React from 'react';
import {Switch, Route} from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import LoginForm from './LoginForm';
import Menu from './Menu';
import NavBar from './NavBar';
import UserList from './UserList';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged:false,
            isAdmin:false,
            token:""
        }
    }

    saveToStorage = () => {
        sessionStorage.setItem("state", JSON.stringify(this.state));
    }

    //LOGIN API
  
    handleStatus = (status) => {
        if(status === 403) {
            this.setState({
                token:"",
                isLogged:false,
                isAdmin:false,
            }, () => {this.saveToStorage()});
        }
    }
    
    login = (user) => {
        let request = {
            method:"POST",
            mode:"cors",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(user)
        }

        fetch("/login", request).then(response => {
            if(response.ok) {
                response.json().then(data => {
                    this.setState({
                        isLogged:true,
                        isAdmin:data.isAdmin,
                        token:data.token
                    }, () => {
                        this.saveToStorage();
                    })
                }).catch(error => {
                    console.log("Error parsing JSON");
                })
            } else {
                console.log("Server responded with status:"+response.status);
            }
        }).catch(error => {
            console.log(error);
        })
    }  
      
    logout = () => {
        let request = {
            method:"POST",
            mode:"cors",
            headers:{"Content-Type":"application/json",
            "token":this.state.token}
        }

        fetch("/logout",request).then(response => {
            if(response.ok) {
                this.setState({
                    token:"",
                    isLogged:false,
                    isAdmin:false,
                },() => {this.saveToStorage()});
            } 
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className="App" style={{width:800, margin:"auto"}}>
                  
                <Menu logout={this.logout}/>
                  

                <Segment.Group  horizontal>
                    <Segment id="nav" style={{left: "auto"}}>
                        <NavBar/>
                    </Segment>
                <Segment id="login" style={{right: "150px"}}>

                <Switch>
                    <Route exact path="/" render={() =>
                        this.state.isLogged ?
                            <UserList/> : // Placeholder, show caselist when implemented
                            <LoginForm login={this.login}/> 

                    }/>
                </Switch>
                </Segment>   

                </Segment.Group>     
          </div>
        );
    }
  }

export default App;
