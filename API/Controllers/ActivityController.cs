
using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace API.Controllers
{
    [AllowAnonymous]
    public class ActivityController : BaseApiController
    {
        
        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> GetActivities([FromQuery]ActivityParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}));

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetActivity(Guid id)
        {
              return await Mediator.Send(new Details.Query{Id = id});
        }
       
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command{Activity = activity}));
        }
         [Authorize(Policy = "IsActivityHost") ]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id  = id;
            return Ok(await Mediator.Send(new Edit.Command{Activity = activity}));
        }
        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return Ok(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }

    }
}