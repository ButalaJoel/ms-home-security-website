import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import Layout from "./components/layout/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import { DistributorPage, ForBusinessesPage, SolutionPage } from "./pages/SolutionPages.tsx";
import { InstallationPage, ProjectsPage } from "./pages/InstallationPages.tsx";
import { ContactPage, FeedbackPage, NewsPage, ReviewsPage, TrackOrderPage } from "./pages/SupportPages.tsx";
import { AboutPage, PrivacyPage } from "./pages/CompanyPages.tsx";
import ComingNextPage, { NotFoundPage } from "./pages/ComingNextPage.tsx";

// Every page from the feature map has its address now; pages not built yet show a placeholder.
const NEXT: [path: string, title: string][] = [
  ["/checkout", "Checkout"],
  ["/order/:reference", "Order received"],
  ["/cctv-planner", "CCTV planner"],
];

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:category" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/solutions/:place" element={<SolutionPage />} />
              <Route path="/for-businesses" element={<ForBusinessesPage />} />
              <Route path="/become-a-distributor" element={<DistributorPage />} />
              <Route path="/installation" element={<InstallationPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {NEXT.map(([path, title]) => <Route key={path} path={path} element={<ComingNextPage title={title} />} />)}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </ShopProvider>
    </BrowserRouter>
  );
}
