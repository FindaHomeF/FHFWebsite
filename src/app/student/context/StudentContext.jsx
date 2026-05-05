'use client';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { currentUserProfileQueryOptions, studentIdStatusQueryOptions } from '@/lib/query-options';

const StudentContext = createContext(null);

const toStudentProfileState = (profile = {}, studentIdStatus = {}, fallback = {}) => {
  if (!profile || typeof profile !== 'object') return fallback

  const studentIdDocument =
    profile.student_id_document ||
    profile.studentIdDocument ||
    studentIdStatus?.student_id_document ||
    studentIdStatus?.studentIdDocument ||
    fallback?.studentIdDocument ||
    null

  const studentIdApprovalStatus =
    profile.student_id_approval_status ||
    profile.studentIdApprovalStatus ||
    studentIdStatus?.student_id_approval_status ||
    studentIdStatus?.studentIdApprovalStatus ||
    fallback?.studentIdApprovalStatus ||
    null

  return {
    ...fallback,
    firstName: profile.first_name || profile.firstName || fallback?.firstName || '',
    lastName: profile.last_name || profile.lastName || fallback?.lastName || '',
    email: profile.email || fallback?.email || '',
    phone:
      profile.phone_number ||
      profile.phone ||
      fallback?.phone ||
      '',
    description:
      profile.description ||
      profile.bio ||
      fallback?.description ||
      '',
    location:
      profile.location ||
      profile.address ||
      fallback?.location ||
      '',
    profilePicture:
      profile.profile_picture ||
      profile.profilePicture ||
      fallback?.profilePicture ||
      null,
    studentIdNumber:
      profile.student_id_number ||
      profile.studentIdNumber ||
      fallback?.studentIdNumber ||
      '',
    studentIdDocument,
    studentIdApprovalStatus,
  }
}

export const StudentProvider = ({ children }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const currentUserProfileQuery = useQuery(currentUserProfileQueryOptions())
  const studentIdStatusQuery = useQuery(studentIdStatusQueryOptions())

  useEffect(() => {
    setMounted(true);
    // Load student profile from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('studentProfile');
      if (stored) {
        setStudentProfile(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return
    if (!currentUserProfileQuery.data) return

    const normalizedProfile = toStudentProfileState(
      currentUserProfileQuery.data,
      studentIdStatusQuery.data,
      studentProfile || {}
    )

    setStudentProfile(normalizedProfile)
    if (typeof window !== 'undefined') {
      localStorage.setItem('studentProfile', JSON.stringify(normalizedProfile))
    }
  }, [mounted, currentUserProfileQuery.data, studentIdStatusQuery.data])

  // Check if profile is complete
  const isProfileComplete = useMemo(() => {
    if (!studentProfile) return false;
    return !!(
      studentProfile.profilePicture &&
      studentProfile.description &&
      studentProfile.location
    );
  }, [studentProfile]);

  // Check if Student ID is uploaded
  const isStudentIdUploaded = useMemo(() => {
    if (!studentProfile) return false;
    return !!studentProfile.studentIdDocument;
  }, [studentProfile]);

  // Check if Student ID is approved
  const isStudentIdApproved = useMemo(() => {
    if (!studentProfile) return false;
    return studentProfile.studentIdApprovalStatus === 'approved';
  }, [studentProfile]);

  // Check if can manage listings (profile complete + Student ID approved)
  const canManageListings = useMemo(() => {
    return isProfileComplete && isStudentIdUploaded && isStudentIdApproved;
  }, [isProfileComplete, isStudentIdUploaded, isStudentIdApproved]);

  const isNavItemActive = useMemo(() => {
    return (itemHref) => {
      if (!mounted) return false;
      if (!pathname) return false;
      const isExactMatch = pathname === itemHref;
      const isModuleSubPage = itemHref !== '/student' && 
                              itemHref !== '/student/profile' &&
                              pathname.startsWith(itemHref + '/');
      return isExactMatch || isModuleSubPage;
    };
  }, [pathname, mounted]);

  const updateProfile = (updates) => {
    const updated = { ...studentProfile, ...updates };
    setStudentProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('studentProfile', JSON.stringify(updated));
    }
  };

  return (
    <StudentContext.Provider value={{ 
      isNavItemActive, 
      studentProfile, 
      setStudentProfile: updateProfile,
      isProfileComplete,
      isStudentIdUploaded,
      isStudentIdApproved,
      canManageListings
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider');
  }
  return context;
};

