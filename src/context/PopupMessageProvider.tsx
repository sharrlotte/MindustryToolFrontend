import { v4 } from 'uuid';
import ClearIconButton from 'src/components/ClearIconButton';

import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';

type PopupMessageType = 'info' | 'warning' | 'error';

interface PopupMessageData {
	content: ReactNode;
	duration: number;
	type: PopupMessageType;
	uuid: string;
}

export function usePopup() {
	return useContext(PopupMessageContext);
}

type PopupMessageContextProps = (content: ReactNode, duration: number, type: PopupMessageType) => void;

export const PopupMessageContext = React.createContext<PopupMessageContextProps>((_: ReactNode, __: number, ___: PopupMessageType) => {});

interface PopupMessageProvider {
	children: ReactNode;
}

export default function AlertProvider({ children }: PopupMessageProvider) {
	const [contents, setMessages] = useState<PopupMessageData[]>([]);

	function addMessage(content: ReactNode, duration: number, type: PopupMessageType) {
		let uuid: string = v4();
		let val: PopupMessageData = {
			content: content,
			duration: duration,
			uuid: uuid,
			type: type,
		};

		setMessages((prev) => [val, ...prev]);
	}

	function removeMessage(id: string) {
		setMessages((prev) => [...prev.filter((val) => id !== val.uuid)]);
	}

	return (
		<PopupMessageContext.Provider value={addMessage}>
			<section className='pointer-events-none absolute right-0 top-12 z-popup flex h-[calc(100vh-3rem)] w-screen flex-col items-end gap-1 overflow-hidden'>
				{contents.map((val) => (
					<PopupMessage //
						key={val.uuid}
						content={val.content}
						duration={val.duration}
						type={val.type}
						onTimeOut={() => removeMessage(val.uuid)}
					/>
				))}
			</section>
			{children}
		</PopupMessageContext.Provider>
	);
}

interface PopupMessageNode {
	content: ReactNode;
	duration: number;
	type: PopupMessageType;
	onTimeOut: () => void;
}

function PopupMessage({ content, duration, type, onTimeOut }: PopupMessageNode) {
	const ref = useRef({ duration, onTimeOut });

	useEffect(() => {
		let id: NodeJS.Timeout = setTimeout(() => {
			ref.current.onTimeOut();

			return () => clearTimeout(id);
		}, ref.current.duration * 1000);

		return () => clearTimeout(id);
	}, []);

	return (
		<section className={'pointer-events-auto min-w-[50%] max-w-full animate-slide-in overflow-hidden rounded-l-lg text-white md:min-w-[25%] md:max-w-[50%] ' + type}>
			<section className='flex w-full flex-row items-start justify-between gap-1 p-2'>
				<section className='p-2'>{content}</section>
				<ClearIconButton //
					className='aspect-square h-4 w-4 self-start align-top'
					icon='/assets/icons/quit.png'
					title='remove'
					onClick={() => onTimeOut()}
				/>
			</section>
			<div className='h-1 w-full origin-top-left bg-blue-500' style={{ animation: `timer ${duration}s linear forwards` }} />
		</section>
	);
}
