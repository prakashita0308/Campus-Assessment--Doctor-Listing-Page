import { useState, useRef, useEffect } from "react";
import { Doctor } from "@/types/doctor";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DoctorSearchProps {
  doctors: Doctor[];
  onSearch: (search: string) => void;
  searchValue: string;
}

export default function DoctorSearch({ doctors, onSearch, searchValue }: DoctorSearchProps) {
  const [query, setQuery] = useState(searchValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const filteredDoctors = doctors
        .filter(doctor => 
          doctor.name && doctor.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3); // Maximum 3 suggestions
      
      setSuggestions(filteredDoctors);
      setShowSuggestions(filteredDoctors.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, doctors]);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle search form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (name: string) => {
    setQuery(name);
    onSearch(name);
    setShowSuggestions(false);
  };

  // Handle key navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            data-testid="autocomplete-input"
            type="text"
            placeholder="Search Symptoms, Doctors, Specialties, Clinics"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full py-2 pl-4 pr-10 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <button 
            type="submit"
            className="absolute right-3 top-2.5 text-gray-400"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((doctor) => (
            <div
              key={doctor.id}
              data-testid="suggestion-item"
              className="p-3 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => handleSelectSuggestion(doctor.name)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {doctor.image ? (
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xl font-bold text-gray-500">
                      {doctor.name ? doctor.name.charAt(0) : '?'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{doctor.name}</div>
                  <div className="text-sm text-gray-500">
                    {Array.isArray(doctor.specialty) && doctor.specialty.length > 0
                      ? String(doctor.specialty[0]).toUpperCase()
                      : ""}
                  </div>
                </div>
                <svg 
                  className="ml-auto text-gray-400 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
