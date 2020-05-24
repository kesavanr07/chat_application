import React from 'react';
import Authenticate from './Authenticate.js';
import { Container, Col, Form, Button, FormControl, Jumbotron } from 'react-bootstrap';


class Login extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email_id: '',
            password: '',
            err_msg : {
                is_error : false,
                email_id : "",
                password : "",
                login_err: ""
            }
        }
    }

    componentDidMount() {

    }
    updateFormValue = (event) => {
        const { id, value } = event.target;
        this.setState({
            [id] : value
        });
    }

    redirectRegister = () => {
        window.location.href = "/register";
    };
  
    async loginUser() {
        const {email_id, password, err_msg} = this.state;
        err_msg.is_error = false;
        err_msg.login_err = "";
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },  
                body : JSON.stringify({
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
                err_msg.login_err = (user_data && user_data.data) || "Unexpected error occured";
                err_msg.is_error = true;
            }
        } catch (error) {
            err_msg.login_err = "Unexpected error occured"
            err_msg.is_error= true;
        }
        if(err_msg.is_error) {
            this.setState({
                err_msg : err_msg
            });
        }
    }

    submitLogin = () => {
        const err_obj = this.state.err_msg;

        err_obj.is_error = false;
        err_obj.email_id = "";
        err_obj.password = "";

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
            this.loginUser();
        }
    }

    render() {
        const token = Authenticate.loggedIn();
        if(!token)
            return window.location.href = "/dashboard";

        const { email_id, password, err_msg } = this.state;
        return (
            < Container >
            <Jumbotron>
                <Col md={{ span: 4, offset: 4 }}>
                    <h3 className="text-center">Login User</h3><br/>
                    <Form>
                        <Form.Group>
                            <Form.Label>Email Id</Form.Label>
                            <FormControl 
                                type="text"
                                placeholder="Email Id"
                                id="email_id"
                                value={email_id}
                                onChange={this.updateFormValue}
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
                                placeholder="Password"
                                value={password}
                                onChange={this.updateFormValue}
                            />
                            {err_msg.password &&
                                <Form.Text className="text-error">{err_msg.password}</Form.Text>
                            }
                        </Form.Group>
                        {err_msg.login_err &&
                            <Form.Text className="text-error text-center">{err_msg.login_err}</Form.Text>
                        }
                        {/* <Button variant="light">Cancel</Button> */}
                        <Button variant="secondary" onClick={this.redirectRegister} className="pull-right">Register</Button>
                        <Button className="float-right" onClick={this.submitLogin}>Login</Button>
                    </Form>
                </Col>
                </Jumbotron>
            </Container>
        );
    }
}

export default Login;
