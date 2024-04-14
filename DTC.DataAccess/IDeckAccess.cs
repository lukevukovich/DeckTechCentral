using DTC.Model;

namespace DTC.DataAccess {
    public interface IDeckAccess 
    {
        public Task<List<Deck>> SearchDeck(string? name, string? format, string? sortBy);

        public Deck CreateDeck(Deck deck);
        
        public Deck UpdateDeck(Guid deckId, DeckCreationRequest deck);

        public Task<Deck> GetDeck(Guid deckId);

        public bool? LikeDeck(Guid deckId, string Username);

        public Task<List<Deck>> GetDecksForUser(string Username);
    }
}