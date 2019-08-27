import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {Segment} from 'semantic-ui-react';
import Menu from './components/Menu';
import NavBar from './components//NavBar';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import UserView from './components/UserView';
import UserForm from './components/UserForm';
import CaseList from './components/CaseList';
import CaseForm from './components/CaseForm';
import CaseView from './components/CaseView';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            token:"",
            isLogged:false,
            user:[],
            types:[],
            statuses:[],
            locations:[]
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem("state")) {
            let tempState = JSON.parse(sessionStorage.getItem("state"));
            this.setState(tempState)
        }
    }

    componentDidUpdate() {

        // Get case location, type, status lists on update if we don't have them

        if (!this.state.isLogged) {
            return
        }
        
        if (this.state.types.length < 1) {
            this.getTypes()
        }

        if (this.state.locations.length < 1) {
            this.getLocations()
        }

        if (this.state.statuses.length < 1) {
            this.getStatuses()
        }
    }

    saveToStorage = () => {
        sessionStorage.setItem("state", JSON.stringify(this.state));
    }

    getLocations = () => {
        let request = {
            method:"GET",
            mode:"cors",
            headers:{"Content-Type":"application/json", "token":this.state.token}
        }

        let locations

        fetch("/api/locations", request).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    this.setState({locations:data})
                }).catch(error => {
                    console.log("Error in parsing response json")
                });
            }
            else {
                console.log("Server responded with status: " + response.statusText);
            }
        }).catch(error => {
            console.log(error);
        })

        return locations
    }

    getTypes = () => {
        let request = {
            method:"GET",
            mode:"cors",
            headers:{"Content-Type":"application/json", "token":this.state.token}
        }

        let types

        fetch("/api/casetypes", request).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    this.setState({types:data})
                }).catch(error => {
                    console.log("Error in parsing response json")
                });
            }
            else {
                console.log("Server responded with status: " + response.statusText);
            }
        }).catch(error => {
            console.log(error);
        })

        return types
    }

    getStatuses = () => {
        let request = {
            method:"GET",
            mode:"cors",
            headers:{"Content-Type":"application/json", "token":this.state.token}
        }

        let statuses

        fetch("/api/casestatuses", request).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    this.setState({statuses:data})
                }).catch(error => {
                    console.log("Error in parsing response json")
                });
            }
            else {
                console.log("Server responded with status: " + response.statusText);
            }
        }).catch(error => {
            console.log(error);
        })

        return statuses
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
    
    onLogin = (data) => {
        this.setState({
            isLogged:true,
            token:data.token,
            user:data.user
        }, () => {
            this.saveToStorage();
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
                  
                <Menu isLogged={this.state.isLogged} logout={this.logout} 
                        user={this.state.user} style={{maxHeight: "80px"}}/>

                <Segment.Group horizontal>

                    <NavBar 
                        isLogged={this.state.isLogged} 
                        user={this.state.user}
                        />

                    <Segment id="login" style={{right: "0px"}}>

                        <Switch>

                            <Route exact path="/" render={() =>
                                !this.state.isLogged ?
                                    <LoginForm onLogin={this.onLogin}/> :
                                    <Redirect to="/cases"/>
                            }/>

                            <Route path="/users" render={() =>
                                (this.state.isLogged && this.state.user.isAdmin) ?
                                    <UserList token={this.state.token}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/newuser" render={() =>
                                (this.state.isLogged && this.state.user.isAdmin) ?
                                    <UserForm token={this.state.token}
                                        history={this.props.history}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/user/:id" render={({match}) =>
                                this.state.isLogged ?
                                    <UserView 
                                        token={this.state.token} 
                                        id={match.params.id}
                                        isAdmin={this.state.user.isAdmin}
                                        history={this.props.history}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/cases" render={() =>
                                this.state.isLogged ?
                                    <CaseList token={this.state.token}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/newcase" render={() =>
                                this.state.isLogged ?
                                    <CaseForm
                                        token={this.state.token}
                                        types={this.state.types}
                                        locations={this.state.locations}
                                        statuses={this.state.statuses}
                                        history={this.props.history}/> :
                                    <Redirect to="/"/>
                            }/>

                            <Route path="/case/:id" render={({match}) =>
                                this.state.isLogged ?
                                    <CaseView 
                                        user={this.state.user}
                                        token={this.state.token} 
                                        id={match.params.id}
                                        types={this.state.types}
                                        locations={this.state.locations}
                                        statuses={this.state.statuses}
                                        isAdmin={this.state.user.isAdmin} 
                                        history={this.props.history}/> :
                                    <Redirect to="/"/>
                            }/>

                        </Switch>

                    </Segment>

                </Segment.Group>

          </div>
        );
    }
}

export default withRouter(App);
