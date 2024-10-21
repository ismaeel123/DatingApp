using System;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController (DataContext context, ITokenService tokenService) :BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register (RegisterDTO registerDTO)
    {
        if (await UserExists(registerDTO.UserName)) return BadRequest("Username already taken");

        using var hmac= new HMACSHA256();

        var user= new AppUser 
        {
            UserName= registerDTO.UserName.ToLower(),
            PasswordHash =hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
            PasswordSalt =hmac.Key
        };

        context.Users.Add(user);

        await context.SaveChangesAsync();

        return new UserDTO
        {
            Username= user.UserName,
            Token = tokenService.CreateToken(user)
        };


    }
    private async Task <bool> UserExists (string username)
    {
       return  await context.Users.AnyAsync(x=>x.UserName.ToLower() == username.ToLower());
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login (LoginDTO loginDTO)
    {
        var user =await context.Users.FirstOrDefaultAsync(x=>x.UserName == loginDTO.UserName.ToLower());
        if (user ==null)
            return Unauthorized ("invalid username");

        using var hmac = new HMACSHA256(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i]!= user.PasswordHash[i])
            return Unauthorized ("invalid Password");
        }

        return new UserDTO 
        {
            Username =user.UserName,
            Token = tokenService.CreateToken (user)
        };

    }

}
