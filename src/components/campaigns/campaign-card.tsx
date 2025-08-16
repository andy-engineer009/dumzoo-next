export default function CampaignCard({campaign, isExpanded, toggleCampaignExpansion}: {campaign: any, isExpanded: (id: string) => boolean, toggleCampaignExpansion: (id: string) => void}) {    
    return (
        <div key={campaign.id} className="bg-[#cccccc3d] rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200 relative">
        {/* Title Row */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-md font-semibold text-gray-900 leading-tight pr-2 flex-1">
            {campaign.title}
          </h3>
        </div>
        
        {/* Description - Limited to 2 lines initially */}
        <div className="mb-3">
          <p className={`text-xs text-gray-600 leading-relaxed ${!isExpanded(campaign.id) ? 'line-clamp-2' : ''}`}>
            {campaign.description}
          </p>
          {isExpanded(campaign.id) && (
            <p className="text-xs text-gray-600 leading-relaxed mt-2">
              {campaign.fullDescription}
            </p>
          )}
        </div>
        
        {/* Due Date and Actions Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {campaign.dueDate}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="text-blue-600 hover:text-blue-700 font-medium text-xs px-2 py-1 rounded-xl hover:bg-blue-50 transition-colors "
              onClick={() => toggleCampaignExpansion(campaign.id)}
            >
              {isExpanded(campaign.id) ? 'See Less' : 'See More'}
            </button>
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-xs font-medium transition-colors shadow-sm hover:shadow-md">
              Apply
            </button>
          </div>
        </div>
      </div>
    )
}