using Cassandra.Data.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinChatNet.ChatApi.Models;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.Controllers
{
    [Route("api/messages")]
    [ApiController]
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

            var messages = (await messTbl.Where(o => o.RoomId == "public" && o.Time < previous)
                .Take(DefaultTake)
                .OrderByDescending(o => o.Time)
                .AllowFiltering()
                .ExecuteAsync())
                .ToArray();
            var messageUsers = messages.Select(o => o.UserId).Distinct().ToArray();
            var users = await _dataContext.Users.Where(u => messageUsers.Contains(u.Id))
                .Select(o => new UserModel
                {
                    Avatar = o.Avatar,
                    DisplayName = o.DisplayName,
                    UserId = o.Id
                }).ToDictionaryAsync(o => o.UserId);

            var isOldest = messages.Length < DefaultTake;

            var messageModels = messages.Select(o => new MessageModel
            {
                Content = o.Content,
                Time = o.Time,
                FromUser = users.TryGetValue(o.UserId, out var fromUser) ? fromUser : null
            }).ToArray();

            var messageHistoryModel = new MessageHistoryResponseModel
            {
                Messages = messageModels,
                IsOldest = isOldest
            };

            return Ok(messageHistoryModel);
        }

        private async Task InitMockMessages()
        {
            if (Init) return;

            Init = true;
            var random = new Random();

            var users = await _dataContext.Users.Select(o => new UserModel
            {
                Avatar = o.Avatar,
                DisplayName = o.DisplayName,
                UserId = o.Id
            }).ToArrayAsync();

            foreach (var message in MockMessages)
            {
                message.FromUser = users[random.Next(users.Length)];
            }
        }

        static MessageController()
        {
            var random = new Random();
            MockMessages = Enumerable.Range(0, random.Next(50, 100))
                .Select(i => new MessageModel
                {
                    Content = MockContents[random.Next(MockContents.Length)],
                    Time = DateTimeOffset.Now.Subtract(TimeSpan.FromSeconds(i)),
                }).ToArray();
        }

        static bool Init { get; set; }

        static MessageModel[] MockMessages;

        static string[] MockContents = new[]
        {
            "Hi, How are you?",
            "I'm fine thanks",
            "How was your day? Is it right\nI know that you are very tired",
            "Keep going !!! You are the best you know ❤️",
            "My name is Trung",
            "ABCD\nXYZY"
        };
    }
}
