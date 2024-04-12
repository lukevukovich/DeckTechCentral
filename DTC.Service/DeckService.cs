using DTC.Model;
using DTC.DataAccess;
using RestSharp;
using MongoDB.Driver.Linq;
using Amazon.Runtime.Internal;
using System.Net;
using System.Data.Common;

namespace DTC.Service {
    public class DeckService : IDeckService
    {
        DeckAccess deckRepo;
        CardAccess cardRepo;
        public DeckService() {
            deckRepo = new DeckAccess();
            cardRepo = new CardAccess();
        }
        public List<DeckSearchResponse> SearchDeck(string? name, string? format, string? sortBy, User? user) {

            var search = deckRepo.SearchDeck(name, format, sortBy).Result;
            foreach(var deck in search) {
                if(deck.Privacy == "private" && (user == null || !deck.Editors.Contains(user.Username)))
                    search.Remove(deck);
            }

            return ConvertDeckToDeckSearch(search);
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
            });
        }

        public DeckResponse? GetDeck(Guid deckId, User? user) {
            var tempDeck = deckRepo.GetDeck(deckId).Result;
            if(tempDeck.Privacy.Equals("private") && (user == null || tempDeck.Editors.Contains(user.Username))) return null;
            deckRepo.AddView(deckId);
            return ConvertDeckToDeckResponse(new List<Deck>{tempDeck}).First();
        }

        public DeckResponse? UpdateDeck(Guid deckId, User user, DeckCreationRequest deck) {
            var temp = deckRepo.GetDeck(deckId).Result;
            if(temp.Editors.Where(u => u.Equals(user.Username)).Count() == 0) throw new UnauthorizedAccessException();

            return ConvertDeckToDeckResponse(new List<Deck> {deckRepo.UpdateDeck(deckId, new Deck {
                Name = deck.Name,
                Privacy = deck.Privacy,
                Format = deck.Format,
                Description = deck.Description,
                CoverImage = deck.CoverImage,
                Mainboard = deck.Mainboard,
                Sideboard = deck.Sideboard,
                Considering = deck.Considering,
            })}).First();
        }

        public List<DeckSearchResponse> GetDecksForUser(User user) {

            var results = deckRepo.GetDecksForUser(user.Username).Result;
            return ConvertDeckToDeckSearch(results);
        }

        public async void DeleteDeck(Guid DeckId, User user) {
            if(!deckRepo.GetDeck(DeckId).Result.Editors.Contains(user.Username)) {
                throw new UnauthorizedAccessException();
            } 

            await deckRepo.DeleteDeck(DeckId);
        }

        public Card GetCardById(Guid id) {
            return GetCardBulk(new List<Guid> {id}).First();
        }

        public List<Card> GetCardBulk(List<Guid> ids) {
            var cards = cardRepo.GetCardBulk(ids).Result;

            List<Guid> notInDB = new List<Guid>();
            // foreach(var card in cards) {
            //     if(card.Name == null) {
            //         notInDB.Append(card.Id);
            //         cards.Remove(card);
            //     }
            // }

            foreach(var id in ids) {
                if(cards.Where(f => f.Id.Equals(id)).Count() == 0) {
                    notInDB.Add(id);
                }
            }


            if(notInDB.Count() > 0) {
                var newCards = CardSearching.GetCards(notInDB);
                cardRepo.CreateCardBulk(newCards);

                foreach(var card in newCards) {
                    cards.Add(card);
                }
            }

            return cards;
        }

        public List<Card> SearchCard(string q, int? page, int? pageSize) {
            var response = CardSearching.SearchCard(q, page, pageSize);
            if(response == null) return null;
            else {
                return response;
            }
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
                var mb = new List<CardAmmount>();
                foreach(var card in deck.Mainboard) {
                    mb.Add(new CardAmmount() {
                        Amount = card.Amount,
                        Card = GetCardById(card.CardId),
                        IsCommander = card.IsCommander
                    });
                }

                var sb = new List<CardAmmount>();
                foreach(var card in deck.Mainboard) {
                    sb.Add(new CardAmmount() {
                        Amount = card.Amount,
                        Card = GetCardById(card.CardId),
                        IsCommander = card.IsCommander
                    });
                }

                var cons = new List<CardAmmount>();
                foreach(var card in deck.Mainboard) {
                    cons.Add(new CardAmmount() {
                        Amount = card.Amount,
                        Card = GetCardById(card.CardId),
                        IsCommander = card.IsCommander
                    });
                }

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
                });
            }

            return responses;
        }
    }
}