import { Doctor } from "@/types/doctor";
import { MapPin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div data-testid="doctor-card" className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            {doctor.image ? (
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                {doctor.name ? doctor.name.charAt(0) : '?'}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h2 data-testid="doctor-name" className="text-lg font-semibold text-gray-800">
                  {doctor.name}
                </h2>
                <p data-testid="doctor-specialty" className="text-gray-600">
                  {Array.isArray(doctor.specialty) 
                    ? doctor.specialty.join(", ") 
                    : doctor.specialty}
                </p>
                {doctor.qualifications && (
                  <p className="text-sm text-gray-500">{doctor.qualifications}</p>
                )}
                <p data-testid="doctor-experience" className="text-sm text-gray-600 mt-1">
                  {doctor.experience} yrs exp.
                </p>
              </div>
              <div className="mt-2 sm:mt-0 text-right">
                <div data-testid="doctor-fee" className="font-semibold text-gray-800">
                  ₹ {doctor.fees}
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {doctor.clinic && (
                <div className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  <Video className="h-3 w-3 mr-1 text-gray-500" />
                  <span>{doctor.clinic}</span>
                </div>
              )}
              {doctor.location && (
                <div className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                  <span>{doctor.location}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline"
                className="w-full sm:w-auto float-right bg-white text-primary border border-primary font-medium py-2 px-6 rounded hover:bg-blue-50 transition"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
