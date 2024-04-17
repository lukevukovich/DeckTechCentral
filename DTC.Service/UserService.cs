using DTC.Model;
using DTC.DataAccess;
using System.Net;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Amazon.Runtime.Internal;
using Microsoft.Extensions.Options;

namespace DTC.Service {
    public class UserService : IUserService
    {

        UserAccess access;
        private readonly SecretKey secret;
        public UserService(IOptions<SecretKey> options) {
            access = new UserAccess();
            secret = options.Value;
        }

        public Task<User> GetUserByEmail(string? email) {
            if(email == null) throw new Exception("invalid email");
            if(!email.Contains('@')) throw new Exception("invalid email");

            return access.GetUserByEmail(email);
        }

        public Task<User> GetUserById(Guid id) {
            return access.GetUserById(id);
        }

        public bool CreateUser(CreateNewUser user) {
            if(user.Username == null || user.Email == null || user.password == null) throw new Exception("invalid user");
            if(user.Username.Length < 3 || user.Username.Length > 20) throw new Exception("invalid username");
            if(user.Email.Length < 6 || user.Email.Length > 50) throw new Exception("invalid email");
            if(user.password.Length < 6 || user.password.Length > 50) throw new Exception("invalid password");
            
            var salt = GenerateSalt(256);
            var SaltedPassHash = Convert.ToBase64String(Hash(user.password, salt));
            if(access.GetUserByUsername(user.Username) != null) throw new Exception("username already taken");
            if(access.GetUserByEmail(user.Email) != null) throw new Exception("email already taken");

            var result = access.CreateUser(new User() {
                Username = user.Username,
                Email = user.Email,
                UserStatus = "standard",
                Salt = salt,
                SaltedPassHash = SaltedPassHash
            });

            return true;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest request) {

            var user = access.GetUserByEmail(request.Email).Result;

            var saltedHash = Convert.ToBase64String(Hash(request.Password, user.Salt));
            if(!user.SaltedPassHash.Equals(saltedHash)) return null;

            var token = generateJwtToken(user);

            return new AuthenticateResponse(user, token);
        }

        private static byte[] Hash(string value, byte[] salt)
        {
            return Hash(Encoding.UTF8.GetBytes(value), salt);
        }

        private static byte[] Hash(byte[] value, byte[] salt)
        {
            byte[] saltedValue = value.Concat(salt).ToArray();
            // Alternatively use CopyTo.
            //var saltedValue = new byte[value.Length + salt.Length];
            //value.CopyTo(saltedValue, 0);
            //salt.CopyTo(saltedValue, value.Length);

            return SHA256.HashData(saltedValue);
        }

        private static byte[] GenerateSalt(int size)
        {
            //Generate a cryptographic random number.
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            byte[] buff = new byte[size];
            rng.GetBytes(buff);

            // Return a Base64 string representation of the random number.
            return buff;
        }

        private string generateJwtToken(User user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity([new Claim("id", user.Id.ToString())]),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}