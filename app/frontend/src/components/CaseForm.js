import React from 'react';
import Moment from 'moment';
import {Form, Button, Header, TextArea, Grid} from 'semantic-ui-react';

export default class CaseForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			title:"",
			type:"",
			location:"",
			description:"",
			adminComment:"",
			dateCreated:"",
			dateUpdated:"",
			creator:"",
			creatorId:"",
			edit:false,
			remove:false,
			lastId:this.props.id
		}
	}

	componentDidMount() {
		// Get case data if we got an id
		if (this.props.id) {
			this.getCase();
		}
	}

	componentDidUpdate() {
		// Got a caseid as props?
		if (this.props.id !== this.state.lastId) {
			// then reset state
			this.resetState();
			// and get the case info
			if (this.props.id) {
				this.getCase();
			}
		}
	}

	resetState() {
		this.setState({
			title:"",
			type:"",
			location:"",
			description:"",
			adminComment:"",
			dateCreated:"",
			dateUpdated:"",
			creator:"",
			creatorId:"",
			edit:false,
			remove:false,
			lastId:this.props.id
		});
	}

	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
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
						type:data.type._id,
						status:data.status._id,
						location:data.location._id,
						description:data.description,
						adminComment:data.adminComment,
						dateCreated:data.dateCreated,
						dateUpdated:data.dateUpdated,
						creator:data.creator.firstName + " " + data.creator.lastName,
						creatorId:data.creator._id,
						thisCase:data
					}
					this.setState(tempState)
				}).catch(error => {
					console.log("Error in parsing response json")
				});
			} else {
				console.log("Server responded with status: " + response.statusText);
			}
		}).catch(error => {
			console.log(error);
		});
	}

	createCase = (newcase) => {
		let request = {
			method:"POST",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token},
			body:JSON.stringify(newcase)
		}

		fetch("/api/case/create", request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.props.history.push("/case/"+data.caseId);
				});
			} else {
				alert("Case creation failed.");
				console.log("Server responded with status: "+response.status);
			}
		}).catch(error => {
			alert("Case creation failed.");
			console.log(error);
		});
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
				this.getCase();
			} else {
				console.log("Server responded with status: " + response.status);
			}
		}).catch(error => {
			console.log(error);
		});
	}

	removeCase = () => {
		let request = {
			method:"DELETE",
			mode:"cors",
			headers:{"Content-Type":"application/json", token:this.props.token},
		}

		fetch("/api/case/" + this.props.id, request).then(response => {
			if (response.ok) {
				this.props.history.push("/cases");
			} else {
				console.log("Server responded with status: " + response.status);
			}
		}).catch(error => {
			console.log(error);
		});

		this.resetState();
	}
	
	onSubmit = (event) => {
		event.preventDefault();

		if (this.state.remove) {
			this.removeCase();
			return;
		}
		
		// Validate input
		if (this.state.title === "") {
			alert("Case Title required.");
			return;
		}

		if (this.state.description === "") {
			alert("Description required.");
			return;
		}
		
		let thisCase = {
			title:this.state.title,
			type:this.state.type,
			status:this.state.status,
			location:this.state.location,
			description:this.state.description,
			adminComment:this.state.adminComment,
		}

		if (this.state.edit) {
			this.putCase(thisCase);
		} else {
			this.createCase(thisCase);
		}

		this.resetState();
	}

	enableRemove = () => {
		this.setState({
			remove:true
		});
	}

	enableEdit = () => {
		this.setState({
			edit:true
		});
	}

	cancelUpdate = () => {
		this.setState({
			edit:false,
			remove:false
		});
	}

	render() {

		// Are we creating a new case or viewing an existing one
		let newCase = !this.props.id;

		let isOwnCaseOrAdmin = (this.props.accessLevel > 2 || this.state.creatorId == this.props.user._id);

		// Define styles for toggling forms
		let enableInputs = newCase || this.state.edit;
		let hideInputs = newCase ? {display:'none'} : {};

		let titleText = newCase ? 'NEW CASE' : 'CASE EDIT';
		let submitText = this.state.edit ? 'Update' : 'Remove';

		// Map case types, statuses and locations
		let types = this.props.types.map((item) => {
			return <option key={item._id} value={item._id}>{item.name}</option>
		})
		
		let statuses = this.props.statuses.map((item) => {
			return <option key={item._id} value={item._id}>{item.name}</option>
		})

		let locations = this.props.locations.map((item) => {
			return <option key={item._id} value={item._id}>{item.name}</option>
		})

		// Format dates if set
		let dateUpdated = '';
		if (this.state.dateUpdated) {
			dateUpdated = Moment(this.state.dateUpdated).format('DD.MM.YYYY HH:mm');
		}

		let dateCreated = '';
		if (this.state.dateCreated) {
			dateCreated = Moment(this.state.dateCreated).format('DD.MM.YYYY HH:mm');
		}

		return (
			<Form>

				<Header textAlign='center'>{titleText}</Header>

				<Form.Group>
					<Form.Field width={13}>
						<label htmlFor="title">Case Title:</label>
						<input type="text"
							   name="title"
							   disabled={!(newCase || (this.state.edit && isOwnCaseOrAdmin))}
							   onChange={this.onChange}
							   value={this.state.title}/>
					</Form.Field>

					<Form.Field width={5} style={hideInputs}>
						<label htmlFor="status">Case status:</label>
						<select name="status"
								className="ui dropdown"
								inputtype="hidden"
								disabled={!(enableInputs && this.props.accessLevel > 1)}
								onChange={this.onChange}
								value={this.state.status}
								>
								{statuses}
						</select>
					</Form.Field>
				</Form.Group>

				<Form.Group style={hideInputs}>
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
							   value={dateCreated}/>
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
								disabled={!enableInputs}
								onChange={this.onChange}
								value={this.state.type}
								>
								{types}
						</select>
					</Form.Field>
					
					<Form.Field>
						<label htmlFor="location">Location:</label>
						<select name="location"
								className="ui dropdown"
								inputtype="hidden"
								disabled={!enableInputs} 
								onChange={this.onChange}
								value={this.state.location}
								>
								{locations}
						</select>
					</Form.Field>
				</Form.Group>

				<label style={{fontWeight: "bold"}}>Case Description:</label>
				<Form.Field
					control={TextArea}
					disabled={!(newCase || (this.state.edit && isOwnCaseOrAdmin))}
					inputtype="text"
					name="description"
					onChange={this.onChange}
					value={this.state.description}
				/>

				<div style={hideInputs}>
					<label style={{fontWeight: "bold"}}>Handler Comment:</label>
					<Form.Field
						control={TextArea}
						disabled={!(enableInputs && (this.props.accessLevel > 1))}
						inputtype="text"
						name="adminComment"
						onChange={this.onChange}
						value={this.state.adminComment}
					/>
				</div>

				<br/>
				<Grid>
					<Grid.Column>

						{(!newCase && (this.state.edit || this.state.remove)) &&
							<div>
								<Button onClick={this.onSubmit} floated='right'>{submitText}</Button>
								<Button onClick={this.cancelUpdate} floated='right'>Cancel</Button>
							</div>
						}

						{(!newCase && !this.state.edit && !this.state.remove) &&
							<div>
								<Button onClick={this.enableEdit} floated='right'>Edit</Button>
							</div>
						}

						{(!newCase && !this.state.edit && !this.state.remove && this.props.accessLevel > 2) &&
							<div>
								<Button onClick={this.enableRemove} floated='right'>Remove</Button>
							</div>
						}

						{newCase &&
							<Button onClick={this.onSubmit} floated='right'>Submit</Button>
						}

					</Grid.Column>
				</Grid>
			</Form>
		);
	}
}