using System.Security.Principal;

namespace DTC.Model
{
    public class AuthenticateResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }

        public AuthenticateResponse(User user, string token) {
            Id = user.Id;
            Username = user.Username;
            Email = user.Email;
            Token = token;
        }  
    }
}