import { API } from 'src/API';
import { Trans } from 'react-i18next';
import { SchematicInfo } from 'src/routes/schematic/SchematicPage';
import { useNavigate, useParams } from 'react-router-dom';

import i18n from 'src/util/I18N';
import React from 'react';
import useQuery from 'src/hooks/UseQuery';
import { usePopup } from 'src/context/PopupMessageProvider';
import Schematic from 'src/data/Schematic';
import LoadingSpinner from 'src/components/LoadingSpinner';

export default function SchematicPreviewPage() {
	const { schematicId } = useParams();
	const { data, isLoading, isError } = useQuery<Schematic>(`schematics/${schematicId}`);

	const navigate = useNavigate();

	const addPopup = usePopup();

	let schematic = data;

	function handleDeleteSchematic(schematic: Schematic) {
		API.deleteSchematic(schematic.id) //
			.then(() => addPopup(i18n.t('schematic.delete-success'), 5, 'info'))
			.then(() => navigate('/schematic'))
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'));
	}

	if (isLoading) return <LoadingSpinner className='flex h-full items-center justify-center' />;

	if (isError || !schematic)
		return (
			<div className='flex h-full w-full items-center justify-center'>
				<Trans i18nKey='schematic-not-found' />
			</div>
		);

	return (
		<SchematicInfo //
			schematic={schematic}
			handleCloseModel={() => navigate('/schematic')}
			handleDeleteSchematic={handleDeleteSchematic}
		/>
	);
}
