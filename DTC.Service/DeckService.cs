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
                if((deck.Privacy == "private" || deck.Privacy == "unlisted") && (user == null || !deck.Editors.Contains(user.Username))) {
                    search.Remove(deck);
                }
            }

            return ConvertDeckToDeckSearch(search);
        }

        public DeckResponse CreateDeck(DeckCreationRequest deck, User user) {
            
            if(deck.Privacy == null) deck.Privacy = "public";
            if(deck.Name == null) deck.Name = "New Deck";

            var result = deckRepo.CreateDeck(new Deck {
                Name = deck.Name,
                Privacy = deck.Privacy,
                Format = deck.Format,
                Description = deck.Description,
                CoverImage = deck.CoverImage,
                Mainboard = deck.Mainboard,
                Sideboard = deck.Sideboard,
                Considering = deck.Considering,
                LikedUsernames = new List<string>(),
                Likes = 0,
                Views = 0,
                Editors = new List<string> { user.Username },
                CreatedDate = DateTime.Today,
                ModifiedDate = DateTime.Today,
            });

            return ConvertDeckToDeckResponse(result, user);
        }

        public DeckResponse? GetDeck(Guid deckId, User? user) {
            var tempDeck = deckRepo.GetDeck(deckId).Result;
            if(tempDeck == null) throw new KeyNotFoundException("deck not found");
            if(tempDeck.Privacy.Equals("private") && (user == null || !tempDeck.Editors.Contains(user.Username))) throw new UnauthorizedAccessException("forbidden");
            deckRepo.AddView(deckId);
            return ConvertDeckToDeckResponse(tempDeck, user);
        }

        public DeckResponse? UpdateDeck(Guid deckId, User user, DeckCreationRequest deck) {
            var temp = deckRepo.GetDeck(deckId).Result;
            if(temp == null) throw new KeyNotFoundException("deck not found");
            if(temp.Editors.Where(u => u.Equals(user.Username)).Count() == 0) throw new UnauthorizedAccessException("forbidden");

            return ConvertDeckToDeckResponse(deckRepo.UpdateDeck(deckId, deck), user);
        }

        public List<DeckSearchResponse> GetDecksForUser(string Username, User? LoggedInUser) {

            var results = deckRepo.GetDecksForUser(Username).Result;
            if(LoggedInUser != null && LoggedInUser.Username.Equals(Username)) return ConvertDeckToDeckSearch(results);

            foreach(var deck in results) {
                if(deck.Privacy.Equals("private") || deck.Privacy.Equals("unlisted")) {
                    results.Remove(deck);
                }
            }
            return ConvertDeckToDeckSearch(results);
        }

        public async void DeleteDeck(Guid DeckId, User user) {
            if(!deckRepo.GetDeck(DeckId).Result.Editors.Contains(user.Username)) throw new UnauthorizedAccessException("forbidden");

            await deckRepo.DeleteDeck(DeckId);
        }

        public bool? LikeDeck(Guid deckId, User user) {
            return deckRepo.LikeDeck(deckId, user.Username);
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
                    Views = deck.Views,
                    CoverImage = deck.CoverImage,
                    CreatedDate = deck.CreatedDate,
                    ModifiedDate = deck.ModifiedDate,
                });
            }

            return response;
        }

        private DeckResponse ConvertDeckToDeckResponse(Deck deck, User? user) {
            var mb = new List<CardAmmount>();
            foreach(var card in deck.Mainboard) {
                mb.Add(new CardAmmount() {
                    Amount = card.Amount,
                    Card = GetCardById(card.CardId),
                    IsCommander = card.IsCommander
                });
            }

            var sb = new List<CardAmmount>();
            if(deck.Sideboard != null)
            {
                foreach(var card in deck.Sideboard) {
                    sb.Add(new CardAmmount() {
                        Amount = card.Amount,
                        Card = GetCardById(card.CardId),
                        IsCommander = card.IsCommander
                    });
                }
            }

            var cons = new List<CardAmmount>();
            if(deck.Considering != null)
            {
                foreach(var card in deck.Considering) {
                    cons.Add(new CardAmmount() {
                        Amount = card.Amount,
                        Card = GetCardById(card.CardId),
                        IsCommander = card.IsCommander
                    });
                }
            }

            return new DeckResponse {
                Id = deck.Id,
                Editors = deck.Editors,
                Name = deck.Name,
                Privacy = deck.Privacy,
                Format = deck.Format,
                Likes = deck.Likes,
                Views = deck.Views,
                Mainboard = mb,
                Sideboard = sb,
                Considering = cons,
                CoverImage = deck.CoverImage,
                CreatedDate = deck.CreatedDate,
                ModifiedDate = deck.ModifiedDate,
                LikedDeck = user != null ? deck.LikedUsernames.Contains(user.Username) : false,
                Description = deck.Description,
            };
        }
    }
}