import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AdminAuthGate from './components/admin/AdminAuthGate';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <CartProvider>
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminAuthGate>
                  <AdminPage />
                </AdminAuthGate>
              }
            />
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <CartDrawer />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;
