namespace MinChatNet.ChatApi.Models
{
    public class MessageModel
    {
        public string Content { get; set; }
        public UserModel FromUser { get; set; }
    }
}
