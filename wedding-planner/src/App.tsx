import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import Home from "@/pages/home";
import Venues from "@/pages/venues";
import Music from "@/pages/music";
import Photographer from "@/pages/photographer";
import Florist from "@/pages/florist";
import Guide from "@/pages/guide";
import Transport from "@/pages/transport";
import Guests from "@/pages/guests";
import Budget from "@/pages/budget";
import Tasks from "@/pages/tasks";
import Timeline from "@/pages/timeline";
import Footer from "@/components/footer";
import FAQPage from "@/pages/faq";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privact";

import Login from "@/auth/login";
import Register from "@/auth/register";

import AdminLayout from "@/admin/admin-layout";
import AdminDashboard from "@/admin/dashboard";
import ManageVenues from "@/admin/manage-venues";
import ManageMusic from "@/admin/manage-music";
import ManagePhotographers from "@/admin/manage-photographers";
import ManageFlorists from "@/admin/manage-florists";
import ManageTransport from "@/admin/manage-transport";
import ManageUsers from "@/admin/manage-users";
import AdminSettings from "@/admin/settings";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-brand-50 text-ink">
      <Navbar />
      <div className="max-w-7xl mx-auto w-screen px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/sala-weselna" element={<PublicLayout><Venues /></PublicLayout>} />
      <Route path="/muzyka" element={<PublicLayout><Music /></PublicLayout>} />
      <Route path="/fotograf" element={<PublicLayout><Photographer /></PublicLayout>} />
      <Route path="/florysta" element={<PublicLayout><Florist /></PublicLayout>} />
      <Route path="/transport" element={<PublicLayout><Transport /></PublicLayout>} />

      <Route path="/goscie" element={<PublicLayout><Guests /></PublicLayout>} />
      <Route path="/budzet" element={<PublicLayout><Budget /></PublicLayout>} />
      <Route path="/zadania" element={<PublicLayout><Tasks /></PublicLayout>} />
      <Route path="/harmonogram" element={<PublicLayout><Timeline /></PublicLayout>} />
      <Route path="/przewodnik" element={<PublicLayout><Guide /></PublicLayout>} />

      <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
      <Route path="/kontakt" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/polityka-prywatnosci" element={<PublicLayout><Privacy /></PublicLayout>} />

      <Route path="/login" element={<Login />} />
      <Route path="/rejestracja" element={<Register />} />

      <Route path="/admin" element={<AdminLayout />}>
         <Route index element={<AdminDashboard />} />
         <Route path="sale" element={<ManageVenues />} />
         <Route path="muzyka" element={<ManageMusic />} />
         <Route path="foto" element={<ManagePhotographers />} />
         <Route path="florysci" element={<ManageFlorists />} />
         <Route path="transport" element={<ManageTransport />} />
         <Route path="uzytkownicy" element={<ManageUsers />} />
         <Route path="ustawienia" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}