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
        private IUserService userService;

        public DeckListController(IUserService userService, IDeckService deckService) {
            this.userService = userService;
            this.deckService = deckService;
        }
        [HttpPost]
        [Authorize]
        [Route("deck")]
        public async void CreateDeck([FromBody] DeckCreationRequest deck) {
            deckService.CreateDeck(deck, (User)ControllerContext.HttpContext.Items["User"]);
        }

        [HttpGet]
        [Route("deck/{deckId}")]
        public DeckResponse GetDeck([FromRoute] Guid deckId) {
            return deckService.GetDeck(deckId, (User?)ControllerContext.HttpContext.Items["User"]);
        }

        [HttpPut]
        [Authorize]
        [Route("deck/{deckId}")]
        public DeckResponse UpdateDeck([FromRoute] Guid deckId, [FromBody] DeckCreationRequest deck, HttpContext context) {
            return deckService.UpdateDeck(deckId, (User)context.Items["User"], deck);
        }

        [HttpGet]
        [Route("deck/search")]
        public List<DeckSearchResponse> SearchDecks([FromQuery] string? name, [FromQuery] string? format, [FromQuery] string? sortBy, HttpContext context) {          
            return deckService.SearchDeck(name, format, sortBy, (User?)context.Items["User"]);
        }

        [HttpGet] //NEED TO EDIT
        [Route("deck/users/{userId}")]
        public List<DeckSearchResponse> GetUserDecks([FromHeader] Guid requestingUser, HttpContext context) {
            return deckService.GetDecksForUser((User)context.Items["User"]);
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