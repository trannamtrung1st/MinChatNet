namespace MinChatNet.ChatApi.Models
{
    public class MessageModel
    {
        public string Content { get; set; }
        public string UserDisplayName { get; set; }
        public UserModel FromUser { get; set; }
        public DateTimeOffset Time { get; set; }
    }
}
