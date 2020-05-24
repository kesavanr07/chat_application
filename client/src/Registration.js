import React from 'react';
import { Container, Col, Form, Button, FormControl, Jumbotron } from 'react-bootstrap';
import Authenticate from './Authenticate.js';


class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email_id: "",
            err_msg : {
                is_error : false,
                username : "",
                password : "",
                email_id : "",
                register_err : ""
            }
        }
    }

    redirectLogin = () => {
        window.location.href = "/login";
    }
    
    updateFormValue = (event) => {
        const { id, value } = event.target;
        this.setState({
            [id] : value
        });
    }

    async registerUser() {
        const {email_id, username, password, err_msg} = this.state;
        
        err_msg.is_error = false;
        err_msg.register_err = "";
        
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },  
                body : JSON.stringify({
                    username : username,
                    email_id : email_id,
                    password : password
                })
            });
            const user_data = await response.json();

            if(user_data && user_data.status === "success") {
                if(user_data.data && user_data.data.token)
                    Authenticate.setToken(user_data.data)

                return window.location.href = "/dashboard";
            } else {
                err_msg.register_err = (user_data && user_data.data) || "Unexpected error occured";
                err_msg.is_error = true;
            }
        } catch (error) {
            err_msg.register_err = "Unexpected error occured"
            err_msg.is_error= true;
        }
        if(err_msg.is_error) {
            this.setState({
                err_msg : err_msg
            });
        }
    }

    submitRegistration = () => {
        console.log('state :>> ', this.state);
        const err_obj = this.state.err_msg;

        err_obj.is_error = false;
        err_obj.username = "";
        err_obj.email_id = "";
        err_obj.password = "";

        if(!this.state.username) {
            err_obj.username = "Please enter Username";
            err_obj.is_error = true;
        }

        if(!this.state.email_id) {
            err_obj.email_id = "Please enter Email Id";
            err_obj.is_error = true;
        }

        if(!this.state.password) {
            err_obj.password = "Please enter Password";
            err_obj.is_error = true;
        }

        this.setState({
            err_msg : err_obj
        });

        if(err_obj.is_error === false) {
            this.registerUser();
        }
    }

    render() {
        const token = Authenticate.loggedIn();
        if(!token)
            return window.location.href = "/dashboard";

        const { username, password, email_id, err_msg } = this.state;
        return (
            <Container>
            <Jumbotron>
                <Col md={{ span: 4, offset: 4 }}>
                    <h3 className="text-center">Register User</h3><br/>
                    <Form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <FormControl 
                                type="text"
                                id="username"
                                value={username}
                                onChange={this.updateFormValue}
                                placeholder="Username"
                            />
                            {err_msg.username &&
                                <Form.Text className="text-error">{err_msg.username}</Form.Text>
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <FormControl 
                                type="email"
                                id="email_id"
                                value={email_id}
                                onChange={this.updateFormValue}
                                placeholder="Email Id"
                            />
                            {err_msg.email_id &&
                                <Form.Text className="text-error">{err_msg.email_id}</Form.Text>
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <FormControl 
                                type="password"
                                id="password"
                                value={password}
                                onChange={this.updateFormValue}
                                placeholder="Password"
                            />
                            {err_msg.password &&
                                <Form.Text className="text-error">{err_msg.password}</Form.Text>
                            }
                        </Form.Group>
                        {err_msg.register_err &&
                            <Form.Text className="text-error text-center">{err_msg.register_err}</Form.Text>
                        }
                        <Button variant="secondary" onClick={this.redirectLogin}>Login</Button>
                        <Button className="float-right" onClick={this.submitRegistration}>Register</Button>
                    </Form>
                </Col>
                </Jumbotron>
            </Container>
        );
    }
}

export default Registration;
