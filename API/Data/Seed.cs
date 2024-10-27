using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(DataContext context)
    {
        if (await context.Users.AnyAsync()) return;
        var userData = await File.ReadAllTextAsync("Data/UserDataSeed.json");

        var options = new JsonSerializerOptions {PropertyNameCaseInsensitive=true};
        var users = JsonSerializer.Deserialize<List<AppUser>> (userData,options);

        if(users ==null) return;

        foreach (var user in users)
        {
            using var Hmac= new HMACSHA512 ();
            user.UserName =user.UserName.ToLower();
            user.PasswordHash = Hmac.ComputeHash (Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswordSalt =Hmac.Key;
            context.Users.Add(user);   
        }

        await context.SaveChangesAsync();
    }
}