import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { TagChoice, Tags } from 'src/components/Tag';

interface TagProviderProps {
	children: ReactNode;
}

interface TagContextProps {
	schematicUploadTag: TagChoice[];
	schematicSearchTag: TagChoice[];
	mapUploadTag: TagChoice[];
	mapSearchTag: TagChoice[];
	postUploadTag: TagChoice[];
	postSearchTag: TagChoice[];
}

const TagContext = React.createContext<TagContextProps>({
	schematicUploadTag: [],
	schematicSearchTag: [],
	mapUploadTag: [],
	mapSearchTag: [],
	postUploadTag: [],
	postSearchTag: [],
});

export function useTags() {
	return useContext(TagContext);
}

export default function TagProvider({ children }: TagProviderProps) {
	const [tags, setTags] = useState<TagContextProps>({
		schematicUploadTag: [],
		schematicSearchTag: [],
		mapUploadTag: [],
		mapSearchTag: [],
		postUploadTag: [],
		postSearchTag: [],
	});

	useEffect(() => {
		Tags.getTag('schematic-upload-tag', (data) =>
			setTags((prev) => {
				return { ...prev, schematicUploadTag: data };
			}),
		);
		Tags.getTag('schematic-search-tag', (data) =>
			setTags((prev) => {
				return { ...prev, schematicSearchTag: data };
			}),
		);
		Tags.getTag('map-upload-tag', (data) =>
			setTags((prev) => {
				return { ...prev, mapUploadTag: data };
			}),
		);
		Tags.getTag('map-search-tag', (data) =>
			setTags((prev) => {
				return { ...prev, mapSearchTag: data };
			}),
		);
		Tags.getTag('post-upload-tag', (data) =>
			setTags((prev) => {
				return { ...prev, postUploadTag: data };
			}),
		);
		Tags.getTag('post-search-tag', (data) =>
			setTags((prev) => {
				return { ...prev, postSearchTag: data };
			}),
		);
	}, []);

	return <TagContext.Provider value={tags}>{children}</TagContext.Provider>;
}
