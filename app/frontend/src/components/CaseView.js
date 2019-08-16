import React from 'react';
import {Form,Button, Popup, Icon, Header, TextArea, Grid} from 'semantic-ui-react';

export default class CaseView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			types:[],
			statuses:[],
			locations:[],
			title:"",
            type:"",
            location:"",
			caseInfo:"",
            superInfo:"",
            edit:false
		}
	}

	componentDidMount() {
        this.getCase();
	}

	getCase= () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token}
		}

		fetch("/api/case/" + this.props.id, request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					// convert to string for easier handling in form
					
					this.setState(data)
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
    }
    /*
	getLocation= () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token}
		}

		fetch("/api/locations/" + this.props.id, request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					// convert to string for easier handling in form
					
					this.setState(data)
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
    }   
    */

	putCase = (thiscase) => {
        let request = {
            method:"PUT",
            mode:"cors",
            headers:{"Content-Type":"application/json", token:this.props.token},
            body:JSON.stringify(thiscase)
        }

        fetch("/api/case/" + this.props.id, request).then(response => {
            if (response.ok) {
                alert("Update successful!")
            }
            else {
                console.log("Server responded with status: " + response.status);
            }
        }).catch(error => {
        	console.log(error);
        })
    }
	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
    }
        
	onEdit = () => {
		let state = {};
		state.edit = true
		this.setState(state);
	}

	onCancel = () => {
		let state = {};
		state.edit = false
		this.setState(state);
	}
	
	onSubmit = (event) => {
		event.preventDefault();
        //Errors after accepting editing
        if(this.state.edit === true){
            if (this.state.title === "") {
                alert("Add a title");
                return;
            }
            if (this.state.superInfo === "") {
                alert("Add handler comments");
                return;
            }
        }
        
		let thisCase = {
			title:this.state.title,
			type:this.state.type,
            location:this.state.location,
			caseInfo:this.state.caseInfo,
			superInfo:this.state.superInfo,
		}

		this.putCase(thisCase);

		this.setState({
			title:"",
			type:"",
            location:"",
			caseInfo:"",
            superInfo:"",
            edit:false
        })
        this.getCase();
	}

	render() {
        let edit = !this.state.edit ? {display:'none'} : {};
		return (
			
			<Form onSubmit={this.onSubmit}  style={{width:600}}>
				<Header textAlign='center'>CASE OVERVIEW</Header>

				<Form.Field>
					<label htmlFor="title">Title:</label>
					<input type="text"
                           name="title"
                           disabled={!this.state.edit}
						   onChange={this.onChange}
						   value={this.state.title}/>
				</Form.Field>

				<Form.Group widths='equal'>
				<Form.Field>
				<label htmlFor="type">Case type:</label>
				<select name="type"
						className="ui dropdown"
                        inputtype="hidden"
                        disabled={!this.state.edit}
						onChange={this.onChange}
						   value={this.state.type}>
						<option value='0'>Other</option>				 		
  				 		<option value='1'>Service advice</option>
						<option value='2'>Development plan</option>
 				</select>
				</Form.Field>
				
				<Form.Field>
				<label htmlFor="location">Location:</label>
				<select name="location"
						className="ui dropdown"
                        inputtype="hidden"
                        disabled={!this.state.edit} 
						onChange={this.onChange}
						   value={this.state.location}>
						<option value='0'>Other</option>				 		
  				 		<option value='1'>Office</option>
						<option value='2'>Storage</option>
						<option value='3'>Common space</option>				 		
 				</select>
				</Form.Field>

				</Form.Group>

				<Form.Field 
					control={TextArea}
					label= 'Description:'
                    disabled={!this.state.edit}
					inputtype="text"
						   name="caseInfo"
						   onChange={this.onChange}
						   value={this.state.caseInfo}
				/>

				<Form.Field 
					control={TextArea}
					label= 'Handler Comment:'
                    disabled={!this.state.edit}
					inputtype="text"
						   name="superInfo"
						   onChange={this.onChange}
						   value={this.state.caseInfo}
				/>

				<Form.Field>
				<label htmlFor="status">Case status:</label>
				<select name="status"
						className="ui dropdown"
                        inputtype="hidden"
                        disabled={!this.state.edit}
						onChange={this.onChange}
						   value={this.state.status}>
						<option value='0'>New</option>				 		
  				 		<option value='1'>Closed</option>
 				</select>
				</Form.Field>

				<br/>
				<Grid>
					<Grid.Column textAlign="center">
						<Button onClick={this.onEdit} disabled={this.state.edit}>Edit</Button>
						<Button onClick={this.onCancel} style={edit}>Cancel</Button>
						<Button onClick={this.onSubmit} style={edit}>Submit</Button>
					</Grid.Column>
				</Grid>
			</Form>
		
		)		
	}

}