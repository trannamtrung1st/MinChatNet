using MinChatNet.ChatApi.Models;

namespace MinChatNet.ChatApi.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(MessageModel messageModel);
    }
}
