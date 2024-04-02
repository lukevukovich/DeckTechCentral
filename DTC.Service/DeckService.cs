using DTC.Model;
using DTC.DataAccess;
using RestSharp;

namespace DTC.Service {
    public class DeckService : IDeckService
    {
        DeckAccess deckRepo;
        CardAccess cardRepo;
        public DeckService() {
            deckRepo = new DeckAccess();
            cardRepo = new CardAccess();
        }
        public List<DeckSearchResponse> SearchDeck(string? name, string? format, string? commander1, string commander2, string? sortBy) {
            if(name == null && format == null && commander1 == null && commander2 == null) throw new Exception("empty search");

            var search = deckRepo.SearchDeck(name, format, commander1, commander2, sortBy);

            return ConvertDeckToDeckSearch(search.Result);
        }

        public void CreateDeck(DeckCreationRequest deck, User user) {
            
            if(deck.Privacy == null) deck.Privacy = "public";
            if(deck.Name == null) deck.Name = "New Deck";
            if(deck.CoverImage == null) deck.CoverImage = new Uri("https://upload.wikimedia.org/wikipedia/en/a/aa/Magic_the_gathering-card_back.jpg");

            deckRepo.CreateDeck(new Deck {
                Name = deck.Name,
                Privacy = deck.Privacy,
                Format = deck.Format,
                Description = deck.Description,
                CoverImage = deck.CoverImage,
                Mainboard = deck.Mainboard,
                Sideboard = deck.Sideboard,
                Considering = deck.Considering,
                Commander1 = deck.Commander1,
                Commander2 = deck.Commander2
            });
        }

        public DeckResponse GetDeck(Guid deckId) {
            var tempDeck = deckRepo.GetDeck(deckId).Result;

            List<Deck> decks= new List<Deck>();


            return ConvertDeckToDeckResponse(decks).First();
        }

        public List<DeckSearchResponse> GetDecksForUserId(Guid userId) {

            var results = deckRepo.GetDecksForUser(userId).Result;

            return ConvertDeckToDeckSearch(results);
        }

        public async void DeleteDeck(Guid DeckId, User user) {
            if(!deckRepo.GetDeck(DeckId).Result.Editors.Contains(user)) {
                throw new UnauthorizedAccessException();
            } 

            await deckRepo.DeleteDeck(DeckId);
        }

        public Card GetCardById(Guid id) {
            return cardRepo.GetCardById(id).Result;
        }

        public List<Card> GetCardBulk(List<Guid> ids) {
            var cards = cardRepo.GetCardBulk(ids).Result;

            List<Guid> notInDB = new List<Guid>();
            foreach(var card in cards) {
                if(card.Name == null) {
                    notInDB.Append(card.Id);
                    cards.Remove(card);
                }
            }

            var newCards = CardSearching.GetCards(notInDB);
            cardRepo.CreateCardBulk(newCards);

            foreach(var card in newCards) {
                newCards.Add(card);
            }

            return cards;
        }

        public List<Card> SearchCard(string q, int page, int pageSize) {
            return CardSearching.SearchCard(q, page, pageSize);
        }

        private List<DeckSearchResponse> ConvertDeckToDeckSearch(List<Deck> decks) {
            List<DeckSearchResponse> response = new List<DeckSearchResponse>();
            foreach(var deck in decks) {
                response.Add( new DeckSearchResponse {
                    Id = deck.Id,
                    Editors = deck.Editors,
                    Name = deck.Name,
                    Privacy = deck.Privacy,
                    Format = deck.Format,
                    Likes = deck.Likes,
                    Dislikes = deck.Dislikes,
                    Views = deck.Views,
                    CoverImage = deck.CoverImage,
                    CreatedDate = deck.CreatedDate,
                    ModifiedDate = deck.ModifiedDate,
                });
            }

            return response;
        }

        private List<DeckResponse> ConvertDeckToDeckResponse(List<Deck> decks) {
            List<DeckResponse> responses = new List<DeckResponse>();
            foreach(var deck in decks) {
                var mb = GetCardBulk(deck.Mainboard);
                var sb = GetCardBulk(deck.Sideboard);
                var cons = GetCardBulk(deck.Considering);

                responses.Add(new DeckResponse {
                    Id = deck.Id,
                    Editors = deck.Editors,
                    Name = deck.Name,
                    Privacy = deck.Privacy,
                    Format = deck.Format,
                    Likes = deck.Likes,
                    Dislikes = deck.Dislikes,
                    Views = deck.Views,
                    Mainboard = mb,
                    Sideboard = sb,
                    Considering = cons,
                    CoverImage = deck.CoverImage,
                    CreatedDate = deck.CreatedDate,
                    ModifiedDate = deck.ModifiedDate,
                    Commander1 = deck.Commander1,
                    Commander2 = deck.Commander2
                });
            }

            return responses;
        }
    }
}