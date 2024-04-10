using DTC.Model;
using DTC.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace DTC.App.Controller {
    [ApiController]
    public class UserController
    {
        private static IUserService userService;
        public UserController() {
            userService = new UserService();
        }

        [Route("user")]
        [HttpPost]
        public void CreateUser([FromBody] CreateNewUser newUser) {
            userService.CreateUser(newUser);
        }

        [Route("user/{email}")]
        [HttpGet]
        public User GetUserByEmail([FromRoute] string email) {
            return userService.GetUserByEmail(email).Result;
        }
    }
}