export function EditPanel() {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Example Section */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">标题</label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Section标题"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">正文</label>
              <textarea
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={4}
                placeholder="Section正文内容"
              />
            </div>
          </div>

          {/* Add more sections */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">标题</label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Section标题"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">正文</label>
              <textarea
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={4}
                placeholder="Section正文内容"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
