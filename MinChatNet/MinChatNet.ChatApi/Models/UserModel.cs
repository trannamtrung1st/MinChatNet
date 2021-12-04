namespace MinChatNet.ChatApi.Models
{
    public class UserModel
    {
        public bool IsGuest { get; set; }
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Avatar { get; set; }
    }
}
