using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class CreationCardAmmount
    {
        [BsonElement("amount")]
        [JsonPropertyName("amount")]
        public int Amount { get; set; }

        [BsonElement("card_id")]
        [JsonPropertyName("card_id")]
        public Guid CardId { get; set; }
    }
}