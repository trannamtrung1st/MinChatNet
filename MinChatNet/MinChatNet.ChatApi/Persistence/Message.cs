namespace MinChatNet.ChatApi.Persistence
{
    public class Message
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Content { get; set; }
        public string UserId { get; set; }
        public string UserDisplayName { get; set; }
        public string RoomId { get; set; }
        public DateTimeOffset Time { get; set; }
    }

    public class MessageMV : Message
    {
    }
}
