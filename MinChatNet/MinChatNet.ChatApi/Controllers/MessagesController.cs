using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MinChatNet.ChatApi.Models;
using MinChatNet.ChatApi.Persistence;

namespace MinChatNet.ChatApi.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public MessageController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetMessageHistory([FromQuery] DateTimeOffset previous)
        {
            const int DefaultTake = 10;

            await Task.Delay(1000);

            await InitMockMessages();

            var messages = MockMessages.Where(o => o.Time < previous)
                .Take(DefaultTake)
                .OrderBy(o => o.Time)
                .ToArray();

            var isOldest = messages.Length < DefaultTake;

            var messageHistoryModel = new MessageHistoryResponseModel
            {
                Messages = messages,
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
