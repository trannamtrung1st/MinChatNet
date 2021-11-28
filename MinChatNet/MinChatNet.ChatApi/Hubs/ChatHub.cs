using Microsoft.AspNetCore.SignalR;
using MinChatNet.ChatApi.Clients;
using MinChatNet.ChatApi.Models;

namespace MinChatNet.ChatApi.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(MessageModel messageModel)
        {
            await Clients.All.ReceiveMessage(messageModel);
        }
    }
}
