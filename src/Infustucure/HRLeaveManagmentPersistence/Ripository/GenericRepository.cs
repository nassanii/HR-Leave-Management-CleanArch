using HR.LeaveManagement.Application.Contracts.Persistence;
using HRLeaveManagmentPersistence.DatabaseContext;
using HRLeaveManegent.Domin.Common;
using Microsoft.EntityFrameworkCore;

namespace HRLeaveManagmentPersistence.Ripository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly HRDbContext _db;

        public GenericRepository(HRDbContext db)
        {
            this._db = db;
        }


        public async Task AddAsync(T entity)
        {
            await _db.Set<T>().AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            _db.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _db.Set<T>().AsNoTracking().ToListAsync();
        }

        public async Task<T?> GetAsync(int id)
        {
            return await _db.Set<T>().AsNoTracking().FirstOrDefaultAsync(q => q.Id == id);
        }

        public Task UpdateAsync(T entity)
        {
            _db.Entry(entity).State = EntityState.Modified;
            return _db.SaveChangesAsync();
        }
    }
}
