using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest
        {
            public Guid Id {get; set;}
        }

        public class Handler : IRequestHandler<Command>
        {
        private readonly IUserAccessor _userAccessor;
        public readonly DataContext _dataContext;

            public Handler(DataContext dataContext, IUserAccessor userAccessor){
                _dataContext = dataContext;
                _userAccessor = userAccessor;

            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                    .Include(a => a.Attendees).ThenInclude(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);
                
                
                var user  =  await _dataContext.Users.FirstOrDefaultAsync(x=> x.UserName ==  _userAccessor.GetUsername());

                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendace =  activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if(attendace != null && hostUsername == user.UserName){
                    activity.IsCancelled  = !activity.IsCancelled;
                }

                if(attendace !=null  && hostUsername != user.UserName){
                    activity.Attendees.Remove(attendace);
                }

                if(attendace ==null)
                {
                    attendace =new ActivityAttendee{
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendace);
                }
                 var result =  await _dataContext.SaveChangesAsync() > 0;

                 return Unit.Value;
            }
        }
    }
}