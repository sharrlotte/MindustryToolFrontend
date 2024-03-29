import { API } from 'src/API';
import Schematic from 'src/data/Schematic';
import React, { useRef } from 'react';

import i18n from 'src/util/I18N';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import User from 'src/data/User';
import { usePopup } from 'src/context/PopupMessageProvider';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import { SchematicInfo, SchematicPreview } from 'src/routes/schematic/SchematicPage';
import InfiniteScroll from 'src/components/InfiniteScroll';
import useModel from 'src/hooks/UseModel';

interface UserSchematicTabProps {
	user: User;
}

export default function UserSchematicTab({ user }: UserSchematicTabProps) {
	const currentSchematic = useRef<Schematic>();

	const addPopup = usePopup();

	const { model, setVisibility } = useModel();
	const usePage = useInfinitePage<Schematic>(`user/${user.id}/schematic`, 20);

	function handleDeleteSchematic(schematic: Schematic) {
		setVisibility(false);
		API.deleteSchematic(schematic.id) //
			.then(() => addPopup(i18n.t('schematic.delete-success'), 5, 'info'))
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'))
			.finally(() => usePage.filter((sc) => sc !== schematic));
	}

	function handleOpenSchematicInfo(schematic: Schematic) {
		currentSchematic.current = schematic;
		setVisibility(true);
	}

	return (
		<main id='schematic-tab' className='box-border flex h-full w-full flex-col gap-2 overflow-y-auto p-2'>
			<InfiniteScroll className='preview-container' infinitePage={usePage} mapper={(v) => <SchematicPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />} />
			<footer className='flex items-center justify-center'>
				<ScrollToTopButton containerId='schematic-tab' />
			</footer>
			{currentSchematic.current &&
				model(
					<SchematicInfo
						schematic={currentSchematic.current} //
						handleCloseModel={() => setVisibility(false)}
						handleDeleteSchematic={handleDeleteSchematic}
					/>,
				)}
		</main>
	);
}
