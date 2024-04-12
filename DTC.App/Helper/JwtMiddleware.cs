using System.IdentityModel.Tokens.Jwt;
using System.Text;
using DTC.Model;
using DTC.Service;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DTC.App.Helper
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly SecretKey _secret;

        public JwtMiddleware(RequestDelegate next, IOptions<SecretKey> secret) {
            _next = next;
            _secret = secret.Value;
        }

        public async Task Invoke(HttpContext context, IUserService userService) {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if(token != null) attachUserToContext(context, userService, token);

            await _next(context);
        }

        private void attachUserToContext(HttpContext context, IUserService userService, string token) {
            try 
            {
                var tokenHander = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secret.Secret);
                tokenHander.ValidateToken(token, new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    //does not increase lifespan of the token
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = new Guid(jwtToken.Claims.First(x => x.Type == "id").Value);

                context.Items["User"] = userService.GetUserById(userId).Result;
            }
            catch
            {

            }
        }
    }
}