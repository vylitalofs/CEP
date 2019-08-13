import React from 'react';
import {Switch, Route} from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import LoginForm from './components//LoginForm';
import Menu from './components//Menu';
import NavBar from './components//NavBar';
import UserList from './components/UserList';
import CaseList from './components//CaseList';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged:false,
            isAdmin:false,
            token:""
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem("state")) {
            let tempState = JSON.parse(sessionStorage.getItem("state"));
            this.setState(tempState)
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
            <div className="App" style={{width:900, margin:"auto"}}>
                  
                <Menu isLogged={this.state.isLogged} logout={this.logout}/>

                <Segment.Group horizontal>
                    <NavBar isLogged={this.state.isLogged} isAdmin={this.state.isAdmin}/>
                <Segment id="login" style={{right: "0px"}}>

                <Switch>
                    <Route exact path="/" render={() =>
                        this.state.isLogged ?
                            <CaseList/> :
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
