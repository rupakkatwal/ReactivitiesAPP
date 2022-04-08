using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Unit>
        {
            public string TargetUsername{get; set;}
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            public readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer =  await _dataContext.Users.FirstOrDefaultAsync( x=>
                    x.UserName == _userAccessor.GetUsername());
                
                var target =  await _dataContext.Users.FirstOrDefaultAsync(x=>
                    x.UserName == request.TargetUsername);
                
              
                var following =  await _dataContext.UserFollowings.FindAsync(observer.Id, target.Id);

                if(following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    _dataContext.UserFollowings.Add(following);
                }

                else
                {
                    _dataContext.UserFollowings.Remove(following);
                }

                var success =  await _dataContext.SaveChangesAsync() > 0;

                return Unit.Value;

                

            }
        }
    }
}