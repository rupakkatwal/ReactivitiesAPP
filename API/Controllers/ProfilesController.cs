using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController: BaseApiController
    {
        
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return Ok(await Mediator.Send(new Details.Query{Username = username}));
        }

         
        [HttpPut]
        public async Task<IActionResult> EditProfile(Edit.Command command)
        {
            return Ok(await Mediator.Send(command));
        }


        [HttpGet("{username}/activities")]
           public async Task<IActionResult> GetUserActivities(string username, string predicate)
        {
            return Ok(await Mediator.Send(new ListActivities.Query{Username = username, Predicate =  predicate}));
        }

        
    }
}