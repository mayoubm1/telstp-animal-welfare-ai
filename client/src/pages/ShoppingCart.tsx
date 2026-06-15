import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface CartItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Invoice {
  id: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  paymentMethod: string;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Organic Dog Food",
    vendor: "Nature's Best",
    price: 350,
    quantity: 2,
    image: "🐾",
    category: "Food & Treats",
  },
  {
    id: "2",
    name: "Natural Dog Shampoo",
    vendor: "Pet Care Plus",
    price: 120,
    quantity: 1,
    image: "🧴",
    category: "Grooming",
  },
  {
    id: "3",
    name: "Eco-Friendly Dog Toys",
    vendor: "Green Paws",
    price: 200,
    quantity: 1,
    image: "🎾",
    category: "Toys",
  },
];

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    date: new Date("2024-01-20"),
    items: [
      {
        id: "1",
        name: "Premium Cat Food",
        vendor: "Pet Essentials",
        price: 280,
        quantity: 1,
        image: "🐾",
        category: "Food",
      },
    ],
    subtotal: 280,
    tax: 28,
    shippingFee: 50,
    total: 358,
    status: "delivered",
    paymentMethod: "Credit Card",
  },
  {
    id: "INV-002",
    date: new Date("2024-01-15"),
    items: [
      {
        id: "2",
        name: "Rabbit Hay Bundle",
        vendor: "Nature's Store",
        price: 150,
        quantity: 2,
        image: "🥕",
        category: "Food",
      },
    ],
    subtotal: 300,
    tax: 30,
    shippingFee: 50,
    total: 380,
    status: "shipped",
    paymentMethod: "Mobile Wallet",
  },
];

export default function ShoppingCart() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"cart" | "invoices">("cart");
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile" | "bank">("card");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const shippingFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shippingFee;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (!shippingAddress) {
      alert("Please enter a shipping address");
      return;
    }
    // TODO: Call payment API
    alert("Order placed successfully!");
    setShowCheckout(false);
    setCartItems([]);
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
            Shopping Cart
          </h1>
          <p className="text-yellow-200">Browse and purchase natural pet products</p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            {[
              { id: "cart", label: "🛒 Shopping Cart" },
              { id: "invoices", label: "📄 Invoices" },
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

          {/* Shopping Cart Tab */}
          {activeTab === "cart" && (
            <div className="space-y-8">
              {cartItems.length === 0 ? (
                <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-12 text-center">
                  <p className="text-3xl mb-4">🛒</p>
                  <p className="text-yellow-200 text-lg">Your cart is empty</p>
                  <p className="text-yellow-100/60 mb-6">Start shopping for natural pet products</p>
                  <Button
                    onClick={() => setLocation("/")}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold px-8 py-3 rounded-lg"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  {/* Cart items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-800/60 border border-yellow-400/30 rounded-lg p-6"
                      >
                        <div className="flex gap-6">
                          {/* Product image */}
                          <div className="text-5xl flex-shrink-0">{item.image}</div>

                          {/* Product info */}
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-yellow-200 mb-1">{item.name}</h4>
                            <p className="text-yellow-100/60 mb-2">{item.vendor}</p>
                            <p className="text-sm text-yellow-100/50 mb-3">{item.category}</p>

                            {/* Quantity and price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, item.quantity - 1)
                                  }
                                  className="bg-slate-700/50 text-yellow-200 px-3 py-1 rounded hover:bg-slate-600/70"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(item.id, parseInt(e.target.value))
                                  }
                                  className="w-12 text-center bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded"
                                />
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item.id, item.quantity + 1)
                                  }
                                  className="bg-slate-700/50 text-yellow-200 px-3 py-1 rounded hover:bg-slate-600/70"
                                >
                                  +
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-yellow-100/60">Price</p>
                                <p className="text-2xl font-bold text-yellow-300">
                                  {item.price * item.quantity} EGP
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order summary */}
                  <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-yellow-200 mb-6">Order Summary</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-yellow-100">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span className="font-bold">{subtotal} EGP</span>
                      </div>
                      <div className="flex justify-between text-yellow-100">
                        <span>Tax (10%)</span>
                        <span className="font-bold">{tax} EGP</span>
                      </div>
                      <div className="flex justify-between text-yellow-100">
                        <span>Shipping</span>
                        <span className="font-bold">
                          {shippingFee === 0 ? "FREE" : `${shippingFee} EGP`}
                        </span>
                      </div>
                      {shippingFee === 0 && (
                        <p className="text-green-400 text-sm">✓ Free shipping on orders over 500 EGP</p>
                      )}
                      <div className="border-t border-yellow-400/30 pt-3 flex justify-between text-yellow-300 text-lg font-bold">
                        <span>Total</span>
                        <span>{total} EGP</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold py-3 rounded-lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>

                  {/* Checkout form */}
                  {showCheckout && (
                    <div className="bg-slate-800/60 border-2 border-yellow-400/40 rounded-2xl p-6 space-y-6">
                      <h3 className="text-2xl font-bold text-yellow-200">Checkout</h3>

                      {/* Shipping address */}
                      <div>
                        <label className="block text-yellow-200 font-semibold mb-2">
                          Shipping Address *
                        </label>
                        <textarea
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Enter your full address..."
                          rows={3}
                          className="w-full bg-slate-700/50 border border-yellow-400/30 text-yellow-100 rounded-lg px-4 py-2"
                        />
                      </div>

                      {/* Payment method */}
                      <div>
                        <label className="block text-yellow-200 font-semibold mb-3">
                          Payment Method
                        </label>
                        <div className="space-y-2">
                          {[
                            { id: "card", label: "💳 Credit/Debit Card" },
                            { id: "mobile", label: "📱 Mobile Wallet" },
                            { id: "bank", label: "🏦 Bank Transfer" },
                          ].map((method) => (
                            <button
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                              className={`w-full p-3 rounded-lg font-semibold transition-all text-left ${
                                paymentMethod === method.id
                                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900"
                                  : "bg-slate-700/50 text-yellow-200 border border-yellow-400/30"
                              }`}
                            >
                              {method.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-4">
                        <Button
                          onClick={() => setShowCheckout(false)}
                          variant="outline"
                          className="flex-1 border-2 border-yellow-400 text-yellow-200 font-bold py-3 rounded-lg"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleCheckout}
                          className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-slate-900 font-bold py-3 rounded-lg"
                        >
                          Place Order
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <div className="space-y-4">
              {mockInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-slate-800/60 border border-yellow-400/30 rounded-lg p-6 hover:border-yellow-400/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-yellow-200">{invoice.id}</h4>
                      <p className="text-yellow-100/60">
                        {invoice.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          invoice.status === "delivered"
                            ? "bg-green-400/20 text-green-300"
                            : invoice.status === "shipped"
                            ? "bg-blue-400/20 text-blue-300"
                            : "bg-yellow-400/20 text-yellow-300"
                        }`}
                      >
                        {invoice.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mb-4 pb-4 border-b border-yellow-400/30">
                    {invoice.items.map((item) => (
                      <p key={item.id} className="text-yellow-100/80">
                        {item.name} x{item.quantity} - {item.price * item.quantity} EGP
                      </p>
                    ))}
                  </div>

                  {/* Total and details */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-100/60">Total Amount</p>
                      <p className="text-2xl font-bold text-yellow-300">{invoice.total} EGP</p>
                    </div>
                    <Button className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                      Download Invoice
                    </Button>
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
