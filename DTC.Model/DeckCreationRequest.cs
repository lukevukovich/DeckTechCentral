using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DTC.Model {
    public class DeckCreationRequest
    {

        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [BsonElement("privacy")]
        [JsonPropertyName("privacy")]
        public string? Privacy { get; set; }


        [BsonElement("format")]
        [JsonPropertyName("format")]
        public string? Format { get; set; }

        [BsonElement("description")]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [BsonElement("cover_image")]
        [JsonPropertyName("cover_image")]
        public string? CoverImage { get; set; }

        [BsonElement("mainboard")]
        [JsonPropertyName("mainboard")]
        public List<CreationCardAmmount> Mainboard { get; set; }

        [BsonElement("sideboard")]
        [JsonPropertyName("sideboard")]
        public List<CreationCardAmmount>? Sideboard { get; set; }

        [BsonElement("considering")]
        [JsonPropertyName("considering")]
        public List<CreationCardAmmount>? Considering { get; set; }
    }
}