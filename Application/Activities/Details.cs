using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext _context;
             public readonly IMapper _mapper;
             public readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
               _mapper = mapper;
               _context = context;
               _userAccessor =userAccessor;
            }
            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
              var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new{currentUserName = _userAccessor.GetUsername()})
                    .FirstOrDefaultAsync(x=> x.Id ==  request.Id);

               return activities;
            }
        }
    }
}