'use client';
import Link from 'next/link';
import { 
  Home, 
  Building2, 
  Package, 
  Users,
  Wallet, 
  User,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';
import Image from "next/image"
import { useStudent } from '../context/StudentContext'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/student', icon: Home },
  {
    name: 'Properties',
    href: '/student/properties',
    icon: Building2,
    hasSubmenu: true,
    submenu: [
      { name: 'View Properties', href: '/apartments/all?scope=my' },
      { name: 'Add Property', href: '/student/properties/add', requiresApproval: true },
    ],
  },
  {
    name: 'Decluttering',
    href: '/student/decluttering',
    icon: Package,
    hasSubmenu: true,
    submenu: [
      { name: 'View Items', href: '/decluttering/all?scope=my' },
      { name: 'Add Item', href: '/student/decluttering/add', requiresApproval: true },
    ],
  },
  { name: 'Roommate Finder', href: '/student/roommate-finder', icon: Users, requiresApproval: true },
  { name: 'Bookings', href: '/student/bookings', icon: CalendarDays },
  { name: 'Payments & Transactions', href: '/student/payments', icon: Wallet },
  { name: 'Profile', href: '/student/profile', icon: User },
];

export default function StudentSidebar({ isOpen, onClose }) {
  const { isNavItemActive, canManageListings, isStudentIdUploaded, isStudentIdApproved } = useStudent();
  const [expandedMenus, setExpandedMenus] = useState({
    Properties: false,
    Decluttering: false,
  })
  const Logo = "/Logo/Logosvg.svg"

  const getLockedReason = () => {
    if (!isStudentIdUploaded) return "Complete profile and upload Student ID"
    if (!isStudentIdApproved) return "Student ID pending approval"
    return "Profile incomplete"
  }

  const toggleExpanded = (name) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 min-w-64 h-screen shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="flex-1 flex flex-col overflow-y-auto pt-7 px-2 z-[9999] bg-white">
          <div className="logo-container w-full h-[5rem] flex-shrink-0">
            <Link href={'/student'}>
              <Image src={Logo}
                alt="fhflogo"
                width={200}
                height={54}
              />
            </Link>
          </div>

          <ul className="space-y-1 px-2 flex-1">
            {navigation.map((item) => {
              const isActive = isNavItemActive(item.href);
              const isDisabled = item.requiresApproval && !canManageListings;
              const isExpanded = expandedMenus[item.name];
              
              const linkClasses = isActive
                ? "group flex items-center px-3 py-3 text-base font-medium rounded-2xl transition-colors relative bg-primary text-white border-l-2 border-white"
                : "group flex items-center px-3 py-3 text-base font-medium rounded-2xl transition-colors relative text-black hover:bg-primaryHover hover:text-white";
              
              const disabledClasses = isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "";
              
              const iconClasses = isActive
                ? "flex-shrink-0 w-8 h-8 text-tertiary rounded-xl p-2 bg-white"
                : "flex-shrink-0 w-8 h-8 text-tertiary rounded-xl p-2 bg-transparent group-hover:text-slate-300";
              
              return (
                <li key={item.name}>
                  {item.hasSubmenu ? (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(item.name)}
                        className={`${linkClasses} w-full`}
                      >
                        <item.icon className={iconClasses} />
                        <span className="ml-3">{item.name}</span>
                        <ChevronDown
                          className={`ml-auto h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isExpanded ? (
                        <div className="ml-7 space-y-1 border-l border-black10 pl-3">
                          {item.submenu.map((subItem) => {
                            const isSubActive = isNavItemActive(subItem.href)
                            const isSubLocked = subItem.requiresApproval && !canManageListings
                            const subClasses = isSubActive
                              ? 'flex items-center rounded-xl px-3 py-2 text-sm font-medium bg-primary text-white'
                              : 'flex items-center rounded-xl px-3 py-2 text-sm text-black hover:bg-primaryHover hover:text-white'

                            if (isSubLocked) {
                              return (
                                <div
                                  key={subItem.name}
                                  className={`${subClasses} opacity-50 cursor-not-allowed`}
                                  title={getLockedReason()}
                                >
                                  <span>{subItem.name}</span>
                                  <span className="ml-auto text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">
                                    Locked
                                  </span>
                                </div>
                              )
                            }

                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={subClasses}
                                onClick={onClose}
                              >
                                {subItem.name}
                              </Link>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : isDisabled ? (
                    <div className={`${linkClasses} ${disabledClasses}`} title={!isStudentIdUploaded ? "Complete profile and upload Student ID" : !isStudentIdApproved ? "Student ID pending approval" : "Profile incomplete"}>
                      <item.icon className={iconClasses} />
                      <span className="ml-3">{item.name}</span>
                      {isDisabled && (
                        <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                          Locked
                        </span>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href} className={linkClasses} onClick={onClose}>
                      <item.icon className={iconClasses} />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          
          <div className="flex-shrink-0 mt-auto p-4">
            <div className="flex items-center px-3 py-2">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-tertiary" />
              </div>
              <span className="ml-3 text-sm font-medium text-tertiary">Student</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

