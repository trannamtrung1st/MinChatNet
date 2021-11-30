namespace MinChatNet.ChatApi.Models
{
    public class MessageHistoryResponseModel
    {
        public bool IsOldest { get; set; }
        public IEnumerable<MessageModel> Messages { get; set; }
    }
}
