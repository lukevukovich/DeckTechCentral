using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DTC.Model
{
    public class AuthenticateRequest
    {
        [Required]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }
}