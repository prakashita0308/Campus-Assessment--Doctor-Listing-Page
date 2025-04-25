import { useState } from "react";
import { ConsultationType, DoctorFilterState } from "@/types/doctor";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterSidebarProps {
  filterState: DoctorFilterState;
  onFilterChange: (updates: Partial<DoctorFilterState>) => void;
  specialties: string[];
}

export default function FilterSidebar({ 
  filterState, 
  onFilterChange,
  specialties 
}: FilterSidebarProps) {
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    specialties: true,
    consultation: true
  });

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle sort option change
  const handleSortChange = (value: 'fees' | 'experience') => {
    onFilterChange({ sortBy: value });
  };

  // Handle consultation type change
  const handleConsultationChange = (value: ConsultationType | '') => {
    onFilterChange({ consultationType: value });
  };

  // Handle specialty filter change
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const updatedSpecialties = checked
      ? [...filterState.specialties, specialty]
      : filterState.specialties.filter(s => s !== specialty);
    
    onFilterChange({ specialties: updatedSpecialties });
  };

  // Filter specialties based on search input
  const filteredSpecialties = specialties
    .filter(specialty => !specialtyFilter || 
      specialty.toLowerCase().includes(specialtyFilter.toLowerCase()));

  // Reset all filters
  const handleClearAll = () => {
    onFilterChange({
      specialties: [],
      consultationType: '',
      sortBy: ''
    });
  };

  return (
    <div className="w-full md:w-1/4 bg-white rounded-md shadow-sm p-4">
      {/* Sort Filter */}
      <div className="mb-6">
        <div 
          data-testid="filter-header-sort"
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => toggleSection('sort')}
        >
          <h3 className="font-medium text-gray-800">Sort by</h3>
          <button className="text-gray-400">
            {expandedSections.sort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {expandedSections.sort && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="sort" 
                value="fees" 
                data-testid="sort-fees"
                checked={filterState.sortBy === 'fees'} 
                onChange={() => handleSortChange('fees')}
                className="text-primary focus:ring-blue-500 h-4 w-4" 
              />
              <span className="text-gray-700">Price: Low-High</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="sort" 
                value="experience" 
                data-testid="sort-experience"
                checked={filterState.sortBy === 'experience'} 
                onChange={() => handleSortChange('experience')}
                className="text-primary focus:ring-blue-500 h-4 w-4" 
              />
              <span className="text-gray-700">Experience: Most Experience first</span>
            </label>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        <button 
          onClick={handleClearAll}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>
      
      {/* Specialties Filter */}
      <div className="mb-6">
        <div 
          data-testid="filter-header-speciality" 
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => toggleSection('specialties')}
        >
          <h3 className="font-medium text-gray-800">Specialities</h3>
          <button className="text-gray-400">
            {expandedSections.specialties ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {expandedSections.specialties && (
          <>
            {/* Search within specialties */}
            <div className="relative mb-3">
              <Input
                type="text"
                placeholder="Search"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-2.5 top-2.5 text-gray-400 text-sm h-4 w-4" />
            </div>
            
            {/* Specialities list with checkboxes */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredSpecialties.map((specialty) => (
                <label key={specialty} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    data-testid={`filter-specialty-${specialty ? specialty.replace('/', '-') : specialty}`}
                    checked={filterState.specialties.includes(specialty)}
                    onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
                    className="text-primary focus:ring-blue-500 h-4 w-4 rounded"
                  />
                  <span className="text-gray-700">{specialty}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Mode of Consultation Filter */}
      <div className="mb-6">
        <div 
          data-testid="filter-header-moc" 
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => toggleSection('consultation')}
        >
          <h3 className="font-medium text-gray-800">Mode of Consultation</h3>
          <button className="text-gray-400">
            {expandedSections.consultation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {expandedSections.consultation && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="consultation" 
                value="video" 
                data-testid="filter-video-consult"
                checked={filterState.consultationType === ConsultationType.VIDEO}
                onChange={() => handleConsultationChange(ConsultationType.VIDEO)}
                className="text-primary focus:ring-blue-500 h-4 w-4" 
              />
              <span className="text-gray-700">Video Consultation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="consultation" 
                value="clinic" 
                data-testid="filter-in-clinic"
                checked={filterState.consultationType === ConsultationType.IN_CLINIC}
                onChange={() => handleConsultationChange(ConsultationType.IN_CLINIC)}
                className="text-primary focus:ring-blue-500 h-4 w-4" 
              />
              <span className="text-gray-700">In-clinic Consultation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="consultation" 
                value="all"
                checked={filterState.consultationType === ''}
                onChange={() => handleConsultationChange('')}
                className="text-primary focus:ring-blue-500 h-4 w-4" 
              />
              <span className="text-gray-700">All</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
