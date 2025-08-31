
import React from 'react';
import { X, Plus, Minus, ShoppingBag, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export const CartDropdown = () => {
  const { state, removeItem, updateQuantity, toggleCart, setPaymentMethod, getSubtotal, getHST, getTotalPrice } = useCart();

  const paymentMethods = [
    { id: 'credit-card', label: 'Credit Card', icon: CreditCard },
    { id: 'debit-card', label: 'Debit Card', icon: CreditCard },
    { id: 'paypal', label: 'PayPal', icon: Wallet },
    { id: 'apple-pay', label: 'Apple Pay', icon: Smartphone },
  ];

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={toggleCart}
      />
      
      {/* Cart Slide-out */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md glass-effect z-50 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-white/10">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold animated-gradient-text">Shopping Cart</h2>
            <Button variant="ghost" size="sm" onClick={toggleCart} className="glass-button">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 glass-effect rounded-lg border border-white/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent font-semibold">${item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 glass-button border-white/20"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 glass-button border-white/20"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Selection & Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-white/10 p-6 space-y-6">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center space-x-2 p-3 rounded-lg border text-sm transition-colors ${
                          state.paymentMethod === method.id
                            ? 'bg-gradient-to-r from-sky-500/20 to-indigo-600/20 border-sky-500/50 text-sky-400'
                            : 'border-white/20 hover:border-white/30 glass-effect'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>HST (13%):</span>
                  <span>${getHST().toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white border-0">
                Checkout with {paymentMethods.find(m => m.id === state.paymentMethod)?.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
