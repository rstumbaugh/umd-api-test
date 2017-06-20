import * as styles from 'styles/admin.scss';
import React, {Component} from 'react';
import Header from 'components/header.js';
import Footer from 'components/footer.js';
import Sidebar from 'components/admin/admin-sidebar.js';
import Pages from 'components/admin/pages/admin-pages.js';
import Auth from 'components/firebase/firebase-auth.js';
import Globals from 'components/globals.js';
import * as isofetch from 'isomorphic-fetch';

class Admin extends Component {
	constructor() {
		super();

		this.state = {
			status: 'logging in',
			name: '',
			active: '',
			items: []
		};
	}

	updateActive(active) {
		this.setState({
			active: active
		})
	}

	// set up auth state change monitor
	componentDidMount() {
		var self = this;

		Auth.onStateChanged(function(user) {
			if (user) {
				// get user's firebase access token
				// use token to check if admin, then get 

				// get Firebase token, check if authenticated
				user.getIdToken(true)
					.then(function(token) {
						self.setState({
							token: token,
							name: user.displayName
						})
						return fetch(Globals.API_ADMIN_DASHBOARD + '?token=' + token);
					})
					.then(Globals.handleFetchResponse)
					.then(function(response) {
						// populate state with info
						console.log('token received');
						self.setState({
							status: 'logged in',
							items: Globals.ADMIN_PAGES,
							active: Globals.ADMIN_PAGES[0],
							content: {
								logs: response.logs,
								emails: response.emails,
								feedback: response.feedback,
								users: response.users
							}
						})
					})
					.catch(function(err) {
						// error thrown if unauthorized 
						console.log(err);
						self.setState({
							status: 'unauthorized'
						})
					})
			} else {
				self.setState({
					status: 'logged out',
					items: [],
					active: '',
				})
			}
		})

		Auth.logIn();
	}

	// remove item from one of the pages
	// arguments are type of item to remove (emails, users, feedback, etc)
	// and the PK of object to remove
	removeItem(type, key) {
		var obj = this.state.content[type];
		delete obj[key];
		
		var state = {};
		state[type] = obj;

		var item = {
			type: type,
			key: key
		}

		var self = this;
		fetch(Globals.API_DASHBOARD_REMOVE + '?token=' + this.state.token, {
			method: 'POST',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(item)
		})
		.then(Globals.handleFetchResponse)
		.then(function(response) {
			self.setState(state);
		})
		.catch(function(err) {
			console.log(err);
		})
	}

	sendEmail(subject, body) {
		console.log('sending...');
		console.log({subject: subject, body: body})

		var obj = {
			subject: subject,
			message: body
		};

		var self = this;
		fetch(Globals.API_EMAIL_SEND + '?token=' + this.state.token, {
			method: 'POST',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(obj)
		})
		.then(Globals.handleFetchResponse)
		.then(function(response) {
			console.log('email sent!');
		})
		.catch(function(err) {
			console.log(err);
		})
	}

	addEmail(email) {
		var self = this;

		fetch(Globals.API_ADD_EMAIL + '?token=' + this.state.token, {
			method: 'POST',
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email: email})
		})
		.then(Globals.handleFetchResponse)
		.then(function(response) {
			return fetch(Globals.API_ADMIN_DASHBOARD + '?token=' + self.state.token)
		})
		.then(Globals.handleFetchResponse)
		.then(function(response) {
			self.setState({
				content: {
					emails: response.emails
				}
			})
			console.log('emails updated');
		})
		.catch(function(err) {
			console.log(err);
		})
	}

	getContent() {
		var content;
		var callbacks = { // passed down to pages, all API calls managed here
			removeItem: this.removeItem,
			sendEmail: this.sendEmail,
			addEmail: this.addEmail
		};

		if (this.state.status == 'logging in') {
			content = <h1>Logging in...</h1>;
		} else if (this.state.status == 'unauthorized') {
			content = (
				<div>
					<h1>Unauthorized</h1>
					<p>You are unauthorized to see this page.</p>
				</div>
			)
		} else if (this.state.status == 'logged in') {
			content = (
				<div className='row'>
					<div className='col-sm-10 col-sm-offset-1'>
						<Pages
							active={this.state.active}
							content={this.state.content}
							callbacks={callbacks}
						/>
					</div>
				</div>
			)
		} else if (this.state.status == 'logged out') {
			content = (
				<div>
					<h1>Logged out</h1>
					<p>You are not logged in.</p>
				</div>
			)
		}

		return content;
	}

	render() {
		var content = this.getContent();

		var displayName = this.state.status != 'logging in' && this.state.status != 'logged out';
		return (
			<div>
				<Header />
				<div className='container-fluid content-wrap'>
					<div className='row'>
						<div className='col-sm-2 admin-sidebar-wrap'>
							<Sidebar
								items={this.state.items}
								default='Logs'
								active={this.state.active}
								onActiveChange={this.updateActive.bind(this)}
							/>
						</div>
						<div className='col-sm-10 admin-content'>
							<h1>{Globals.capitalize(this.state.active)}</h1>
							<div style={{display: displayName ? '' : 'none'}}>
								<div>
									{'Logged in as '+this.state.name}
								</div>
								<div className='link' onClick={function() {Auth.logOut()}}>
									Log Out
								</div>
								<br/><br/>
							</div>
							{content}
						</div>
					</div>
				</div>
			</div>
		)
		// return (
		// 	<div className='content-wrap'>
		// 		<Header hideFeedback={true} />
		// 		<div className='container-fluid content-wrap'>
		// 			<div className='row'>
		// 				<div className='col-sm-2 sidebar-wrap'>
		// 					<Sidebar
		// 						items={this.state.items}
		// 						default='Logs'
		// 						active={this.state.active}
		// 						onActiveChange={this.updateActive}
		// 					/>
		// 				</div>
		// 				<div className='col-sm-10 admin-content'>
		// 					<h1>{Globals.capitalize(this.state.active)}</h1>
		// 					<div style={{display: displayName ? '' : 'none'}}>
		// 						<div>
		// 							{'Logged in as '+this.state.name}
		// 						</div>
		// 						<div className='link' onClick={function() {Auth.logOut()}}>
		// 							Log Out
		// 						</div>
		// 						<br/><br/>
		// 					</div>
		// 					{content}
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// )
	}
}

export default Admin;