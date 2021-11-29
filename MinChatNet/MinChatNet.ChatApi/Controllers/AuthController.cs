using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MinChatNet.ChatApi.Persistence;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MinChatNet.ChatApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _dataContext;
        public AuthController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpPost("token")]
        public async Task<IActionResult> ExchangeTokenAsync([FromBody] ExchangeTokenModel model)
        {
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(model.IdToken);
            string uid = decodedToken.Uid;

            var userEntity = await _dataContext.Users.FirstOrDefaultAsync(u => u.ProviderUid == uid);

            if (userEntity == null)
            {
                userEntity = new UserEntity
                {
                    Id = Guid.NewGuid().ToString(),
                    ProviderUid = uid,
                };
                _dataContext.Add(userEntity);
            }

            userEntity.Avatar = decodedToken.Claims["picture"] as string;
            userEntity.DisplayName = decodedToken.Claims["name"] as string;
            await _dataContext.SaveChangesAsync();

            var accessToken = GenerateTokenResponse(userEntity);

            return Ok(new TokenResponse
            {
                AccessToken = accessToken
            });
        }


        private string GenerateTokenResponse(UserEntity userEntity)
        {
            #region Generate JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.Default.GetBytes(AppSettings.Instance.JwtSecretKey);
            var issuer = TokenConstants.DefaultTokenParameters.ValidIssuer;
            var audClaims = TokenConstants.DefaultTokenParameters.ValidAudiences
                .Select(aud => new Claim(JwtRegisteredClaimNames.Aud, aud));
            var identity = new ClaimsIdentity(JwtBearerDefaults.AuthenticationScheme);

            identity.AddClaim(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            identity.AddClaim(new Claim(JwtRegisteredClaimNames.Sub, userEntity.Id));
            identity.AddClaims(audClaims);

            var utcNow = DateTime.UtcNow;

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = issuer,
                Subject = identity,
                IssuedAt = utcNow,
                Expires = utcNow.AddSeconds(3600),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                NotBefore = utcNow
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var tokenString = tokenHandler.WriteToken(token);
            #endregion

            return tokenString;
        }
    }

    public class TokenResponse
    {
        public string AccessToken { get; set; }
    }

    public class ExchangeTokenModel
    {
        public string IdToken { get; set; }
    }
}
