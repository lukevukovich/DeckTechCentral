using DTC.Model;

namespace DTC.Service 
{
    public interface IDeckService 
    {
        public List<DeckSearchResponse> SearchDeck(string? name, string? format, string? commander1, string? commander2, string? sortBy);

        public void CreateDeck (DeckCreationRequest deck, User user);

        public DeckResponse GetDeck(Guid deckId);

        public List<DeckSearchResponse> GetDecksForUserId(string UserId);

        public void DeleteDeck(Guid DeckId, User user);

        public Card GetCardById(Guid id);

        public List<Card> GetCardBulk(List<Guid> guids);

        public List<Card> SearchCard(string q, int page, int pageSize);

        public void CreateCard(Card card);
    }
}