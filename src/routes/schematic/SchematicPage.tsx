import React, { useCallback, useEffect, useRef, useState } from 'react';
import Schematic from 'src/data/Schematic';

import { TagChoice, Tags } from 'src/components/Tag';
import { API_BASE_URL, FRONTEND_URL } from 'src/config/Config';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { API } from 'src/API';
import { useMe } from 'src/context/MeProvider';

import PreviewImage from 'src/components/PreviewImage';
import PreviewCard from 'src/components/PreviewCard';
import Description from 'src/components/Description';
import ItemRequirement from 'src/components/ItemRequirement';
import InfoImage from 'src/components/InfoImage';
import ScrollToTopButton from 'src/components/ScrollToTopButton';
import TagEditContainer from 'src/components/TagEditContainer';
import ClearIconButton from 'src/components/ClearIconButton';
import DownloadButton from 'src/components/DownloadButton';
import ConfirmBox from 'src/components/ConfirmBox';
import LoadUserName from 'src/components/LoadUserName';
import useClipboard from 'src/hooks/UseClipboard';
import TagContainer from 'src/components/TagContainer';
import IconButton from 'src/components/IconButton';
import LikeCount from 'src/components/LikeCount';
import ColorText from 'src/components/ColorText';
import { usePopup } from 'src/context/PopupMessageProvider';
import useModel from 'src/hooks/UseModel';
import SearchBox from 'src/components/Searchbox';
import useInfinitePage from 'src/hooks/UseInfinitePage';
import useLike from 'src/hooks/UseLike';
import TagPick from 'src/components/TagPick';
import IfTrue from 'src/components/IfTrue';
import Icon, { AddIcon } from 'src/components/Icon';
import i18n from 'src/util/I18N';
import useDialog from 'src/hooks/UseDialog';
import CommentSection from 'src/components/CommentSection';
import { Users } from 'src/data/User';
import { useTags } from 'src/context/TagProvider';
import OptionBox from 'src/components/OptionBox';
import ClearButton from 'src/components/ClearButton';
import Author from 'src/components/Author';
import BackButton from 'src/components/BackButton';
import InfiniteScroll from 'src/components/InfiniteScroll';

export default function SchematicPage() {
	const [searchParam, setSearchParam] = useSearchParams();

	const sort = Tags.parse(searchParam.get('sort'), Tags.SORT_TAG);
	const urlTags = searchParam.get('tags');
	const { schematicSearchTag } = useTags();
	const tags = Tags.parseArray((urlTags ? urlTags : '').split(','), schematicSearchTag);

	const currentSchematic = useRef<Schematic>();
	const [tag, setTag] = useState<string>('');

	const sortQuery = sort ? sort : Tags.SORT_TAG[0];
	const tagQuery = tags;

	const searchConfig = useRef({
		params: {
			tags: Tags.toString(tagQuery), //
			sort: sortQuery.toString(),
		},
	});

	const [totalSchematic, setTotalSchematic] = useState(0);

	const { model, setVisibility } = useModel();
	const addPopup = usePopup();

	const navigate = useNavigate();

	const usePage = useInfinitePage<Schematic>('schematic', 20, searchConfig.current);
	const { loadNextPage } = usePage;

	const getTotalSchematic = useCallback(() => {
		API.getTotalSchematic(searchConfig.current)
			.then((result) => setTotalSchematic(result.data))
			.catch(() => console.log('Error fletching total schematic'));
	}, []);

	useEffect(() => {
		getTotalSchematic();
	}, [getTotalSchematic]);

	function setSearchConfig(sort: TagChoice, tags: TagChoice[]) {
		searchConfig.current = {
			params: {
				tags: Tags.toString(tags), //
				sort: sort.toString(),
			},
		};

		getTotalSchematic();

		setSearchParam(searchConfig.current.params);
	}

	function handleSetSortQuery(sort: TagChoice) {
		setSearchConfig(sort, tagQuery);
	}

	function handleRemoveTag(index: number) {
		let t = tags.filter((_, i) => i !== index);
		setSearchConfig(sortQuery, t);
	}

	function handleAddTag(tag: TagChoice) {
		let t = tags.filter((q) => q !== tag);
		t.push(tag);
		setSearchConfig(sortQuery, t);
		setTag('');
	}

	function handleOpenSchematicInfo(schematic: Schematic) {
		currentSchematic.current = schematic;
		setVisibility(true);
	}

	function handleDeleteSchematic(schematic: Schematic) {
		setVisibility(false);
		API.deleteSchematic(schematic.id) //
			.then(() => addPopup(i18n.t('schematic.delete-success'), 5, 'info')) //
			.then(() => setTotalSchematic((prev) => prev - 1))
			.catch(() => addPopup(i18n.t('schematic.delete-fail'), 5, 'warning'))
			.finally(() => usePage.filter((sc) => sc !== schematic));
	}

	return (
		<main id='schematic' className='flex h-full w-full flex-col gap-2 overflow-y-auto p-2'>
			<span className='flex w-full flex-col gap-2'>
				<section className='m-auto mt-8 flex w-3/4 flex-row flex-wrap items-center justify-start gap-2 md:w-3/5 md:flex-nowrap'>
					<SearchBox
						className='flex h-10 w-full'
						placeholder={i18n.t('search-with-tag').toString()}
						value={tag}
						items={schematicSearchTag.filter((t) => t.toDisplayString().toLowerCase().includes(tag.toLowerCase()) && !tagQuery.includes(t))}
						onChange={(event) => setTag(event.target.value)}
						onChoose={(item) => handleAddTag(item)}
						mapper={(t, index) => <TagPick key={index} tag={t} />}>
						<ClearIconButton className='h-5' icon='/assets/icons/search.png' title='search' onClick={() => loadNextPage()} />
					</SearchBox>
					<OptionBox
						className='h-10 w-full max-w-none md:max-w-[10rem]'
						items={Tags.SORT_TAG}
						mapper={(item, index) => (
							<span key={index} className='whitespace-nowrap'>
								{item.displayName}
							</span>
						)}
						onChoose={(item) => handleSetSortQuery(item)}
					/>
				</section>
				<TagEditContainer className='m-auto flex w-3/4 items-center justify-center' tags={tagQuery} onRemove={(index) => handleRemoveTag(index)} />
			</span>
			<section className='flex flex-row items-center justify-center p-2'>
				<Trans i18nKey='total-schematic' /> : {totalSchematic > 0 ? totalSchematic : 0}
			</section>
			<InfiniteScroll className='preview-container' infinitePage={usePage} mapper={(v) => <SchematicPreview key={v.id} schematic={v} handleOpenModel={handleOpenSchematicInfo} />} />
			<footer className='flex w-full items-center justify-center'></footer>
			<section className='fixed bottom-4 right-0 flex flex-col items-center justify-center'>
				<ClearButton title={i18n.t('upload-your-schematic')} onClick={() => navigate('/upload/schematic')}>
					<AddIcon className='h-10 w-10' />
				</ClearButton>
				<ScrollToTopButton className='h-10 w-10 ' containerId='schematic' />
			</section>
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

interface SchematicPreviewProps {
	schematic: Schematic;
	handleOpenModel: (schematic: Schematic) => void;
}

export function SchematicPreview({ schematic, handleOpenModel }: SchematicPreviewProps) {
	const copy = useClipboard();

	return (
		<PreviewCard className='relative h-full w-full' key={schematic.id}>
			<ClearIconButton
				className='absolute left-0 top-0 p-2'
				title={i18n.t('copy-link')}
				icon='/assets/icons/copy.png'
				onClick={() => copy(`${FRONTEND_URL}schematic/${schematic.id}`)}></ClearIconButton>
			<PreviewImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} onClick={() => handleOpenModel(schematic)} />
			<ColorText className='flex items-center justify-center p-4 text-center capitalize' text={schematic.name} />
			<SchematicPreviewButton schematic={schematic} />
		</PreviewCard>
	);
}
interface SchematicPreviewButtonProps {
	schematic: Schematic;
}

function SchematicPreviewButton({ schematic }: SchematicPreviewButtonProps) {
	const copy = useClipboard();

	const likeService = useLike('schematic', schematic.id, schematic.like, schematic.userLike);
	schematic.like = likeService.likes;

	return (
		<section className='flex flex-row gap-2 p-2'>
			<IconButton className='h-8 w-full' title='up vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
			<LikeCount className='h-8 w-full' count={likeService.likes} />
			<IconButton className='h-8 w-full' title='down vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
			<IconButton className='h-8 w-full' title='copy' icon='/assets/icons/copy.png' onClick={() => API.get(`schematic/${schematic.id}/data`).then((result) => copy(result.data))} />
			<DownloadButton className='h-8 w-full' href={`schematic/${schematic.id}/download`} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
		</section>
	);
}

interface SchematicInfoProps {
	schematic: Schematic;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: Schematic) => void;
}

export function SchematicInfo({ schematic, handleCloseModel, handleDeleteSchematic }: SchematicInfoProps) {
	const copy = useClipboard();

	const { schematicSearchTag } = useTags();

	return (
		<main className='box-border flex h-full w-full flex-col justify-between gap-4 overflow-y-auto p-8'>
			<section className='relative flex flex-row flex-wrap gap-2'>
				<InfoImage src={`${API_BASE_URL}schematic/${schematic.id}/image`} />
				<ClearIconButton
					className='absolute left-0 top-0 p-2'
					title={i18n.t('copy-link').toString()}
					icon='/assets/icons/copy.png'
					onClick={() => copy(`${FRONTEND_URL}schematic/${schematic.id}`)}
				/>
				<section className='flex flex-col flex-wrap gap-2'>
					<ColorText className='text-2xl capitalize' text={schematic.name} />
					<Author authorId={schematic.authorId} />
					<Description description={schematic.description} />
					<ItemRequirement requirement={schematic.requirement} />
					<TagContainer tags={Tags.parseArray(schematic.tags, schematicSearchTag)} />
					<section className='flex flex-row gap-2 whitespace-nowrap'>
						<Trans i18nKey='verify-by' /> <LoadUserName userId={schematic.verifyAdmin} />
					</section>
				</section>
			</section>
			<SchematicInfoButton
				schematic={schematic}
				handleCloseModel={handleCloseModel} //
				handleDeleteSchematic={handleDeleteSchematic}
			/>
			<CommentSection contentType='schematic' targetId={schematic.id} />
		</main>
	);
}

interface SchematicInfoButtonProps {
	schematic: Schematic;
	handleCloseModel: () => void;
	handleDeleteSchematic: (schematic: Schematic) => void;
}

function SchematicInfoButton({ schematic, handleCloseModel, handleDeleteSchematic }: SchematicInfoButtonProps) {
	const { me } = useMe();
	const copy = useClipboard();

	const { dialog, setVisibility } = useDialog();

	const likeService = useLike('schematic', schematic.id, schematic.like, schematic.userLike);
	schematic.like = likeService.likes;

	return (
		<section className='flex flex-row justify-between'>
			<section className='flex flex-row gap-2'>
				<IconButton className='h-8 w-8' title='up-vote' active={likeService.liked} icon='/assets/icons/up-vote.png' onClick={() => likeService.like()} />
				<LikeCount className='h-8 w-8' count={likeService.likes} />
				<IconButton className='h-8 w-8' title='down-vote' active={likeService.disliked} icon='/assets/icons/down-vote.png' onClick={() => likeService.dislike()} />
				<IconButton className='h-8 w-8' title={i18n.t('copy')} icon='/assets/icons/copy.png' onClick={() => API.get(`schematic/${schematic.id}/data`).then((result) => copy(result.data))} />
				<DownloadButton className='h-8 w-8' href={`schematic/${schematic.id}/download`} download={`${('schematic_' + schematic.name).trim().replaceAll(' ', '_')}.msch`} />
				<IfTrue
					condition={Users.isAuthorOrAdmin(schematic.id, me)} //
					whenTrue={<IconButton className='h-8 w-8' title={i18n.t('delete')} icon='/assets/icons/trash-16.png' onClick={() => setVisibility(true)} />}
				/>
			</section>
			<BackButton onClick={handleCloseModel} />
			{dialog(
				<ConfirmBox onClose={() => setVisibility(false)} onConfirm={() => handleDeleteSchematic(schematic)}>
					<Icon className='h-4 w-4 p-2' icon='/assets/icons/info.png' />
					<Trans i18nKey='delete-schematic-dialog' />
				</ConfirmBox>,
			)}
		</section>
	);
}
