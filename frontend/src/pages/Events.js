import React, { Component } from 'react';
import "./css/Events.css";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from '../context/auth-context';

export default class Events extends Component {

    state = {
        creating: false,
        events: []
    }

    static contextType = AuthContext;


    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.descriptionElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
    }

    componentDidMount(){
        this.fetchEvents();
    }

    StartEventCreateHandler = () => {
        this.setState({ creating: true });
        const token = this.context.token;
    }
    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

    
  fetchEvents() {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        this.setState({events: events})
        
      })
      .catch(err => {
        console.log(err);
      });
  }

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            title.trim().length == 0 ||
            price <= 0 ||
            date.trim().length == 0 ||
            description.trim().length == 0
        ) {
            return;
        }

        const event = { title, price, date, description };
        console.log(event);

        const requestBody = {
            query: `
                mutation{
                    createEvent(eventInput:{title:"${title}", description : "${description}", price : ${price}, date :"${date}"}){
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                        }
                    }
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token

            }
        })
            .then(res => {
                if (res.status != 200 && res.status != 201) {
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then(resData => {
                this.fetchEvents();
            })
            .catch(err => {
                console.log(err);
            });

    }

    render() {
        const eventList = this.state.events.map(event=>{
            return <li className="event__list-item" key={event._id}>{event.title}</li>;
        })
        console.log(this.contextType);
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
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" ref={this.titleElRef} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="price">Price</label>
                                    <input type="number" id="price" ref={this.priceElRef} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="date">Date</label>
                                    <input type="datetime-local" id="date" ref={this.dateElRef} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="description">Description</label>
                                    <textarea name="" id="description" rows="5" ref={this.descriptionElRef} />
                                </div>
                            </form>
                        </Modal>
                    </React.Fragment>)}
                {this.context.token && (
                    <div className="events-controls">
                        <p className="events-paragraph">Share your own Events to the others ! </p>
                        <button className="btn" onClick={this.StartEventCreateHandler}>
                            Create Event
                        </button>
                    </div>
                )}
                <ul className="event__list">
                    {eventList}
                </ul>
            </React.Fragment>
        )
    }
}