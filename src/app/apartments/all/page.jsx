import { Suspense } from 'react';
import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";
import FooterCta from "@/app/components/global/FooterCta";
import ApartmentsAllScopeView from "@/app/components/global/ApartmentsAllScopeView";
import { mockApartments } from "@/lib/mockData";

// Server Component - Data fetched on server
export default function AllApartmentsPage() {
  // This runs on the server
  const mockListings = mockApartments;

  return (
    <div>
      <Header />
      
      {/* Filter and Grid Wrapper - Client Component with Suspense */}
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
        <ApartmentsAllScopeView mockItems={mockListings} />
      </Suspense>

      <FooterCta context="propertiesAll" />
      <Footer />
    </div>
  );
}

// Optional: Add metadata
export const metadata = {
  title: "All Apartments - Find-a-Home FUTA",
  description: "Browse all available apartments near FUTA with filters for price, location, and amenities.",
};
