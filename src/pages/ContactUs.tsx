import { Helmet } from 'react-helmet-async';

export function ContactUs() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Contact Us - TradeHub24</title>
        <meta name="description" content="Get in touch with TradeHub24. We're here to help with any questions you may have." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Have questions? Get in touch with us!</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
              <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" id="phone" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"></textarea>
            </div>
            <button type="submit" className="bg-[#e20000] text-white px-6 py-3 rounded-md hover:bg-[#cc0000] transition-colors">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}