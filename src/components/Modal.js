import React from 'react';

class Modal extends React.PureComponent {

    hideModal = ()=> {

        this.props.hideModal(true);
    }

    render(){
        const modalContent = this.props.visible === true ? <div className="full_ov"><i className="lnr lnr-cross" onClick={ ()=> { this.hideModal()}}></i>{this.props.content}</div> : '';
        const modalClass = this.props.visible === true ? 'active_modal' : '';

        return(
            <div className={`modal ${modalClass}`}>
                {modalContent}
            </div>
        );
    }

}

export default Modal;