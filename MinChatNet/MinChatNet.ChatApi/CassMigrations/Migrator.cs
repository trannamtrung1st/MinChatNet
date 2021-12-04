using Cassandra;
using Cassandra.Data.Linq;
using Cassandra.Mapping;

namespace MinChatNet.ChatApi.CassMigrations
{
    public class Migrator
    {
        private readonly Cluster _cluster;
        public Migrator(Cluster cluster)
        {
            _cluster = cluster;
        }

        public async Task MigrateAsync()
        {
            var session = _cluster.ConnectAndCreateDefaultKeyspaceIfNotExists();

            var metadata = _cluster.Metadata.GetKeyspace(
                _cluster.Configuration.ClientOptions.DefaultKeyspace);

            var tableNames = metadata.GetTablesNames();

            var migrationTblExists = tableNames.Contains(nameof(CassandraMigrations),
                StringComparer.OrdinalIgnoreCase);

            if (!migrationTblExists)
            {
                var statement = await session.PrepareAsync($"CREATE TABLE {nameof(CassandraMigrations)} \n" +
                    "(Id varchar PRIMARY KEY, ApplyDate timestamp)");
                var rs = await session.ExecuteAsync(new BoundStatement(statement));
            }

            var tblMigration = new Table<CassandraMigrations>(session);

            var executedMigrations = (await tblMigration.Select(o => o.Id).ExecuteAsync())
                .ToArray();

            var mapper = new Mapper(session);

            var migrationObjs = GetMigrationObjects();

            foreach (var migrationObj in migrationObjs)
            {
                var id = migrationObj.GetType().Name;
                if (executedMigrations.Contains(id)) continue;
                await migrationObj.UpgradeAsync(session);
                await mapper.InsertAsync(new CassandraMigrations
                {
                    Id = id,
                    ApplyDate = DateTimeOffset.UtcNow
                });
            }
        }

        public async Task RevertAsync(string migrationId)
        {
            var session = await _cluster.ConnectAsync();
            var tblMigration = new Table<CassandraMigrations>(session);

            var executedMigrations = (await tblMigration.Select(o => o.Id).ExecuteAsync())
                .ToArray();

            if (!executedMigrations.Contains(migrationId)) return;

            var migrationObjs = GetMigrationObjects();

            var migrationObj = migrationObjs.FirstOrDefault(o => o.GetType().Name == migrationId);

            if (migrationObj == null) throw new KeyNotFoundException();

            await migrationObj.RevertAsync(session);

            var mapper = new Mapper(session);
            await mapper.DeleteIfAsync<CassandraMigrations>("WHERE id = ?", migrationId);
        }

        private IEnumerable<IMigration> GetMigrationObjects()
        {

            var migrations = typeof(Migrator).Assembly.GetTypes()
                .Where(t => typeof(IMigration).IsAssignableFrom(t) && t.IsClass && !t.IsAbstract)
                .ToArray();

            var migrationObjs = migrations.Select(m => Activator.CreateInstance(m))
                .OfType<IMigration>()
                .OrderBy(m => m.Order)
                .ToArray();

            return migrationObjs;
        }
    }

    public class CassandraMigrations
    {
        public string Id { get; set; }
        public DateTimeOffset ApplyDate { get; set; }
    }
}
