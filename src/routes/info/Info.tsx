import 'src/styles.css';

import React from 'react';
import LoadUserName from 'src/components/user/LoadUserName';

export default function InfoPage() {
	return (
		<main className="flex-row h100p w100p center medium-gap">
			Page owner: <LoadUserName userId="647a1daf8088ac255a224c04" />
		</main>
	);
}
