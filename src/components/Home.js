import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Chat from "./Chat";
import { useHistory } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Home() {
  const query = useQuery();
  const user = query.get("user");
  const room = query.get("room");
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState();
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [userTyping, setUserTyping] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl("https://localhost:5001/chat")
          .configureLogging(LogLevel.Information)
          .build();
        connection.on("ReceiveMessage", (user, message) => {
          setMessages((messages) => [...messages, { user, message }]);
        });
        connection?.on("Typing", (userCon, isT) => {
          setIsTyping(isT);
          setUserTyping(userCon);
        });
        connection?.on("UsersInRoom", (users) => {
          setUsersInRoom(users);
          console.log(users);
        });

        connection?.onclose((e) => {
          setConnection();
          setMessages([]);
          setUsersInRoom([]);
        });

        await connection.start();
        await connection.invoke("JoinRoom", { user, room });
        setConnection(connection);
      } catch (e) {
        console.log(e);
      }
    };

    joinRoom();
  }, [room, user]);

  const sendMessage = async (message) => {
    if (message === "") return;
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.error(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.stop();
      history.replace("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container className="home">
      <aside>
        {usersInRoom.map((user, index) => (
          <h6 key={index}>{user}</h6>
        ))}
      </aside>
      <Chat
        sendMessage={sendMessage}
        messages={messages}
        closeConnection={closeConnection}
        connection={connection}
        currentUser={user}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
        user={userTyping}
      />
    </Container>
  );
}
