using System.Security.Principal;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DTC.Model
{
    public class AuthenticateResponse
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("token")]
        public string Token { get; set; }

        public AuthenticateResponse(User user, string token) {
            Id = user.Id;
            Username = user.Username;
            Email = user.Email;
            Token = token;
        }  
    }
}