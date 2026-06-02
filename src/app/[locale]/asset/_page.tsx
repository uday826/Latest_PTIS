

/**
 * Asset Module Page - Server Component
 * Uses the existing MainLayout (Header + Footer) without modifications.
 * AssetSidebar is self-contained and manages its own state internally.
 */
export default function AssetPage() {
  return (
      <div className="flex min-h-[calc(100vh-10rem)]">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-500 mt-1">Select a module from the sidebar to get started.</p>
        </div>
      </div>
  );
}
