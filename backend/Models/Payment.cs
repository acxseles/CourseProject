using System;

namespace SchoolSwedishAPI.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int EnrollmentId { get; set; }
        public decimal Amount { get; set; }
        public string YooKassaPaymentId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }

        public Enrollment Enrollment { get; set; }
    }
}