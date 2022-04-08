using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[Controller]")]
    public class AccountController: ControllerBase
    {
        public readonly TokenService _tokenService;
        
        public readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService){
              _tokenService = tokenService;
              _userManager = userManager;
            _signInManager = signInManager;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user =  await _userManager.Users.Include(p=> p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);
            if(user == null) return Unauthorized();
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if(result.Succeeded)
            {
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Image = user?.Photos?.FirstOrDefault(x=> x.IsMain)?.Url,
                    Token =  _tokenService.CreateToken(user),
                    UserName = user.UserName
                };
            }
            return Unauthorized();

        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email","Email already exist");
                return ValidationProblem();
            }
            if(await _userManager.Users.AnyAsync(x=> x.UserName == registerDto.UserName))
            {
                 ModelState.AddModelError("username","UserName already exist");
                return ValidationProblem();
            }

            var user = new AppUser{
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user,registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);
               
            }
            ModelState.AddModelError("password","Password must be 8 character and combined with uppercase,number and special character");
            return BadRequest(ModelState);
        }


        [HttpGet("getcurrentuser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
             var user =  await _userManager.Users.Include(p=> p.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            
            return new UserDto
             {
                    DisplayName = user.DisplayName,
                    Image = user?.Photos?.FirstOrDefault(x=> x.IsMain)?.Url,
                    Token = _tokenService.CreateToken(user),
                    UserName = user.UserName
             };

        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
             {
                    DisplayName = user.DisplayName,
                    Image = user?.Photos?.FirstOrDefault(x=> x.IsMain)?.Url,
                    Token = _tokenService.CreateToken(user),
                    UserName = user.UserName
             };
        }
        
    }
}