using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MinChatNet.ChatApi.Clients;
using MinChatNet.ChatApi.Models;
using MinChatNet.ChatApi.Persistence;

namespace MinChatNet.ChatApi.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly DataContext _dataContext;
        public ChatHub(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task SendMessage(SendMessageModel messageModel)
        {
            var user = await _dataContext.Users
                .Where(o => o.Id == Context.UserIdentifier)
                .Select(o => new UserModel
                {
                    Avatar = o.Avatar,
                    DisplayName = o.DisplayName,
                    UserId = o.Id
                }).FirstOrDefaultAsync();

            await Clients.All.ReceiveMessage(new MessageModel
            {
                Content = messageModel.Content,
                FromUser = user,
                Time = DateTimeOffset.UtcNow
            });
        }
    }
}
