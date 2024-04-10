using System;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model {
    public class DeckResponse
    {
        [BsonElement("id")]
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [BsonElement("editors")]
        [JsonPropertyName("editors")]
        public List<User> Editors { get; set; }

        [BsonElement("privacy")]
        [JsonPropertyName("privacy")]
        public string Privacy { get; set; }

        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [BsonElement("format")]
        [JsonPropertyName("format")]
        public string? Format { get; set; }

        [BsonElement("likes")]
        [JsonPropertyName("likes")]
        public int Likes { get; set; }

        [BsonElement("dislikes")]
        [JsonPropertyName("dislikes")]
        public int Dislikes { get; set; }

        [BsonElement("views")]
        [JsonPropertyName("views")]
        public int Views { get; set; }

        [BsonElement("description")]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [BsonElement("cover_image")]
        [JsonPropertyName("cover_image")]
        public Uri CoverImage { get; set; }

        [BsonElement("mainboard")]
        [JsonPropertyName("mainboard")]
        public List<CardAmmount> Mainboard { get; set; }

        [BsonElement("sideboard")]
        [JsonPropertyName("sideboard")]
        public List<CardAmmount> Sideboard { get; set; }

        [BsonElement("considering")]
        [JsonPropertyName("considering")]
        public List<CardAmmount> Considering { get; set; }

        [BsonElement("created_date")]
        [JsonPropertyName("created_date")]
        public DateTime CreatedDate { get; set; }

        [BsonElement("modified_date")]
        [JsonPropertyName("modified_date")]
        public DateTime ModifiedDate { get; set; }

        [BsonElement("commander_1")]
        [JsonPropertyName("commander_1")]
        public string? Commander1 { get; set; }

        [BsonElement("commander_2")]
        [JsonPropertyName("commander_2")]
        public string? Commander2 { get; set; }
    }
}