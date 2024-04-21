using System.Buffers;
using System.Collections.Immutable;
using System.Net;
using System.Text;
using DTC.Model;
using Microsoft.AspNetCore.Mvc.Filters;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Serializers;

namespace DTC.App.Helper {
    public class ExceptionFilterMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionFilterMiddleware(RequestDelegate next) {
            _next = next;
        }

        public async Task Invoke(HttpContext context) {
            try 
            {
                await _next(context);
            }
            catch(Exception ex) 
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var response = context.Response;
            var errorMessage = new ErrorMessage();
            if(ex is ArgumentException) {
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                errorMessage.message = ex.Message;
            }
            else if(ex is UnauthorizedAccessException) {
                if(ex.Message.Equals("forbidden")) {
                    response.StatusCode = (int)HttpStatusCode.Forbidden;

                }
                else {
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                }

                errorMessage.message = ex.Message;
            }
            else if(ex is KeyNotFoundException) {
                errorMessage.message = ex.Message;
                response.StatusCode = (int)HttpStatusCode.NotFound;
            }
            else {
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                errorMessage.message = "An internal server error has occured";
            }
            var errorString = $"{{\"message\":\"{errorMessage.message}\"}}";
            
            response.BodyWriter.Write(new ReadOnlySpan<byte>(Encoding.UTF8.GetBytes(errorString)));
        }
    }
}