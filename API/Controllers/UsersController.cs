using System;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository repository, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
    {
        var users= await repository.GetMembersAsync();
        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDTO>> GetUser(string username)
    {
        var user=await repository.GetMemberAsync(username);

        if (user ==null) return NotFound();
        
        return user;
    }

    [HttpPut]
    public async Task <ActionResult> UpdateUser (MemberUpdateDTO memberUpdateDTO)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null) return BadRequest ("mfeesh username fil token");

        var user = await repository.GetUserbyUsernameAsync (username);
        if (user == null) return BadRequest ("mesh la2y el user da lol");

        mapper.Map (memberUpdateDTO,user);

         if (await repository.SaveAllAsync()) return NoContent ();
         return BadRequest ("bazet ya m3llem el updataya");
    }

}
