/**
 * Get class by status
 */
export function statusClass(status: string) {
  if (status === 'PUBLISHED' || status === 'APPROVED') {
    return 'text-cyan bg-cyan-light';
  }

  if (status === 'CREATED' || status === 'ON_HOLD') {
    return 'text-green bg-green-light';
  }

  if (status === 'DEPRECATED' || status === 'BLOCKED') {
    return 'text-red bg-red-light';
  }

  return 'text-gray bg-gray-light';
}
