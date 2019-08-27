import React from 'react';
import {Form, Button, Popup, Icon, Header, TextArea, Grid} from 'semantic-ui-react';

export default class CaseForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			title:"",
            type:"",
            location:"",
			description:"",
		}
	}

	componentDidMount() {
	}
	
	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}
	
	onSubmit = (event) => {
		event.preventDefault();
		
		if (this.state.title === "") {
			alert("Case Title required.");
			return;
		}

		if (this.state.description === "") {
			alert("Case Description required.");
			return;
		}

		if (this.state.location === "") {
			alert("Case Location required.");
			return;
		}

		if (this.state.type === "") {
			alert("Case Type required.");
			return;
		}

		let newcase = {
			title:this.state.title,
			type:this.state.type,
            location:this.state.location,
			description:this.state.description,
		}

		this.createCase(newcase);

		this.setState({
			title:"",
			type:"",
            location:"",
			description:"",
		})
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
				})
			}
			else {
				alert("Case creation failed.")
				console.log("Server responded with status: "+response.status);
			}
		}).catch(error => {
			alert("Case creation failed.")
			console.log(error);
		})
	}

	render() {

		// Map case types and locations
		let types = this.props.types.map((item) => {
			return <option key={item._id} value={item._id}>{item.name}</option>
		})

		let locations = this.props.locations.map((item) => {
			return <option key={item._id} value={item._id}>{item.name}</option>
		})

		return (
			
			<Form onSubmit={this.onSubmit} style={{padding:"10px"}}>

				<Header textAlign='center'>CREATE A CASE</Header>
				<Grid>
					<Grid.Column floated= 'right' textAlign='right' >
						<Popup content='Enter all the required information and press Create.' 
								trigger={<Icon circular name='info'/>} 
								position='bottom center'/>
					</Grid.Column>
				</Grid>

				<Form.Field>
					<label htmlFor="title">Title:</label>
					<input type="text"
							name="title"
							placeholder='Case title'
							onChange={this.onChange}
							value={this.state.title}/>
				</Form.Field>

				<Form.Group widths='equal'>
					<Form.Field>
						<label htmlFor="type">Case type:</label>
						<select name="type"
								className="ui dropdown"
								inputtype="hidden" 
								onChange={this.onChange}
								value={this.state.type}>
								<option value=''>Select Case Type</option>
								{types}
		 				</select>
					</Form.Field>
				
					<Form.Field>
						<label htmlFor="location">Location:</label>
						<select name="location"
								className="ui dropdown"
								inputtype="hidden" 
								onChange={this.onChange}
								value={this.state.location}>
								<option value=''>Select Location</option>
								{locations}
		 				</select>
					</Form.Field>
				</Form.Group>

				<Form.Field 
					control={TextArea}
					label= 'Description:'
					placeholder='What is this case about?'
					inputtype="text"
						   name="description"
						   onChange={this.onChange}
						   value={this.state.description}
				/>

				<br/>

				<Grid>
					<Grid.Column textAlign="center">
						<Button type="submit"><Icon name="plus"/>Create</Button>
					</Grid.Column>
				</Grid>
			</Form>
		
		)		
	}

}