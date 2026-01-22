using AutoMapper;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetAllLeaveType;
using HR.LeaveManagement.Application.Features.LeaveType.Queries.GetLeaveType.DTOs;
using HR.LeaveManagement.Application.LeaveTypeProfile;
using HRLeaveMamagment.Application.UnitTest.Mocks;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRLeaveMamagment.Application.UnitTest.Features.LeaveType.Queries.GetLeaveType
{
    public class GetLeaveTypesQueryHandlerTests
    {
        private readonly IMapper _mapper;
        private readonly Mock<ILeaveTypeRepository> _mockRepo;

        public GetLeaveTypesQueryHandlerTests()
        {
            _mockRepo = MockLeaveTypeRepository.GetLeaveTypes();
            var mapperConfig = new MapperConfiguration(c => 
            {
                c.AddProfile<LeaveTypeProfile>();
            });

            _mapper = mapperConfig.CreateMapper();
        }

        [Fact]
        public async Task GetLeaveTypeListTest()
        {
            var handler = new GetLeavTypesHandlerQuery(_mapper, _mockRepo.Object);

            var result = await handler.Handle(new GetLeaveTypeQuery(), CancellationToken.None);

            result.ShouldBeOfType<List<LeaveTypeDTO>>();
            result.Count.ShouldBe(3);
        }
    }
}
