using System.Text;
using System.Text.Json;
using DTC.Model;
using MongoDB.Driver;
using RestSharp;

public class CardSearching
{
    static string baseUrl = "https://api.scryfall.com";
    public static List<Card> SearchCard(string q, int? page, int? pageSize) {
        RestClient client = new RestClient();
        RestRequest request = new RestRequest($"{baseUrl}/cards/search", Method.Get);
        request.AddQueryParameter("q", q);
        if(page != null) request.AddQueryParameter("page", page.Value);
        if(pageSize != null) request.AddQueryParameter("pageSize", pageSize.Value);

        var response = client.Execute(request);

        if(response.IsSuccessful)
            return convertJsonToCard(response.Content);
        else return null;;
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

        var response = client.Execute(request);

        if(response.IsSuccessful)
            return convertJsonToCard(response.Content);
        else return null;
    }

    private static List<Card> convertJsonToCard(string json) {
        var data = JsonDocument.Parse(json).RootElement.GetProperty("data");

        List<Card> cards = new List<Card>();

        foreach(var card in data.EnumerateArray()) { //grab each card
            List<string> legs = new List<string>();
            foreach(var leg in card.GetProperty("legalities").EnumerateObject()) { //set up the legalities object as defined by the open api spec
                legs.Add($"{leg.Name}: {leg.Value}");
            }
            if(!card.TryGetProperty("card_faces", out JsonElement faces)) {

                List<Uri> uris = new List<Uri>();
                if(card.TryGetProperty("image_uris", out JsonElement imageuris)) {
                    foreach(var uri in card.GetProperty("image_uris").EnumerateObject()) {
                        uris.Add(new Uri(uri.Value.ToString()));
                    }
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
                    Power = card.TryGetProperty("power", out JsonElement element) ? card.GetProperty("power").ToString() : null,
                    Toughness = card.TryGetProperty("toughness", out JsonElement element1) ? card.GetProperty("toughness").ToString() : null,
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
                    OracleText = card.GetProperty("oracle_text").ToString(),
                    FlavorText = card.TryGetProperty("flavor_text", out JsonElement flavor) ? card.GetProperty("flavor_text").ToString() : null
                });
            } else {
                List<CardFace> cardFaces = new List<CardFace>();
                foreach(var face in card.GetProperty("card_faces").EnumerateArray()) {
                    List<Uri> uris = new List<Uri>();
                    if(face.TryGetProperty("image_uris", out JsonElement imageuris)) {
                        foreach(var uri in face.GetProperty("image_uris").EnumerateObject()) {
                            uris.Add(new Uri(uri.Value.ToString()));
                        }
                    }

                    cardFaces.Add(new CardFace {
                        Name = face.GetProperty("name").ToString(),
                        ImageUris = uris.ToArray(),
                        ManaCost = face.GetProperty("mana_cost").ToString(),
                        TypeLine = face.GetProperty("type_line").ToString(),
                        Power = face.TryGetProperty("power", out JsonElement element) ? face.GetProperty("power").ToString() : null,
                        Toughness = face.TryGetProperty("toughness", out JsonElement element1) ? face.GetProperty("toughness").ToString() : null,
                        Colors = face.TryGetProperty("colors", out JsonElement colors) ? face.GetProperty("colors").Deserialize<string[]>() : Array.Empty<string>(),
                        OracleText = face.GetProperty("oracle_text").ToString(),
                        FlavorText = face.TryGetProperty("flavor_text", out JsonElement flavor) ? face.GetProperty("flavor_text").ToString() : null
                    });
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
                    CMC = (int)card.GetProperty("cmc").GetDouble(),
                    TypeLine = card.GetProperty("type_line").ToString(),
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
                    CardFaces = cardFaces.ToArray()
                });
            }
        }

        return cards;
    }
}