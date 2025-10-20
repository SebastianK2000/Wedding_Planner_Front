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

export default function App() {
  return (
    <div className="min-h-screen bg-brand-50 text-ink">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sala-weselna" element={<Venues />} />
          <Route path="/muzyka" element={<Music />} />
          <Route path="/fotograf" element={<Photographer />} />
          <Route path="/florysta" element={<Florist />} />
          <Route path="/przewodnik" element={<Guide />} />
          <Route path="/transport" element={<Transport />} />

          {/* Dodatkowe karty przydatne na wesele */}
          <Route path="/goscie" element={<Guests />} />
          <Route path="/budzet" element={<Budget />} />
          <Route path="/zadania" element={<Tasks />} />
          <Route path="/harmonogram" element={<Timeline />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}