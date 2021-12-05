using Cassandra;
using Cassandra.Mapping;
using MinChatNet.ChatApi.Persistence;
using ISession = Cassandra.ISession;

namespace MinChatNet.ChatApi.CassMigrations
{
    public class AddRoom : IMigration
    {
        public int Order => 4;

        public async Task UpgradeAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"CREATE TABLE {nameof(Room)} " +
                $"(" +
                $"Id varchar," +
                $"IsPrivate boolean," +
                $"Members set<varchar>," +
                $"PRIMARY KEY (Id)" +
                $")"));

            var mapper = new Mapper(session);

            await mapper.InsertAsync(new Room
            {
                Id = Room.PublicRoomId,
                IsPrivate = false,
                Members = null
            });
        }

        public async Task RevertAsync(ISession session)
        {
            await session.ExecuteAsync(new SimpleStatement($"DROP TABLE {nameof(Room)}"));
        }
    }
}
