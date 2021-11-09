import React, { useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import Message from "./Message";

export default function MessageContainer({ messages, isTyping, user }) {
  const messageRef = useRef();

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <Container ref={messageRef} className="message-container">
      {messages.map((m, index) => (
        <Message key={index} message={m} />
      ))}
      {isTyping && user && (
        <Message message={{ message: `${user} is typing`, user: null }} />
      )}
    </Container>
  );
}
