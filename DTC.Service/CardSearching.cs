using System.Text;
using System.Text.Json;
using DTC.Model;
using MongoDB.Driver;
using RestSharp;

public class CardSearching
{
    static string baseUrl = "https://api.scryfall.com";
    public static List<Card> SearchCard(string q, int page, int pageSize) {
        RestClient client = new RestClient();
        RestRequest request = new RestRequest($"{baseUrl}/cards/search", Method.Get);
        request.AddQueryParameter("q", q);
        request.AddQueryParameter("page", page);

        var response = client.Execute(request).Content;

        return convertJsonToCard(response);
    }

    public static List<Card> GetCards(List<Guid> guids) {
        RestClient client = new RestClient();
        RestRequest request = new RestRequest($"{baseUrl}/cards/collection", Method.Post);

        #region BuildBody
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append("{\"identifiers\":[");

            foreach(var id in guids) {
                stringBuilder.Append("{\"id\":\"");
                stringBuilder.Append(id.ToString());
                stringBuilder.Append("\"},");
            }
            stringBuilder.Remove(stringBuilder.Length-1, 1);
            stringBuilder.Append("]}");
        #endregion

        request.AddBody(stringBuilder.ToString());

        var response = client.Execute(request).Content;

        return convertJsonToCard(response);
    }

    private static List<Card> convertJsonToCard(string json) {
        var data = JsonDocument.Parse(json).RootElement.GetProperty("data");

        List<Card> cards = new List<Card>();

        foreach(var card in data.EnumerateArray()) {
            List<string> legs = new List<string>();
            foreach(var leg in card.GetProperty("legalities").EnumerateObject()) {
                legs.Append($"\"{leg.Name}\": \"{leg.Value}\"");
            }

            List<Uri> uris = new List<Uri>();
            foreach(var uri in card.GetProperty("image_uris").EnumerateObject()) {
                uris.Append(new Uri(uri.Value.ToString()));
            }
            cards.Add(new Card() {
                Id = new Guid(card.GetProperty("id").ToString()),
                OracleId = new Guid(card.GetProperty("oracle_id").ToString()),
                MultiverseIds = card.GetProperty("multiverse_ids").Deserialize<int[]>(),
                TCGPlayerId = card.TryGetProperty("tcgplayer_id", out JsonElement tcgid) ? card.GetProperty("tcgplayer_id").GetInt32() : null,
                CardMarketId = card.TryGetProperty("cardmarket_id", out JsonElement cardmarket_id) ? card.GetProperty("cardmarket_id").GetInt32() : null,
                Name = card.GetProperty("name").ToString(),
                Lang = card.GetProperty("lang").ToString(),
                ReleaseAt = card.GetProperty("released_at").GetDateTime(),
                Uri = new Uri(card.GetProperty("uri").ToString()),
                ScryfallUri = new Uri(card.GetProperty("scryfall_uri").ToString()),
                Layout = card.GetProperty("layout").ToString(),
                ImageStatus = card.GetProperty("image_status").ToString(),
                ImageUris = uris.ToArray(),
                CMC = (int)card.GetProperty("cmc").GetDouble(),
                ManaCost = card.GetProperty("mana_cost").ToString(),
                TypeLine = card.GetProperty("type_line").ToString(),
                Power = card.TryGetProperty("power", out JsonElement element) ? int.Parse(card.GetProperty("power").ToString()) : null,
                Toughness = card.TryGetProperty("toughness", out JsonElement element1) ? int.Parse(card.GetProperty("toughness").ToString()) : null,
                Colors = card.GetProperty("colors").Deserialize<string[]>(),
                ColorIdentity = card.GetProperty("color_identity").Deserialize<string[]>(),
                Keywords = card.GetProperty("keywords").Deserialize<string[]>(),
                Legalities = legs.ToArray(),
                Games = card.GetProperty("games").Deserialize<string[]>(),
                Reserved = card.GetProperty("reserved").GetBoolean(),
                Foil = card.GetProperty("foil").GetBoolean(),
                NonFoil = card.GetProperty("nonfoil").GetBoolean(),
                Finishes = card.GetProperty("finishes").Deserialize<string[]>(),
                Oversized = card.GetProperty("oversized").GetBoolean(),
                Promo = card.GetProperty("promo").GetBoolean(),
                Reprint = card.GetProperty("reprint").GetBoolean(),
                Variation = card.GetProperty("variation").GetBoolean(),
                SetId = new Guid(card.GetProperty("set_id").ToString()),
                Set = card.GetProperty("set").ToString(),
                Rarity = card.GetProperty("rarity").ToString(),
                Artist = card.GetProperty("artist").ToString(),

            });
        }

        return cards;
    }
}