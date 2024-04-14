using DTC.Model;

namespace DTC.Service 
{
    public interface IDeckService 
    {
        public List<DeckSearchResponse> SearchDeck(string? name, string? format, string? sortBy, User? user);

        public void CreateDeck (DeckCreationRequest deck, User user);

        public DeckResponse GetDeck(Guid deckId, User? userId);

        public DeckResponse UpdateDeck(Guid deckId, User user, DeckCreationRequest deck);

        public List<DeckSearchResponse> GetDecksForUser(string Username, User? LoggedInUser);

        public void DeleteDeck(Guid DeckId, User user);

        public Card GetCardById(Guid id);

        public List<Card> GetCardBulk(List<Guid> guids);

        public List<Card> SearchCard(string q, int? page, int? pageSize);

        public bool? LikeDeck(Guid deckId, User user);
    }
}