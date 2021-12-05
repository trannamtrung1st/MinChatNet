using Cassandra;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.CassMigrations
{
    public class AddLoginTracking : IMigration
    {
        public int Order => 3;

        public async Task UpgradeAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"CREATE TABLE {nameof(LoginTracking)} " +
                $"(" +
                $"Month int," +
                $"Year int," +
                $"Time timeuuid," +
                $"UserId varchar," +
                $"UserDisplayName varchar," +
                $"IsGuest boolean," +
                $"PRIMARY KEY ((Month,Year),Time,UserId)" +
                $") WITH CLUSTERING ORDER BY (Time DESC)"));
        }

        public async Task RevertAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"DROP TABLE {nameof(LoginTracking)}"));
        }
    }
}
