import './NavigationPanel.css';
import 'src/styles.css';

import React, { useContext, useState } from 'react';
import { Users } from 'src/data/User';
import { Link } from 'react-router-dom';
import { UserContext } from 'src/context/UserProvider';
import { Trans } from 'react-i18next';
import ClearButton from 'src/components/button/ClearButton';
import UserDisplay from 'src/components/user/UserDisplay';
import NotificationTab from 'src/components/navigation/NotificationTab';

export default function NavigationPanel() {
	const { user } = useContext(UserContext);

	const [showNavigatePanel, setShowNavigatePanel] = useState(false);

	return (
		<nav className='navigation-bar'>
			<section className='navigation-panel'>
				<button
					className='icon flex-center w2rem h2rem'
					type='button'
					onClick={() => setShowNavigatePanel((prev) => !prev)}
					onFocus={() => setShowNavigatePanel(true)}
					onMouseEnter={() => setShowNavigatePanel(true)}>
					<img className='icon w2rem h2rem' src='/assets/icons/dots.png' alt='menu' />
				</button>

				{showNavigatePanel && (
					<section className='popup' onMouseLeave={() => setShowNavigatePanel(false)}>
						<section className='nav-link-container'>
							<img src='https://cdn.discordapp.com/attachments/1009013837946695730/1106504291465834596/a_cda53ec40b5d02ffdefa966f2fc013b8.gif' alt='' />
							<Link className='nav-link' to='/home' onClick={() => setShowNavigatePanel(false)}>
								Home
							</Link>
							<Link className='nav-link' to='/user' onClick={() => setShowNavigatePanel(false)}>
								User
							</Link>
							<Link className='nav-link' to='/forum' onClick={() => setShowNavigatePanel(false)}>
								Forum
							</Link>
							<Link className='nav-link' to='/schematic' onClick={() => setShowNavigatePanel(false)}>
								Schematic
							</Link>
							<Link className='nav-link' to='/map' onClick={() => setShowNavigatePanel(false)}>
								Map
							</Link>
							<Link className='nav-link' to='/mod' onClick={() => setShowNavigatePanel(false)}>
								Mod
							</Link>
							<Link className='nav-link' to='/logic' onClick={() => setShowNavigatePanel(false)}>
								Logic
							</Link>
							<Link className='nav-link' to='/upload' onClick={() => setShowNavigatePanel(false)}>
								Upload
							</Link>
							<Link className='nav-link' to='/info' onClick={() => setShowNavigatePanel(false)}>
								Info
							</Link>
							{Users.isAdmin(user) && (
								<Link className='nav-link' to='/admin' onClick={() => setShowNavigatePanel(false)}>
									Admin
								</Link>
							)}
						</section>
						<ClearButton onClick={() => setShowNavigatePanel(false)}>
							<Trans i18nKey='close' />
						</ClearButton>
					</section>
				)}
			</section>
			<section className='flex-row small-gap relative'>
				<NotificationTab />
				<UserDisplay />
			</section>
		</nav>
	);
}
