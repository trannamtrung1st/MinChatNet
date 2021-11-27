using MinChatNet.ChatApi.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;

services.AddControllers();

services.AddSignalR();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

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

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/hub/chat");

app.Run();
