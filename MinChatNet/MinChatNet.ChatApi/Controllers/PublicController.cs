using Cassandra.Data.Linq;
using Microsoft.AspNetCore.Mvc;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.Controllers
{
    [Route("api/public")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly ISession _cassSession;
        public PublicController(DataContext dataContext,
            ISession cassSession)
        {
            _dataContext = dataContext;
            _cassSession = cassSession;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetPublicDataAsync()
        {
            var loginTrackingTbl = new Table<LoginTracking>(_cassSession);
            var totalLogin = await loginTrackingTbl.Count().ExecuteAsync();

            return Ok(new PublicDataModel
            {
                TotalLogin = totalLogin,
                PublicRoomId = Room.PublicRoomId
            });
        }
    }

    public class PublicDataModel
    {
        public string PublicRoomId { get; set; }
        public long TotalLogin { get; set; }
    }
}
