import React from 'react';
import {Form,Button} from 'semantic-ui-react';

export default class CaseForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			title:"",
            type:"",
            location:"",
            caseInfo:""
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
			id:0
		}
		this.props.addToList(item);
		this.setState({
			title:"",
			type:"",
            location:"",
            caseInfo:""
		})
	}
	
	render() {
		return (
			<Form onSubmit={this.onSubmit}>
				<Form.Field>
					<label htmlFor="title">Title:</label>
					<input type="text"
						   name="title"
						   onChange={this.onChange}
						   value={this.state.title}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="type">Type:</label>
					<input type="text"
						   name="type"
						   onChange={this.onChange}
						   value={this.state.type}/>
				</Form.Field>
                <Form.Field>
					<label htmlFor="location">Location:</label>
					<input type="text"
						   name="location"
						   onChange={this.onChange}
						   value={this.state.location}/>
				</Form.Field>
                <Form.Field>
					<label htmlFor="caseInfo">Description:</label>
					<input type="text"
						   name="caseInfo"
						   onChange={this.onChange}
						   value={this.state.caseInfo}/>
				</Form.Field>
				<Button type="submit">Add</Button>
			</Form>
		
		)		
	}

}