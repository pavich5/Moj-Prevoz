using Microsoft.AspNetCore.Http;
using MojPrevoz.Services.Implementations;

namespace MojPrevoz.Middlewares
{
    public class TokenBlocklistMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TokenBlocklistService _tokenBlocklistService;

        public TokenBlocklistMiddleware(RequestDelegate next, TokenBlocklistService tokenBlocklistService)
        {
            _next = next;
            _tokenBlocklistService = tokenBlocklistService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (!string.IsNullOrEmpty(token) && _tokenBlocklistService.IsTokenBlocked(token))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token has been revoked.");
                return;
            }

            await _next(context);
        }
    }
}
