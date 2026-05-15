using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using MojPrevoz.Services.Interfaces;

namespace MojPrevoz.Helpers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class PrivateKeyAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            //if (context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any())
            //    return;

            var apiKeyValidator = context.HttpContext.RequestServices.GetService<IApiKeyValidator>();

            if (!context.HttpContext.Request.Headers.TryGetValue("X-Encrypted-ApiKey", out var encryptedKey) || apiKeyValidator == null || !apiKeyValidator.ValidateApiKey(encryptedKey))
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
