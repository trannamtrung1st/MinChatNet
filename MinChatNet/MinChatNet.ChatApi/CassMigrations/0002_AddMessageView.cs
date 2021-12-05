using Cassandra;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.CassMigrations
{
    public class AddMessageView : IMigration
    {
        public int Order => 2;

        public async Task UpgradeAsync(ISession session)
        {
            // [Important] Clustering order must specify all clustering keys
            await session.ExecuteAsync(new SimpleStatement($"CREATE MATERIALIZED VIEW {nameof(MessageMV)} AS " +
                $"SELECT * FROM Message " +
                $"WHERE RoomId IS NOT NULL " +
                $"AND Month IS NOT NULL " +
                $"AND Year IS NOT NULL " +
                $"AND UserId IS NOT NULL " +
                $"AND Time IS NOT NULL " +
                $"PRIMARY KEY((Month,Year,RoomId),Time,UserId) " +
                $"WITH CLUSTERING ORDER BY (Time DESC, UserId ASC)"));
        }

        public async Task RevertAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"DROP MATERIALIZED VIEW {nameof(MessageMV)}"));
        }
    }
}
