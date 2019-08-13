import React from 'react';
import {Form,Button, Popup, Icon, Header, TextArea} from 'semantic-ui-react';

//täältä puuttuu locationeiden hakeminen tietokannasta ja niiden asettaminen
//4 default locationia: Other, Office, Storage, Common space
//Toistaiseksi kolme typeä: Other, Service advice, Development plan 

export default class CaseForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			title:"",
            type:"",
            location:"",
			caseInfo:"",
			superInfo:""
		}
	}
	
	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}
	
	onSubmit = (event) => {
		event.preventDefault();
		let item = {
			title:this.state.title,
			type:this.state.type,
            location:this.state.location,
			caseInfo:this.state.caseInfo,
			superInfo:this.state.superInfo,
			id:0
		}
				//vikatapaukset
		if (item.title === "") {
			alert("Add a title");
			return;
		}
		if (item.Surname === "") {
			alert("Add a description about the case");
			return;
		}

		this.props.addToList(item);
		this.setState({
			title:"",
			type:"",
            location:"",
			caseInfo:"",
			superInfo:""
		})
	}
	
	render() {
		return (
			
			<Form onSubmit={this.onSubmit}>
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
						class="ui dropdown"
						input type="hidden" 
						onChange={this.onChange}
						   value={this.state.type}>
						<i class="dropdown icon"></i>
						<option value='0'>Other</option>				 		
  				 		<option value='1'>Service advice</option>
						<option value='2'>Development plan</option>
 				</select>
				</Form.Field>
				
				<Form.Field>
				<label htmlFor="location">Location:</label>
				<select name="location"
						class="ui dropdown"
						input type="hidden" 
						onChange={this.onChange}
						   value={this.state.location}>
						<i class="dropdown icon"></i>
						<option value='0'>Other</option>				 		
  				 		<option value='1'>Office</option>
						<option value='2'>Storage</option>
						<option value='3'>Common space</option>				 		
 				</select>
				</Form.Field>
				<Popup content='Select the type and location of the case' 
							trigger={<Icon circular name='info' />} 
							position='bottom'/>
				</Form.Group>

				<Form.Field 
					control={TextArea}
					label= 'Description:'
					placeholder='What is this case about?'
					input type="text"
						   name="caseInfo"
						   onChange={this.onChange}
						   value={this.state.caseInfo}
				/>

				<Button type="submit">Submit</Button>
			</Form>
		
		)		
	}

}