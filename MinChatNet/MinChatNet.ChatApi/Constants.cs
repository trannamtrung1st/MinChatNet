using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace MinChatNet.ChatApi
{
    public class AppSettings
    {
        public string JwtSecretKey { get; set; }

        private static AppSettings _instance;
        public static AppSettings Instance => _instance ?? (_instance = new AppSettings());
    }

    public static class TokenConstants
    {
        public static TokenValidationParameters DefaultTokenParameters = new TokenValidationParameters()
        {
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "MinChatNet",
            ValidAudiences = new[] { "MinChatNet" },
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.Default.GetBytes(AppSettings.Instance.JwtSecretKey)),
            ClockSkew = TimeSpan.Zero,
            NameClaimType = JwtRegisteredClaimNames.Sub,
            RoleClaimType = "role"
        };
    }
}
