using Cassandra.Data.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinChatNet.ChatApi.Models;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.Controllers
{
    [Route("api/messages")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly ISession _cassSession;
        public MessageController(DataContext dataContext,
            ISession cassSession)
        {
            _dataContext = dataContext;
            _cassSession = cassSession;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetMessageHistory([FromQuery] DateTimeOffset previous)
        {
            const int DefaultTake = 17;

            await Task.Delay(1000);

            var messTbl = new Table<MessageMV>(_cassSession);

            // [Important] can only use EQ (==) or IN (Contains) for partition keys,
            // other filters must be used with AllowFiltering
            var (month, year) = (previous.Month, previous.Year);
            var messages = (await messTbl
                .Where(o => o.RoomId == "public" && o.Month == month && o.Year == year)
                .Where(o => o.Time < previous)
                .Take(DefaultTake)
                .AllowFiltering()
                .ExecuteAsync())
                .ToArray();
            var messageUsers = messages.Select(o => o.UserId).Distinct().ToArray();
            var users = await _dataContext.Users.Where(u => messageUsers.Contains(u.Id))
                .Select(o => new UserModel
                {
                    Avatar = o.Avatar,
                    DisplayName = o.DisplayName,
                    IsGuest = false,
                    UserId = o.Id
                }).ToDictionaryAsync(o => o.UserId);

            var isOldest = messages.Length < DefaultTake;

            var messageModels = messages.Select(o => new MessageModel
            {
                Content = o.Content,
                Time = o.Time,
                UserDisplayName = o.UserDisplayName,
                FromUser = users.TryGetValue(o.UserId, out var fromUser) ? fromUser : new UserModel
                {
                    DisplayName = o.UserDisplayName,
                    UserId = o.UserId,
                    IsGuest = true,
                }
            }).ToArray();

            var messageHistoryModel = new MessageHistoryResponseModel
            {
                Messages = messageModels,
                IsOldest = isOldest
            };

            return Ok(messageHistoryModel);
        }
    }
}
