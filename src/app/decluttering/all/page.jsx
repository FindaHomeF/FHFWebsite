import { Suspense } from 'react';
import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";
import FooterCta from "@/app/components/global/FooterCta";
import HeroSection from "@/app/components/service/HeroSection";
import DeclutteredFilterWrapper from "@/app/components/global/DeclutteredFilterWrapper";
import { mockDeclutteredItems } from "@/lib/mockData";

// Server Component - Data fetched on server
export default function AllDeclutteredItemsPage() {
  // This runs on the server
  const mockItems = mockDeclutteredItems;

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <div className="mt-10 md:mt-0">
        <HeroSection
          showScrollDownButton={false}
          mainText="Student Marketplace"
          subText="Sell items you no longer need and discover affordable pre-owned essentials from trusted FUTA students."
          primaryButtonText="LIST AN ITEM"
          secondaryButtonText="BROWSE CATEGORIES"
          secondaryCta="/decluttering#categories"
        />
      </div>

      {/* Filter and Grid Wrapper - Client Component with Suspense */}
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
        <DeclutteredFilterWrapper items={mockItems} />
      </Suspense>

      <FooterCta />
      <Footer />
    </div>
  );
}

// Optional: Add metadata
export const metadata = {
  title: "All Decluttered Items - Find-a-Home FUTA",
  description: "Browse all available second-hand furniture, electronics, and essentials for students.",
};
