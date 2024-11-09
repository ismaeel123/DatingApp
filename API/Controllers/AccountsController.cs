using System;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController (DataContext context, ITokenService tokenService,IMapper mapper) :BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register (RegisterDTO registerDTO)
    {
        if (await UserExists(registerDTO.UserName)) return BadRequest("Username already taken");
        
        using var hmac= new HMACSHA512();

        var user = mapper.Map<AppUser> (registerDTO);
        user.UserName = registerDTO.UserName.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
        user.PasswordSalt = hmac.Key;
        
        context.Users.Add(user);

        await context.SaveChangesAsync();

        return new UserDTO
        {
            Username= user.UserName,
            Token = tokenService.CreateToken(user),
            KnownAs = user.KnownAs
        };

    }
    private async Task <bool> UserExists (string username)
    {
       return  await context.Users.AnyAsync(x=>x.UserName.ToLower() == username.ToLower());
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login (LoginDTO loginDTO)
    {
        var user =await context.Users
        .Include(x=> x.Photos)
        .FirstOrDefaultAsync(x=>x.UserName == loginDTO.UserName.ToLower());

        if (user ==null)
            return Unauthorized ("invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i]!= user.PasswordHash[i])
            return Unauthorized ("invalid Password");
        }

        return new UserDTO 
        {
            Username =user.UserName,
            Token = tokenService.CreateToken (user),
            PhotoUrl = user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
            KnownAs = user.KnownAs
        };

    }

}
