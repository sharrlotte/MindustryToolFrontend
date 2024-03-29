import ClearButton from 'src/components/ClearButton';

import React from 'react';

interface PreviewImageProps {
	src: string;
	onClick: () => void;
}

export default function PreviewImage({ src, onClick }: PreviewImageProps) {
	return (
		<ClearButton className='flex justify-center items-center' title='' onClick={() => onClick()}>
			<img className='object-cover w-[var(--preview-image-min-size)] h-[var(--preview-image-min-size)] border-b-2 border-slate-500' src={src} alt='schematic' />
		</ClearButton>
	);
}
