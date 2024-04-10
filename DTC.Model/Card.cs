using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace DTC.Model
{
    public class Card
    {
        [BsonId]
        [BsonRequired]
        [BsonElement("id")]
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [BsonRequired]
        [BsonElement("oracle_id")]
        [JsonPropertyName("oracle_id")]
        public Guid OracleId { get; set; }

        [BsonElement("multiverse_ids")]
        [JsonPropertyName("multiverse_ids")]
        public int[] MultiverseIds { get; set; }

        [BsonElement("tcgplayer_id")]
        [JsonPropertyName("tcgplayer_id")]
        public int? TCGPlayerId { get; set; }

        [BsonElement("cardmarket_id")]
        [JsonPropertyName("cardmarket_id")]
        public int? CardMarketId { get; set; }

        [BsonElement("oracle_text")]
        [JsonPropertyName("oracle_text")]
        public string OracleText { get; set; }

        [BsonElement("flavor_text")]
        [JsonPropertyName("flavor_text")]
        public string FlavorText { get; set; }

        [BsonElement("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [BsonElement("lang")]
        [JsonPropertyName("lang")]
        public string Lang { get; set; }

        [BsonElement("release_at")]
        [JsonPropertyName("release_at")]
        public DateTime ReleaseAt { get; set; }

        [BsonElement("uri")]
        [JsonPropertyName("uri")]
        public Uri Uri { get; set; }

        [BsonElement("scryfall_uri")]
        [JsonPropertyName("scryfall_uri")]
        public Uri ScryfallUri { get; set; }

        [BsonElement("layout")]
        [JsonPropertyName("layout")]
        public string Layout { get; set; }

        [BsonElement("highres_image")]
        [JsonPropertyName("highres_image")]
        public bool HighResImage { get; set; }

        [BsonElement("image_status")]
        [JsonPropertyName("image_status")]
        public string ImageStatus { get; set; }

        [BsonElement("image_uris")]
        [JsonPropertyName("image_uris")]
        public Uri[] ImageUris { get; set; }

        [BsonElement("cmc")]
        [JsonPropertyName("cmc")]
        public int CMC { get; set; }

        [BsonElement("mana_cost")]
        [JsonPropertyName("mana_cost")]
        public string ManaCost { get; set; }

        [BsonElement("type_line")]
        [JsonPropertyName("type_line")]
        public string TypeLine { get; set; }

        [BsonElement("power")]
        [JsonPropertyName("power")]
        public string? Power { get; set; }

        [BsonElement("toughness")]
        [JsonPropertyName("toughness")]
        public string? Toughness { get; set; }

        [BsonElement("colors")]
        [JsonPropertyName("colors")]
        public string[] Colors { get; set; }

        [BsonElement("color_identity")]
        [JsonPropertyName("color_identity")]
        public string[] ColorIdentity { get; set; }

        [BsonElement("keywords")]
        [JsonPropertyName("keywords")]
        public string[] Keywords { get; set; }

        [BsonElement("legalities")]
        [JsonPropertyName("legalities")]
        public string[] Legalities { get; set; }

        [BsonElement("games")]
        [JsonPropertyName("games")]
        public string[] Games { get; set; }

        [BsonElement("reserved")]
        [JsonPropertyName("reserved")]
        public bool Reserved { get; set; }

        [BsonElement("foil")]
        [JsonPropertyName("foil")]
        public bool Foil { get; set; }

        [BsonElement("nonfoil")]
        [JsonPropertyName("nonfoil")]
        public bool NonFoil { get; set; }

        [BsonElement("finishes")]
        [JsonPropertyName("finishes")]
        public string[] Finishes { get; set; }

        [BsonElement("oversized")]
        [JsonPropertyName("oversized")]
        public bool Oversized { get; set; }

        [BsonElement("promo")]
        [JsonPropertyName("promo")]
        public bool Promo { get; set; }

        [BsonElement("reprint")]
        [JsonPropertyName("reprint")]
        public bool Reprint { get; set; }

        [BsonElement("variation")]
        [JsonPropertyName("variation")]
        public bool Variation { get; set; }

        [BsonElement("set_id")]
        [JsonPropertyName("set_id")]
        public Guid SetId { get; set; }

        [BsonElement("set")]
        [JsonPropertyName("set")]
        public string Set { get; set; }

        [BsonElement("set_name")]
        [JsonPropertyName("set_name")]
        public string SetName { get; set; }

        [BsonElement("set_type")]
        [JsonPropertyName("set_type")]
        public string SetType { get; set; }

        [BsonElement("rarity")]
        [JsonPropertyName("rarity")]
        public string Rarity { get; set; }

        [BsonElement("artist")]
        [JsonPropertyName("artist")]
        public string Artist { get; set; }

        [BsonElement("card_faces")]
        [JsonPropertyName("card_faces")]
        public CardFace[]? CardFaces { get; set; }
    }
}