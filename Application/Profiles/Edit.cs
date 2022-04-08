using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command: IRequest<Unit>{
            public string DisplayName {get; set;}
            public string Bio {get; set;}
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command>
        {
            public readonly DataContext _dataContext;
            public readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IUserAccessor userAccessor){
                _userAccessor= userAccessor;
                _dataContext= dataContext;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetUsername());

                user.Bio = request.Bio ?? user.Bio;
                user.DisplayName = request.DisplayName ?? user.DisplayName;                
                 _dataContext.Entry(user).State = EntityState.Modified;

                await _dataContext.SaveChangesAsync();
                return Unit.Value;

            }
        }
    }
}