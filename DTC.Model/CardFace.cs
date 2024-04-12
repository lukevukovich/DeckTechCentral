using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace DTC.Model
{
    public class CardFace
    {
        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [BsonElement("image_uris")]
        [JsonPropertyName("image_uris")]
        public Uri[] ImageUris { get; set; }

        [BsonElement("mana_cost")]
        [JsonPropertyName("mana_cost")]
        public string ManaCost { get; set; }

        [BsonElement("type_line")]
        [JsonPropertyName("type_line")]
        public string TypeLine { get; set; }

        [BsonElement("colors")]
        [JsonPropertyName("colors")]
        public string[] Colors { get; set; }

        [BsonElement("power")]
        [JsonPropertyName("power")]
        public string? Power { get; set; }

        [BsonElement("toughness")]
        [JsonPropertyName("toughness")]
        public string? Toughness { get; set; }

        [BsonElement("oracle_text")]
        [JsonPropertyName("oracle_text")]
        public string? OracleText { get; set; }

        [BsonElement("flavor_text")]
        [JsonPropertyName("flavor_text")]
        public string? FlavorText { get; set; }
    }
}