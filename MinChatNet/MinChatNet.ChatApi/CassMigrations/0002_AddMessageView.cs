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
            await session.ExecuteAsync(new SimpleStatement($"CREATE MATERIALIZED VIEW {nameof(MessageMV)} AS " +
                $"SELECT * FROM Message " +
                $"WHERE RoomId IS NOT NULL AND Id IS NOT NULL AND Time IS NOT NULL " +
                $"PRIMARY KEY(RoomId,Time,Id)"));
        }

        public async Task RevertAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"DROP MATERIALIZED VIEW {nameof(MessageMV)}"));
        }
    }
}
