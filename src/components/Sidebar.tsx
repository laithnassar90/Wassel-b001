import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, PlusCircle, Calendar, MessageCircle, CreditCard, Settings, User, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Logo } from './Logo';
import { routes } from '../router/routes';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: routes.app.dashboard, label: 'Dashboard', labelAr: 'لوحة التحكم', icon: LayoutDashboard },
  { path: routes.app.findRide, label: 'Find a Ride', labelAr: 'ابحث عن رحلة', icon: Search },
  { path: routes.app.offerRide, label: 'Offer a Ride', labelAr: 'اعرض رحلة', icon: PlusCircle },
  { path: routes.app.trips, label: 'My Trips', labelAr: 'رحلاتي', icon: Calendar },
  { path: routes.app.messages, label: 'Messages', labelAr: 'الرسائل', icon: MessageCircle },
  { path: routes.app.payments, label: 'Payments', labelAr: 'المدفوعات', icon: CreditCard },
  { path: routes.app.profile(), label: 'Profile', labelAr: 'الملف الشخصي', icon: User },
  { path: routes.app.settings, label: 'Settings', labelAr: 'الإعدادات', icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { language } = useLanguage();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <Logo size="sm" />
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const label = language === 'ar' ? item.labelAr : item.label;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}