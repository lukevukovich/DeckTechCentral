using DTC.Model;
using DTC.DataAccess;
using MongoDB.Driver.Core.Connections;
using System.Data.Common;
using MongoDB.Bson.Serialization.Serializers;

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

            List<DeckSearchResponse> result = new List<DeckSearchResponse>();
            foreach(var d in search.Result) {
                if(d.Privacy.Equals("public")) {
                    result.Append(new DeckSearchResponse {
                        Id = d.Id,
                        Editors = d.Editors,
                        Name = d.Name,
                        Format = d.Format,
                        Likes = d.Likes,
                        Dislikes = d.Dislikes,
                        Views = d.Views,
                        CoverImage = d.CoverImage,
                        CreatedDate = d.CreatedDate,
                        ModifiedDate = d.ModifiedDate
                    });
                }
            }

            return result;
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

            var mb = GetCardBulk(tempDeck.Mainboard);
            var sb = GetCardBulk(tempDeck.Sideboard);
            var cons = GetCardBulk(tempDeck.Considering);

            var deck = new DeckResponse {
                Id = tempDeck.Id,
                Editors = tempDeck.Editors,
                Privacy = tempDeck.Privacy,
                Name = tempDeck.Name,
                Format = tempDeck.Format,
                Likes = tempDeck.Likes,
                Dislikes = tempDeck.Dislikes,
                Views = tempDeck.Views,
                Description = tempDeck.Description,
                CoverImage = tempDeck.CoverImage,
                Mainboard = mb,
                Sideboard = sb,
                Considering = cons,
                CreatedDate = tempDeck.CreatedDate,
                ModifiedDate = tempDeck.ModifiedDate,
                Commander1 = tempDeck.Commander1,
                Commander2 = tempDeck.Commander2,
            };

            return deck;
        }

        public List<DeckSearchResponse> GetDecksForUserId(string userId) {
            //get user

            return deckRepo.GetDecksForUser(user);
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
                }
            }

            //make a scryfall call for the missing cards
            //insert the missing cards into the db
        }

        public List<Card> SearchCard(string q, int page, int pageSize) {
            //set up rest sharp client stuff
        }

        public void CreateCard(Card card) {
            cardRepo.CreateCard(card);
        }
    }
}