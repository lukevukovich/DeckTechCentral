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
        public void CreateUser([FromBody] CreateNewUser newUser) {
            userService.CreateUser(newUser);
            
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