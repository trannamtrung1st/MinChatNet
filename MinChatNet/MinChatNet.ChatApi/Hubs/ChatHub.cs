using Microsoft.AspNetCore.SignalR;

namespace MinChatNet.ChatApi.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string displayName, string messageContent)
        {
            await Clients.All.SendAsync("receiveMessage", displayName, messageContent);
        }
    }
}
