'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function AccountPage() {
  const { data: session, update: updateSession } = useSession();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [connectingAccount, setConnectingAccount] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize form values when session loads
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      // If user already has an image, set it as preview
      if (session.user.image) {
        setAvatarPreview(session.user.image);
      }
    }
  }, [session]);
  
  // Update profile function
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Show loading state
    const loadingToast = toast.loading('Updating profile...');
    
    try {
      // Make API call to update profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Update the session with the new values
      await updateSession({ name, email });
      
      toast.success('Profile updated successfully!', { id: loadingToast });
      setIsEditingProfile(false);
    } catch (error) {
      toast.error('Failed to update profile', { id: loadingToast });
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const loadingToast = toast.loading('Uploading avatar...');
    
    try {
      // In a real app, you would upload the file to a storage service
      // For now, simulate a successful upload without actually making API calls
      // This helps avoid issues with client component reloading
      
      // Simple file validation
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File too large (max 5MB)');
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      
      // Create a local preview (without server upload)
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Here you would normally upload to a server
          // Simulate a short delay to mimic server processing
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Update session would happen here in a real app
          // await updateSession({ image: result });
          
          toast.success('Avatar updated!', { id: loadingToast });
          setAvatarPreview(reader.result as string);
        } catch (error) {
          toast.error('Failed to process image', { id: loadingToast });
          console.error(error);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read file', { id: loadingToast });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload avatar', 
        { id: loadingToast }
      );
      console.error(error);
    }
  };
  
  // Get user initials for avatar placeholder
  const getUserInitials = () => {
    if (!name) return '?';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Connect social account
  const connectAccount = async (provider: string) => {
    setConnectingAccount(provider);
    
    try {
      const response = await fetch('/api/user/connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to connect ${provider}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Connected to ${provider}!`);
        // In a real app, you would redirect to the OAuth URL
        // window.location.href = data.redirectUrl;
      }
    } catch (error) {
      toast.error(`Failed to connect to ${provider}`);
      console.error(error);
    } finally {
      setConnectingAccount(null);
    }
  };
  
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>
      
      {/* Profile Information */}
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="rounded-lg bg-amber-50 px-4 py-2 text-amber-600 hover:bg-amber-100"
          >
            {isEditingProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        <div className="flex items-start gap-6">
          {/* User Avatar */}
          <div className="flex flex-col items-center">
            <div 
              onClick={handleAvatarClick}
              className={`h-20 w-20 rounded-full grid place-items-center cursor-pointer hover:opacity-90 transition-opacity overflow-hidden ${avatarPreview ? '' : 'bg-gradient-to-br from-amber-400 to-rose-400 text-white text-xl font-medium'}`}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : getUserInitials()}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange}
            />
            <button 
              onClick={handleAvatarClick}
              className="mt-2 text-xs text-amber-600 hover:underline"
            >
              Change photo
            </button>
          </div>
          
          {/* Profile Form */}
          <div className="flex-1">
            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    disabled
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed as it's used for login</p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-lg bg-amber-500 px-6 py-2 text-white hover:bg-amber-600 disabled:bg-amber-300"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-lg">{session?.user?.name || 'Not set'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-lg">{session?.user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Connected Accounts */}
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
        
        <p className="mb-6 text-gray-600">
          Connect your social accounts to enable one-click sponsorships and easier sharing of your Kindling profile. 
          Connected accounts also help sponsors recognize and trust your brand more easily.
        </p>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Facebook</p>
                <p className="text-sm text-gray-500">Share your sponsorship slots</p>
              </div>
            </div>
            <button 
              onClick={() => connectAccount('facebook')}
              disabled={!!connectingAccount}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              {connectingAccount === 'facebook' ? 'Connecting...' : 'Connect'}
            </button>
          </div>
          
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Twitter</p>
                <p className="text-sm text-gray-500">Auto-tweet new sponsorships</p>
              </div>
            </div>
            <button 
              onClick={() => connectAccount('twitter')}
              disabled={!!connectingAccount}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              {connectingAccount === 'twitter' ? 'Connecting...' : 'Connect'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-gray-500">For developers - one-click embed code</p>
              </div>
            </div>
            <button 
              onClick={() => connectAccount('github')}
              disabled={!!connectingAccount}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              {connectingAccount === 'github' ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New sponsorships</p>
              <p className="text-sm text-gray-500">Email me when someone sponsors my site</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-amber-300"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Revenue reports</p>
              <p className="text-sm text-gray-500">Weekly summary of your earnings</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-amber-300"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Product updates</p>
              <p className="text-sm text-gray-500">News about Kindling features and improvements</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-amber-300"></div>
            </label>
          </div>
        </div>
      </div>
    </main>
  );
} 