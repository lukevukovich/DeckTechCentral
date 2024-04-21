using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using DTC.Model;

namespace DTC.App.Helper
{

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            User? user = (User)context.HttpContext.Items["User"];
            if (user == null)
            {
                // not logged in
                //context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
                throw new UnauthorizedAccessException("invalid login");
            }
        }
    }
}