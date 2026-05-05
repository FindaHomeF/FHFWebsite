import { Suspense } from 'react';
import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";
import FooterCta from "@/app/components/global/FooterCta";
import ServicesAllScopeView from "@/app/components/global/ServicesAllScopeView";
import { mockServices } from "@/lib/mockData";

// Server Component - Data fetched on server
export default function AllServicesPage() {
  // This runs on the server
  const mockServicesData = mockServices;

  return (
    <div>
      <Header />
      
      {/* Filter and Grid Wrapper - Client Component with Suspense */}
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
        <ServicesAllScopeView mockItems={mockServicesData} />
      </Suspense>

      <FooterCta context="servicesAll" />
      <Footer />
    </div>
  );
}

// Optional: Add metadata
export const metadata = {
  title: "All Service Providers - Find-a-Home FUTA",
  description: "Browse all verified service providers for cleaning, moving, repairs, and more.",
};
