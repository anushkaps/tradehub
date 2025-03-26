import { User, Settings, Bell, Shield, Key } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function Account() {
  return (
    <>
      <Helmet>
        <title>Account Help & Settings | TradeHub24</title>
        <meta name="description" content="Learn how to manage your TradeHub24 account settings, preferences, notifications, and security options. Get help with account-related questions and features." />
        <meta name="keywords" content="account settings, account management, TradeHub24 help, account preferences, account security" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Account Help & Settings | TradeHub24" />
        <meta property="og:description" content="Learn how to manage your TradeHub24 account settings, preferences, notifications, and security options." />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Account Help & Settings | TradeHub24" />
        <meta name="twitter:description" content="Learn how to manage your TradeHub24 account settings, preferences, notifications, and security options." />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Account Help & Settings",
            "description": "Learn how to manage your TradeHub24 account settings, preferences, notifications, and security options.",
            "publisher": {
              "@type": "Organization",
              "name": "TradeHub24"
            }
          })}
        </script>
      </Helmet>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Settings</h1>
            <p className="text-xl text-gray-600">Manage your account preferences and settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#105298] rounded-full p-3">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">John Doe</h2>
                      <p className="text-gray-600">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left rounded-md hover:bg-gray-100"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                          defaultValue="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                          defaultValue="Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                          defaultValue="john.doe@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                          defaultValue="+44 123 456 7890"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                        defaultValue="123 Main St, London, UK"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#e20000] text-white px-6 py-2 rounded-md hover:bg-[#cc0000] transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const menuItems = [
  {
    icon: <Settings className="w-5 h-5 text-gray-600" />,
    label: "General Settings"
  },
  {
    icon: <Bell className="w-5 h-5 text-gray-600" />,
    label: "Notifications"
  },
  {
    icon: <Shield className="w-5 h-5 text-gray-600" />,
    label: "Privacy"
  },
  {
    icon: <Key className="w-5 h-5 text-gray-600" />,
    label: "Security"
  }
];