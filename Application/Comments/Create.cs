using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body {get; set;}
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator(){
                RuleFor(x=>x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            public readonly DataContext _dataContext;
            public readonly IMapper _mapper;
            public readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _dataContext= dataContext;

            }
            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity =   await _dataContext.Activities.FindAsync(request.ActivityId);
                if (activity == null) return null;
                var user =  await _dataContext.Users
                    .Include(p => p.Photos)
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                
                var comment  =  new Comment{
                    Author =  user,
                    Activity = activity,
                    Body =  request.Body
                };

                activity.Comments.Add(comment);
                var success =  await _dataContext.SaveChangesAsync() > 0;
                if(success)return Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment));
                return Result<CommentDto>.Failure("failed to add comment");

            }
        }
    }
}