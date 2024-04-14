using DTC.App.Helper;
using DTC.Model;
using DTC.Service;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Bson;

namespace DTC.App.Controller {
    [ApiController]
    public class DeckListController : ControllerBase
    {
        private IDeckService deckService;

        public DeckListController(IDeckService deckService) {
            this.deckService = deckService;
        }
        [HttpPost]
        [Authorize]
        [Route("deck")]
        public DeckResponse CreateDeck([FromBody] DeckCreationRequest deck) {
            return deckService.CreateDeck(deck, (User)ControllerContext.HttpContext.Items["User"]);
        }

        [HttpGet]
        [Route("deck/{deckId}")]
        public DeckResponse GetDeck([FromRoute] Guid deckId) {
            return deckService.GetDeck(deckId, (User?)ControllerContext.HttpContext.Items["User"]);
        }

        [HttpDelete]
        [Route("deck/{deckId}")]
        public void DeleteDeck([FromRoute] Guid deckId, [FromHeader] Guid userId) {
            deckService.DeleteDeck(deckId, userService.GetUserById(userId).Result);
        }

        [HttpPut]
        [Authorize]
        [Route("deck/{deckId}")]
        public DeckResponse UpdateDeck([FromRoute] Guid deckId, [FromBody] DeckCreationRequest deck) {
            return deckService.UpdateDeck(deckId, (User)ControllerContext.HttpContext.Items["User"], deck);
        }

        [HttpGet]
        [Route("deck/search")]
        public List<DeckSearchResponse> SearchDecks([FromQuery] string? name, [FromQuery] string? format, [FromQuery] string? sortBy) {          
            return deckService.SearchDeck(name, format, sortBy, (User?)ControllerContext.HttpContext.Items["User"]);
        }

        [HttpGet]
        [Route("deck/users/{UserName}")]
        public List<DeckSearchResponse> GetUserDecks([FromHeader] string requestingUser) {
            return deckService.GetDecksForUser(requestingUser, (User?)ControllerContext.HttpContext.Items["User"]);
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

        //Add in deck Liking

        [HttpPatch]
        [Authorize]
        [Route("deck/{deckId}/like")]
        public IActionResult LikeDeck([FromRoute] Guid deckId) {
            var result = deckService.LikeDeck(deckId, (User)ControllerContext.HttpContext.Items["User"]);
            if(result == null) return NotFound();
            return Ok(result);
        }
    }
}