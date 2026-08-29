import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface BookingSlot {
  date: string;
  time: string;
  available: boolean;
}

interface Booking {
  id: string;
  vetName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  consultationFee: number;
  platformFee: number;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  petName: string;
  reason: string;
}

const mockAvailableSlots: BookingSlot[] = [
  { date: "2024-02-01", time: "09:00", available: true },
  { date: "2024-02-01", time: "10:00", available: true },
  { date: "2024-02-01", time: "11:00", available: false },
  { date: "2024-02-01", time: "14:00", available: true },
  { date: "2024-02-01", time: "15:00", available: true },
  { date: "2024-02-02", time: "09:00", available: true },
  { date: "2024-02-02", time: "10:00", available: true },
  { date: "2024-02-02", time: "14:00", available: true },
];

const mockBookings: Booking[] = [
  {
    id: "1",
    vetName: "Dr. Ahmed Veterinary Clinic",
    date: "2024-01-25",
    time: "10:00",
    status: "confirmed",
    consultationFee: 250,
    platformFee: 25,
    totalAmount: 275,
    paymentStatus: "paid",
    petName: "Max",
    reason: "Regular checkup",
  },
  {
    id: "2",
    vetName: "Dr. Fatima - Freelance Vet",
    date: "2024-01-20",
    time: "14:00",
    status: "completed",
    consultationFee: 150,
    platformFee: 15,
    totalAmount: 165,
    paymentStatus: "paid",
    petName: "Whiskers",
    reason: "Vaccination",
  },
];

export default function BookingSystem() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [bookingData, setBookingData] = useState({
    petName: "",
    reason: "",
    notes: "",
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile" | "bank">("card");

  const consultationFee = 250;
  const platformFee = Math.round(consultationFee * 0.1);
  const totalAmount = consultationFee + platformFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmBooking = () => {
    if (!bookingData.petName || !selectedSlot) {
      alert("Please fill in all required fields");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = () => {
    // TODO: Call payment API
    alert("Payment processed successfully!");
    setShowPayment(false);
    setSelectedSlot(null);
    setBookingData({ petName: "", reason: "", notes: "" });
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400 mb-2">
            Book an Appointment
          </h1>
          <p className="text-yellow-200">Schedule a consultation with your preferred veterinarian</p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            {[
              { id: "new", label: "📅 New Booking" },
              { id: "history", label: "📋 Booking History" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg"
                    : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* New Booking Tab */}
          {activeTab === "new" && (
            <div className="space-y-8">
              {/* Vet/Clinic info */}
              <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-yellow-200 mb-4">Dr. Ahmed Veterinary Clinic</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-yellow-100/80">
                  <div>
                    <p className="text-sm text-yellow-100/60">Rating</p>
                    <p className="font-bold">⭐ 4.9 (156 reviews)</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-100/60">Location</p>
                    <p className="font-bold">Zamalek, Cairo</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-100/60">Consultation Fee</p>
                    <p className="font-bold">250 EGP</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-100/60">Status</p>
                    <p className="font-bold text-green-400">🟢 Open</p>
                  </div>
                </div>
              </div>

              {/* Booking form */}
              <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6 space-y-6">
                <h3 className="text-2xl font-bold text-yellow-200">Booking Details</h3>

                {/* Pet selection */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">Select Pet *</label>
                  <Input
                    name="petName"
                    value={bookingData.petName}
                    onChange={handleInputChange}
                    placeholder="Enter your pet's name"
                    className="bg-slate-700/50 border-yellow-400/30"
                  />
                </div>

                {/* Reason for visit */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">Reason for Visit *</label>
                  <select
                    name="reason"
                    value={bookingData.reason}
                    onChange={(e) =>
                      setBookingData((prev) => ({ ...prev, reason: e.target.value }))
                    }
                    className="w-full bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded-lg px-4 py-2"
                  >
                    <option value="">Select a reason</option>
                    <option value="checkup">Regular Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="illness">Illness/Injury</option>
                    <option value="dental">Dental Care</option>
                    <option value="grooming">Grooming</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-yellow-200 font-semibold mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              {/* Available slots */}
              <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-yellow-200 mb-4">Available Slots</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mockAvailableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={!slot.available}
                      className={`p-4 rounded-lg font-semibold transition-all ${
                        selectedSlot === slot
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 shadow-lg"
                          : slot.available
                          ? "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                          : "bg-slate-700/30 text-slate-500 border border-slate-600/30 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-sm">{slot.date}</div>
                      <div className="text-lg">{slot.time}</div>
                      {!slot.available && <div className="text-xs mt-1">Booked</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              {selectedSlot && (
                <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-yellow-200 mb-4">Price Breakdown</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-yellow-100">
                      <span>Consultation Fee</span>
                      <span className="font-bold">{consultationFee} EGP</span>
                    </div>
                    <div className="flex justify-between text-yellow-100">
                      <span>Platform Fee (10%)</span>
                      <span className="font-bold">{platformFee} EGP</span>
                    </div>
                    <div className="border-t border-yellow-400/30 pt-3 flex justify-between text-yellow-300 text-lg font-bold">
                      <span>Total Amount</span>
                      <span>{totalAmount} EGP</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold py-3 rounded-lg"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              )}

              {/* Payment modal */}
              {showPayment && (
                <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-yellow-200 mb-6">Payment Method</h3>

                  <div className="space-y-4 mb-6">
                    {[
                      { id: "card", label: "💳 Credit/Debit Card" },
                      { id: "mobile", label: "📱 Mobile Wallet" },
                      { id: "bank", label: "🏦 Bank Transfer" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                        className={`w-full p-4 rounded-lg font-semibold transition-all text-left ${
                          paymentMethod === method.id
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900"
                            : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30 hover:bg-slate-600/70"
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-green-400 to-green-500 text-slate-900 font-bold py-3 rounded-lg"
                    >
                      Complete Payment
                    </Button>
                    <Button
                      onClick={() => setShowPayment(false)}
                      variant="outline"
                      className="w-full border-2 border-yellow-400 text-yellow-200 font-bold py-3 rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Booking History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-800/60 border border-yellow-400/30 rounded-lg p-6 hover:border-yellow-400/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-yellow-200">{booking.vetName}</h4>
                      <p className="text-yellow-100/60">Pet: {booking.petName}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-400/20 text-green-300"
                            : booking.status === "completed"
                            ? "bg-blue-400/20 text-blue-300"
                            : "bg-yellow-400/20 text-yellow-300"
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-yellow-100/80">
                    <div>
                      <p className="text-sm text-yellow-100/60">Date & Time</p>
                      <p className="font-bold">{booking.date} {booking.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-100/60">Reason</p>
                      <p className="font-bold">{booking.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-100/60">Total Amount</p>
                      <p className="font-bold">{booking.totalAmount} EGP</p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-100/60">Payment Status</p>
                      <p className={`font-bold ${booking.paymentStatus === "paid" ? "text-green-400" : ""}`}>
                        {booking.paymentStatus.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {booking.status === "confirmed" && (
                      <>
                        <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                          Reschedule
                        </Button>
                        <Button variant="outline" className="border-red-400 text-red-300 px-4 py-2 rounded-lg">
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back button */}
          <div className="mt-8">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-2 border-yellow-400 text-yellow-200 font-bold px-6 py-2 rounded-full"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
