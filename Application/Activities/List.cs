using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;
using static Application.Core.PageList;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<PagedList<ActivityDto>> { 
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedList<ActivityDto>>
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

            public async Task<PagedList<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                var queries =  _context.Activities
                    .Where(d=> d.Date >= request.Params.StartDate)
                    .OrderBy(d=> d.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new{currentUserName = _userAccessor.GetUsername()})
                    .AsQueryable();
                
                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    queries = queries.Where(x => x.Attendees.Any( a=> a.UserName == _userAccessor.GetUsername()));
                }
                 if(request.Params.IsHost && !request.Params.IsGoing)
                {
                    queries = queries.Where(x => x.HostUsername == _userAccessor.GetUsername());
                }

                var result = await PagedList<ActivityDto>.CreateAsync(queries,request.Params.PageNumber, request.Params.PageSize);
                return result;
            }
        }
    }
}