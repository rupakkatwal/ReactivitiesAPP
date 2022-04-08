using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<Profiles.Profile>>
        {
            public string Predicate{get; set;}
            public string UserName{get; set;}

        }

        public class Handler : IRequestHandler<Query, List<Profiles.Profile>>
        {
            public readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _dataContext = dataContext;
                _userAccessor = userAccessor;
                
            }
            public async Task<List<Profiles.Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles =  new List<Profiles.Profile>();
                switch(request.Predicate)
                {
                    case "followers":
                        profiles = await _dataContext.UserFollowings.Where(x=> x.Target.UserName == request.UserName)
                            .Select(u=> u.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new{currentUserName = _userAccessor.GetUsername()})
                            .ToListAsync();
                        break;
                    
                    case "following":
                        profiles = await _dataContext.UserFollowings.Where(x=> x.Observer.UserName == request.UserName)
                            .Select(u=> u.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                                new{currentUserName = _userAccessor.GetUsername()})
                            .ToListAsync();
                        break;

                }

                return profiles;

            }
        }
    }
}