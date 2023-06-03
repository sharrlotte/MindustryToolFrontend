import React, { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export default class PrivateRoute extends Component<{ children: ReactNode; user: UserInfo | undefined }> {
	render() {
		if (this.props.user && this.props.user.role.includes("USER")) return <div>{this.props.children}</div>;
		else return <Navigate to='/login' />;
	}
}