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

import PhotographerOffer from "@/pages/photographer_offer";
import FloristOffer from "@/pages/florist_offer";
import MusicOffer from "@/pages/music_offer";
import TransportOffer from "@/pages/transport_offer";

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
          <Route path="/przewodnik" element={<Guide />} />
          <Route path="/transport" element={<Transport />} />

          <Route path="/goscie" element={<Guests />} />
          <Route path="/budzet" element={<Budget />} />
          <Route path="/zadania" element={<Tasks />} />
          <Route path="/harmonogram" element={<Timeline />} />

          <Route path="/fotograf/:id" element={<PhotographerOffer />} />
          <Route path="/florysta/:id" element={<FloristOffer />} />
          <Route path="/muzyka/:id" element={<MusicOffer />} />
          <Route path="/transport/:id" element={<TransportOffer />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}