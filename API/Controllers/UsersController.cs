using System;
using System.Net.Http.Headers;
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository repository, IMapper mapper, IPhotoService photoService) : BaseApiController
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
        var user = await repository.GetUserbyUsernameAsync (User.GetUserName());
        if (user == null) return BadRequest ("mesh la2y el user da lol");

        mapper.Map (memberUpdateDTO,user);

         if (await repository.SaveAllAsync()) return NoContent ();
         return BadRequest ("bazet ya m3llem el updataya");
    }

    [HttpPost("add-photo")]
    public async Task <ActionResult<PhotoDTO>> AddPhoto (IFormFile file)
    {
        var user= await repository.GetUserbyUsernameAsync (User.GetUserName());
        if (user == null) return   BadRequest ("el user mesh mwgood lol");

        var result = await photoService.AddPhotoAsync (file);

        if (result.Error != null) return BadRequest ("fi 7aga ghalat fi cloudinary");

        var photo = new Photo {Url= result.SecureUrl.AbsoluteUri, PublicId = result.PublicId};
        
        if (user.Photos.Count==0)
            photo.IsMain=true;

        user.Photos.Add(photo);

        if (await repository.SaveAllAsync()) 
        return CreatedAtAction (nameof(GetUser), new {username= user.UserName}, mapper.Map<PhotoDTO> (photo));

        return BadRequest ("baz fil a5er brdo");
    }

    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto (int photoId){
        var user = await repository.GetUserbyUsernameAsync (User.GetUserName());
        if (user == null) return BadRequest("couldnt find user lol");

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null || photo.IsMain) return BadRequest("mynf3sh el klam da 3al photos");

        var currentMain = user.Photos.FirstOrDefault (x=>x.IsMain);
        if (currentMain == null) return BadRequest ("ezzay 7asal keda aslun?");
        currentMain.IsMain=false;
        
        photo.IsMain=true;

        if (await repository.SaveAllAsync()) return NoContent();

        return BadRequest("fi 3awa2 7asal");
    }

    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await repository.GetUserbyUsernameAsync(User.GetUserName());
        if (user ==null) return BadRequest("mfeesh user");

        var photo = user.Photos.FirstOrDefault(x => x.Id==photoId);
        if (photo == null || photo.IsMain) return BadRequest("cant delete ya m3llem");

        if (photo.PublicId != null)
        {
            var  result=await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error !=null) return BadRequest (result.Error.Message);
        }

        user.Photos.Remove(photo);
        if (await repository.SaveAllAsync()) return Ok();

        return BadRequest("fi 3awa2 hena");
    }


}
