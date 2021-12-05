using Cassandra.Data.Linq;
using Cassandra.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MinChatNet.ChatApi.Clients;
using MinChatNet.ChatApi.Models;
using MinChatNet.ChatApi.Persistence;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, Room.PublicRoomId);
        }

        public async Task SendMessage(SendMessageModel messageModel)
        {
            var user = await GetUserModelAsync();

            var mapper = new Mapper(_cassSession);

            if (messageModel.RoomId != Room.PublicRoomId)
            {
                var publicRoom = await mapper.FirstOrDefaultAsync<Room>("WHERE Id = ?", messageModel.RoomId);
                if (publicRoom?.Members?.Contains(user.UserId) == false)
                {
                    throw new UnauthorizedAccessException();
                }
            }

            var message = new Message
            {
                Content = messageModel.Content,
                UserId = user.UserId,
                UserDisplayName = user.DisplayName,
                RoomId = messageModel.RoomId
            };

            await mapper.InsertAsync(message, insertNulls: true, ttl: 3600);

            await Clients.Group(message.RoomId).ReceiveMessage(new MessageModel
            {
                Content = message.Content,
                FromUser = user,
                UserDisplayName = user.DisplayName,
                RoomId = message.RoomId,
                Time = message.Time
            });
        }

        public async Task JoinPrivateRoom(string roomId)
        {
            var mapper = new Mapper(_cassSession);

            if (roomId == Room.PublicRoomId)
            {
                return;
            }

            await mapper.UpdateAsync<Room>("SET Members = Members + ? WHERE Id = ?", new HashSet<string>
            {
                Context.UserIdentifier
            }, roomId);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        }

        private async Task<UserModel> GetUserModelAsync()
        {
            var isGuest = Context.User.FindFirstValue(ClaimTypes.Anonymous) == $"{true}";
            if (isGuest)
            {
                var userModel = new UserModel
                {
                    DisplayName = Context.User.FindFirstValue(JwtRegisteredClaimNames.GivenName),
                    IsGuest = true,
                    UserId = Context.UserIdentifier
                };
                return userModel;
            }
            else
            {
                return await _dataContext.Users
                    .Where(o => o.Id == Context.UserIdentifier)
                    .Select(o => new UserModel
                    {
                        Avatar = o.Avatar,
                        DisplayName = o.DisplayName,
                        IsGuest = false,
                        UserId = o.Id
                    }).FirstOrDefaultAsync();
            }
        }
    }
}
