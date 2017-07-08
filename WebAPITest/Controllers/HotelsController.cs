using HotelsWeb.Models;
using HotelsWeb.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace HotelsWeb.Controllers
{
    public class HotelsController : ApiController
    {
        [HttpGet]
        public async Task<IHttpActionResult> GatAllHotels()
        {
            TestDBEntities db = new TestDBEntities();
            var hotels = await db.Hotels.Select(h => new { h.ID, h.Name, h.Date, h.LastUpdate }).ToListAsync();
            return Ok(hotels);
        }

        [HttpPost]
        public async Task<IHttpActionResult> CreateHotel(HotelViewModel hotel)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TestDBEntities db = new TestDBEntities();

            var exist = await db.Hotels
                                .AnyAsync(h => h.Name.Equals(hotel.Name, StringComparison.InvariantCultureIgnoreCase));

            if(exist)
            {
                return BadRequest("Object already exist");
            }

            var newHotel = new Hotel
            {
                Name = hotel.Name,
                Date = DateTime.Now,
                LastUpdate = DateTime.Now
            };

            db.Hotels.Add(newHotel);
            await db.SaveChangesAsync();
            var location = Request.RequestUri + newHotel.ID.ToString();
            return Created(location, newHotel);
        }

        [HttpDelete]
        public async Task<IHttpActionResult> DeleteHotel(int id)
        {
            TestDBEntities db = new TestDBEntities();

            var hotel = await db.Hotels.Where(h => h.ID == id).SingleOrDefaultAsync();

            if (hotel == null)
            {
                return BadRequest("Object not found");
            }

            db.Hotels.Remove(hotel);
            await db.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<IHttpActionResult> EditHotel(int id, HotelViewModel hotel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            TestDBEntities db = new TestDBEntities();

            var existingHotel = await db.Hotels.Where(h => h.ID == id).SingleOrDefaultAsync();

            if (existingHotel == null)
            {
                return BadRequest("Object not found");
            }

            existingHotel.Name = hotel.Name;
            existingHotel.LastUpdate = DateTime.Now;

            db.Hotels.Attach(existingHotel);
            var entry = db.Entry(existingHotel);
            entry.Property(h => h.Name).IsModified = true;
            entry.Property(h => h.LastUpdate).IsModified = true;
            await db.SaveChangesAsync();
            return Ok();
        }
    }
}