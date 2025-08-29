import { ChevronDown, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { logout } from 'wasp/client/auth';
import { Link as WaspRouterLink } from 'wasp/client/router';
import { type User as UserEntity } from 'wasp/entities';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { CreditIndicator } from '../components/ui/credit-indicator';
import { userMenuItems } from './constants';

export function UserDropdown({ user }: { user: Partial<UserEntity> }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center duration-300 ease-in-out text-foreground hover:text-primary transition-colors'>
          <span className='hidden mr-2 text-right lg:block text-sm font-medium text-foreground'>
            {user.username}
          </span>
          <User className='size-5' />
          <ChevronDown className='size-4' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Credit indicator - always show for authenticated users */}
        {user && typeof user.credits === 'number' && (
          <>
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Credits</span>
                <CreditIndicator 
                  currentCredits={user.credits}
                  showDetails={false}
                  size="sm"
                />
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        {userMenuItems.map((item) => {
          if (item.isAuthRequired && !user) return null;
          if (item.isAdminOnly && (!user || !user.isAdmin)) return null;

          return (
            <DropdownMenuItem key={item.name}>
              <WaspRouterLink
                to={item.to}
                onClick={() => {
                  setOpen(false);
                }}
                className='flex items-center gap-3 w-full'
              >
                <item.icon size='1.1rem' />
                {item.name}
              </WaspRouterLink>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem>
          <button type='button' onClick={() => logout()} className='flex items-center gap-3 w-full'>
            <LogOut size='1.1rem' />
            Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
