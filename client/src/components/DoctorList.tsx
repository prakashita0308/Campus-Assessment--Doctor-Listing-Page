import { Doctor, DoctorFilterState, ConsultationType } from "@/types/doctor";
import DoctorCard from "./DoctorCard";

interface DoctorListProps {
  doctors: Doctor[];
  filterState: DoctorFilterState;
}

export default function DoctorList({ doctors, filterState }: DoctorListProps) {
  // Apply filtering and sorting
  const filteredDoctors = doctors.filter(doctor => {
    // Filter by search term
    if (filterState.search && !doctor.name.toLowerCase().includes(filterState.search.toLowerCase())) {
      return false;
    }

    // Filter by consultation type
    if (filterState.consultationType) {
      if (!doctor.consultationType.includes(filterState.consultationType as ConsultationType)) {
        return false;
      }
    }

    // Filter by specialties (if any selected)
    if (filterState.specialties.length > 0) {
      // Check if any of the doctor's specialties match any of the selected specialties
      const hasMatchingSpecialty = filterState.specialties.some(specialty => 
        doctor.specialty.includes(specialty)
      );
      
      if (!hasMatchingSpecialty) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (filterState.sortBy === 'fees') {
      return a.fees - b.fees; // Ascending order
    } else if (filterState.sortBy === 'experience') {
      return b.experience - a.experience; // Descending order
    }
    return 0;
  });

  if (sortedDoctors.length === 0) {
    return (
      <div className="w-full md:w-3/4 bg-white rounded-md shadow-sm p-8 text-center">
        <p className="text-lg text-gray-500">No doctors found matching your criteria.</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/4 space-y-4">
      {sortedDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
