import React from 'react';
import {Form,Button, Popup, Icon, Header, TextArea, Grid} from 'semantic-ui-react';

//täältä puuttuu locationeiden hakeminen tietokannasta ja niiden asettaminen
//4 default locationia: Other, Office, Storage, Common space
//Toistaiseksi kolme typeä: Other, Service advice, Development plan 

export default class CaseForm extends React.Component {
	
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
		}
	}

	componentDidMount() {
	}

	getLocation = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token}
		}

		fetch("/api/locations/" + this.props.id, request).then(response => {
			if (response.ok) {
				response.json().then(data => {
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
		if (this.state.caseInfo === "") {
			alert("Case Description required.");
			return;
		}

		let thisCase = {
			title:this.state.title,
			type:this.state.type,
            location:this.state.location,
			caseInfo:this.state.caseInfo,
			superInfo:this.state.superInfo,
		}

		this.createCase(thisCase);

		this.setState({
			title:"",
			type:"",
            location:"",
			caseInfo:"",
		})
	}

	createCase = (item) => {
		let request = {
			method:"POST",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token},
			body:JSON.stringify(item)
		}
		fetch("/api/case/create",request).then(response => {
			  if(response.ok) {
                alert("Case Created!")
			  } else {
				  console.log("Server responded with status:"
				  +response.statusText);
			  }
		}).catch(error => {
			  console.log(error);
		})
  
	}

	render() {
		return (
			
			<Form onSubmit={this.onSubmit}  style={{width:600}}>
				<Header textAlign='center'>CREATE A CASE</Header>

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
						onChange={this.onChange}
						   value={this.state.location}>
						<option value='0'>Other</option>				 		
  				 		<option value='1'>Office</option>
						<option value='2'>Storage</option>
						<option value='3'>Common space</option>				 		
 				</select>
				</Form.Field>
				<Popup content='Select the type and location of the case' 
							trigger={<Icon circular name='info' />} 
							position='bottom center'/>
				</Form.Group>

				<Form.Field 
					control={TextArea}
					label= 'Description:'
					placeholder='What is this case about?'
					inputtype="text"
						   name="caseInfo"
						   onChange={this.onChange}
						   value={this.state.caseInfo}
				/>

				<br/>

				<Grid>
					<Grid.Column textAlign="center">
				<Button type="submit">Create</Button>
				</Grid.Column>
				</Grid>
			</Form>
		
		)		
	}

}