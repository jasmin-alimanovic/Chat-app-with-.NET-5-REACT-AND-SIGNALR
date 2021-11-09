using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatService.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;
        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "Chat Bot";
            _connections = connections;
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left");
                await SendUsersInRoom(userConnection.Room);
            }
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            _connections[Context.ConnectionId] = userConnection;
            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage",  _botUser,
                $"{userConnection.User} has joined {userConnection.Room}");
            await SendUsersInRoom(userConnection.Room);

        }

        public async Task SendMessage(string message)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", userConnection.User, message);
            }
        }

        public async Task IsUserTyping(bool isTyping)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.GroupExcept(userConnection.Room, Context.ConnectionId).SendAsync("Typing", userConnection.User, isTyping);
            }
        }
        public  Task SendUsersInRoom(string room)
        {

            var users = _connections.Values
            .Where(u => u.Room.Equals(room))
            .Select(u => u.User);

            return Clients.Group(room).SendAsync("UsersInRoom", users);
            
        }
    }
}
