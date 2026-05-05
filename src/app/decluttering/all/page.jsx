import { Suspense } from 'react';
import Header from "@/app/components/global/Header";
import Footer from "@/app/components/global/Footer";
import FooterCta from "@/app/components/global/FooterCta";
import DeclutteringAllScopeView from "@/app/components/global/DeclutteringAllScopeView";
import { mockDeclutteredItems } from "@/lib/mockData";

// Server Component - Data fetched on server
export default function AllDeclutteredItemsPage() {
  // This runs on the server
  const mockItems = mockDeclutteredItems;

  return (
    <div>
      <Header />
      
      {/* Filter and Grid Wrapper - Client Component with Suspense */}
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
        <DeclutteringAllScopeView mockItems={mockItems} />
      </Suspense>

      <FooterCta context="declutteringAll" />
      <Footer />
    </div>
  );
}

// Optional: Add metadata
export const metadata = {
  title: "All Decluttered Items - Find-a-Home FUTA",
  description: "Browse all available second-hand furniture, electronics, and essentials for students.",
};
