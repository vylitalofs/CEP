import React from 'react';
import {Table, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Moment from 'moment';

export default class CaseList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			list:[]
		}
	}

	componentDidMount() {
		this.getCaseList();
	}

	getCaseList = () => {
		let request = {
			method:"GET",
			mode:"cors",
			headers:{"Content-Type":"application/json", "token":this.props.token}
		}

		fetch("/api/cases", request).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.setState({
						list:data
					})
				}).catch(error => {
					console.log("Error in parsing response json")
				});
			} else {
				console.log("Server responded with status: " + response.statusText);
			}
		}).catch(error => {
			console.log(error);
		})
	}

	render() {

		let listitems = this.state.list.map((thiscase, index) => {
			
			return (
				<Table.Row key={thiscase._id}>
					<Table.Cell><Link to={"/case/"+thiscase._id}>{thiscase.title}</Link></Table.Cell>
					<Table.Cell>{thiscase.type.name}</Table.Cell>
					<Table.Cell>{thiscase.location.name}</Table.Cell>
					<Table.Cell>{thiscase.status.name}</Table.Cell>
					<Table.Cell>{Moment(thiscase.dateCreated).format('DD.MM.YYYY')}</Table.Cell>
					<Table.Cell>{thiscase.creator.lastName}</Table.Cell>
				</Table.Row>
			)
		});
	
		return (
			<div style={{padding:"10px"}}>
				<Header textAlign='center'>CASES</Header>
				<Table celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Title</Table.HeaderCell>
							<Table.HeaderCell>Type</Table.HeaderCell>
							<Table.HeaderCell>Location</Table.HeaderCell>
							<Table.HeaderCell>Status</Table.HeaderCell>
							<Table.HeaderCell>Date</Table.HeaderCell>
							<Table.HeaderCell>Creator</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{listitems}
					</Table.Body>
				</Table>
			</div>
		);
	}
}