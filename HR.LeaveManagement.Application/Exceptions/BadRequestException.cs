using FluentValidation.Results; 

namespace HR.LeaveManagement.Application.Exceptions;

public class BadRequestException : Exception
{

    public BadRequestException(string message) : base(message)
    {
        ValidationErrors = new Dictionary<string, string[]>();
    }

    public BadRequestException(string message, ValidationResult validationResult) : base(message)
    {
        ValidationErrors = validationResult.Errors
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }

    public IDictionary<string, string[]> ValidationErrors { get; set; }
}