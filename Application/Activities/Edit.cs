using AutoMapper;
using Domain;
using MediatR;
using persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _Context;
            private readonly IMapper _mapper;
            public Handler(DataContext Context, IMapper mapper)
            {
                _mapper = mapper;
                _Context = Context;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _Context.Activities.FindAsync(request.Activity.Id);
                _mapper.Map(request.Activity, activity);
                await _Context.SaveChangesAsync();
                return Unit.Value;
            }
        }
    }
}