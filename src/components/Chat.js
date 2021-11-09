import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import MessageContainer from "./MessageContainer";

export default function Chat({
  messages,
  sendMessage,
  closeConnection,
  connection,
  currentUser,
  isTyping,
  user,
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    function Typing() {
      if (message !== "") connection?.invoke("IsUserTyping", true);
      else connection?.invoke("IsUserTyping", false);
    }
    Typing();
  }, [connection, message]);

  return (
    <div style={{ width: "924px" }}>
      <div>
        <Button variant="danger" onClick={closeConnection}>
          Leave Room
        </Button>
      </div>
      <Container className="chat">
        <MessageContainer isTyping={isTyping} messages={messages} user={user} />
        <Form
          style={{ height: "10%", position: "relative" }}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(message);
            setMessage("");
          }}
        >
          <input
            placeholder="Enter your message"
            className="chat-input"
            value={message}
            type="text"
            onInput={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button
            className="dark"
            type="submit"
            style={{
              position: "absolute",
              right: "0",
              bottom: "0",
              height: "100%",
              width: "100px",
            }}
          >
            Send
          </Button>
        </Form>
      </Container>
    </div>
  );
}
