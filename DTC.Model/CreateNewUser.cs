using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class CreateNewUser
    {

        [BsonElement("username")]
        [JsonPropertyName("username")]
        public String? Username { get; set; }

        [BsonElement("email")]
        [JsonPropertyName("email")]
        public String? Email { get; set; }

        [JsonPropertyName("password")]
        public String? password { get; set; }
    }
}