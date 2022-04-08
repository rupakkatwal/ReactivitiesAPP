using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Followers;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController: BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<Unit> follow(string username)
        {
            return await Mediator.Send(new  FollowToggle.Command{TargetUsername = username});
        }
        
        
        [HttpGet("{username}")]
        public async Task<ActionResult<List<Profile>>> GetFollowing(string username, string predicate)
        {
            return await Mediator.Send(new  List.Query{UserName = username, Predicate = predicate});
        }
    }
}