'use client';

export default function UserListingSection({ title, users = [] }) {
  const displayUsers = Array.isArray(users) ? users : []

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <a href="#" className="text-sm text-tertiary hover:text-tertiary/50">View All</a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="text-black33 text-sm">
              <th className="text-left py-3 px-4 font-semibold ">Name</th>
              <th className="text-left py-3 px-4 font-semibold ">Email</th>
              <th className="text-left py-3 px-4 font-semibold ">Role</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="space-y-2">
            {displayUsers.length > 0 ? (
              displayUsers.map((user) => (
                <tr key={user.id} className="bg-black10 text-sm text-tertiary hover:bg-gray-50 transition-colors border-b-2 border-b-white">
                  <td className="py-3 px-4">
                    {user.name}
                  </td>
                  <td className="py-3 px-4">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    {user.role}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-500">
                  No user records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
