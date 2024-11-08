using System;
using System.Security.Claims;

namespace API.Extensions;

public static  class ClaimsPrincipalExtension
{
    public static string  GetUserName (this ClaimsPrincipal user){
        var username = user.FindFirstValue (ClaimTypes.NameIdentifier);
        if (username == null) throw new Exception ("ezzay b2a el habal da?");

        return username;
    }
}
