using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class DeckCreationRequest
    {

        [JsonPropertyName("Privacy")]
        public string? Privacy { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("format")]
        public string? Format { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("cover_image")]
        public string? CoverImage { get; set; }

        [JsonPropertyName("mainboard")]
        public List<CreationCardAmmount> Mainboard { get; set; }

        [JsonPropertyName("sideboard")]
        public List<CreationCardAmmount>? Sideboard { get; set; }

        [JsonPropertyName("considering")]
        public List<CreationCardAmmount>? Considering { get; set; }
    }
}