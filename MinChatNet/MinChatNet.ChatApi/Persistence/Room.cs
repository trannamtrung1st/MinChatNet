namespace MinChatNet.ChatApi.Persistence
{
    public class Room
    {
        public const string PublicRoomId = "public";

        public string Id { get; set; }
        public bool IsPrivate { get; set; }
        public ISet<string> Members { get; set; }
    }
}
