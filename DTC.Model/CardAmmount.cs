using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class CardAmmount
    {
        [BsonElement("amount")]
        [JsonPropertyName("amount")]
        public int Amount { get; set; }

        [BsonElement("card")]
        [JsonPropertyName("card")]
        public Card Card { get; set; }

        [BsonElement("is_commander")]
        [JsonPropertyName("is_commander")]
        public bool IsCommander { get; set; }
    }
    
}