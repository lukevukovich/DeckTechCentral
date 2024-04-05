using DTC.Model;
using DTC.Service;
using Microsoft.AspNetCore.Mvc;

namespace DTC.App.Controller {
    [ApiController]
    public class DeckListController : ControllerBase
    {
        private static IDeckService deckService;

        public DeckListController() {
            deckService = new DeckService();
        }
        [HttpGet]
        [Route("deck/{deckId}")]
        public DeckResponse GetDeck([FromRoute] Guid deckId, [FromHeader] Guid? userId) {
            return userId != null ? deckService.GetDeck(deckId, userId.Value) : deckService.GetDeck(deckId);
        }

        [HttpPut]
        [Route("deck/{deckId}")]
        public DeckResponse UpdateDeck([FromRoute] Guid deckId, [FromHeader] Guid userId, [FromBody] DeckCreationRequest deck) {
            return deckService.UpdateDeck(deckId, userId, deck);
        }

        [HttpGet]
        [Route("deck/search")]
        public List<DeckSearchResponse> SearchDecks([FromQuery] string? name, [FromQuery] string? format, [FromQuery] string? commander1, [FromQuery] string? commander2, [FromQuery] string? sortBy) {
            return deckService.SearchDeck(name, format, commander1, commander2, sortBy);
        }

        [HttpGet]
        [Route("deck/users/{userId}")]
        public List<DeckSearchResponse> GetUserDecks([FromRoute] Guid userId, [FromHeader] Guid requestingUser) {
            return deckService.GetDecksForUserId(userId); //TODO add in userRequesting in the check.
        }

        [HttpGet]
        [Route("card/{cardId}")]
        public Card GetCard([FromRoute] Guid cardId) {
            return deckService.GetCardById(cardId);
        }

        [HttpPost]
        [Route("card/bulk")]
        public List<Card> GetCardBulk([FromBody] Guid[] cardIds) {
            return deckService.GetCardBulk(cardIds.ToList());
        }

        [HttpGet]
        [Route("card/search")]
        public List<Card> SearchCard([FromQuery] string q, [FromQuery] int? page, [FromQuery] int? pageSize) {
            return deckService.SearchCard(q, page, pageSize);
        }
    }
}