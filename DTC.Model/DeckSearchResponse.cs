using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DTC.Model {
    public class DeckSearchResponse
    {
        [BsonId]
        [BsonElement("id")]
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [BsonElement("editors")]
        [JsonPropertyName("editors")]
        public List<string> Editors { get; set; }
        
        [BsonElement("privacy")]
        [JsonPropertyName("privacy")]
        public string Privacy { get; set; }

        [BsonElement("name")]
        [JsonPropertyName("name")]
        public String Name { get; set; }

        [BsonElement("format")]
        [JsonPropertyName("format")]
        public String Format { get; set; }

        [BsonElement("likes")]
        [JsonPropertyName("likes")]
        public int Likes { get; set; }

        [BsonElement("dislikes")]
        [JsonPropertyName("dislikes")]
        public int Dislikes { get; set; }

        [BsonElement("views")]
        [JsonPropertyName("views")]
        public int Views { get; set; }

        [BsonElement("cover_image")]
        [JsonPropertyName("cover_image")]
        public Uri CoverImage { get; set; }

        [BsonElement("created_date")]
        [JsonPropertyName("created_date")]
        public DateTime CreatedDate { get; set; }

        [BsonElement("modified_date")]
        [JsonPropertyName("modified_date")]
        public DateTime ModifiedDate { get; set; }
    }
}