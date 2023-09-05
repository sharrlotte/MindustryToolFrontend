import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import { TagChoice } from 'src/components/Tag';
import { MAP_FILE_EXTENSION, PNG_IMAGE_PREFIX } from 'src/config/Config';
import { getFileExtension } from 'src/util/StringUtils';
import { PopupMessageContext } from 'src/context/PopupMessageProvider';
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import SearchBox from 'src/components/Searchbox';
import i18n from 'src/util/I18N';
import TagPick from 'src/components/TagPick';
import Button from 'src/components/Button';
import TagEditContainer from 'src/components/TagEditContainer';
import LoadUserName from 'src/components/LoadUserName';
import ColorText from 'src/components/ColorText';
import LoadingSpinner from 'src/components/LoadingSpinner';
import { useMe } from 'src/context/MeProvider';
import MapUploadPreview from 'src/data/MapUploadPreview';
import InfoImage from 'src/components/InfoImage';
import Description from 'src/components/Description';
import { useTags } from 'src/context/TagProvider';

let notLoginMessage = (
	<span>
		<Trans i18nKey='recommend-login' />
		<Link className='p-2' to='/login'>
			<Trans i18nKey='login' />
		</Link>
	</span>
);

export default function UploadMapPage() {
	const [file, setFile] = useState<File>();
	const [preview, setPreview] = useState<MapUploadPreview>();
	const [tag, setTag] = useState<string>('');
	const [tags, setTags] = useState<TagChoice[]>([]);

	const [isLoading, setIsLoading] = useState(false);

	const { me, loading } = useMe();
	const popup = useRef(useContext(PopupMessageContext));
	const { mapUploadTag } = useTags();

	useEffect(() => {
		if (!loading && !me) popup.current.addPopup(notLoginMessage, 20, 'warning');
	}, [me, loading]);

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (!files || files.length <= 0) {
			popup.current.addPopup(i18n.t('invalid-map-file'), 5, 'error');
			return;
		}

		const extension: string = getFileExtension(files[0]);

		if (extension !== MAP_FILE_EXTENSION) {
			popup.current.addPopup(i18n.t('invalid-map-file'), 5, 'error');
			return;
		}

		setFile(files[0]);

		setIsLoading(true);

		API.getMapPreview(files[0]) //
			.then((result) => setPreview(result.data)) //
			.catch(() => popup.current.addPopup(i18n.t(`invalid-map`), 10, 'error')) //
			.finally(() => setIsLoading(false));
	}

	function handleSubmit() {
		if (!file) {
			popup.current.addPopup(i18n.t('no-data'), 5, 'error');
			return;
		}

		if (!tags || tags.length === 0) {
			popup.current.addPopup(i18n.t('no-tag'), 5, 'error');
			return;
		}

		setIsLoading(true);

		API.postMapUpload(file, tags)
			.then(() => {
				setFile(undefined);
				setPreview(undefined);
				setTags([]);
				popup.current.addPopup(i18n.t('upload-success'), 10, 'info');
			})
			.catch((error) => popup.current.addPopup(i18n.t('upload-fail') + ' ' + i18n.t(`${error.response.data}`), 10, 'error')) //
			.finally(() => setIsLoading(false));
	}

	function handleRemoveTag(index: number) {
		setTags((prev) => [...prev.filter((_, i) => i !== index)]);
	}

	function handleAddTag(tag: TagChoice) {
		setTags((prev) => {
			let tags = prev.filter((q) => q !== tag);
			return [...tags, tag];
		});
		setTag('');
	}

	function checkUploadRequirement() {
		if (!file) return <Trans i18nKey='no-data' />;
		if (!tags || tags.length === 0) return <Trans i18nKey='no-tag' />;

		return <Trans i18nKey='ok' />;
	}

	if (isLoading) return <LoadingSpinner />;

	return (
		<main className='flex flex-row space-between w-full h-full gap-2 p-8 box-border overflow-y-auto'>
			<header className='flex justify-center items-center'>
				<label className='button' htmlFor='ufb'>
					<Trans i18nKey='upload-a-file' />
				</label>
				<input id='ufb' type='file' onChange={(event) => handleFileChange(event)} />
			</header>
			{preview && (
				<section className='flex flex-row flex-wrap gap-2'>
					<InfoImage src={PNG_IMAGE_PREFIX + preview.image} />
					<section className='flex flex-row space-between'>
						<section className='flex flex-row gap-2 flex-wrap'>
							<ColorText className='capitalize h2' text={preview.name} />
							<Trans i18nKey='author' /> <LoadUserName userId={me ? me.id : 'community'} />
							<Description description={preview.description} />
							<TagEditContainer tags={tags} onRemove={(index) => handleRemoveTag(index)} />
						</section>
					</section>
					<section className='flex flex-row flex-nowrap gap-2 w-full'>
						<SearchBox
							placeholder={i18n.t('add-tag').toString()}
							value={tag}
							items={mapUploadTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tags.includes(t))}
							onChange={(event) => setTag(event.target.value)}
							onChoose={(item) => handleAddTag(item)}
							mapper={(t, index) => <TagPick key={index} tag={t} />}
						/>
					</section>
				</section>
			)}

			<footer className='flex flex-row center gap-2 medium-padding'>
				<span children={checkUploadRequirement()} />
				<Button title={i18n.t('upload')} onClick={() => handleSubmit()}>
					<Trans i18nKey='upload' />
				</Button>
			</footer>
		</main>
	);
}
