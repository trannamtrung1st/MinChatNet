using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MinChatNet.ChatApi;
using MinChatNet.ChatApi.Hubs;
using MinChatNet.ChatApi.Persistence;
using MinChatNet.ChatApi.Services;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
configuration.Bind(nameof(AppSettings), AppSettings.Instance);

// Add services to the container.
var services = builder.Services;

services.AddDbContext<DataContext>(opt =>
    opt.UseNpgsql(configuration.GetConnectionString(nameof(DataContext))));

services.AddControllers()
    .AddNewtonsoftJson();

services.AddSignalR();
services.AddSingleton<IUserIdProvider, NameUserIdProvider>();

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = TokenConstants.DefaultTokenParameters;
        options.MapInboundClaims = true;
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                // If the request is for our hub...
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    (path.StartsWithSegments("/hub")))
                {
                    // Read the token out of the query string
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

#if false
    app.UseHttpsRedirection();
#endif

app.UseCors(builder =>
{
    builder.AllowAnyHeader();
    builder.AllowAnyMethod();
    builder.AllowCredentials();
    //builder.AllowAnyOrigin();
    builder.SetIsOriginAllowed(origin =>
    {
        return true;
    });
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/hub/chat");

// [Important] Configuration
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile("default-firebase-service-account.json")
});

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    await dbContext.Database.MigrateAsync();
}

app.Run();
