using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController(DataContext context) :BaseApiController
{
    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> getAuth ()
    {
        return "Secret Text";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> getNotFound ()
    {
        var thing = context.Users.Find(-1);
        if (thing ==null ) return NotFound();
        return thing;
    }
    [HttpGet("server-error")]
    public ActionResult<AppUser> getServerError ()
    {
        var thing = context.Users.Find(-1)?? throw new Exception ("eh el 7war da?");
        return thing;

    }
    [HttpGet("bad-request")]
    public ActionResult<string> getBadRequest ()
    {
        return BadRequest("3eeb b2a ya user");
    }
}
