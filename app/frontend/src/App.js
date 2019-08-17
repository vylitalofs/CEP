import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import LoginForm from './components//LoginForm';
import Menu from './components//Menu';
import NavBar from './components//NavBar';
import UserList from './components/UserList';
import UserView from './components/UserView';
import UserForm from './components/UserForm';
import CaseList from './components//CaseList';
import CaseForm from './components/CaseForm';
import CaseView from './components/CaseView';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged:false,
            user:[],
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
                user:[],
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
                        token:data.token,
                        user:data.user
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
                    user:[],
                },() => {this.saveToStorage()});
            } 
        }).catch(error => {
            console.log(error);
        })
    }

    render() {

        return (
            <div className="App" style={{width:900, margin:"auto"}}>
                  
                <Menu isLogged={this.state.isLogged} logout={this.logout} user={this.state.user}/>

                <Segment.Group horizontal>
                    <NavBar 
                        isLogged={this.state.isLogged} 
                        user={this.state.user}/>

                    <Segment id="login" style={{right: "0px"}}>

                        <Switch>

                            <Route exact path="/" render={() =>
                                !this.state.isLogged ?
                                    <LoginForm login={this.login}/> :
                                    <Redirect to="/cases"/>
                            }/>

                            <Route path="/users" render={() =>
                                (this.state.isLogged && this.state.user.isAdmin) ?
                                    <UserList token={this.state.token}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/newuser" render={() =>
                                (this.state.isLogged && this.state.user.isAdmin) ?
                                    <UserForm token={this.state.token}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/user/:id" render={({match}) =>
                                this.state.isLogged ?
                                    <UserView token={this.state.token} id={match.params.id}
                                    onSubmitRemove={this.onSubmitRemove}
                                    editUser={this.editUser}/> :
                                    <Redirect to="/"/>
                            }/>
                            <Route path="/case/:id" render={({match}) =>
                                this.state.isLogged ?
                                    <CaseView token={this.state.token} id={match.params.id}
                                    onSubmitRemove={this.onSubmitRemove}
                                    editCase={this.editCase}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/cases" render={() =>
                                this.state.isLogged ?
                                    <CaseList token={this.state.token}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/newcase" render={() =>
                                this.state.isLogged ?
                                    <CaseForm token={this.state.token}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/case/:id" render={({match}) =>
                                this.state.isLogged ?
                                    <CaseView token={this.state.token} id={match.params.id}/> :
                                    <Redirect to="/"/>
                            }/>

                        </Switch>

                    </Segment>

                </Segment.Group>

          </div>
        );
    }
  }

export default App;
