using DTC.Model;
using DTC.Service;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace DTC.App.Controller {
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService userService;
        public UserController(IUserService userService) {
            this.userService = userService;
        }

        [Route("user")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] CreateNewUser newUser) {
            if(userService.CreateUser(newUser)) return Ok();
            return BadRequest(new {message = "Username is in use"});
        }

        [Route("user/login")]
        [HttpPost]
        public IActionResult LogIn([FromBody] AuthenticateRequest request) {
            var response = userService.Authenticate(request);

            if(response == null) return BadRequest(new {message = "Username or Password is incorrect"});

            return Ok(response);
        }
    }
}