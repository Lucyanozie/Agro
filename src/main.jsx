import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';
import { OrderProvider } from '@/context/OrderContext';
import { ProductProvider } from '@/context/ProductContext';
import { ToastProvider } from '@/context/ToastContext';
import { VerificationProvider } from '@/context/VerificationContext';
import '@/index.css';
createRoot(document.getElementById('root')).render(<StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <VerificationProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <ChatProvider>
                    <App />
                  </ChatProvider>
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </VerificationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>);
