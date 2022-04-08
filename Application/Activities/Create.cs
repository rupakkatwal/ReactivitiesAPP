using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator: AbstractValidator<Activity>
        {
            public  CommandValidator(){
                RuleFor(x => x.Title).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
           private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                 _userAccessor = userAccessor;
                 _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user  =  await _context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetUsername()
                );
                var attendee =  new ActivityAttendee{
                    AppUser = user,
                    Activity =  request.Activity,
                    IsHost = true
                };
                request.Activity.Attendees.Add(attendee);
                _context.Activities.Add(request.Activity); 
                await _context.SaveChangesAsync();  
                return Unit.Value;         
            }
        }
    }
}