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

export default function App() {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-brand-50 text-ink">
      <Navbar />
        <div className="max-w-7xl mx-auto w-screen px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sala-weselna" element={<Venues />} />
            <Route path="/muzyka" element={<Music />} />
            <Route path="/fotograf" element={<Photographer />} />
            <Route path="/florysta" element={<Florist />} />
            <Route path="/transport" element={<Transport />} />

            <Route path="/goscie" element={<Guests />} />
            <Route path="/budzet" element={<Budget />} />
            <Route path="/zadania" element={<Tasks />} />
            <Route path="/harmonogram" element={<Timeline />} />
            <Route path="/przewodnik" element={<Guide />} />

            <Route path="/faq" element={<FAQPage />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/polityka-prywatnosci" element={<Privacy />} />

            <Route path="/login" element={<Login />} />
            <Route path="/rejestracja" element={<Register />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      <Footer />
    </div>
  );
}