import { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import Times from '../../assets/images/icons/times/Times';
import Download from '../../assets/images/icons/download/Download';
import { downloadFile } from '../../utils/downloadFile';
import './ResumeModal.scss';

interface ResumeModalProps {
	isOpen: boolean;
	onClose: () => void;
	src: string;
	downloadSrc: string;
}

const ResumeModal = ({ isOpen, onClose, src, downloadSrc }: ResumeModalProps) => {
	const [delayedIsOpen, setDelayedIsOpen] = useState(false);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		const timeout = setTimeout(
			() => {
				setDelayedIsOpen(isOpen);
			},
			isOpen ? 0 : 300,
		);

		document.body.classList.toggle('modal-open', isOpen);

		if (isOpen) {
			document.body.style.overflow = 'hidden';
			triggerRef.current = document.activeElement as HTMLElement;
			const focusTimeout = setTimeout(() => {
				closeButtonRef.current?.focus();
			}, 50);
			return () => {
				clearTimeout(timeout);
				clearTimeout(focusTimeout);
			};
		} else {
			document.body.style.overflow = '';
			triggerRef.current?.focus();
			return () => clearTimeout(timeout);
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !iframeRef.current) return;

		const iframe = iframeRef.current;

		const handleLoad = () => {
			const doc = iframe.contentDocument;
			if (!doc) return;

			const style = doc.createElement('style');
			style.textContent = `
				* { cursor: none !important; }
				html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
				#sidebar { display: none !important; }
				#page-container {
					position: static !important;
					background: white !important;
					background-image: none !important;
					overflow: visible !important;
				}
				.pf { margin: 0 !important; box-shadow: none !important; }
			`;
			doc.head.appendChild(style);

			let naturalPageWidth = 0;

			const applyScale = () => {
				const pf = doc.querySelector<HTMLElement>('.pf');
				if (!pf) return;

				if (!naturalPageWidth) {
					pf.style.transform = '';
					naturalPageWidth = pf.offsetWidth;
				}

				const scale = iframe.clientWidth / naturalPageWidth;
				pf.style.transform = `scale(${scale})`;
				pf.style.transformOrigin = 'top left';
				pf.style.marginBottom = `${pf.offsetHeight * (scale - 1)}px`;
			};

			applyScale();

			resizeObserverRef.current?.disconnect();
			resizeObserverRef.current = new ResizeObserver(applyScale);
			resizeObserverRef.current.observe(iframe);

			const script = doc.createElement('script');
			script.textContent = `
				document.addEventListener('pointermove', (e) => {
					const rect = window.frameElement.getBoundingClientRect();
					window.parent.dispatchEvent(new PointerEvent('pointermove', {
						clientX: e.clientX + rect.left,
						clientY: e.clientY + rect.top,
					}));
				});
			`;
			doc.body.appendChild(script);
		};

		iframe.addEventListener('load', handleLoad);
		if (iframe.contentDocument?.readyState === 'complete') {
			handleLoad();
		}

		return () => {
			iframe.removeEventListener('load', handleLoad);
			resizeObserverRef.current?.disconnect();
			resizeObserverRef.current = null;
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
				return;
			}

			// Focus trap
			if (event.key === 'Tab') {
				const focusableElements =
					document.querySelectorAll<HTMLElement>(
						'.resume-modal__content button, .resume-modal__content a',
					);
				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				if (event.shiftKey && document.activeElement === firstElement) {
					event.preventDefault();
					lastElement?.focus();
				} else if (!event.shiftKey && document.activeElement === lastElement) {
					event.preventDefault();
					firstElement?.focus();
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.currentTarget === event.target) {
			onClose();
		}
	};

	const handleDownload = () => {
		downloadFile(downloadSrc, 'NoahHarborthResume.pdf');
	};

	if (!delayedIsOpen && !isOpen) return null;

	return (
		<div
			className={`resume-modal__backdrop ${isOpen ? 'fade-in' : 'fade-out'}`}
			onClick={handleBackdropClick}
		>
			<div
				className={`resume-modal__content ${isOpen ? 'fade-scale-in' : 'fade-scale-out'}`}
				role='dialog'
				aria-modal='true'
				aria-label='Resume'
			>
				<div className='resume-modal__actions'>
					<Button
						className='resume-modal__download'
						styleType='round'
						onClick={handleDownload}
						aria-label='Download resume'
					>
						<Download size={16} color='inherit' />
					</Button>
					<Button
						ref={closeButtonRef}
						className='resume-modal__close'
						styleType='round'
						onClick={onClose}
						aria-label='Close resume'
					>
						<Times size={16} color='inherit' />
					</Button>
				</div>
				<div className='resume-modal__iframe-container'>
					<iframe
						ref={iframeRef}
						src={src}
						title='Resume'
						className='resume-modal__iframe'
					/>
				</div>
				<div className='resume-modal__mobile-fallback'>
					<Button onClick={handleDownload}>
						<Download size={16} />
						download resume
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ResumeModal;
