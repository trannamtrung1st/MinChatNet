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
            // [Important] maximum 2 billion cells (rows x columns), must fit on a single node
            await session.ExecuteAsync(new SimpleStatement($"CREATE TABLE {nameof(Message)} \n" +
                "(" +
                "Month int," +
                "Year int," +
                "RoomId varchar," +
                "Content text," +
                "UserId varchar," +
                "UserDisplayName varchar," +
                "Time timestamp," +
                "PRIMARY KEY ((Month,Year,RoomId),Time,UserId)" +
                ") WITH CLUSTERING ORDER BY (Time DESC)"));
        }

        public async Task RevertAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"DROP TABLE {nameof(Message)}"));
        }
    }
}
