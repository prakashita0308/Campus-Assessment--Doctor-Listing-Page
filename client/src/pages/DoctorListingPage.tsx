import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctors } from "@/lib/api";
import { Doctor, ConsultationType, DoctorFilterState } from "@/types/doctor";

import DoctorSearch from "@/components/DoctorSearch";
import FilterSidebar from "@/components/FilterSidebar";
import DoctorList from "@/components/DoctorList";

export default function DoctorListingPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  
  // Define filter state directly in the component
  const [filterState, setFilterState] = useState<DoctorFilterState>({
    search: "",
    specialties: [],
    consultationType: '',
    sortBy: ''
  });

  // Fetch doctors data
  const { data, isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  // Process and set doctors data when it's loaded
  useEffect(() => {
    if (data) {
      // Transform data to match our Doctor type if needed
      const processedDoctors = data.map((doc: any) => {
        // Extract experience years from text (e.g., "13 Years of experience")
        const experienceMatch = doc.experience ? doc.experience.match(/(\d+)/) : null;
        const experienceYears = experienceMatch ? parseInt(experienceMatch[1]) : 0;
        
        // Extract fee amount (remove currency symbol)
        const feesMatch = doc.fees ? doc.fees.match(/\d+/) : null;
        const feesAmount = feesMatch ? parseInt(feesMatch[0]) : 0;
        
        // Extract specialties from the API response format
        const specialtyList = doc.specialities ? 
          doc.specialities.map((s: any) => s.name).filter(Boolean) : 
          [];
          
        return {
          id: doc.id || Math.random().toString(),
          name: doc.name || "",
          specialty: specialtyList,
          image: doc.photo || "",
          experience: experienceYears,
          fees: feesAmount,
          consultationType: [
            ConsultationType.VIDEO,
            ConsultationType.IN_CLINIC
          ],
          clinic: doc.clinic?.name || "",
          location: doc.clinic?.address?.city || "",
          qualifications: "",
        };
      });
      
      setDoctors(processedDoctors);
      
      // Extract unique specialties
      const allSpecialties = new Set<string>();
      processedDoctors.forEach(doctor => {
        doctor.specialty.forEach((s: string) => s && allSpecialties.add(s));
      });
      
      setSpecialties(Array.from(allSpecialties).sort());
    }
  }, [data]);

  // Handle search input
  const handleSearch = (search: string) => {
    console.log("Search:", search);
    setFilterState(prev => ({ ...prev, search }));
  };

  // Handle filter changes
  const handleFilterChange = (updates: Partial<DoctorFilterState>) => {
    console.log("Filter change:", updates);
    
    // Update state
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto relative">
            <div className="w-full max-w-2xl mx-auto h-10 bg-white/30 animate-pulse rounded-md"></div>
          </div>
        </header>
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4 h-96 bg-white/50 animate-pulse rounded-md"></div>
              <div className="w-full md:w-3/4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-white/50 animate-pulse rounded-md"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto relative">
            <div className="w-full max-w-2xl mx-auto text-center text-white">
              Doctor Listing
            </div>
          </div>
        </header>
        <main className="flex-grow p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-sm text-center max-w-lg">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Doctors</h2>
            <p className="text-gray-600 mb-4">
              We're unable to load the doctor listing at this time. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with search bar */}
      <header className="bg-primary py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative">
          <DoctorSearch 
            doctors={doctors} 
            onSearch={handleSearch} 
            searchValue={filterState.search}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <FilterSidebar 
              filterState={filterState}
              onFilterChange={handleFilterChange}
              specialties={specialties}
            />
            
            {/* Doctor list */}
            <DoctorList 
              doctors={doctors} 
              filterState={filterState}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
