import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoutes } from '@/routes/ProtectedRoutes'

import { SplashPage } from '@/pages/auth/SplashPage'
import { WelcomePage } from '@/pages/auth/WelcomePage'
import { RoleSelectionPage } from '@/pages/auth/RoleSelectionPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { OTPPage } from '@/pages/auth/OTPPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { AccountCreatedPage } from '@/pages/auth/AccountCreatedPage'

import { ProfileSetup } from '@/pages/farmer/verification/ProfileSetup'
import { IdentityVerification } from '@/pages/farmer/verification/IdentityVerification'
import { AddressVerification } from '@/pages/farmer/verification/AddressVerification'
import { FarmingDetails } from '@/pages/farmer/verification/FarmingDetails'
import { BankVerification } from '@/pages/farmer/verification/BankVerification'
import { SecuritySetup } from '@/pages/farmer/verification/SecuritySetup'
import { ReviewVerification } from '@/pages/farmer/verification/ReviewVerification'
import { VerificationApproved } from '@/pages/farmer/verification/VerificationApproved'

import { FarmerDashboard } from '@/pages/farmer/FarmerDashboard'
import { FarmerMarketplace } from '@/pages/farmer/FarmerMarketplace'
import { CreateProductPage } from '@/pages/farmer/CreateProductPage'
import { FarmerProductDetail } from '@/pages/farmer/FarmerProductDetail'
import { PublishedPage } from '@/pages/farmer/PublishedPage'
import { FarmerOrdersPage } from '@/pages/farmer/FarmerOrdersPage'
import { AnalyticsDashboard } from '@/pages/farmer/AnalyticsDashboard'
import { EarningsPage } from '@/pages/farmer/EarningsPage'
import { ProductSoldPage } from '@/pages/farmer/ProductSoldPage'
import { OrderOverviewPage } from '@/pages/farmer/OrderOverviewPage'
import { WithdrawPage } from '@/pages/farmer/WithdrawPage'
import { WithdrawSuccessPage } from '@/pages/farmer/WithdrawSuccessPage'
import { HarvestTrackerPage } from '@/pages/farmer/HarvestTrackerPage'
import { FarmerProfilePage } from '@/pages/farmer/FarmerProfilePage'
import { FarmerSettingsPage } from '@/pages/farmer/FarmerSettingsPage'
import { FeaturedPlanPage } from '@/pages/farmer/FeaturedPlanPage'

import { BuyerHomePage } from '@/pages/buyer/BuyerHomePage'
import { CategoryProductsPage } from '@/pages/buyer/CategoryProductsPage'
import { ProductDetailPage } from '@/pages/buyer/ProductDetailPage'
import { CartPage } from '@/pages/buyer/CartPage'
import { OrderPlacedPage } from '@/pages/buyer/OrderPlacedPage'
import { BuyerOrdersPage } from '@/pages/buyer/BuyerOrdersPage'
import { OrderTrackingPage } from '@/pages/buyer/OrderTrackingPage'
import { RateFarmerPage } from '@/pages/buyer/RateFarmerPage'
import { BuyerAccountPage } from '@/pages/buyer/BuyerAccountPage'
import { ProfileSettingsPage } from '@/pages/buyer/ProfileSettingsPage'

import { ChatPage } from '@/pages/shared/ChatPage'
import { OrderSummaryPage } from '@/pages/shared/OrderSummaryPage'
import { ReviewsPage } from '@/pages/shared/ReviewsPage'
import { NotFoundPage } from '@/pages/shared/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Onboarding / Public Routes */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/role" element={<RoleSelectionPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OTPPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account-created" element={<AccountCreatedPage />} />

      {/* Protected Farmer Routes */}
      <Route element={<ProtectedRoutes role="farmer" />}>
        <Route element={<AppShell role="farmer" />}>
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/marketplace" element={<FarmerMarketplace />} />
          <Route path="/farmer/products/new" element={<CreateProductPage />} />
          <Route path="/farmer/products/:id" element={<FarmerProductDetail />} />
          <Route path="/farmer/products/:id/edit" element={<CreateProductPage />} />
          <Route path="/farmer/products/:id/reviews" element={<ReviewsPage role="farmer" />} />
          <Route path="/farmer/published" element={<PublishedPage />} />
          <Route path="/farmer/orders" element={<FarmerOrdersPage />} />
          <Route path="/farmer/orders/:id" element={<OrderSummaryPage role="farmer" />} />
          <Route path="/farmer/analytics" element={<AnalyticsDashboard />} />
          <Route path="/farmer/earnings" element={<EarningsPage />} />
          <Route path="/farmer/earnings/withdraw" element={<WithdrawPage />} />
          <Route path="/farmer/earnings/withdraw/success" element={<WithdrawSuccessPage />} />
          <Route path="/farmer/sold" element={<ProductSoldPage />} />
          <Route path="/farmer/order-overview" element={<OrderOverviewPage />} />
          <Route path="/farmer/harvest" element={<HarvestTrackerPage />} />
          <Route path="/farmer/profile" element={<FarmerProfilePage />} />
          <Route path="/farmer/settings" element={<FarmerSettingsPage />} />
          <Route path="/farmer/featured" element={<FeaturedPlanPage />} />
          <Route path="/farmer/chats" element={<ChatPage role="farmer" />} />
          <Route path="/farmer/chats/:id" element={<ChatPage role="farmer" />} />

          {/* Verification sub-routes */}
          <Route path="/farmer/verify" element={<Navigate to="/farmer/verify/profile" replace />} />
          <Route path="/farmer/verify/profile" element={<ProfileSetup />} />
          <Route path="/farmer/verify/identity" element={<IdentityVerification />} />
          <Route path="/farmer/verify/address" element={<AddressVerification />} />
          <Route path="/farmer/verify/farming" element={<FarmingDetails />} />
          <Route path="/farmer/verify/bank" element={<BankVerification />} />
          <Route path="/farmer/verify/security" element={<SecuritySetup />} />
          <Route path="/farmer/verify/review" element={<ReviewVerification />} />
          <Route path="/farmer/verify/approved" element={<VerificationApproved />} />
        </Route>
      </Route>

      {/* Protected Buyer Routes */}
      <Route element={<ProtectedRoutes role="buyer" />}>
        <Route element={<AppShell role="buyer" />}>
          <Route path="/buyer" element={<BuyerHomePage />} />
          <Route path="/buyer/category/:slug" element={<CategoryProductsPage />} />
          <Route path="/buyer/product/:id" element={<ProductDetailPage />} />
          <Route path="/buyer/product/:id/reviews" element={<ReviewsPage role="buyer" />} />
          <Route path="/buyer/cart" element={<CartPage />} />
          <Route path="/buyer/order-placed/:id" element={<OrderPlacedPage />} />
          <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
          <Route path="/buyer/orders/:id" element={<OrderSummaryPage role="buyer" />} />
          <Route path="/buyer/orders/:id/rate" element={<RateFarmerPage />} />
          <Route path="/buyer/track/:id" element={<OrderTrackingPage />} />
          <Route path="/buyer/account" element={<BuyerAccountPage />} />
          <Route path="/buyer/account/profile" element={<ProfileSettingsPage />} />
          <Route path="/buyer/chats" element={<ChatPage role="buyer" />} />
          <Route path="/buyer/chats/:id" element={<ChatPage role="buyer" />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
