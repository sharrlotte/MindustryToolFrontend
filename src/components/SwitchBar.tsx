import React, { ReactNode } from 'react';
import ClearButton from 'src/components/ClearButton';
import i18n from 'src/util/I18N';

interface Switch {
	id: string;
	name: ReactNode;
	element: ReactNode;
}

interface SwitchBarProps {
	className?: string;
	elements: Switch[];
}

export default function SwitchBar({ className, elements }: SwitchBarProps) {
	const [currentElement, setCurrentElement] = React.useState<Switch>(elements[0]);

	function renderCurrentElement() {
		const cur = elements.find((element) => element.id === currentElement.id);

		if (cur) return <React.Fragment key={cur.id}>{cur.element}</React.Fragment>;

		throw new Error('No matching element for Switcher');
	}

	return (
		<div className={className ? className : ''}>
			<section className='flex flex-row gap-4 p-4 w-full overflow-x-auto no-scrollbar'>
				{elements.map((element) => (
					<ClearButton
						className={`capitalize py-2 whitespace-nowrap ${currentElement.id === element.id ? 'border-b-2' : ''} `}
						title={i18n.t(element.id)}
						key={element.id}
						onClick={() => setCurrentElement(element)}>
						{element.name}
					</ClearButton>
				))}
			</section>
			{renderCurrentElement()}
		</div>
	);
}