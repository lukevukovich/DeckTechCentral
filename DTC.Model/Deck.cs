using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;

namespace DTC.Model {
    public class Deck
    {
        [BsonId]
        [BsonRequired]
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
        public List<CreationCardAmmount> Mainboard { get; set; }

        [BsonElement("sideboard")]
        [JsonPropertyName("sideboard")]
        public List<CreationCardAmmount> Sideboard { get; set; }

        [BsonElement("considering")]
        [JsonPropertyName("considering")]
        public List<CreationCardAmmount> Considering { get; set; }

        [BsonElement("created_date")]
        [JsonPropertyName("created_date")]
        public DateTime CreatedDate { get; set; }

        [BsonElement("modified_date")]
        [JsonPropertyName("modified_date")]
        public DateTime ModifiedDate { get; set; }
    }
}