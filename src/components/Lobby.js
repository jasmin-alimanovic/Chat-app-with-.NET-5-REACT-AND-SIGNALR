import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function Lobby() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);

  async function joinRoom(user, room) {
    window.location.replace(`/chat?user=${user}&room=${room}`);
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        joinRoom(user, room);
      }}
      style={{ width: "400px" }}
    >
      <Form.Group>
        <Form.Control
          placeholder="Name"
          onChange={(e) => setUser(e.target.value)}
          className="mb-4"
        />
        <Form.Control
          placeholder="Room"
          onChange={(e) => setRoom(e.target.value)}
          className="mb-4"
        />
      </Form.Group>
      <Button variant="success" type="submit" disabled={!user || !room}>
        Join
      </Button>
    </Form>
  );
}
