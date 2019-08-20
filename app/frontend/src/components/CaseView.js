import React from 'react';
import Moment from 'moment';
import {Form, Button, Header, TextArea, Grid} from 'semantic-ui-react';

export default class CaseView extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			types:[],
			statuses:[],
			locations:[],
			thisCase:[],

			title:"",
			type:"",
			location:"",
			description:"",
			adminComment:"",
			dateCreated:"",
			dateUpdated:"",
			creator:"",
			edit:false
		}
	}

	componentDidMount() {
        this.getCase();
	}

	getCase = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token}
		}

		fetch("/api/case/" + this.props.id, request).then(response => {
			if (response.ok) {
				response.json().then(data => {

					let tempState = {
						title:data.title,
						type:data.type.name,
						status:data.status.name,
						location:data.location.name,
						description:data.description,
						adminComment:data.adminComment,
						dateCreated:data.dateCreated,
						dateUpdated:data.dateUpdated,
						creator:data.creator.firstName + " " + data.creator.lastName,
						thisCase:data
					}

					this.setState(tempState)
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
        if (this.state.edit === true){
            if (this.state.title === "") {
                alert("Case Title required");
                return;
            }
            if (this.state.adminComment === "") {
                alert("Add handler comments");
                return;
            }
        }
        
		let thisCase = {
			title:this.state.title,
			type:this.state.type,
			location:this.state.location,
			description:this.state.description,
			adminComment:this.state.adminComment,
		}

		this.putCase(thisCase);

		this.setState({
			title:"",
			type:"",
            location:"",
			description:"",
            adminComment:"",
            edit:false
        })
        
        this.getCase();
	}
	
	//REMOVE
	onRemove = () => {
		let state = {};
		state.remove = true
		this.setState(state);
	}
	onCancelRemove = () => {
		let state = {};
		state.remove = false
		this.setState(state);
	}

	onSubmitRemove = () => {
        let request = {
            method:"DELETE",
            mode:"cors",
            headers:{"Content-Type":"application/json", token:this.props.token},
        }

        fetch("/api/case/" + this.props.id, request).then(response => {
            if (response.ok) {
                alert("Case removed successfully!")
            }
            else {
                console.log("Server responded with status: " + response.status);
            }
        }).catch(error => {
        	console.log(error);
        })
    }

	render() {

		let edit = !this.state.edit ? {display:'none'} : {};
		let noedit = this.state.edit ? {display:'none'} : {};
		let remove = !this.state.remove ? {display:'none'} : {};
		let noremove = this.state.remove ? {display:'none'} : {};

		let dateUpdated = ''

		if (this.state.dateUpdated) {
			dateUpdated = Moment(this.state.dateUpdated).format('DD.MM.YYYY hh:mm')
		}

		return (
			<Form style={{width:600}}>
				<Header textAlign='center'>CASE OVERVIEW</Header>

				<Form.Group>
					<Form.Field width={13}>
						<label htmlFor="title">Case Title:</label>
						<input type="text"
	                           name="title"
	                           disabled={!this.state.edit}
							   onChange={this.onChange}
							   value={this.state.title}/>
					</Form.Field>

					<Form.Field width={5}>
						<label htmlFor="status">Case status:</label>
						<select name="status"
								className="ui dropdown"
								inputtype="hidden"
								disabled={!(this.state.edit && this.props.isAdmin)}
								onChange={this.onChange}
								value={this.state.status}
								>
		 				</select>
					</Form.Field>
				</Form.Group>

				<Form.Group>
					<Form.Field width={8}>
						<label htmlFor="creator">Case creator:</label>
						<input type="text"
								name="creator"
								disabled={true}
								value={this.state.creator}/>
					</Form.Field>


					<Form.Field width={5}>
						<label htmlFor="dateCreated">Date Created:</label>
						<input type="text"
								name="dateCreated"
								disabled={true}
								value={Moment(this.state.dateCreated).format('DD.MM.YYYY hh:mm')}/>
					</Form.Field>

					<Form.Field width={5}>
						<label htmlFor="dateUpdated">Date Updated:</label>
						<input type="text"
								name="dateUpdated"
								disabled={true}
								value={dateUpdated}/>
					</Form.Field>
				</Form.Group>

				<Form.Group widths='equal'>
					<Form.Field>
						<label htmlFor="type">Case type:</label>
						<select name="type"
								className="ui dropdown"
		                        inputtype="hidden"
		                        disabled={!this.state.edit}
								onChange={this.onChange}
								value={this.state.type}
								options={this.state.types}
								>
		 				</select>
					</Form.Field>
					
					<Form.Field>
						<label htmlFor="location">Location:</label>
						<select name="location"
								className="ui dropdown"
		                        inputtype="hidden"
		                        disabled={!this.state.edit} 
								onChange={this.onChange}
								value={this.state.location}
								options={this.state.location}
								>			 		
		 				</select>
					</Form.Field>
				</Form.Group>

				<label style={{fontWeight: "bold"}}>Case Description:</label>
				<Form.Field 
					control={TextArea}
                    disabled={!this.state.edit}
					inputtype="text"
					name="description"
					onChange={this.onChange}
					value={this.state.description}
				/>

				<label style={{fontWeight: "bold"}}>Handler Comment:</label>
				<Form.Field
					control={TextArea}
                    disabled={!(this.state.edit && this.props.isAdmin)}
					inputtype="text"
					name="adminComment"
					onChange={this.onChange}
					value={this.state.adminComment}
				/>

				<br/>
				<Grid>
					<Grid.Column >
						<Button onClick={this.onEdit} floated='left' style={noedit}>Edit</Button>
						<Button onClick={this.onCancel} floated='left' style={edit}>Cancel</Button>
						<Button onClick={this.onSubmit} floated='left' style={edit}>Submit</Button>		
						<Button onClick={this.onRemove} floated='right' style={noremove}>Remove</Button>
						<Button onClick={this.onCancelRemove} floated='right' style={remove}>Cancel</Button>
						<Button onClick={this.onSubmitRemove} floated='right' style={remove}>Submit</Button>
					</Grid.Column>
				</Grid>
			</Form>
		
		)		
	}

}