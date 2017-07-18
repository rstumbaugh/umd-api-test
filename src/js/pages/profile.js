import React, {Component} from 'react';
import Ajax from 'utils/ajax';
import Store from 'utils/store';
import Globals from 'globals';
import {Header, Content, Footer} from 'utils/layout';
import ProfileInfo from 'components/profile/profile-info';
import ProfileRatings from 'components/profile/profile-ratings';
import ProfileComments from 'components/profile/profile-comments';

class Profile extends Component {
	constructor(props) {
		super(props);
		
		var uid = props.match.params.userId;
		this.state = {
			user: {},
			uid: uid,
			isSelf: Store.getItem('userId') == uid
		}
	}

	componentDidMount() {
		this.getUserInfo();
	}

	getUserInfo() {
		var url = `${Globals.API_USERS}/${this.state.uid}/profile`;
		
		Ajax.get(url, { 'Authorization': Store.getItem('userToken') })
			.then(res => JSON.parse(res.response))
			.then(user => {
				this.setState({ user });
				console.log(user)
			})
			.catch(err => {
				console.error(err)
			})
	}

	// toggle user email subscribe status
	toggleEmail(isUnsubscribing) {
		var url = isUnsubscribing
			? `${Globals.API_USERS}/${this.state.uid}/unsubscribe`
			: `${Globals.API_USERS}/${this.state.uid}/subscribe`;

		Ajax.post(url, {
			headers: {
				'Authorization': Store.getItem('userToken')
			},
			body: {}
		})
			.then(() => {
				this.getUserInfo();
			})
			.catch(err => {
				console.error(err);
			})
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<div className='user-profile-wrap row'>
						<div className='user-profile-info-wrap col-md-8'>
							<ProfileInfo
								name={this.state.user.name}
								email={this.state.user.email}
								uid={this.state.uid}
								subscribed={this.state.user.getUpdates}
								isSelf={this.state.isSelf}
								onEmailChange={this.toggleEmail.bind(this)}
							/>
						</div>
						<div className='user-profile-ratings-wrap col-md-4'>
							<ProfileRatings
								ratings={this.state.user.ratings}
								isSelf={this.state.isSelf}
							/>
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Profile;