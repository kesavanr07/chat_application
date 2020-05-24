import React from 'react';
import { Card, Alert } from 'react-bootstrap';

class ChatWindow extends React.Component {
    render() {
        const {chats, userId} = this.props;
        return (
            <div id="chat_box">
                {chats.map((value, index) => {
                    return (
                        <Card className={(value.user_id === userId) ? "my_chat" : ""} key={index}>
                            <Card.Body>{value.content}</Card.Body>
                        </Card>
                    )
                })}
                {chats.length === 0 ? <Alert variant="warning">No Chat found</Alert>: ""}
            </div>
        );
    }
}

export default ChatWindow;
