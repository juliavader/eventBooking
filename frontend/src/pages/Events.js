import React, { Component } from 'react';
import "./css/Events.css";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";


export default class Events extends Component {

    state = {
        creating: false
    }

    StartEventCreateHandler = () => {
        this.setState({ creating: true });
    }
    modalCancelHandler =()=>{
        this.setState({ creating: false });
    }
    modalConfirmHandler=()=>{
        this.setState({ creating: false });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.creating && (
                    <React.Fragment>
                        <Backdrop />
                        <Modal 
                        title="Add event !" 
                        canConfirm
                        canCancel
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        >
                            <p>My modal content </p>
                        </Modal>
                    </React.Fragment>)}
                <div className="events-controls">
                    <p className="events-paragraph">Share your own Events to the others ! </p>
                    <button className="btn" onClick={this.StartEventCreateHandler}>
                        Create Event
                </button>
                </div>

            </React.Fragment>
        )
    }
}