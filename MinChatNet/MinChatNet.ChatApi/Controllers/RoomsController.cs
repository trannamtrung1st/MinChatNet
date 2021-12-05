using Cassandra.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    [Authorize]
    public class RoomsController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly ISession _cassSession;
        public RoomsController(DataContext dataContext,
            ISession cassSession)
        {
            _dataContext = dataContext;
            _cassSession = cassSession;
        }

        [HttpPost("")]
        public async Task<IActionResult> CreatePrivateRoom()
        {
            var roomGuid = Guid.NewGuid().ToString();
            var room = new Room
            {
                Id = roomGuid,
                IsPrivate = true,
                Members = new HashSet<string>
                {
                    User.Identity.Name
                }
            };

            var mapper = new Mapper(_cassSession);
            await mapper.InsertAsync(room);

            return Ok(room);
        }
    }
}
