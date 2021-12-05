namespace MinChatNet.ChatApi.Persistence
{
    public class Message
    {
        public Message()
        {
            Time = DateTimeOffset.UtcNow;
            Month = Time.Month;
            Year = Time.Year;
        }

        public int Month { get; set; }
        public int Year { get; set; }
        public string RoomId { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public string UserDisplayName { get; set; }
        public DateTimeOffset Time { get; set; }
    }

    public class MessageMV : Message
    {
    }
}
