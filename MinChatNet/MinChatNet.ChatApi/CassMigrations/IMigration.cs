using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.CassMigrations
{
    public interface IMigration
    {
        int Order { get; }
        Task UpgradeAsync(ISession session);
        Task RevertAsync(ISession session);
    }
}
