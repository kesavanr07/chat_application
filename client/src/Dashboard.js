
import React from 'react';
import { Container, Col, Alert, Navbar, Toast, Nav, ListGroup, InputGroup, Row, FormControl, Button, Jumbotron } from 'react-bootstrap';
import _ from 'underscore';
import Authenticate from './Authenticate.js';
import "./Dashboard.css";
import ChatWindow from "./ChatWindow.js";
import socketIOClient from "socket.io-client";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_data   : [],
            user_contacts: [],
            user_id     : Authenticate.getUserId(),
            to_user_id  : 0,
            content     : "",
            chats       : [],
            show_message    : false,
            received_msg    : "",
            chat_username   : "",
            searched_keyword   : ""
        }
    }

    getSocket = () => {
        return socketIOClient(Authenticate.domain);
    }

    showHideMessage = () => {
        this.setState(state_obj => {
            state_obj.show_message = !state_obj.show_message;
            return state_obj;
        });
    }

    filterUser = (event) => {
        const { value } = event.target;
        this.setState({
            searched_keyword : value
        });
    }

    getMessages = async (to_user_id) => {
        const { user_id } = this.state;
        this.setState({
            to_user_id,
            content : ""
        });

        Authenticate.requestAPI({
            user_id,
            to_user_id
        }, "messages/get", (err, response) => {
            if(err) return console.log('err :>> ', err);

            this.setState({
                chats : (response && response.message_data) || []
            });

        });
    }

    getUserData = (isload = false) => {
        const {user_id, user_contacts, searched_keyword} = this.state;
        Authenticate.requestAPI({
            user_id,
            searched_keyword
        }, "get_user", (err, response) => {
            if(err) return console.log('err :>> ', err);

            const user_data = (response && response.user_data) || [];
                
            var to_user_id = 0;

            if(user_data.length > 0)
                to_user_id = (user_data[0] && user_data[0].user_id) || 0;

            this.setState({
                user_data,
                to_user_id,
                user_contacts : (isload === true) ? user_data : user_contacts
            });
            if(to_user_id !== 0) {
                this.getMessages(to_user_id);
            } else {
                this.setState({
                    chats : []
                });
            }
        });
    }

    async componentDidMount() {
        const socket = this.getSocket();

        socket.on("receive_msg", (data) => {
            if(data) {
                const { to_user_id, user_id, user_contacts, chats } = this.state;
                const msg_user_data = _.findWhere(user_contacts, {user_id : data.user_id});
                if(msg_user_data && user_id === data.to_user_id) {
                    if(data && data.user_id === to_user_id) {
                        chats.unshift(data);
                    }
                    this.setState({
                        chats,
                        chat_username : msg_user_data.username,
                        received_msg : data.content,
                        show_message : true
                    });
                }        
            }    
        });
        this.getUserData(true);
    }

    updateMessage = (event) => {
        const { value } = event.target;
        this.setState({
            content : value
        });
    }

    sendMessage = async () => {
        const { user_id, to_user_id, content, chats } = this.state;
        if(content) {
            Authenticate.requestAPI({
                user_id,
                to_user_id,
                content
            }, "messages/save", (err, response) => {
                if(err) return console.log('err :>> ', err);

                const saved_message = (response && response.saved_message) || [];
                if(!_.isEmpty(saved_message)) {
                    chats.unshift(saved_message);
                    this.setState({
                        chats,
                        content : ""
                    });
                    const socket = this.getSocket();
                    socket.emit("send_msg", saved_message);
                }
            });
        }
    }

    render() {
        const token = Authenticate.loggedIn();
        if(token)
            return window.location.href = "/login";
        
        const { user_data, user_id, to_user_id, show_message, chat_username, received_msg, content, chats } = this.state;

        return (
            <Container className="dashboard">
                <Col xs={{ span : 6, offset:4}}>
                    <Toast show={show_message} onClick={this.showHideMessage}>
                        <Toast.Header>
                            <img
                                src="holder.js/20x20?text=%20"
                                className="rounded mr-2"
                                alt=""
                            />
                            New Message from <strong className="mr-auto text-capitalize">&nbsp;{chat_username}</strong>
                            <small></small>
                        </Toast.Header>
                        <Toast.Body>{received_msg}</Toast.Body>
                    </Toast>
                </Col>
                <Navbar className="bg-light justify-content-between">
                    <Navbar.Brand href="#home" className="text-capitalize">Hi, {Authenticate.getUsername()}</Navbar.Brand>
                    <Nav>
                        <Nav.Link onClick={Authenticate.logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar>
                <Row>
                    <Col md={{ span: 4 }}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Search User"
                                aria-label="Search User"
                                aria-describedby="search"
                                onChange={this.filterUser}
                            />
                            <InputGroup.Append>
                                <Button onClick={this.getUserData} id="search">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        {/* <Form.Control placeholder="Search User" /> */}
                        <ListGroup>
                        {user_data.map((value, index) => {
                            return (
                                <ListGroup.Item action 
                                    className={to_user_id === value.user_id ? 'active' : ''}
                                    eventKey={"contact_"+index} 
                                    onClick={() => this.getMessages(value.user_id)}
                                    key={index}
                                    ref={to_user_id === value.user_id ?  this.simulateClick : ""}
                                >
                                    {value.username}<br/>
                                    <small>{value.email_id}</small>
                                </ListGroup.Item>
                            )
                        })}
                        </ListGroup>
                        {user_data.length === 0 ? <Alert variant="warning">No User found</Alert>: ""}
                    </Col>
                    <Col md={{ span: 8}}>
                        <Jumbotron>
                            <InputGroup className="mb-3">
                                <FormControl
                                type="text"
                                value={content}
                                placeholder="Enter Message"
                                aria-label="Enter Message"
                                onChange={this.updateMessage}
                                />
                                <InputGroup.Append>
                                    <Button onClick={this.sendMessage}>Send</Button>
                                </InputGroup.Append>
                            </InputGroup>
                            <ChatWindow chats={chats} userId={user_id}/>
                        </Jumbotron>
                    </Col>
                    </Row>
            </Container>
        );
    }
}

export default Dashboard;
