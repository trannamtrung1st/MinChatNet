using Cassandra.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MinChatNet.ChatApi.Clients;
using MinChatNet.ChatApi.Models;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly DataContext _dataContext;
        private readonly ISession _cassSession;
        public ChatHub(DataContext dataContext,
            ISession cassSession)
        {
            _dataContext = dataContext;
            _cassSession = cassSession;
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

            var mapper = new Mapper(_cassSession);

            var message = new Message
            {
                Content = messageModel.Content,
                Time = DateTimeOffset.UtcNow,
                UserId = user.UserId,
                RoomId = "public"
            };

            await mapper.InsertAsync(message);

            await Clients.All.ReceiveMessage(new MessageModel
            {
                Content = message.Content,
                FromUser = user,
                Time = message.Time
            });
        }
    }
}
