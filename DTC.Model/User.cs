using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.Marshalling;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace DTC.Model {
    public class User
    {
        [BsonId]
        [BsonRequired]
        [BsonElement("id")]
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [BsonElement("username")]
        [JsonPropertyName("username")]
        public string Username { get; set; }

        [BsonElement("email")]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [BsonElement("user_status")]
        [JsonPropertyName("user_status")]
        public string UserStatus { get; set; }

        [BsonElement("password")]
        [JsonPropertyName("password")]
        public string SaltedPassHash { get; set; }

        [BsonElement("salt")]
        public byte[] Salt { get; set; }
    }
}