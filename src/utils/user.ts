/**
 * Get user initials from full name
 * @param name - Full name of the user
 * @returns First letters of first and last name (max 2 characters)
 * @example
 * getInitials("John Doe") // returns "JD"
 * getInitials("Alice") // returns "AL"
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Get badge variant based on user role
 * @param role - User role
 * @returns Variant string for badge component
 */
export function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
    switch (role.toLowerCase()) {
        case 'admin':
            return 'default';
        case 'user':
            return 'secondary';
        default:
            return 'outline';
    }
}
