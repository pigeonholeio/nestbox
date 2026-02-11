import { useState } from 'react';
import { searchUsers } from '@/services/api/user.api';
import type { User } from '@/types/api.types';

/**
 * Hook for searching and managing recipients
 */
export function useRecipientSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  /**
   * Search for a user by email
   */
  const searchUser = async (
    email: string,
    useTransient: boolean = false
  ): Promise<User | null> => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchUsers([email], useTransient);

      if (!response || response.users.length === 0) {
        if (useTransient) {
          // If using transient keys and still no user found, there's an issue
          setSearchError('Failed to create transient key for user');
          return null;
        } else {
          // User not found, need to use transient key
          return null;
        }
      }

      return response.users[0];
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to search for user';
      setSearchError(errorMessage);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Search for multiple users
   */
  const searchMultipleUsers = async (
    emails: string[],
    useTransient: boolean = false
  ): Promise<User[]> => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchUsers(emails, useTransient);
      return response.users;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to search for users';
      setSearchError(errorMessage);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  const clearError = () => {
    setSearchError(null);
  };

  return {
    searchUser,
    searchMultipleUsers,
    isSearching,
    searchError,
    clearError,
  };
}
