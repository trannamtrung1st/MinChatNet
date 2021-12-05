using Cassandra;

namespace MinChatNet.ChatApi.Persistence
{
    public class LoginTracking
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public TimeUuid Time { get; set; }
        public string UserId { get; set; }
        public string UserDisplayName { get; set; }
        public bool? IsGuest { get; set; }
    }
}
