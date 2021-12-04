using Cassandra;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.CassMigrations
{
    public class InitDb : IMigration
    {
        public int Order => 1;

        public async Task UpgradeAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"CREATE TABLE {nameof(Message)} \n" +
                "(Id uuid, " +
                "Content text," +
                "UserId varchar," +
                "UserDisplayName varchar," +
                "RoomId varchar," +
                "Time timestamp," +
                "PRIMARY KEY (RoomId,Time,Id))"));
        }

        public async Task RevertAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"DROP TABLE {nameof(Message)}"));
        }
    }
}
