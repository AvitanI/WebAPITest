using HotelsWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using System.Threading.Tasks;

namespace HotelsWeb.Controllers
{
    public class FacilitiesController : ApiController
    {
        [HttpGet]
        public async Task<IHttpActionResult> GetAllFacilities()
        {
            TestDBEntities db = new TestDBEntities();
            var facilities = await db.Facilities.Select(f => new { f.ID, f.Name }).ToListAsync();
            return Ok(facilities);
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetFacilitiesByHotel(int id)
        {
            TestDBEntities db = new TestDBEntities();

            var hotel = await db.Hotels.Where(h => h.ID == id).SingleOrDefaultAsync();

            if(hotel == null)
            {
                return BadRequest("Object not found");
            }

            var facilities = await db.Facilities
                                    .Where(f => f.Hotels.Any(h => h.ID == id))
                                    .Select(s => new { s.ID, s.Name })
                                    .ToListAsync();
            return Ok(facilities);
        }
    }
}
