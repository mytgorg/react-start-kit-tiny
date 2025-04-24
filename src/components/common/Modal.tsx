import React from 'react';
import ReactDOM from 'react-dom';
import { Modal as ReactstrapModal } from 'reactstrap';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    centered?: boolean;
    size?: 'sm' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    children, 
    className = '',
    centered = true,
    size
}) => {
    // Don't render anything if modal is not open
    if (!isOpen) return null;

    // Create portal to render modal outside of app hierarchy
    return ReactDOM.createPortal(
        <ReactstrapModal
            isOpen={true}
            toggle={onClose}
            className={className}
            centered={centered}
            size={size}
            unmountOnClose={true}
        >
            {children}
        </ReactstrapModal>,
        document.body
    );
};

export default Modal;