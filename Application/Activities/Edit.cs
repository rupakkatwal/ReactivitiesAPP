using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

         public class CommandValidator: AbstractValidator<Command>
        {
            public  CommandValidator(){
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _Context;
            private readonly IMapper _mapper;
            public Handler(DataContext Context, IMapper mapper)
            {
                _mapper = mapper;
                _Context = Context;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _Context.Activities.FindAsync(request.Activity.Id);
                _mapper.Map(request.Activity, activity);
                var result = await _Context.SaveChangesAsync() >0;
                if(!result)
                {
                    return Result<Unit>.Failure("Failed to delete the  activity");
                }
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}